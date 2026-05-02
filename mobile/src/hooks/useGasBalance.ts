import { useState, useEffect, useCallback, useRef } from "react";
import { getUsdcBalance } from "../services/kora";

const REFRESH_INTERVAL_MS = 15000; // auto-refresh every 15s

export function useGasBalance(walletAddress: string | null) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    if (!walletAddress) {
      setBalance(null);
      return;
    }
    setLoading(true);
    try {
      const bal = await getUsdcBalance(walletAddress);
      setBalance(bal);
    } catch {
      // keep last known value on error
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refresh();

    if (walletAddress) {
      intervalRef.current = setInterval(refresh, REFRESH_INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh, walletAddress]);

  return { balance, loading, refresh };
}
