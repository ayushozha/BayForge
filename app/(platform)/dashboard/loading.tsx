export default function DashboardLoading() {
  return (
    <main className="platform-content" aria-busy="true" aria-label="Loading workspace">
      <div className="platform-loading-heading" />
      <div className="platform-loading-copy" />
      <div className="platform-loading-grid">
        <div />
        <div />
        <div />
      </div>
      <div className="platform-loading-panel" />
    </main>
  );
}
