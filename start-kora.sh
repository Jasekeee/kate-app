#!/bin/bash
# Start the Kora node locally for Käte development
# Run this before testing the mobile app: bash start-kora.sh

source "$HOME/.cargo/env"
export PATH="/Users/zhasulanmedetkhan/.local/share/solana/install/active_release/bin:$PATH"

# Load private key from .env.local (create this file from .env.example)
if [ -f "$(dirname "$0")/.env.local" ]; then
  export $(grep -v '^#' "$(dirname "$0")/.env.local" | xargs)
fi

if [ -z "$KORA_SIGNER_KEY" ]; then
  echo "Error: KORA_SIGNER_KEY not set. Add it to .env.local"
  exit 1
fi

cd "$(dirname "$0")"
echo "Starting Kora node on http://localhost:8080..."
echo "Fee payer: $(solana address)"
echo "Network: devnet"
echo ""

kora \
  --rpc-url https://api.devnet.solana.com \
  --config kora.toml \
  rpc start \
  --port 8080 \
  --signers-config signers.toml
