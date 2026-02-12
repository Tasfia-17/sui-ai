/// Agent OS Marketplace Module
/// Handles agent NFTs, licensing, and marketplace operations
module agent_os::marketplace {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;
    use sui::clock::{Self, Clock};

    // ===== Error Codes =====
    const EAgentNotFound: u64 = 0;
    const EInsufficientPayment: u64 = 1;
    const ENotOwner: u64 = 2;
    const EAgentNotListed: u64 = 3;
    const EInvalidPrice: u64 = 4;
    const ELicenseExpired: u64 = 5;
    const EInsufficientUsage: u64 = 6;

    // ===== Structs =====

    /// Main Agent NFT - extensible via dynamic fields
    public struct Agent has key, store {
        id: UID,
        name: vector<u8>,
        description: vector<u8>,
        creator: address,
        version: u64,
        created_at: u64,
        // Dynamic fields: config, memory, capabilities
    }

    /// Capability NFT - modular permissions
    public struct Capability has key, store {
        id: UID,
        agent_id: ID,
        capability_type: vector<u8>, // "DeFi", "NFT", "Social"
        permissions: vector<vector<u8>>, // List of allowed contract calls
        max_budget: u64, // Max SUI per transaction
        rate_limit: u64, // Calls per hour
    }

    /// Agent License - user's right to run an agent
    public struct AgentLicense has key, store {
        id: UID,
        agent_id: ID,
        owner: address,
        expires_at: u64, // Timestamp
        usage_limit: u64, // Max executions
        usage_count: u64, // Current executions
    }

    /// Marketplace listing
    public struct Listing has key {
        id: UID,
        agent_id: ID,
        seller: address,
        price: u64,
        royalty_bps: u64, // Basis points (100 = 1%)
    }

    /// Marketplace global state
    public struct Marketplace has key {
        id: UID,
        total_agents: u64,
        total_sales: u64,
        platform_fee_bps: u64, // Platform fee in basis points
        fee_balance: Balance<SUI>,
    }

    // ===== Events =====

    public struct AgentCreated has copy, drop {
        agent_id: ID,
        creator: address,
        name: vector<u8>,
        timestamp: u64,
    }

    public struct AgentListed has copy, drop {
        agent_id: ID,
        seller: address,
        price: u64,
        timestamp: u64,
    }

    public struct AgentSold has copy, drop {
        agent_id: ID,
        seller: address,
        buyer: address,
        price: u64,
        royalty_paid: u64,
        timestamp: u64,
    }

    public struct AgentExecuted has copy, drop {
        agent_id: ID,
        executor: address,
        timestamp: u64,
    }

    // ===== Init =====

    fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            total_agents: 0,
            total_sales: 0,
            platform_fee_bps: 250, // 2.5%
            fee_balance: balance::zero(),
        };
        transfer::share_object(marketplace);
    }

    // ===== Public Functions =====

    /// Create a new agent NFT
    public fun create_agent(
        name: vector<u8>,
        description: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ): Agent {
        let agent_id = object::new(ctx);
        let id_copy = object::uid_to_inner(&agent_id);
        
        let agent = Agent {
            id: agent_id,
            name,
            description,
            creator: tx_context::sender(ctx),
            version: 1,
            created_at: clock::timestamp_ms(clock),
        };

        event::emit(AgentCreated {
            agent_id: id_copy,
            creator: tx_context::sender(ctx),
            name,
            timestamp: clock::timestamp_ms(clock),
        });

        agent
    }

    /// Create capability for an agent
    public fun create_capability(
        agent: &Agent,
        capability_type: vector<u8>,
        permissions: vector<vector<u8>>,
        max_budget: u64,
        rate_limit: u64,
        ctx: &mut TxContext
    ): Capability {
        Capability {
            id: object::new(ctx),
            agent_id: object::uid_to_inner(&agent.id),
            capability_type,
            permissions,
            max_budget,
            rate_limit,
        }
    }

    /// Issue license to run an agent
    public fun issue_license(
        agent: &Agent,
        duration_ms: u64,
        usage_limit: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): AgentLicense {
        AgentLicense {
            id: object::new(ctx),
            agent_id: object::uid_to_inner(&agent.id),
            owner: tx_context::sender(ctx),
            expires_at: clock::timestamp_ms(clock) + duration_ms,
            usage_limit,
            usage_count: 0,
        }
    }

    /// List agent for sale
    public entry fun list_agent(
        marketplace: &mut Marketplace,
        agent: Agent,
        price: u64,
        royalty_bps: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(price > 0, EInvalidPrice);
        assert!(tx_context::sender(ctx) == agent.creator, ENotOwner);

        let agent_id = object::uid_to_inner(&agent.id);
        
        // Store agent as dynamic object field
        dof::add(&mut marketplace.id, agent_id, agent);

        let listing = Listing {
            id: object::new(ctx),
            agent_id,
            seller: tx_context::sender(ctx),
            price,
            royalty_bps,
        };

        event::emit(AgentListed {
            agent_id,
            seller: tx_context::sender(ctx),
            price,
            timestamp: clock::timestamp_ms(clock),
        });

        transfer::share_object(listing);
    }

    /// Buy agent from marketplace
    public entry fun buy_agent(
        marketplace: &mut Marketplace,
        listing: &mut Listing,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let price = listing.price;
        assert!(coin::value(&payment) >= price, EInsufficientPayment);

        // Calculate fees
        let platform_fee = (price * marketplace.platform_fee_bps) / 10000;
        let royalty = (price * listing.royalty_bps) / 10000;
        let _seller_amount = price - platform_fee - royalty;

        // Split payment
        let mut payment_balance = coin::into_balance(payment);
        let platform_fee_coin = balance::split(&mut payment_balance, platform_fee);
        let royalty_coin = balance::split(&mut payment_balance, royalty);
        
        // Add platform fee to marketplace
        balance::join(&mut marketplace.fee_balance, platform_fee_coin);

        // Get agent from marketplace
        let agent: Agent = dof::remove(&mut marketplace.id, listing.agent_id);
        let creator = agent.creator;

        // Transfer payments
        transfer::public_transfer(
            coin::from_balance(payment_balance, ctx),
            listing.seller
        );
        transfer::public_transfer(
            coin::from_balance(royalty_coin, ctx),
            creator
        );

        // Transfer agent to buyer
        transfer::public_transfer(agent, tx_context::sender(ctx));

        // Update stats
        marketplace.total_sales = marketplace.total_sales + 1;

        event::emit(AgentSold {
            agent_id: listing.agent_id,
            seller: listing.seller,
            buyer: tx_context::sender(ctx),
            price,
            royalty_paid: royalty,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    /// Update listing price
    public entry fun update_price(
        listing: &mut Listing,
        new_price: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == listing.seller, ENotOwner);
        assert!(new_price > 0, EInvalidPrice);
        listing.price = new_price;
    }

    /// Delist agent
    public entry fun delist_agent(
        marketplace: &mut Marketplace,
        listing: Listing,
        ctx: &mut TxContext
    ) {
        let Listing { id, agent_id, seller, price: _, royalty_bps: _ } = listing;
        assert!(tx_context::sender(ctx) == seller, ENotOwner);

        // Remove agent from marketplace and return to seller
        let agent: Agent = dof::remove(&mut marketplace.id, agent_id);
        transfer::public_transfer(agent, seller);

        object::delete(id);
    }

    /// Record agent execution (for royalty tracking)
    public entry fun record_execution(
        license: &mut AgentLicense,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(license.owner == tx_context::sender(ctx), ENotOwner);
        assert!(clock::timestamp_ms(clock) < license.expires_at, ELicenseExpired);
        assert!(license.usage_count < license.usage_limit, EInsufficientUsage);

        license.usage_count = license.usage_count + 1;

        event::emit(AgentExecuted {
            agent_id: license.agent_id,
            executor: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock),
        });
    }

    // ===== Dynamic Field Helpers =====

    /// Add config to agent
    public fun add_config<T: store>(
        agent: &mut Agent,
        key: vector<u8>,
        value: T
    ) {
        df::add(&mut agent.id, key, value);
    }

    /// Get config from agent
    public fun get_config<T: store + copy>(
        agent: &Agent,
        key: vector<u8>
    ): T {
        *df::borrow(&agent.id, key)
    }

    /// Update config
    public fun update_config<T: store + drop>(
        agent: &mut Agent,
        key: vector<u8>,
        value: T
    ) {
        let _old_value: T = df::remove(&mut agent.id, key);
        df::add(&mut agent.id, key, value);
    }

    // ===== Getters =====

    public fun agent_id(agent: &Agent): ID {
        object::uid_to_inner(&agent.id)
    }

    public fun agent_creator(agent: &Agent): address {
        agent.creator
    }

    public fun capability_agent_id(cap: &Capability): ID {
        cap.agent_id
    }

    public fun capability_max_budget(cap: &Capability): u64 {
        cap.max_budget
    }

    public fun license_is_valid(license: &AgentLicense, clock: &Clock): bool {
        clock::timestamp_ms(clock) < license.expires_at && 
        license.usage_count < license.usage_limit
    }
}
