import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { TimeSeriesData } from "@/types";

interface TimeSeriesChartProps {
  data: TimeSeriesData | null;
  loading: boolean;
  activeRange: string;
  onRangeChange: (range: string) => void;
}

export function TimeSeriesChart({
  data,
  loading,
  activeRange,
  onRangeChange,
}: TimeSeriesChartProps) {
  const chartData = (data?.series || []).map((pt) => {
    const d = new Date(pt.timestamp);
    const label =
      activeRange === "24h"
        ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString([], { month: "short", day: "numeric" });
    return {
      timestamp: pt.timestamp,
      label,
      value: parseFloat((pt.value || 0).toFixed(2)),
    };
  });

  return (
    <div className="soc-card" style={{ padding: "16px 20px", height: "100%", display: "flex", flexDirection: "column" }}>
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
                background: "#cbd5e1",
              }}
            />
            VOLUMETRIC ATTACK TRENDS
          </h3>
          <p style={{ fontSize: "0.7rem", color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>
            METRIC: {data?.metric || "NORMALIZED_DDOS_INTENSITY"} ({data?.unit || "% OF INGESTION"})
          </p>
        </div>

        {/* Tactical Range Selector */}
        <div
          style={{
            display: "flex",
            background: "#080c14",
            padding: "2px",
            borderRadius: "4px",
            border: "1px solid #1e2636",
          }}
        >
          {["24h", "7d", "28d"].map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              style={{
                background: activeRange === range ? "#1a2232" : "transparent",
                color: activeRange === range ? "#f1f5f9" : "#64748b",
                border: "1px solid",
                borderColor: activeRange === range ? "#2d3a52" : "transparent",
                borderRadius: "3px",
                padding: "3px 10px",
                fontSize: "0.68rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 200, position: "relative" }}>
        {loading ? (
          <div
            className="skeleton"
            style={{ width: "100%", height: "100%", minHeight: 200 }}
          />
        ) : chartData.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#64748b",
              fontSize: "0.75rem",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            NO DATA POINTS IN SELECTED RANGE
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="coldSteelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#161e2c" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#475569"
                fontSize={10}
                fontFamily="'JetBrains Mono', monospace"
                tickLine={false}
              />
              <YAxis
                stroke="#475569"
                fontSize={10}
                fontFamily="'JetBrains Mono', monospace"
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div
                        style={{
                          background: "#0a0e17",
                          border: "1px solid #28354b",
                          borderRadius: "4px",
                          padding: "6px 10px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        <p style={{ fontSize: "0.68rem", color: "#64748b" }}>
                          {item.timestamp}
                        </p>
                        <p
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            color: "#f1f5f9",
                            marginTop: "2px",
                          }}
                        >
                          {item.value}% ATTACK SHARE
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#cbd5e1"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#coldSteelGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
