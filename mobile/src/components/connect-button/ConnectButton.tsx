import React, { useState, useCallback } from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useMobileWallet } from "../../utils/useMobileWallet";
import { useAuthorization } from "../../utils/useAuthorization";
import { alertAndLog } from "../../utils/alertAndLog";
import { Colors, Spacing, FontSize } from "../../theme";

interface ConnectButtonProps {
  onConnected?: () => void;
  label?: string;
}

export function ConnectButton({ onConnected, label = "Connect Wallet" }: ConnectButtonProps) {
  const { connect } = useMobileWallet();
  const { selectedAccount } = useAuthorization();
  const [loading, setLoading] = useState(false);

  const handleConnect = useCallback(async () => {
    if (loading) return;
    try {
      setLoading(true);
      await connect();
      onConnected?.();
    } catch (err: any) {
      alertAndLog("Connection failed", err instanceof Error ? err.message : err);
    } finally {
      setLoading(false);
    }
  }, [loading, connect, onConnected]);

  if (selectedAccount) {
    return (
      <TouchableOpacity style={[styles.button, styles.connected]} disabled>
        <Text style={styles.buttonText}>
          ✓ {selectedAccount.publicKey.toString().slice(0, 6)}...
          {selectedAccount.publicKey.toString().slice(-4)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleConnect} disabled={loading}>
      {loading ? (
        <ActivityIndicator color={Colors.textPrimary} />
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
    minHeight: 52,
    justifyContent: "center",
  },
  connected: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: "700",
  },
});
