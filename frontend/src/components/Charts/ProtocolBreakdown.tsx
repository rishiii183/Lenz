import { motion } from "framer-motion";

interface ProtocolBreakdownProps {
  protocols: Record<string, number> | undefined;
  loading: boolean;
}

const PROTOCOL_COLORS: Record<string, string> = {
  udp: "#6366f1",
  syn: "#06b6d4",
  dns: "#10b981",
  http: "#f43f5e",
  icmp: "#f59e0b",
  rst: "#8b5cf6",
  gre: "#ec4899",
  other: "#64748b",
};

export function ProtocolBreakdown({ protocols, loading }: ProtocolBreakdownProps) {
  const protocolEntries = Object.entries(protocols || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="glass-card" style={{ padding: "20px 24px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent-rose)",
            }}
          />
          Vector & Protocol Distribution
        </h3>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
          Observed layer 3/4 & layer 7 volumetric vectors
        </p>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: "100%", height: 28 }} />
          ))
        ) : protocolEntries.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>
            No protocol breakdown available
          </div>
        ) : (
          protocolEntries.map(([name, pct], idx) => {
            const lowerName = name.toLowerCase();
            const color =
              PROTOCOL_COLORS[lowerName] ||
              (lowerName.includes("udp") ? PROTOCOL_COLORS.udp :
               lowerName.includes("syn") ? PROTOCOL_COLORS.syn :
               lowerName.includes("dns") ? PROTOCOL_COLORS.dns :
               lowerName.includes("http") ? PROTOCOL_COLORS.http :
               lowerName.includes("icmp") ? PROTOCOL_COLORS.icmp : "#8b5cf6");

            const formattedPct = typeof pct === "number" ? pct.toFixed(1) : "0.0";

            return (
              <div key={name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                    {name}
                  </span>
                  <span style={{ fontWeight: 700, color }}>{formattedPct}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                    style={{ backgroundColor: color }}
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
