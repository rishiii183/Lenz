import { useState } from "react";
import type { CountryEntry, RegionData } from "@/types";

interface RegionsTableProps {
  originRegions: (RegionData | CountryEntry)[];
  targetRegions: (RegionData | CountryEntry)[];
  loading: boolean;
}

export function RegionsTable({
  originRegions,
  targetRegions,
  loading,
}: RegionsTableProps) {
  const [activeTab, setActiveTab] = useState<"origin" | "target">("origin");

  const currentList = activeTab === "origin" ? originRegions : targetRegions;

  return (
    <div className="glass-card" style={{ padding: "20px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
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
                background: activeTab === "origin" ? "var(--accent-amber)" : "var(--accent-rose)",
              }}
            />
            Geographic Distribution
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Country-level DDoS volumetric concentration
          </p>
        </div>

        {/* Tab Toggle */}
        <div
          style={{
            display: "flex",
            background: "rgba(15, 23, 42, 0.8)",
            padding: "3px",
            borderRadius: "8px",
            border: "1px solid var(--border-primary)",
          }}
        >
          <button
            onClick={() => setActiveTab("origin")}
            style={{
              background: activeTab === "origin" ? "var(--accent-amber)" : "transparent",
              color: activeTab === "origin" ? "#030712" : "var(--text-secondary)",
              border: "none",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Top Origins
          </button>
          <button
            onClick={() => setActiveTab("target")}
            style={{
              background: activeTab === "target" ? "var(--accent-rose)" : "transparent",
              color: activeTab === "target" ? "#ffffff" : "var(--text-secondary)",
              border: "none",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Top Targets
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Rank</th>
              <th>Country</th>
              <th style={{ width: "100px" }}>Code</th>
              <th style={{ width: "140px", textAlign: "right" }}>Attack Share</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4}>
                    <div className="skeleton" style={{ width: "100%", height: 24 }} />
                  </td>
                </tr>
              ))
            ) : currentList.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
                  No regional data available
                </td>
              </tr>
            ) : (
              currentList.map((entry, idx) => (
                <tr key={entry.country_code || idx}>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 22,
                        height: 22,
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        background:
                          idx === 0
                            ? "rgba(245, 158, 11, 0.2)"
                            : idx === 1
                            ? "rgba(99, 102, 241, 0.2)"
                            : "rgba(255, 255, 255, 0.05)",
                        color:
                          idx === 0
                            ? "#f59e0b"
                            : idx === 1
                            ? "#818cf8"
                            : "var(--text-muted)",
                      }}
                    >
                      {entry.rank || idx + 1}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {entry.country_name || entry.country_code}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "rgba(255, 255, 255, 0.08)",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {entry.country_code}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                      <span style={{ fontWeight: 700, color: activeTab === "origin" ? "#f59e0b" : "#fb7185" }}>
                        {entry.value.toFixed(1)}%
                      </span>
                      <div style={{ width: 40, height: 4 }} className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.min(entry.value * 2.5, 100)}%`,
                            backgroundColor: activeTab === "origin" ? "#f59e0b" : "#fb7185",
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
