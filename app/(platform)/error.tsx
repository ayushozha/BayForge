"use client";

export default function PlatformError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="platform-state-page">
      <section className="platform-state-card" role="alert">
        <p className="platform-kicker">Connection interrupted</p>
        <h1>The platform could not verify your session.</h1>
        <p>
          Your account data has not been changed. Retry the secure connection,
          or return to the public Bay Forge site.
        </p>
        <div className="platform-state-actions">
          <button className="platform-button platform-button-primary" onClick={reset}>
            Try again
          </button>
          <a className="platform-button platform-button-secondary" href="/">
            Return home
          </a>
        </div>
      </section>
    </main>
  );
}
