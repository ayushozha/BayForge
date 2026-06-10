"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const FALLBACK_COUNT = 8500;
const FALLBACK_LABEL = "8,500+";

type CommunityCountContextValue = {
  label: string;
  applyTotal: (total: number | null, increment: number) => void;
};

const CommunityCountContext = createContext<CommunityCountContextValue | null>(null);

export function CommunityCountProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState<number | null>(null);

  const applyTotal = useCallback((total: number | null, increment: number) => {
    setCount(current => {
      const base = current ?? FALLBACK_COUNT;
      const next = typeof total === "number" ? total : base + increment;
      return Number.isFinite(next) && next >= 0 ? Math.round(next) : current;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/community-stats", { headers: { Accept: "application/json" } })
      .then(response => response.json())
      .then(data => {
        if (!cancelled && typeof data.total === "number") {
          applyTotal(data.total, 0);
        }
      })
      .catch(() => {
        // Keep the design fallback when stats are unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [applyTotal]);

  const label = count === null ? FALLBACK_LABEL : count.toLocaleString("en-US");

  return (
    <CommunityCountContext.Provider value={{ label, applyTotal }}>
      {children}
    </CommunityCountContext.Provider>
  );
}

export function useCommunityCount() {
  const context = useContext(CommunityCountContext);
  if (!context) {
    throw new Error("useCommunityCount must be used within CommunityCountProvider");
  }
  return context;
}
