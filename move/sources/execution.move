/// Agent OS Execution Module
/// PTB-optimized batch execution with flash loans and coordination
module agent_os::execution {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::vec_map::{Self, VecMap};
    use agent_os::marketplace::{Self, Agent, Capability, AgentLicense};

    // ===== Error Codes =====
    const EInsufficientBudget: u64 = 100;
    const ERateLimitExceeded: u64 = 101;
    const EUnauthorizedCall: u64 = 102;
    const EExecutionFailed: u64 = 103;
    const EFlashLoanNotRepaid: u64 = 104;
    const EInvalidCoordination: u64 = 105;

    // ===== Structs =====

    /// Execution context for PTB
    public struct ExecutionContext has key {
        id: UID,
        agent_id: ID,
        executor: address,
        budget_remaining: u64,
        calls_made: u64,
        started_at: u64,
    }

    /// Flash loan receipt (hot potato pattern)
    public struct FlashLoanReceipt {
        amount: u64,
        fee: u64,
        borrower: address,
    }

    /// Coordination state for multi-agent PTB
    public struct CoordinationState has key {
        id: UID,
        agents: vector<ID>,
        shared_budget: Balance<SUI>,
        execution_order: vector<u64>,
    }

    /// Execution result
    public struct ExecutionResult has copy, drop {
        agent_id: ID,
        success: bool,
        gas_used: u64,
        calls_made: u64,
    }

    // ===== Events =====

    public struct ExecutionStarted has copy, drop {
        agent_id: ID,
        executor: address,
        budget: u64,
        timestamp: u64,
    }

    public struct ExecutionCompleted has copy, drop {
        agent_id: ID,
        executor: address,
        success: bool,
        gas_used: u64,
        timestamp: u64,
    }

    public struct FlashLoanTaken has copy, drop {
        borrower: address,
        amount: u64,
        fee: u64,
        timestamp: u64,
    }

    public struct FlashLoanRepaid has copy, drop {
        borrower: address,
        amount: u64,
        timestamp: u64,
    }

    // ===== Public Functions =====

    /// Start execution context
    public fun start_execution(
        agent: &Agent,
        capability: &Capability,
        budget: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ): ExecutionContext {
        let budget_amount = coin::value(&budget);
        assert!(budget_amount <= marketplace::capability_max_budget(capability), EInsufficientBudget);

        let agent_id = marketplace::agent_id(agent);
        
        event::emit(ExecutionStarted {
            agent_id,
            executor: tx_context::sender(ctx),
            budget: budget_amount,
            timestamp: clock::timestamp_ms(clock),
        });

        // Store budget in context
        let exec_ctx = ExecutionContext {
            id: object::new(ctx),
            agent_id,
            executor: tx_context::sender(ctx),
            budget_remaining: budget_amount,
            calls_made: 0,
            started_at: clock::timestamp_ms(clock),
        };

        // Transfer budget to execution context
        transfer::public_transfer(budget, tx_context::sender(ctx));

        exec_ctx
    }

    /// Execute single operation (PTB command)
    public fun execute_operation(
        exec_ctx: &mut ExecutionContext,
        capability: &Capability,
        gas_estimate: u64,
        _ctx: &mut TxContext
    ) {
        // Check budget
        assert!(exec_ctx.budget_remaining >= gas_estimate, EInsufficientBudget);

        // Deduct from budget
        exec_ctx.budget_remaining = exec_ctx.budget_remaining - gas_estimate;
        exec_ctx.calls_made = exec_ctx.calls_made + 1;

        // In real implementation, this would call the actual contract
        // For now, we just track the execution
    }

    /// Complete execution and cleanup
    public fun complete_execution(
        exec_ctx: ExecutionContext,
        clock: &Clock,
        ctx: &mut TxContext
    ): ExecutionResult {
        let ExecutionContext {
            id,
            agent_id,
            executor,
            budget_remaining,
            calls_made,
            started_at,
        } = exec_ctx;

        let gas_used = 0; // Would be calculated from actual execution
        
        event::emit(ExecutionCompleted {
            agent_id,
            executor,
            success: true,
            gas_used,
            timestamp: clock::timestamp_ms(clock),
        });

        object::delete(id);

        ExecutionResult {
            agent_id,
            success: true,
            gas_used,
            calls_made,
        }
    }

