interface ProtocolBreakdownProps {
  protocols: Record<string, number> | undefined;
  loading: boolean;
}

const TACTICAL_PROTOCOL_COLORS: Record<string, string> = {
  udp: "#ef4444",
  syn: "#f59e0b",
  dns: "#cbd5e1",
  http: "#94a3b8",
  icmp: "#64748b",
  rst: "#475569",
  gre: "#334155",
  other: "#475569",
};

export function ProtocolBreakdown({ protocols, loading }: ProtocolBreakdownProps) {
  const protocolEntries = Object.entries(protocols || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="soc-card" style={{ padding: "16px 20px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "14px" }}>
        <h3
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: "0.06em",
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />
          ATTACK VECTORS & PROTOCOLS
        </h3>
        <p style={{ fontSize: "0.7rem", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>
          L3/L4 & L7 VOLUMETRIC DISTRIBUTION BREAKDOWN
        </p>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: "100%", height: 22 }} />
          ))
        ) : protocolEntries.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>
            NO PROTOCOL VECTORS DETECTED
          </div>
        ) : (
          protocolEntries.map(([name, pct]) => {
            const lowerName = name.toLowerCase();
            const color =
              TACTICAL_PROTOCOL_COLORS[lowerName] ||
              (lowerName.includes("udp") ? TACTICAL_PROTOCOL_COLORS.udp :
               lowerName.includes("syn") ? TACTICAL_PROTOCOL_COLORS.syn :
               lowerName.includes("dns") ? TACTICAL_PROTOCOL_COLORS.dns :
               lowerName.includes("http") ? TACTICAL_PROTOCOL_COLORS.http :
               lowerName.includes("icmp") ? TACTICAL_PROTOCOL_COLORS.icmp : "#64748b");

            const formattedPct = typeof pct === "number" ? pct.toFixed(1) : "0.0";

            return (
              <div key={name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.72rem",
                    marginBottom: "3px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>
                    {name}
                  </span>
                  <span style={{ fontWeight: 700, color }}>{formattedPct}%</span>
                </div>
                <div className="meter-track">
                  <div
                    className="meter-fill"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: color,
                      transition: "width 0.4s ease-out",
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
