#[test_only]
module agent_os::marketplace_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use agent_os::marketplace::{Self, Agent, Capability, AgentLicense, Marketplace};

    const ADMIN: address = @0xAD;
    const CREATOR: address = @0xC1;
    const BUYER: address = @0xB1;

    fun setup_test(): Scenario {
        let mut scenario = ts::begin(ADMIN);
        {
            marketplace::init_for_testing(ts::ctx(&mut scenario));
        };
        scenario
    }

    #[test]
    fun test_create_agent() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        ts::next_tx(&mut scenario, CREATOR);
        {
            let agent = marketplace::create_agent(
                b"DeFi Agent",
                b"Automated DeFi trading agent",
                &clock,
                ts::ctx(&mut scenario)
            );
            
            assert!(marketplace::agent_creator(&agent) == CREATOR, 0);
            transfer::public_transfer(agent, CREATOR);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_create_capability() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        ts::next_tx(&mut scenario, CREATOR);
        {
            let agent = marketplace::create_agent(
                b"DeFi Agent",
                b"Automated DeFi trading agent",
                &clock,
                ts::ctx(&mut scenario)
            );

            let mut permissions = vector::empty();
            vector::push_back(&mut permissions, b"swap");
            vector::push_back(&mut permissions, b"add_liquidity");

            let capability = marketplace::create_capability(
                &agent,
                b"DeFi",
                permissions,
                1000000000, // 1 SUI max budget
                100, // 100 calls per hour
                ts::ctx(&mut scenario)
            );

            assert!(marketplace::capability_max_budget(&capability) == 1000000000, 0);
            
            transfer::public_transfer(agent, CREATOR);
            transfer::public_transfer(capability, CREATOR);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_list_and_buy_agent() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        // Create agent
        ts::next_tx(&mut scenario, CREATOR);
        {
            let agent = marketplace::create_agent(
                b"DeFi Agent",
                b"Automated DeFi trading agent",
                &clock,
                ts::ctx(&mut scenario)
            );
            transfer::public_transfer(agent, CREATOR);
        };

        // List agent
        ts::next_tx(&mut scenario, CREATOR);
        {
            let agent = ts::take_from_sender<Agent>(&scenario);
            let mut marketplace = ts::take_shared<Marketplace>(&scenario);
            
            marketplace::list_agent(
                &mut marketplace,
                agent,
                1000000000, // 1 SUI
                500, // 5% royalty
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(marketplace);
        };

        // Buy agent
        ts::next_tx(&mut scenario, BUYER);
        {
            let mut marketplace = ts::take_shared<Marketplace>(&scenario);
            let mut listing = ts::take_shared<Listing>(&scenario);
            let payment = coin::mint_for_testing<SUI>(1000000000, ts::ctx(&mut scenario));

            marketplace::buy_agent(
                &mut marketplace,
                &mut listing,
                payment,
                &clock,
                ts::ctx(&mut scenario)
            );

            ts::return_shared(marketplace);
            ts::return_shared(listing);
        };

        // Verify buyer owns agent
        ts::next_tx(&mut scenario, BUYER);
        {
            assert!(ts::has_most_recent_for_sender<Agent>(&scenario), 0);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_issue_and_use_license() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        ts::next_tx(&mut scenario, CREATOR);
        {
            let agent = marketplace::create_agent(
                b"DeFi Agent",
                b"Automated DeFi trading agent",
                &clock,
                ts::ctx(&mut scenario)
            );

            let license = marketplace::issue_license(
                &agent,
                86400000, // 24 hours
                100, // 100 executions
                &clock,
                ts::ctx(&mut scenario)
            );

            assert!(marketplace::license_is_valid(&license, &clock), 0);

            transfer::public_transfer(agent, CREATOR);
            transfer::public_transfer(license, CREATOR);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_dynamic_fields() {
        let mut scenario = setup_test();
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        ts::next_tx(&mut scenario, CREATOR);
        {
            let mut agent = marketplace::create_agent(
                b"DeFi Agent",
                b"Automated DeFi trading agent",
                &clock,
                ts::ctx(&mut scenario)
            );

            // Add config
            marketplace::add_config(&mut agent, b"max_slippage", 100u64);
            
            // Get config
            let slippage = marketplace::get_config<u64>(&agent, b"max_slippage");
            assert!(slippage == 100, 0);

            // Update config
            marketplace::update_config(&mut agent, b"max_slippage", 50u64);
            let new_slippage = marketplace::get_config<u64>(&agent, b"max_slippage");
            assert!(new_slippage == 50, 0);

            transfer::public_transfer(agent, CREATOR);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}