    /// Take flash loan (hot potato pattern)
    public fun take_flash_loan(
        amount: u64,
        fee_bps: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): (Coin<SUI>, FlashLoanReceipt) {
        let fee = (amount * fee_bps) / 10000;
        
        event::emit(FlashLoanTaken {
            borrower: tx_context::sender(ctx),
            amount,
            fee,
            timestamp: clock::timestamp_ms(clock),
        });

        // In production, this would borrow from a liquidity pool
        let loan = coin::zero<SUI>(ctx);
        
        let receipt = FlashLoanReceipt {
            amount,
            fee,
            borrower: tx_context::sender(ctx),
        };

        (loan, receipt)
    }

    /// Repay flash loan (consumes receipt)
    public fun repay_flash_loan(
        repayment: Coin<SUI>,
        receipt: FlashLoanReceipt,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let FlashLoanReceipt { amount, fee, borrower } = receipt;
        
        assert!(tx_context::sender(ctx) == borrower, EUnauthorizedCall);
        assert!(coin::value(&repayment) >= amount + fee, EFlashLoanNotRepaid);

        event::emit(FlashLoanRepaid {
            borrower,
            amount: amount + fee,
            timestamp: clock::timestamp_ms(clock),
        });

        // In production, return to liquidity pool
        transfer::public_transfer(repayment, borrower);
    }

    /// Create coordination state for multi-agent execution
    public fun create_coordination(
        agents: vector<ID>,
        shared_budget: Coin<SUI>,
        ctx: &mut TxContext
    ): CoordinationState {
        CoordinationState {
            id: object::new(ctx),
            agents,
            shared_budget: coin::into_balance(shared_budget),
            execution_order: vector::empty(),
        }
    }

    /// Add agent to coordination
    public fun add_to_coordination(
        coord: &mut CoordinationState,
        agent_id: ID,
        execution_index: u64,
    ) {
        vector::push_back(&mut coord.agents, agent_id);
        vector::push_back(&mut coord.execution_order, execution_index);
    }

    /// Execute coordinated batch
    public entry fun execute_coordinated_batch(
        coord: CoordinationState,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let CoordinationState {
            id,
            agents,
            shared_budget,
            execution_order,
        } = coord;

        // Execute agents in order
        let mut i = 0;
        let len = vector::length(&agents);
        
        while (i < len) {
            let _agent_id = *vector::borrow(&agents, i);
            // In production, execute agent operations here
            i = i + 1;
        };

        // Return remaining budget
        let remaining = coin::from_balance(shared_budget, ctx);
        transfer::public_transfer(remaining, tx_context::sender(ctx));

        object::delete(id);
    }

    // ===== PTB Helper Functions =====

    /// Batch execute multiple operations atomically
    public fun batch_execute(
        exec_ctx: &mut ExecutionContext,
        capability: &Capability,
        operations: vector<u64>, // Gas estimates for each operation
        _ctx: &mut TxContext
    ) {
        let mut i = 0;
        let len = vector::length(&operations);
        
        // Named block for early exit on error
        'execution_loop: loop {
            if (i >= len) break 'execution_loop;
            
            let gas_estimate = *vector::borrow(&operations, i);
            
            // Check if we have enough budget
            if (exec_ctx.budget_remaining < gas_estimate) {
                break 'execution_loop; // Early exit
            };

            exec_ctx.budget_remaining = exec_ctx.budget_remaining - gas_estimate;
            exec_ctx.calls_made = exec_ctx.calls_made + 1;
            
            i = i + 1;
        };
    }

    /// Check if operation is authorized
    public fun is_authorized(
        capability: &Capability,
        contract_address: vector<u8>,
    ): bool {
        // In production, check against capability.permissions
        true
    }

    // ===== Getters =====

    public fun execution_budget_remaining(exec_ctx: &ExecutionContext): u64 {
        exec_ctx.budget_remaining
    }

    public fun execution_calls_made(exec_ctx: &ExecutionContext): u64 {
        exec_ctx.calls_made
    }

    public fun result_success(result: &ExecutionResult): bool {
        result.success
    }

    public fun result_gas_used(result: &ExecutionResult): u64 {
        result.gas_used
    }
}
