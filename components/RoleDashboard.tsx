"use client";

import { useEffect, useMemo, useState } from "react";
import type { BayForgeUser, RoleView } from "@/lib/roles";

type DashboardStatus = "loading" | "signed-out" | "signed-in";

type ViewPanel = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: Array<{ label: string; value: string }>;
  actions: string[];
};

const VIEW_ORDER: RoleView[] = ["admin", "organizer", "judge", "participant"];

const VIEW_LABELS: Record<RoleView, string> = {
  admin: "Admin",
  organizer: "Organizer",
  judge: "Judge",
  participant: "Participant",
};

const VIEW_PANELS: Record<RoleView, ViewPanel> = {
  admin: {
    eyebrow: "System command",
    title: "Admin review",
    description:
      "Manage community operations, invite-only roles, event quality, and platform-level access.",
    metrics: [
      { label: "Invite-only roles", value: "Admin, judge" },
      { label: "Default public role", value: "Participant" },
      { label: "Organizer mode", value: "Switchable" },
    ],
    actions: ["Invite admins and judges", "Review organizer access", "Audit community activity"],
  },
  organizer: {
    eyebrow: "Event operations",
    title: "Organizer workspace",
    description:
      "Plan events, publish sessions, coordinate partners, and switch into participant mode when building.",
    metrics: [
      { label: "Event pipeline", value: "Draft to live" },
      { label: "Participant access", value: "Included" },
      { label: "Public signup", value: "Allowed" },
    ],
    actions: ["Create event drafts", "Manage signups", "Coordinate event partners"],
  },
  judge: {
    eyebrow: "Review bench",
    title: "Judge workspace",
    description:
      "Review projects through an invite-only identity with scoring, rubric, and finalist workflows.",
    metrics: [
      { label: "Access path", value: "Invite only" },
      { label: "Public signup", value: "Blocked" },
      { label: "Primary work", value: "Project review" },
    ],
    actions: ["Open review queue", "Apply rubric scores", "Submit finalist notes"],
  },
  participant: {
    eyebrow: "Builder mode",
    title: "Participant hub",
    description:
      "Find events, join teams, track submissions, and keep your builder profile ready for Bay Forge programs.",
    metrics: [
      { label: "Access path", value: "Public signup" },
      { label: "Project work", value: "Enabled" },
      { label: "Organizer switch", value: "When eligible" },
    ],
    actions: ["Explore events", "Join project teams", "Prepare submissions"],
  },
};

export default function RoleDashboard() {
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [user, setUser] = useState<BayForgeUser | null>(null);
  const [activeView, setActiveView] = useState<RoleView>("participant");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : { user: null }))
      .then((data) => {
        if (cancelled) return;

        const nextUser = data?.user ?? null;
        if (!nextUser) {
          setStatus("signed-out");
          setUser(null);
          return;
        }

        const views = getAvailableViews(nextUser);
        const savedView = getSavedView();
        const nextView =
          savedView && views.includes(savedView)
            ? savedView
            : views.includes(nextUser.active_view)
              ? nextUser.active_view
              : views[0];

        setUser(nextUser);
        setActiveView(nextView);
        setStatus("signed-in");
      })
      .catch(() => {
        if (!cancelled) setStatus("signed-out");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const availableViews = useMemo(() => getAvailableViews(user), [user]);
  const currentView = availableViews.includes(activeView) ? activeView : availableViews[0];
  const panel = VIEW_PANELS[currentView];

  function handleViewChange(view: RoleView) {
    if (!availableViews.includes(view)) return;
    setActiveView(view);
    window.localStorage.setItem("bayforge_active_view", view);
  }

  if (status === "loading") {
    return (
      <section className="dashboard-shell" aria-busy="true">
        <div className="dashboard-loading">
          <span />
          <span />
          <span />
        </div>
      </section>
    );
  }

  if (status === "signed-out" || !user) {
    return (
      <section className="dashboard-shell">
        <div className="dashboard-panel dashboard-empty">
          <p className="dashboard-eyebrow">Role required</p>
          <h1>Sign in to open your Bay Forge view</h1>
          <p>
            Participants and organizers can create accounts. Admin, super admin,
            and judge access is invitation-only.
          </p>
          <div className="dashboard-actions">
            <a className="button button-primary" href="/login">
              Sign in
            </a>
            <a className="button button-secondary" href="/signup">
              Create account
            </a>
          </div>
        </div>
      </section>
    );
  }

  const displayName = user.display_name || user.name || user.email || "Bay Forge member";
  const roleList = user.roles.map((role) => role.replaceAll("_", " ")).join(", ");

  return (
    <section className="dashboard-shell">
      <div className="dashboard-panel">
        <div className="dashboard-identity">
          <div>
            <p className="dashboard-eyebrow">Role profile</p>
            <h1>{displayName}</h1>
            <p>{user.email}</p>
          </div>
          <div className="dashboard-role-card">
            <span>{user.role_label}</span>
            <small>{roleList}</small>
          </div>
        </div>

        {availableViews.length > 1 && (
          <div className="role-tabs" role="tablist" aria-label="Role views">
            {VIEW_ORDER.filter((view) => availableViews.includes(view)).map((view) => (
              <button
                key={view}
                type="button"
                role="tab"
                aria-selected={currentView === view}
                className={currentView === view ? "active" : ""}
                onClick={() => handleViewChange(view)}
              >
                {VIEW_LABELS[view]}
              </button>
            ))}
          </div>
        )}

        <div className="dashboard-view">
          <div className="dashboard-view-copy">
            <p className="dashboard-eyebrow">{panel.eyebrow}</p>
            <h2>{panel.title}</h2>
            <p>{panel.description}</p>
          </div>

          <div className="dashboard-metrics">
            {panel.metrics.map((metric) => (
              <div className="dashboard-metric" key={metric.label}>
                <span>{metric.value}</span>
                <small>{metric.label}</small>
              </div>
            ))}
          </div>

          <div className="dashboard-next">
            {panel.actions.map((action) => (
              <span key={action}>{action}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getAvailableViews(user: BayForgeUser | null): RoleView[] {
  if (!user?.available_views?.length) return ["participant"];
  return VIEW_ORDER.filter((view) => user.available_views.includes(view));
}

function getSavedView(): RoleView | null {
  const value = window.localStorage.getItem("bayforge_active_view");
  return VIEW_ORDER.includes(value as RoleView) ? (value as RoleView) : null;
}
