import { KoraClient } from "@solana/kora";
import { Connection, PublicKey } from "@solana/web3.js";

// 10.0.2.2 is the Android emulator's loopback to the Mac's localhost
const KORA_ENDPOINT = process.env.EXPO_PUBLIC_KORA_URL ?? "http://10.0.2.2:8080";
const RPC_ENDPOINT = process.env.EXPO_PUBLIC_RPC_URL ?? "https://api.devnet.solana.com";

export const koraClient = new KoraClient({ rpcUrl: KORA_ENDPOINT });
export const connection = new Connection(RPC_ENDPOINT, "confirmed");

export const USDC_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
export const USDC_MAINNET = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const USDC_MINT = USDC_DEVNET;
export const USDC_DECIMALS = 6;

export async function getKoraConfig() {
  return koraClient.getConfig();
}

export async function getSupportedTokens() {
  return koraClient.getSupportedTokens();
}

// Build a gasless transfer transaction via Kora.
// Returns a base64-encoded partially-signed transaction that the user must sign.
export async function buildGaslessTransfer({
  sourceWallet,
  destinationWallet,
  usdcAmount,
}: {
  sourceWallet: string;
  destinationWallet: string;
  usdcAmount: number;
}) {
  const amountInSmallestUnit = Math.round(usdcAmount * 10 ** USDC_DECIMALS);

  const response = await koraClient.transferTransaction({
    source: sourceWallet,
    destination: destinationWallet,
    amount: amountInSmallestUnit,
    token: USDC_MINT,
  });

  return response;
}

// After the user signs the transaction via MWA, send to Kora for final relay.
export async function relaySignedTransaction(base64SignedTx: string) {
  const response = await koraClient.signAndSendTransaction({
    transaction: base64SignedTx,
  });
  return response; // { signature, signed_transaction, signer_pubkey }
}

export async function getUsdcBalance(walletAddress: string): Promise<number> {
  try {
    const owner = new PublicKey(walletAddress);
    const mint = new PublicKey(USDC_MINT);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, { mint });
    if (tokenAccounts.value.length === 0) return 0;

    const uiAmount =
      tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return uiAmount ?? 0;
  } catch {
    return 0;
  }
}
