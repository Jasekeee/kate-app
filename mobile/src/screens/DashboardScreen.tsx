import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, Spacing, FontSize } from "../theme";
import { useAuthorization } from "../utils/useAuthorization";
import { ConnectButton } from "../components/connect-button/ConnectButton";
import { getUsdcBalance } from "../services/kora";

const COST_PER_TX_USDC = 0.00025;
const CONNECTED_DAPPS = [
  { name: "Jupiter", icon: "🪐", active: true },
  { name: "Drift", icon: "🌊", active: true },
];

export function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { selectedAccount } = useAuthorization();
  const [gasBalance, setGasBalance] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const walletAddress = selectedAccount?.publicKey.toString() ?? null;
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  const loadBalance = useCallback(async () => {
    if (!walletAddress) {
      setGasBalance(null);
      return;
    }
    try {
      const bal = await getUsdcBalance(walletAddress);
      setGasBalance(bal);
    } catch {
      setGasBalance(0);
    }
  }, [walletAddress]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBalance();
    setRefreshing(false);
  };

  const displayBalance = gasBalance ?? 0;
  const txRemaining = Math.floor(displayBalance / COST_PER_TX_USDC);
  const balancePercent = Math.min((displayBalance / 50) * 100, 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Käte</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Wallet address or connect prompt */}
      {shortAddress ? (
        <View style={styles.walletBadge}>
          <Text style={styles.walletDot}>●</Text>
          <Text style={styles.walletAddress}>{shortAddress}</Text>
        </View>
      ) : (
        <View style={styles.connectSection}>
          <Text style={styles.connectHint}>Connect your wallet to start</Text>
          <ConnectButton onConnected={loadBalance} />
        </View>
      )}

      {/* Gas Balance Card */}
      <View style={styles.gasCard}>
        <Text style={styles.gasLabel}>Gas Balance</Text>
        <Text style={styles.gasAmount}>
          {gasBalance === null && walletAddress
            ? "Loading..."
            : `${displayBalance.toFixed(2)} `}
          {gasBalance !== null && (
            <Text style={styles.gasUnit}>USDC</Text>
          )}
        </Text>
        <View style={styles.gasBar}>
          <View style={[styles.gasBarFill, { width: `${balancePercent}%` }]} />
        </View>
        <Text style={styles.gasTxCount}>
          ⚡ ~{txRemaining.toLocaleString()} transactions remaining
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <ActionButton
          emoji="📤"
          label="Send USDC"
          onPress={() => navigation.navigate("Send", { token: "USDC" })}
          disabled={!walletAddress}
        />
        <ActionButton
          emoji="🪙"
          label="Send Token"
          onPress={() => navigation.navigate("Send", { token: "Token" })}
          disabled={!walletAddress}
        />
        <ActionButton emoji="🔄" label="Swap" onPress={() => {}} disabled comingSoon />
        <ActionButton emoji="🌐" label="dApps" onPress={() => {}} disabled comingSoon />
      </View>

      {/* Connected dApps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected dApps</Text>
        {CONNECTED_DAPPS.map((dapp) => (
          <View key={dapp.name} style={styles.dappRow}>
            <Text style={styles.dappIcon}>{dapp.icon}</Text>
            <Text style={styles.dappName}>{dapp.name}</Text>
            <View style={[styles.dappStatus, dapp.active && styles.dappActive]}>
              <Text style={styles.dappStatusText}>Active</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.addDapp}>
          <Text style={styles.addDappText}>+ Add new dApp</Text>
        </TouchableOpacity>
      </View>

      {/* Top up gas */}
      <TouchableOpacity style={styles.topUpButton}>
        <Text style={styles.topUpText}>⚡ Top Up Gas Balance</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ActionButton({
  emoji, label, onPress, disabled, comingSoon,
}: {
  emoji: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, disabled && styles.actionButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={[styles.actionLabel, disabled && styles.actionLabelDisabled]}>
        {label}
      </Text>
      {comingSoon && <Text style={styles.soon}>soon</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logo: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.primary },
  settingsButton: { padding: Spacing.sm },
  settingsIcon: { fontSize: 22 },
  walletBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: Spacing.lg,
    gap: 6,
  },
  walletDot: { color: Colors.accent, fontSize: 10 },
  walletAddress: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: "monospace",
  },
  connectSection: { marginBottom: Spacing.lg, gap: Spacing.sm },
  connectHint: { color: Colors.textSecondary, fontSize: FontSize.sm },
  gasCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + "44",
  },
  gasLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  gasAmount: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: "800",
    marginBottom: Spacing.md,
    minHeight: 48,
  },
  gasUnit: { color: Colors.accent, fontSize: FontSize.xl, fontWeight: "600" },
  gasBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  gasBarFill: { height: "100%", backgroundColor: Colors.primary, borderRadius: 3 },
  gasTxCount: { color: Colors.textSecondary, fontSize: FontSize.sm },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: "center",
    width: "47%",
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 88,
    justifyContent: "center",
    gap: 4,
  },
  actionButtonDisabled: { opacity: 0.4 },
  actionEmoji: { fontSize: 28 },
  actionLabel: { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: "600" },
  actionLabelDisabled: { color: Colors.textSecondary },
  soon: {
    color: Colors.textSecondary,
    fontSize: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  dappRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  dappIcon: { fontSize: 20 },
  dappName: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: "600", flex: 1 },
  dappStatus: {
    backgroundColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  dappActive: { backgroundColor: Colors.accent + "33" },
  dappStatusText: { color: Colors.accent, fontSize: FontSize.xs, fontWeight: "600" },
  addDapp: { padding: Spacing.md, alignItems: "center" },
  addDappText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: "600" },
  topUpButton: {
    backgroundColor: Colors.primary + "22",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  topUpText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: "700" },
});
