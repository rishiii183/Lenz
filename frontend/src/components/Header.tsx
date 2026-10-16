import type { DataStatus } from "../types";

interface HeaderProps {
  dataStatus: DataStatus | null;
  loading: boolean;
}

export function Header({ dataStatus, loading }: HeaderProps) {
  const status = dataStatus?.status ?? (loading ? "loading" : "demo");
  const isSimulated = dataStatus?.is_simulated ?? true;

  const statusConfig: Record<string, { label: string; class: string }> = {
    live: { label: "RADAR // INGESTION ACTIVE", class: "status-live" },
    demo: { label: "DEMO // SYNTHESIZED STREAM", class: "status-demo" },
    stale: { label: "CACHE // STALE REVALIDATION", class: "status-stale" },
    error: { label: "OFFLINE // CONNECTION ERR", class: "status-error" },
    loading: { label: "CONNECTING // TELEMETRY", class: "status-demo" },
  };

  const { label, class: pillClass } = statusConfig[status] || statusConfig.demo;

  return (
    <header
      style={{
        background: "#090c13",
        borderBottom: "1px solid var(--border-primary)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Brand & System Designation */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "4px",
              background: "#121722",
              border: "1px solid #232c3d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#cbd5e1",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className="font-display"
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  letterSpacing: "0.07em",
                  color: "#f8fafc",
                }}
              >
                THREATLENS
              </span>
              <span
                style={{
                  fontSize: "0.62rem",
                  padding: "1px 5px",
                  borderRadius: "2px",
                  background: "#161d2b",
                  border: "1px solid #283347",
                  color: "#94a3b8",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                OPS::CONSOLE
              </span>
            </div>
            <p
              style={{
                fontSize: "0.68rem",
                color: "#64748b",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                marginTop: "1px",
              }}
            >
              GLOBAL DDOS THREAT INTELLIGENCE & TELEMETRY
            </p>
          </div>
        </div>

        {/* Telemetry Status Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <span className={`status-pill ${pillClass}`}>
            <span className="status-indicator-dot" />
            {label}
          </span>

          <div
            style={{
              fontSize: "0.7rem",
              fontFamily: "var(--font-mono)",
              color: "#64748b",
              borderLeft: "1px solid #1e2433",
              paddingLeft: "14px",
            }}
          >
            SOURCE:{" "}
            <a
              href="https://developers.cloudflare.com/radar/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 600 }}
            >
              CLOUDFLARE_RADAR_REST_V4
            </a>
          </div>

          {dataStatus?.last_successful_fetch && (
            <div
              style={{
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)",
                color: "#64748b",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              SYNC: {new Date(dataStatus.last_successful_fetch).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Professional Telemetry Notice Bar */}
      {isSimulated && (
        <div style={{ padding: "0 24px 10px" }}>
          <div className="notice-banner">
            <span>
              [SOURCE: SYNTHESIZED STREAM] Add CLOUDFLARE_API_TOKEN in backend/.env for live autonomous edge telemetry.
            </span>
            <span style={{ color: "#94a3b8", fontSize: "0.66rem", letterSpacing: "0.05em" }}>
              FAILSAFE_ACTIVE
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
