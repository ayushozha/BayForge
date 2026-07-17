"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import BayForgeLogo from "@/components/platform/BayForgeLogo";
import { switchWorkspace } from "@/app/(platform)/dashboard/actions";
import {
  getRoleLabel,
  type BayForgeSessionUser,
  type RoleView,
} from "@/lib/roles";

const VIEW_ORDER: RoleView[] = ["admin", "organizer", "judge", "participant"];

export default function PlatformShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: BayForgeSessionUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [switchError, setSwitchError] = useState("");
  const [isSwitching, startSwitch] = useTransition();
  const displayName =
    user.display_name || user.name || user.email || "Bay Forge member";

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  function handleWorkspaceChange(view: RoleView) {
    if (view === user.active_view || isSwitching) return;
    setSwitchError("");
    startSwitch(async () => {
      const result = await switchWorkspace(view);
      if (!result.ok) {
        setSwitchError(result.message);
        return;
      }
      setMenuOpen(false);
      router.refresh();
    });
  }

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    window.location.assign("/");
  }

  return (
    <div className="platform-frame">
      <header className="platform-mobile-header">
        <Link className="platform-brand" href="/dashboard" aria-label="Bay Forge dashboard">
          <BayForgeLogo compact />
        </Link>
        <button
          className="platform-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="platform-sidebar"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {menuOpen ? "Close navigation" : "Open navigation"}
          </span>
          <span />
          <span />
        </button>
      </header>

      {menuOpen && (
        <button
          className="platform-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`platform-sidebar${menuOpen ? " is-open" : ""}`}
        id="platform-sidebar"
      >
        <div className="platform-sidebar-top">
          <Link className="platform-brand" href="/dashboard" aria-label="Bay Forge dashboard">
            <BayForgeLogo />
            <small>Submission platform</small>
          </Link>

          <nav className="platform-nav" aria-label="Platform navigation">
            <p>Workspace</p>
            <Link
              className={pathname === "/dashboard" ? "is-active" : ""}
              href="/dashboard"
              aria-current={pathname === "/dashboard" ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <OverviewIcon />
              Overview
            </Link>
          </nav>

          <div className="platform-workspace-switcher">
            <p>Acting as</p>
            <div role="group" aria-label="Available role workspaces">
              {VIEW_ORDER.filter((view) =>
                user.available_views.includes(view)
              ).map((view) => (
                <button
                  key={view}
                  className={user.active_view === view ? "is-active" : ""}
                  type="button"
                  aria-pressed={user.active_view === view}
                  disabled={isSwitching}
                  onClick={() => handleWorkspaceChange(view)}
                >
                  <span>{getRoleLabel(view)}</span>
                  {user.active_view === view && <small>Current</small>}
                </button>
              ))}
            </div>
            {switchError && (
              <p className="platform-switch-error" role="status">
                {switchError}
              </p>
            )}
          </div>
        </div>

        <div className="platform-sidebar-bottom">
          <Link className="platform-event-link" href="/bay-builders-hackathon">
            <span>Bay Builders Hackathon</span>
            <small>View public event</small>
          </Link>
          <div className="platform-account">
            <div className="platform-avatar" aria-hidden="true">
              {initials(displayName)}
            </div>
            <span>
              <strong>{displayName}</strong>
              <small>{user.role_label}</small>
            </span>
            <button type="button" onClick={handleSignOut}>
              <span className="sr-only">Sign out</span>
              <SignOutIcon />
            </button>
          </div>
        </div>
      </aside>

      <section className="platform-main">
        <div className="platform-topbar">
          <p>
            <span>Bay Builders Hackathon</span>
            <i aria-hidden="true">/</i>
            {getRoleLabel(user.active_view)} workspace
          </p>
          <span className="platform-session-badge">
            <i />
            Secure session
          </span>
        </div>
        {children}
      </section>
    </div>
  );
}

function initials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts.at(-1)?.[0]}` : value.slice(0, 2))
    .toUpperCase();
}

function OverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
    </svg>
  );
}
