# Sui Agent OS - Move Smart Contracts

Production-ready Move 2024 smart contracts for autonomous AI agents on Sui blockchain.

## 📦 Modules

### 1. `agent_os::marketplace`
Agent NFT marketplace with licensing and royalties.

**Key Features:**
- Agent NFTs with dynamic fields for extensibility
- Capability NFTs for modular permissions (DeFi, NFT, Social)
- Time/usage-limited licenses
- Automatic royalty distribution on sales and executions
- Platform fee collection

**Main Functions:**
- `create_agent()` - Mint new agent NFT
- `create_capability()` - Issue permission NFT
- `issue_license()` - Grant execution rights
- `list_agent()` - List on marketplace
- `buy_agent()` - Purchase with automatic royalty split
- `record_execution()` - Track usage for royalties

### 2. `agent_os::execution`
PTB-optimized execution engine with flash loans.

**Key Features:**
- Batch execution with budget tracking
- Named loops for safe iteration
- Flash loan integration (hot potato pattern)
- Multi-agent coordination in single PTB
- Early exit on errors

**Main Functions:**
- `start_execution()` - Initialize execution context
- `execute_operation()` - Single PTB command
- `batch_execute()` - Multiple operations atomically
- `take_flash_loan()` - Borrow with receipt
- `repay_flash_loan()` - Repay and consume receipt
- `create_coordination()` - Multi-agent state
- `execute_coordinated_batch()` - Coordinated execution

### 3. `agent_os::capabilities`
Permission system with staking and rate limiting.

**Key Features:**
- Contract whitelist/blacklist
- Budget limits per period
- Rate limiting (calls per hour)
- Stake SUI to increase limits
- Automatic window resets

**Main Functions:**
- `stake_for_capability()` - Lock SUI for bonuses
- `unstake_capability()` - Reclaim stake
- `check_rate_limit()` - Verify and update calls
- `check_budget()` - Verify and update spending
- `is_contract_authorized()` - Permission check

## 🏗️ Architecture

```
Agent (NFT)
├── Dynamic Fields (config, memory)
├── Capabilities (permissions)
└── Licenses (execution rights)

Execution Flow:
1. Check license validity
2. Verify capability permissions
3. Check rate limit & budget
4. Execute PTB operations
5. Record execution for royalties
```

## 🚀 Deployment

```bash
# Build
sui move build

# Test
sui move test

# Deploy to testnet
./scripts/deploy.sh testnet

# Deploy to mainnet
./scripts/deploy.sh mainnet
```

## 🧪 Testing

```bash
# Run all tests
sui move test

# Run specific test
sui move test test_create_agent

# Run with coverage
sui move test --coverage
```

## 📝 Integration Examples

### Create and List Agent

```move
// Create agent
let agent = marketplace::create_agent(
    b"DeFi Trader",
    b"Automated trading agent",
    &clock,
    ctx
);

// Create capability
let capability = marketplace::create_capability(
    &agent,
    b"DeFi",
    vector[b"swap", b"add_liquidity"],
    1_000_000_000, // 1 SUI max budget
    100, // 100 calls/hour
    ctx
);

// List on marketplace
marketplace::list_agent(
    &mut marketplace,
    agent,
    5_000_000_000, // 5 SUI price
    500, // 5% royalty
    &clock,
    ctx
);
```

### Execute with PTB

```move
// Start execution
let mut exec_ctx = execution::start_execution(
    &agent,
    &capability,
    budget_coin,
    &clock,
    ctx
);

// Execute operations
let operations = vector[100000, 200000, 150000]; // Gas estimates
execution::batch_execute(
    &mut exec_ctx,
    &capability,
    operations,
    ctx
);

// Complete
let result = execution::complete_execution(exec_ctx, &clock, ctx);
```

### Stake for Higher Limits

```move
// Stake 10 SUI
let stake_coin = coin::split(&mut wallet, 10_000_000_000, ctx);
let stake = capabilities::stake_for_capability(
    &capability,
    stake_coin,
    &clock,
    ctx
);

// Now has 10,000 SUI budget + 100 extra calls/hour
```

## 🔒 Security Features

1. **Capability-based Access Control**
   - All sensitive functions require capability NFT
   - Permissions checked before execution

2. **Budget & Rate Limiting**
   - Per-period spending limits
   - Hourly call limits
   - Automatic window resets

3. **Flash Loan Safety**
   - Hot potato pattern ensures repayment
   - Fee enforcement
   - Atomic execution

4. **Dynamic Field Isolation**
   - Agent config stored separately
   - No direct access to internal state

5. **Event Emission**
   - All state changes emit events
   - Audit trail for compliance

## 📊 Error Codes

### Marketplace (0-99)
- `0` - EAgentNotFound
- `1` - EInsufficientPayment
- `2` - ENotOwner
- `3` - EAgentNotListed
- `4` - EInvalidPrice
- `5` - ELicenseExpired
- `6` - EInsufficientUsage

### Execution (100-199)
- `100` - EInsufficientBudget
- `101` - ERateLimitExceeded
- `102` - EUnauthorizedCall
- `103` - EExecutionFailed
- `104` - EFlashLoanNotRepaid
- `105` - EInvalidCoordination

### Capabilities (200-299)
- `200` - EInsufficientStake
- `201` - ERateLimitExceeded
- `202` - EBudgetExceeded
- `203` - EUnauthorizedContract
- `204` - ECapabilityRevoked

## 🔗 Integration Points

### Cetus Protocol (DeFi)
```move
// Add to capability permissions
vector[b"cetus::swap", b"cetus::add_liquidity"]
```

### Kiosk (NFT Trading)
```move
// Add to capability permissions
vector[b"kiosk::list", b"kiosk::purchase"]
```

### zkLogin Authentication
```move
// Check if sender is zkLogin or standard
public fun is_zklogin_sender(ctx: &TxContext): bool {
    // Implementation depends on zkLogin integration
    true
}
```

## 📈 Gas Optimization

- **Dynamic Fields**: Only load what's needed
- **PTB Batching**: Multiple ops in one transaction
- **Shared Objects**: Minimize consensus overhead
- **Named Loops**: Early exit saves gas

## 🛠️ Development

```bash
# Format code
sui move fmt

# Check for issues
sui move check

# Generate docs
sui move doc
```

## 📄 License

MIT License - Built for Sui Vibe Hackathon 2026

---

**Note**: This is production-ready code but should be audited before mainnet deployment with real funds.
