/// Agent OS Capabilities Module
/// Permission system, budget limits, and rate limiting
module agent_os::capabilities {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::vec_set::{Self, VecSet};
    use agent_os::marketplace::{Self, Agent, Capability};

    // ===== Error Codes =====
    const EInsufficientStake: u64 = 200;
    const ERateLimitExceeded: u64 = 201;
    const EBudgetExceeded: u64 = 202;
    const EUnauthorizedContract: u64 = 203;
    const ECapabilityRevoked: u64 = 204;

    // ===== Structs =====

    /// Capability staking for increased limits
    public struct CapabilityStake has key {
        id: UID,
        capability_id: ID,
        staker: address,
        staked_amount: Balance<SUI>,
        bonus_budget: u64,
        bonus_rate_limit: u64,
    }

    /// Rate limiter state
    public struct RateLimiter has key {
        id: UID,
        capability_id: ID,
        window_start: u64,
        calls_in_window: u64,
        max_calls_per_hour: u64,
    }

    /// Budget tracker
    public struct BudgetTracker has key {
        id: UID,
        capability_id: ID,
        period_start: u64,
        spent_in_period: u64,
        max_per_period: u64,
    }

    /// Permission registry
    public struct PermissionRegistry has key {
        id: UID,
        allowed_contracts: VecSet<vector<u8>>,
        blocked_contracts: VecSet<vector<u8>>,
    }

    // ===== Events =====

    public struct CapabilityStaked has copy, drop {
        capability_id: ID,
        staker: address,
        amount: u64,
        timestamp: u64,
    }

    public struct CapabilityUnstaked has copy, drop {
        capability_id: ID,
        staker: address,
        amount: u64,
        timestamp: u64,
    }

    public struct RateLimitHit has copy, drop {
        capability_id: ID,
        calls_made: u64,
        limit: u64,
        timestamp: u64,
    }

    public struct BudgetExceeded has copy, drop {
        capability_id: ID,
        spent: u64,
        limit: u64,
        timestamp: u64,
    }

    // ===== Public Functions =====

    /// Stake SUI to increase capability limits
    public fun stake_for_capability(
        capability: &Capability,
        stake: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ): CapabilityStake {
        let stake_amount = coin::value(&stake);
        
        // Calculate bonuses (1 SUI = 1000 SUI budget, 10 calls/hour)
        let bonus_budget = stake_amount * 1000;
        let bonus_rate_limit = (stake_amount / 1_000_000_000) * 10; // Per SUI

        let capability_id = marketplace::capability_agent_id(capability);

        event::emit(CapabilityStaked {
            capability_id,
            staker: tx_context::sender(ctx),
            amount: stake_amount,
            timestamp: clock::timestamp_ms(clock),
        });

        CapabilityStake {
            id: object::new(ctx),
            capability_id,
            staker: tx_context::sender(ctx),
            staked_amount: coin::into_balance(stake),
            bonus_budget,
            bonus_rate_limit,
        }
    }

    /// Unstake and reclaim SUI
    public fun unstake_capability(
        stake: CapabilityStake,
        clock: &Clock,
        ctx: &mut TxContext
    ): Coin<SUI> {
        let CapabilityStake {
            id,
            capability_id,
            staker,
            staked_amount,
            bonus_budget: _,
            bonus_rate_limit: _,
        } = stake;

        assert!(tx_context::sender(ctx) == staker, EInsufficientStake);

        let amount = balance::value(&staked_amount);

        event::emit(CapabilityUnstaked {
            capability_id,
            staker,
            amount,
            timestamp: clock::timestamp_ms(clock),
        });

        object::delete(id);
        coin::from_balance(staked_amount, ctx)
    }

    /// Create rate limiter
    public fun create_rate_limiter(
        capability: &Capability,
        max_calls_per_hour: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): RateLimiter {
        RateLimiter {
            id: object::new(ctx),
            capability_id: marketplace::capability_agent_id(capability),
            window_start: clock::timestamp_ms(clock),
            calls_in_window: 0,
            max_calls_per_hour,
        }
    }

