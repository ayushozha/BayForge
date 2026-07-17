import Link from "next/link";
import {
  getRoleLabel,
  type BayForgeSessionUser,
  type RoleView,
} from "@/lib/roles";

const WORKSPACE_COPY: Record<
  RoleView,
  { kicker: string; title: string; accent: string; description: string }
> = {
  admin: {
    kicker: "Platform control",
    title: "Run the event.",
    accent: "Protect every outcome.",
    description:
      "Your verified admin workspace is the secure entry point for role-restricted event operations.",
  },
  organizer: {
    kicker: "Event operations",
    title: "Keep the room moving.",
    accent: "Keep every decision clear.",
    description:
      "Your verified organizer workspace keeps your event identity and authorized view explicit from the first screen.",
  },
  judge: {
    kicker: "Review workspace",
    title: "Review the work.",
    accent: "Score what matters.",
    description:
      "Your invite-only judge workspace confirms review access before any assignment or scoring data is shown.",
  },
  participant: {
    kicker: "Builder workspace",
    title: "Build with clarity.",
    accent: "Submit with confidence.",
    description:
      "Your participant workspace confirms ownership before any private team or submission data is shown.",
  },
};

export default function WorkspaceOverview({
  user,
}: {
  user: BayForgeSessionUser;
}) {
  const content = WORKSPACE_COPY[user.active_view];
  const displayName =
    user.display_name || user.name || user.email || "builder";

  return (
    <main className="platform-content">
      <section className="platform-hero">
        <div>
          <p className="platform-kicker">{content.kicker}</p>
          <h1>
            {content.title}
            <em>{content.accent}</em>
          </h1>
          <p>
            Welcome back, <strong>{firstName(displayName)}</strong>. {content.description}
          </p>
        </div>
        <div className="platform-hero-mark" aria-hidden="true">
          <span>B<span>/</span>F</span>
        </div>
      </section>

      <section className="platform-facts" aria-label="Account access summary">
        <article>
          <small>Current workspace</small>
          <strong>{getRoleLabel(user.active_view)}</strong>
          <span>Server verified</span>
        </article>
        <article>
          <small>Primary role</small>
          <strong>{user.role_label}</strong>
          <span>{user.invite_only ? "Invite-only access" : "Public account role"}</span>
        </article>
        <article>
          <small>Available views</small>
          <strong>{user.available_views.length}</strong>
          <span>{formatViews(user.available_views)}</span>
        </article>
      </section>

      <section className="platform-grid">
        <article className="platform-card platform-card-featured">
          <div className="platform-card-heading">
            <div>
              <p className="platform-kicker">Workspace readiness</p>
              <h2>Your access is active and verified.</h2>
            </div>
            <span className="platform-status"><i /> Ready</span>
          </div>
          <p>
            Bay Forge has verified the identity and role policy behind this
            workspace. Event workflows will use this same secure boundary, so
            every action is attributed to the right person and role.
          </p>
          <ol className="platform-checklist">
            <li>
              <span>01</span>
              <div>
                <strong>Identity confirmed</strong>
                <small>Protected pages verify your session before they render.</small>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Workspace policy applied</strong>
                <small>Only roles returned by the authentication service can be opened.</small>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Operating context visible</strong>
                <small>Your selected role and public event stay visible throughout the workspace.</small>
              </div>
            </li>
          </ol>
        </article>

        <aside className="platform-card platform-access-card">
          <p className="platform-kicker">Signed-in profile</p>
          <h2>{user.role_label}</h2>
          <p>
            Signed in as <strong>{user.email || displayName}</strong>
          </p>
          <div className="platform-role-list">
            {user.roles.map((role) => (
              <span key={role}>{getRoleLabel(role)}</span>
            ))}
          </div>
          <Link className="platform-button platform-button-secondary" href="/bay-builders-hackathon">
            View event page
          </Link>
        </aside>
      </section>
    </main>
  );
}

function firstName(value: string): string {
  return value.includes("@") ? "builder" : value.trim().split(/\s+/)[0];
}

function formatViews(views: RoleView[]): string {
  return views.map((view) => getRoleLabel(view)).join(", ");
}
