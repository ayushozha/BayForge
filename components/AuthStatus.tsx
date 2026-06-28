"use client";

import { useEffect, useState } from "react";
import type { BayForgeUser } from "@/lib/roles";

export default function AuthStatus() {
  const [user, setUser] = useState<BayForgeUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : { user: null }))
      .then((data) => {
        if (!cancelled) {
          setUser(data?.user ?? null);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    setUser(null);
    window.location.assign("/");
  }

  if (!loaded) {
    return <span className="auth-status" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <a className="auth-status auth-signin" href="/login">
        Sign in
      </a>
    );
  }

  const label = user.display_name || user.email || "Account";
  return (
    <span className="auth-status auth-signed-in">
      <a className="auth-user" href="/dashboard" title={user.email}>
        <span>{label}</span>
        <small>{user.role_label}</small>
      </a>
      <button type="button" className="auth-signout" onClick={handleSignOut}>
        Sign out
      </button>
    </span>
  );
}
