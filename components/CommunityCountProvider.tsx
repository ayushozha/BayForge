"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type CommunityCountContextValue = {
  label: string;
  collegesLabel: string;
  applyTotal: (total: number | null, increment: number) => void;
};

const CommunityCountContext = createContext<CommunityCountContextValue | null>(null);

export function CommunityCountProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState<number | null>(null);
  const [collegesRepresented, setCollegesRepresented] = useState<number | null>(null);

  const applyTotal = useCallback((total: number | null, increment: number) => {
    setCount(current => {
      const next =
        typeof total === "number"
          ? total
          : typeof current === "number"
            ? current + increment
            : null;

      return typeof next === "number" && Number.isFinite(next) && next >= 0
        ? Math.round(next)
        : current;
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

        if (!cancelled && typeof data.collegesRepresented === "number") {
          setCollegesRepresented(Math.round(data.collegesRepresented));
        }
      })
      .catch(() => {
        // Keep the design fallback when stats are unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [applyTotal]);

  const label = count === null ? "..." : count.toLocaleString("en-US");
  const collegesLabel =
    collegesRepresented === null ? "..." : collegesRepresented.toLocaleString("en-US");

  return (
    <CommunityCountContext.Provider value={{ label, collegesLabel, applyTotal }}>
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
