import {
  getRoleLabel,
  type BayForgeSessionUser,
  type RoleView,
} from "@/lib/roles";

const WORKSPACE_COPY: Record<
  RoleView,
  { kicker: string; title: string; description: string }
> = {
  admin: {
    kicker: "Platform control",
    title: "A secure base for event operations.",
    description:
      "Your verified admin identity can govern hackathon configuration, role assignments, judging operations, and result publication as those features ship.",
  },
  organizer: {
    kicker: "Event operations",
    title: "Your hackathon command surface starts here.",
    description:
      "Your verified organizer identity is ready for event setup, submission oversight, judge coordination, and result controls.",
  },
  judge: {
    kicker: "Review workspace",
    title: "A focused home for fair project review.",
    description:
      "Your invite-only judge identity is ready for assigned queues, rubric scoring, conflict safeguards, and final submission.",
  },
  participant: {
    kicker: "Builder workspace",
    title: "Your submission journey starts here.",
    description:
      "Your participant identity is ready for team details, project drafts, required links, final submission, and status tracking.",
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
            Welcome, {firstName(displayName)}.
            <em>{content.title}</em>
          </h1>
          <p>{content.description}</p>
        </div>
        <div className="platform-hero-mark" aria-hidden="true">
          <span>BF</span>
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
              <p className="platform-kicker">Foundation status</p>
              <h2>Identity and access are ready.</h2>
            </div>
            <span className="platform-status"><i /> Active</span>
          </div>
          <p>
            This first platform release establishes the authenticated shell,
            trusted role policy, secure workspace switching, and resilient
            session handling. Submission data is intentionally not fabricated
            before the submission feature is connected.
          </p>
          <ol className="platform-checklist">
            <li>
              <span>01</span>
              <div>
                <strong>Authenticated server boundary</strong>
                <small>Protected pages verify the session before rendering.</small>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Role-aware workspaces</strong>
                <small>Only roles returned by the auth service can be opened.</small>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Submission-ready architecture</strong>
                <small>The next feature can attach real event and project data here.</small>
              </div>
            </li>
          </ol>
        </article>

        <aside className="platform-card platform-access-card">
          <p className="platform-kicker">Access profile</p>
          <h2>{user.role_label}</h2>
          <p>
            Signed in as <strong>{user.email || displayName}</strong>
          </p>
          <div className="platform-role-list">
            {user.roles.map((role) => (
              <span key={role}>{getRoleLabel(role)}</span>
            ))}
          </div>
          <a className="platform-button platform-button-secondary" href="/bay-builders-hackathon">
            View hackathon
          </a>
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
