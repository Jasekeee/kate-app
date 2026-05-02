import React, { useState } from "react";
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
import { Colors, Spacing, FontSize } from "../theme";

type SendRouteParams = {
  Send: { token?: string };
};

type SendStatus = "idle" | "confirming" | "sending" | "success" | "error";

export function SendScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<SendRouteParams, "Send">>();
  const token = route.params?.token ?? "USDC";

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [txHash, setTxHash] = useState("");

  const canSend = recipient.length > 10 && parseFloat(amount) > 0;
  const mockFee = "0.001";

  const handleSend = async () => {
    if (!canSend) return;
    setStatus("confirming");
    await new Promise((r) => setTimeout(r, 400));
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1600));
    setTxHash("5xK2...mR9p");
    setStatus("success");
  };

  if (status === "success") {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>Sent!</Text>
        <Text style={styles.successAmount}>
          {amount} {token}
        </Text>
        <Text style={styles.successTo}>to {recipient}</Text>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Fee paid:</Text>
          <Text style={styles.feeValue}>{mockFee} USDC</Text>
        </View>
        <Text style={styles.noSolNote}>No SOL used ⚡</Text>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
          />
          <View style={styles.tokenBadge}>
            <Text style={styles.tokenBadgeText}>{token}</Text>
          </View>
        </View>

        {/* Fee preview */}
        {canSend && (
          <View style={styles.feePreview}>
            <Text style={styles.feePreviewText}>
              ⚡ Gas fee: <Text style={styles.feePreviewAmount}>{mockFee} USDC</Text>
              {"  "}
              <Text style={styles.feePreviewNote}>(no SOL needed)</Text>
            </Text>
          </View>
        )}

        {/* Confirm button */}
        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend || status !== "idle"}
        >
          {status === "sending" || status === "confirming" ? (
            <ActivityIndicator color={Colors.textPrimary} />
          ) : (
            <Text style={styles.sendButtonText}>
              {status === "idle" ? "Confirm & Send" : "Sending..."}
            </Text>
          )}
        </TouchableOpacity>

        {status === "confirming" && (
          <Text style={styles.statusHint}>Confirm in your wallet...</Text>
        )}
        {status === "sending" && (
          <Text style={styles.statusHint}>Broadcasting to Solana...</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 60,
  },
  backText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: "600",
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  form: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
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
  amountRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  amountInput: {
    flex: 1,
  },
  tokenBadge: {
    backgroundColor: Colors.primary + "33",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  tokenBadgeText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: FontSize.sm,
  },
  feePreview: {
    backgroundColor: Colors.accent + "11",
    borderRadius: 10,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accent + "44",
    marginTop: Spacing.sm,
  },
  feePreviewText: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
  },
  feePreviewAmount: {
    color: Colors.accent,
    fontWeight: "700",
  },
  feePreviewNote: {
    color: Colors.textSecondary,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.lg,
    minHeight: 52,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.35,
  },
  sendButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  statusHint: {
    color: Colors.textSecondary,
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
  successEmoji: {
    fontSize: 72,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: "800",
    marginBottom: Spacing.sm,
  },
  successAmount: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: "700",
  },
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
  feeLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  feeValue: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: "700",
  },
  noSolNote: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
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
  doneButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: "700",
  },
});
