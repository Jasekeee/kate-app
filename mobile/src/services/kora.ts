import { Connection, PublicKey } from "@solana/web3.js";

// 10.0.2.2 = Android emulator's loopback to Mac's localhost
const KORA_URL = process.env.EXPO_PUBLIC_KORA_URL ?? "http://10.0.2.2:8080";
const RPC_URL = process.env.EXPO_PUBLIC_RPC_URL ?? "https://api.devnet.solana.com";

export const connection = new Connection(RPC_URL, "confirmed");

export const USDC_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
export const USDC_MINT = USDC_DEVNET;
export const USDC_DECIMALS = 6;

async function koraRpc(method: string, params: Record<string, unknown>) {
  const res = await fetch(KORA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? JSON.stringify(json.error));
  return json.result;
}

export async function getKoraConfig() {
  return koraRpc("getConfig", {});
}

export async function getSupportedTokens() {
  return koraRpc("getSupportedTokens", {});
}

// Build a gasless USDC transfer — Kora returns a partially-signed tx for the user to sign.
export async function buildGaslessTransfer({
  sourceWallet,
  destinationWallet,
  usdcAmount,
}: {
  sourceWallet: string;
  destinationWallet: string;
  usdcAmount: number;
}): Promise<{ transaction: string }> {
  const amount = Math.round(usdcAmount * 10 ** USDC_DECIMALS);
  return koraRpc("transferTransaction", {
    source: sourceWallet,
    destination: destinationWallet,
    amount,
    token: USDC_MINT,
  });
}

// Relay the user-signed transaction to Kora for final fee-payer signature + broadcast.
export async function relaySignedTransaction(base64SignedTx: string): Promise<{ signature: string }> {
  return koraRpc("signAndSendTransaction", { transaction: base64SignedTx });
}

export async function getUsdcBalance(walletAddress: string): Promise<number> {
  try {
    const owner = new PublicKey(walletAddress);
    const mint = new PublicKey(USDC_MINT);
    const accounts = await connection.getParsedTokenAccountsByOwner(owner, { mint });
    if (accounts.value.length === 0) return 0;
    return accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount ?? 0;
  } catch {
    return 0;
  }
}
