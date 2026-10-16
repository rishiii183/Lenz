import { useState } from "react";
import type { CountryEntry, RegionData } from "../types";

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
    <div className="soc-card" style={{ padding: "16px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
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
                background: activeTab === "origin" ? "#f59e0b" : "#ef4444",
              }}
            />
            GEOGRAPHIC ATTACK CONCENTRATION
          </h3>
          <p style={{ fontSize: "0.7rem", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>
            VOLUMETRIC DISTRIBUTION BY COUNTRY ORIGIN AND INGRESS TARGET
          </p>
        </div>

        {/* Tactical Tab Toggle */}
        <div
          style={{
            display: "flex",
            background: "#080c14",
            padding: "2px",
            borderRadius: "4px",
            border: "1px solid #1e2636",
          }}
        >
          <button
            onClick={() => setActiveTab("origin")}
            style={{
              background: activeTab === "origin" ? "#1a2232" : "transparent",
              color: activeTab === "origin" ? "#f59e0b" : "#64748b",
              border: "1px solid",
              borderColor: activeTab === "origin" ? "#2d3a52" : "transparent",
              borderRadius: "3px",
              padding: "4px 12px",
              fontSize: "0.68rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ATTACK ORIGINS
          </button>
          <button
            onClick={() => setActiveTab("target")}
            style={{
              background: activeTab === "target" ? "#1a2232" : "transparent",
              color: activeTab === "target" ? "#ef4444" : "#64748b",
              border: "1px solid",
              borderColor: activeTab === "target" ? "#2d3a52" : "transparent",
              borderRadius: "3px",
              padding: "4px 12px",
              fontSize: "0.68rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            INGRESS TARGETS
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}>RANK</th>
              <th>COUNTRY / JURISDICTION</th>
              <th style={{ width: "80px" }}>ISO</th>
              <th style={{ width: "160px", textAlign: "right" }}>VOLUMETRIC SHARE</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4}>
                    <div className="skeleton" style={{ width: "100%", height: 20 }} />
                  </td>
                </tr>
              ))
            ) : currentList.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#64748b", padding: "18px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}>
                  NO REGIONAL TELEMETRY DATA RETURNED
                </td>
              </tr>
            ) : (
              currentList.map((entry, idx) => (
                <tr key={entry.country_code || idx}>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#64748b" }}>
                    #{entry.rank || idx + 1}
                  </td>
                  <td style={{ fontWeight: 600, color: "#f1f5f9" }}>
                    {entry.country_name || entry.country_code}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "1px 5px",
                        borderRadius: "2px",
                        background: "#161d2b",
                        border: "1px solid #232d3f",
                        fontSize: "0.7rem",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#94a3b8",
                      }}
                    >
                      {entry.country_code}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace",
                          color: activeTab === "origin" ? "#f59e0b" : "#ef4444",
                          fontSize: "0.75rem",
                        }}
                      >
                        {entry.value.toFixed(1)}%
                      </span>
                      <div style={{ width: 45 }} className="meter-track">
                        <div
                          className="meter-fill"
                          style={{
                            width: `${Math.min(entry.value * 2.5, 100)}%`,
                            backgroundColor: activeTab === "origin" ? "#f59e0b" : "#ef4444",
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
