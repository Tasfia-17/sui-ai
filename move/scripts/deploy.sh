#!/bin/bash

# Sui Agent OS - Deployment Script

set -e

echo "🚀 Deploying Sui Agent OS Smart Contracts..."

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Error: sui CLI not found. Please install Sui CLI first."
    exit 1
fi

# Set network (testnet, devnet, or mainnet)
NETWORK=${1:-testnet}
echo "📡 Network: $NETWORK"

# Build the package
echo "🔨 Building Move package..."
sui move build

# Run tests
echo "🧪 Running tests..."
sui move test

# Publish the package
echo "📦 Publishing package to $NETWORK..."
PUBLISH_OUTPUT=$(sui client publish --gas-budget 100000000 --json)

# Extract package ID
PACKAGE_ID=$(echo $PUBLISH_OUTPUT | jq -r '.objectChanges[] | select(.type == "published") | .packageId')

echo "✅ Package published successfully!"
echo "📝 Package ID: $PACKAGE_ID"

# Save package ID to file
echo $PACKAGE_ID > deployed_package_id.txt

# Extract object IDs
MARKETPLACE_ID=$(echo $PUBLISH_OUTPUT | jq -r '.objectChanges[] | select(.objectType | contains("Marketplace")) | .objectId')

echo "📋 Marketplace ID: $MARKETPLACE_ID"

# Create deployment info file
cat > deployment_info.json <<EOF
{
  "network": "$NETWORK",
  "package_id": "$PACKAGE_ID",
  "marketplace_id": "$MARKETPLACE_ID",
  "deployed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ Deployment complete!"
echo "📄 Deployment info saved to deployment_info.json"
