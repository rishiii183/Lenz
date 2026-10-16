interface HeaderProps {
  isSimulated?: boolean;
}

export function Header({ isSimulated = false }: HeaderProps) {
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
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
      </div>

      {/* Professional Telemetry Notice Bar only when simulated */}
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
