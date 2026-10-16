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
        {/* Brand: Lenz & System Designation */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Optical Aperture Lens Emblem */}
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" strokeWidth="2.2" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className="font-display"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#f8fafc",
                }}
              >
                LENZ
              </span>
              <span
                style={{
                  fontSize: "0.62rem",
                  padding: "1px 6px",
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
