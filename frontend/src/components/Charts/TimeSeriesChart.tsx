import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
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
    <div className="glass-card" style={{ padding: "20px 24px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "10px",
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
                background: "var(--accent-cyan)",
              }}
            />
            DDoS Attack Activity Over Time
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
            {data?.metric || "Normalized Attack Traffic Intensity"} ({data?.unit || "% of total traffic"})
          </p>
        </div>

        {/* Range Selector */}
        <div
          style={{
            display: "flex",
            background: "rgba(15, 23, 42, 0.8)",
            padding: "3px",
            borderRadius: "8px",
            border: "1px solid var(--border-primary)",
          }}
        >
          {["24h", "7d", "28d"].map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              style={{
                background: activeRange === range ? "var(--accent-primary)" : "transparent",
                color: activeRange === range ? "#ffffff" : "var(--text-secondary)",
                border: "none",
                borderRadius: "6px",
                padding: "4px 12px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 220, position: "relative" }}>
        {loading ? (
          <div
            className="skeleton"
            style={{ width: "100%", height: "100%", minHeight: 220 }}
          />
        ) : chartData.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            No time-series data available for this range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ddosGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis
                dataKey="label"
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={11}
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
                          background: "rgba(15, 23, 42, 0.95)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid var(--border-glow)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        }}
                      >
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          {item.timestamp}
                        </p>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: "#818cf8",
                            marginTop: "2px",
                          }}
                        >
                          {item.value}% DDoS Attack Share
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
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ddosGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
