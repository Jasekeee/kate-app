import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import {
  VersionedTransaction,
  VersionedMessage,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { Colors, Spacing, FontSize } from "../theme";
import { useAuthorization } from "../utils/useAuthorization";
import { buildGaslessTransfer, relaySignedTransaction } from "../services/kora";
import { alertAndLog } from "../utils/alertAndLog";

type SendRouteParams = { Send: { token?: string } };
type SendStatus = "idle" | "building" | "signing" | "relaying" | "success" | "error";

export function SendScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<SendRouteParams, "Send">>();
  const { authorizeSession } = useAuthorization();
  const token = route.params?.token ?? "USDC";

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [txSignature, setTxSignature] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const canSend = recipient.length > 10 && parseFloat(amount) > 0;
  const estimatedFee = "0.001";

  const handleSend = useCallback(async () => {
    if (!canSend || status !== "idle") return;

    try {
      // Step 1: Build the gasless transaction via Kora
      setStatus("building");
      const transferResponse = await buildGaslessTransfer({
        sourceWallet: "", // filled from wallet below
        destinationWallet: recipient.trim(),
        usdcAmount: parseFloat(amount),
      });

      // Step 2: Sign with user's wallet via MWA (Mobile Wallet Adapter)
      setStatus("signing");
      const signedBase64 = await transact(async (wallet) => {
        const account = await authorizeSession(wallet);

        // Rebuild transfer with actual source wallet
        const txData = await buildGaslessTransfer({
          sourceWallet: account.publicKey.toString(),
          destinationWallet: recipient.trim(),
          usdcAmount: parseFloat(amount),
        });

        // Decode the partially-signed transaction from Kora
        const txBytes = Buffer.from(txData.transaction, "base64");
        const versionedTx = VersionedTransaction.deserialize(txBytes);

        // User signs their part (token transfer authority)
        const signed = await wallet.signTransactions({ transactions: [versionedTx] });

        return Buffer.from(signed[0].serialize()).toString("base64");
      });

      // Step 3: Relay to Kora — it adds its fee-payer signature and broadcasts
      setStatus("relaying");
      const result = await relaySignedTransaction(signedBase64);
      setTxSignature(result.signature);
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus("error");
      alertAndLog("Transaction failed", err instanceof Error ? err.message : err);
    }
  }, [canSend, status, recipient, amount, authorizeSession]);

  const statusLabel: Record<SendStatus, string> = {
    idle: "Confirm & Send",
    building: "Building transaction...",
    signing: "Sign in your wallet...",
    relaying: "Broadcasting to Solana...",
    success: "Sent!",
    error: "Failed — tap to retry",
  };

  if (status === "success") {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>Sent!</Text>
        <Text style={styles.successAmount}>
          {amount} {token}
        </Text>
        <Text style={styles.successTo} numberOfLines={1}>
          to {recipient.slice(0, 20)}...
        </Text>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Fee paid:</Text>
          <Text style={styles.feeValue}>{estimatedFee} USDC</Text>
        </View>
        <Text style={styles.noSolNote}>No SOL used ⚡</Text>
        {txSignature ? (
          <Text style={styles.txHash} numberOfLines={1}>
            Tx: {txSignature.slice(0, 20)}...
          </Text>
        ) : null}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLoading = ["building", "signing", "relaying"].includes(status);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send {token}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        {/* Recipient */}
        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          placeholder="Wallet address or .sol name"
          placeholderTextColor={Colors.textSecondary}
          value={recipient}
          onChangeText={setRecipient}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountRow}>
          <TextInput
            style={[styles.input, styles.amountInput]}
            placeholder="0.00"
            placeholderTextColor={Colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            editable={!isLoading}
          />
          <View style={styles.tokenBadge}>
            <Text style={styles.tokenBadgeText}>{token}</Text>
          </View>
        </View>

        {/* Fee preview */}
        {canSend && (
          <View style={styles.feePreview}>
            <Text style={styles.feePreviewText}>
              ⚡ Gas fee:{" "}
              <Text style={styles.feePreviewAmount}>{estimatedFee} USDC</Text>
              {"  "}
              <Text style={styles.feePreviewNote}>(no SOL needed)</Text>
            </Text>
          </View>
        )}

        {/* Send button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!canSend || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={status === "error" ? () => setStatus("idle") : handleSend}
          disabled={!canSend || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.textPrimary} />
          ) : (
            <Text style={styles.sendButtonText}>{statusLabel[status]}</Text>
          )}
        </TouchableOpacity>

        {isLoading && (
          <Text style={styles.statusHint}>{statusLabel[status]}</Text>
        )}
        {status === "error" && errorMsg ? (
          <Text style={styles.errorHint}>{errorMsg}</Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: { width: 60 },
  backText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: "600" },
  headerTitle: { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: "700" },
  form: { padding: Spacing.lg, gap: Spacing.sm },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.card,
    color: Colors.textPrimary,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amountRow: { flexDirection: "row", gap: Spacing.sm, alignItems: "center" },
  amountInput: { flex: 1 },
  tokenBadge: {
    backgroundColor: Colors.primary + "33",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  tokenBadgeText: { color: Colors.primary, fontWeight: "700", fontSize: FontSize.sm },
  feePreview: {
    backgroundColor: Colors.accent + "11",
    borderRadius: 10,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accent + "44",
    marginTop: Spacing.sm,
  },
  feePreviewText: { color: Colors.textPrimary, fontSize: FontSize.sm },
  feePreviewAmount: { color: Colors.accent, fontWeight: "700" },
  feePreviewNote: { color: Colors.textSecondary },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.lg,
    minHeight: 52,
    justifyContent: "center",
  },
  sendButtonDisabled: { opacity: 0.35 },
  sendButtonText: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: "700" },
  statusHint: {
    color: Colors.textSecondary,
    textAlign: "center",
    fontSize: FontSize.sm,
    marginTop: Spacing.sm,
  },
  errorHint: {
    color: Colors.error,
    textAlign: "center",
    fontSize: FontSize.sm,
    marginTop: Spacing.sm,
  },
  successContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  successEmoji: { fontSize: 72, marginBottom: Spacing.lg },
  successTitle: { color: Colors.accent, fontSize: FontSize.xxl, fontWeight: "800", marginBottom: Spacing.sm },
  successAmount: { color: Colors.textPrimary, fontSize: FontSize.xl, fontWeight: "700" },
  successTo: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.xl,
    fontFamily: "monospace",
  },
  feeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  feeLabel: { color: Colors.textSecondary, fontSize: FontSize.sm },
  feeValue: { color: Colors.accent, fontSize: FontSize.sm, fontWeight: "700" },
  noSolNote: { color: Colors.textSecondary, fontSize: FontSize.sm, marginBottom: Spacing.md },
  txHash: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: "monospace",
    marginBottom: Spacing.xxl,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    minWidth: 200,
    alignItems: "center",
  },
  doneButtonText: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: "700" },
});
