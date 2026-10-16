import { useState } from "react";
import { Header } from "./components/Header";
import {
  KPICard,
  ShieldIcon,
  ActivityIcon,
  GlobeIcon,
  ZapIcon,
} from "./components/KPICard";
import { GlobeSection } from "./components/GlobeSection";
import { TimeSeriesChart } from "./components/Charts/TimeSeriesChart";
import { ProtocolBreakdown } from "./components/Charts/ProtocolBreakdown";
import { RegionsTable } from "./components/RegionsTable";
import {
  useThreatSummary,
  useTimeSeries,
  useRegions,
  useDataStatus,
} from "./hooks/useThreats";

export function App() {
  const [timeRange, setTimeRange] = useState("7d");

  const { data: summary, loading: summaryLoading, refetch: refetchSummary } =
    useThreatSummary(timeRange);
  const { data: timeseries, loading: tsLoading, refetch: refetchTS } =
    useTimeSeries(timeRange);
  const { data: regions, loading: regionsLoading, refetch: refetchRegions } =
    useRegions(timeRange);
  const { data: dataStatus, loading: statusLoading, refetch: refetchStatus } =
    useDataStatus();

  const handleRefreshAll = () => {
    refetchSummary();
    refetchTS();
    refetchRegions();
    refetchStatus();
  };

  const topOrigin = summary?.top_origin_countries?.[0];
  const topTarget = summary?.top_target_countries?.[0];
  const dominantProtocol = summary?.top_attack_protocols
    ? Object.entries(summary.top_attack_protocols).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      <Header dataStatus={dataStatus} loading={statusLoading} />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
        {/* KPI Cards Row */}
        <section className="dashboard-grid">
          <KPICard
            title="DDoS Traffic Ratio"
            value={
              summary?.total_attack_percentage != null
                ? `${summary.total_attack_percentage.toFixed(1)}%`
                : "N/A"
            }
            subtitle="Observed global malicious traffic share"
            icon={<ShieldIcon color="#6366f1" />}
            variant="indigo"
            delay={0.05}
            loading={summaryLoading}
          />

          <KPICard
            title="Top Attack Origin"
            value={topOrigin?.country_name || topOrigin?.country_code || "Unknown"}
            subtitle={
              topOrigin
                ? `${topOrigin.value.toFixed(1)}% of total outbound attacks`
                : undefined
            }
            icon={<GlobeIcon color="#f59e0b" />}
            variant="amber"
            delay={0.1}
            loading={summaryLoading}
          />

          <KPICard
            title="Primary Target Region"
            value={topTarget?.country_name || topTarget?.country_code || "Unknown"}
            subtitle={
              topTarget
                ? `${topTarget.value.toFixed(1)}% of inbound attack traffic`
                : undefined
            }
            icon={<ActivityIcon color="#f43f5e" />}
            variant="rose"
            delay={0.15}
            loading={summaryLoading}
          />

          <KPICard
            title="Dominant Attack Vector"
            value={dominantProtocol ? dominantProtocol[0].toUpperCase() : "N/A"}
            subtitle={
              dominantProtocol
                ? `${dominantProtocol[1].toFixed(1)}% of volumetric floods`
                : undefined
            }
            icon={<ZapIcon color="#06b6d4" />}
            variant="cyan"
            delay={0.2}
            loading={summaryLoading}
          />
        </section>

        {/* Primary Interactive Map & Analytics Grid */}
        <section className="main-grid">
          {/* Left Column: Aceternity GitHub 3D Globe */}
          <div>
            <GlobeSection
              originCountries={
                regions?.origin_regions || summary?.top_origin_countries || []
              }
              targetCountries={
                regions?.target_regions || summary?.top_target_countries || []
              }
              loading={summaryLoading || regionsLoading}
            />
          </div>

          {/* Right Column: TimeSeries & Protocol Charts */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TimeSeriesChart
              data={timeseries}
              loading={tsLoading}
              activeRange={timeRange}
              onRangeChange={setTimeRange}
            />
            <ProtocolBreakdown
              protocols={summary?.top_attack_protocols}
              loading={summaryLoading}
            />
          </div>
        </section>

        {/* Secondary Row: Regional Detail Table */}
        <section style={{ padding: "0 24px 32px" }}>
          <RegionsTable
            originRegions={
              regions?.origin_regions || summary?.top_origin_countries || []
            }
            targetRegions={
              regions?.target_regions || summary?.top_target_countries || []
            }
            loading={regionsLoading || summaryLoading}
          />
        </section>
      </main>

      {/* Global Dashboard Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-primary)",
          background: "rgba(3, 7, 18, 0.8)",
          padding: "20px 24px",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          <div>
            ThreatLens DDoS Intelligence • Built with FastAPI, Three.js, and Cloudflare Radar
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button
              onClick={handleRefreshAll}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-secondary)",
                borderRadius: "6px",
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: "0.72rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>↻</span> Refresh Telemetry
            </button>

            <a
              href="https://radar.cloudflare.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent-cyan)", textDecoration: "none" }}
            >
              Radar Portal ↗
            </a>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent-primary)", textDecoration: "none" }}
            >
              Backend API Docs ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