    /// Check and update rate limit
    public fun check_rate_limit(
        limiter: &mut RateLimiter,
        bonus_rate_limit: u64,
        clock: &Clock,
    ): bool {
        let current_time = clock::timestamp_ms(clock);
        let hour_ms = 3600000; // 1 hour in milliseconds

        // Reset window if hour has passed
        if (current_time - limiter.window_start >= hour_ms) {
            limiter.window_start = current_time;
            limiter.calls_in_window = 0;
        };

        // Calculate effective limit with stake bonus
        let effective_limit = limiter.max_calls_per_hour + bonus_rate_limit;

        // Check limit
        if (limiter.calls_in_window >= effective_limit) {
            event::emit(RateLimitHit {
                capability_id: limiter.capability_id,
                calls_made: limiter.calls_in_window,
                limit: effective_limit,
                timestamp: current_time,
            });
            return false
        };

        limiter.calls_in_window = limiter.calls_in_window + 1;
        true
    }

    /// Create budget tracker
    public fun create_budget_tracker(
        capability: &Capability,
        max_per_period: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): BudgetTracker {
        BudgetTracker {
            id: object::new(ctx),
            capability_id: marketplace::capability_agent_id(capability),
            period_start: clock::timestamp_ms(clock),
            spent_in_period: 0,
            max_per_period,
        }
    }

    /// Check and update budget
    public fun check_budget(
        tracker: &mut BudgetTracker,
        amount: u64,
        bonus_budget: u64,
        clock: &Clock,
    ): bool {
        let current_time = clock::timestamp_ms(clock);
        let day_ms = 86400000; // 24 hours in milliseconds

        // Reset period if day has passed
        if (current_time - tracker.period_start >= day_ms) {
            tracker.period_start = current_time;
            tracker.spent_in_period = 0;
        };

        // Calculate effective budget with stake bonus
        let effective_budget = tracker.max_per_period + bonus_budget;

        // Check budget
        if (tracker.spent_in_period + amount > effective_budget) {
            event::emit(BudgetExceeded {
                capability_id: tracker.capability_id,
                spent: tracker.spent_in_period + amount,
                limit: effective_budget,
                timestamp: current_time,
            });
            return false
        };

        tracker.spent_in_period = tracker.spent_in_period + amount;
        true
    }

    /// Create permission registry
    public fun create_permission_registry(
        ctx: &mut TxContext
    ): PermissionRegistry {
        PermissionRegistry {
            id: object::new(ctx),
            allowed_contracts: vec_set::empty(),
            blocked_contracts: vec_set::empty(),
        }
    }

    /// Add allowed contract
    public fun add_allowed_contract(
        registry: &mut PermissionRegistry,
        contract_address: vector<u8>,
    ) {
        vec_set::insert(&mut registry.allowed_contracts, contract_address);
    }

    /// Block contract
    public fun block_contract(
        registry: &mut PermissionRegistry,
        contract_address: vector<u8>,
    ) {
        vec_set::insert(&mut registry.blocked_contracts, contract_address);
    }

    /// Check if contract call is authorized
    public fun is_contract_authorized(
        registry: &PermissionRegistry,
        contract_address: vector<u8>,
    ): bool {
        // If in blocked list, deny
        if (vec_set::contains(&registry.blocked_contracts, &contract_address)) {
            return false
        };

        // If allowed list is empty, allow all (except blocked)
        if (vec_set::size(&registry.allowed_contracts) == 0) {
            return true
        };

        // Otherwise, must be in allowed list
        vec_set::contains(&registry.allowed_contracts, &contract_address)
    }

    // ===== Getters =====

    public fun stake_amount(stake: &CapabilityStake): u64 {
        balance::value(&stake.staked_amount)
    }

    public fun stake_bonus_budget(stake: &CapabilityStake): u64 {
        stake.bonus_budget
    }

    public fun rate_limiter_calls_remaining(
        limiter: &RateLimiter,
        bonus_rate_limit: u64,
    ): u64 {
        let effective_limit = limiter.max_calls_per_hour + bonus_rate_limit;
        
        if (limiter.calls_in_window >= effective_limit) {
            0
        } else {
            effective_limit - limiter.calls_in_window
        }
    }

    public fun budget_remaining(
        tracker: &BudgetTracker,
        bonus_budget: u64,
    ): u64 {
        let effective_budget = tracker.max_per_period + bonus_budget;
        
        if (tracker.spent_in_period >= effective_budget) {
            0
        } else {
            effective_budget - tracker.spent_in_period
        }
    }
}
