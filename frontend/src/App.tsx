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
      {/* Top Tactical Command Header */}
      <Header dataStatus={dataStatus} loading={statusLoading} />

      {/* Main SOC Dashboard */}
      <main style={{ flex: 1, maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
        {/* KPI Telemetry Row */}
        <section className="dashboard-grid">
          <KPICard
            title="DDoS TRAFFIC RATIO"
            value={
              summary?.total_attack_percentage != null
                ? summary.total_attack_percentage.toFixed(1)
                : "N/A"
            }
            unit={summary?.total_attack_percentage != null ? "%" : undefined}
            subtitle="Observed global malicious traffic share"
            icon={<ShieldIcon />}
            loading={summaryLoading}
            isMonoValue={true}
          />

          <KPICard
            title="PRIMARY ATTACK ORIGIN"
            value={topOrigin?.country_name || topOrigin?.country_code || "Unknown"}
            subtitle={
              topOrigin
                ? `${topOrigin.value.toFixed(1)}% of total outbound vectors`
                : undefined
            }
            icon={<GlobeIcon />}
            loading={summaryLoading}
          />

          <KPICard
            title="PRIMARY INGRESS TARGET"
            value={topTarget?.country_name || topTarget?.country_code || "Unknown"}
            subtitle={
              topTarget
                ? `${topTarget.value.toFixed(1)}% of inbound attack traffic`
                : undefined
            }
            icon={<ActivityIcon />}
            loading={summaryLoading}
          />

          <KPICard
            title="DOMINANT VECTOR"
            value={dominantProtocol ? dominantProtocol[0].toUpperCase() : "N/A"}
            subtitle={
              dominantProtocol
                ? `${dominantProtocol[1].toFixed(1)}% of volumetric floods`
                : undefined
            }
            icon={<ZapIcon />}
            loading={summaryLoading}
            isMonoValue={true}
          />
        </section>

        {/* Primary Interactive Map & Vector Analytics Grid */}
        <section className="main-grid">
          {/* Left Column: 3D Tactical Globe */}
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

          {/* Right Column: TimeSeries Trend & Protocol Breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

        {/* Regional Telemetry Table */}
        <section style={{ padding: "0 24px 24px" }}>
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

      {/* Cold Tactical Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-primary)",
          background: "#080b11",
          padding: "14px 24px",
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
            fontSize: "0.72rem",
            color: "#64748b",
            fontFamily: "var(--font-mono)",
          }}
        >
          <div>
            THREATLENS // CYBERSECURITY TELEMETRY PLATFORM • INGESTION: CLOUDFLARE_RADAR_REST_V4
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button
              onClick={handleRefreshAll}
              style={{
                background: "#0e131d",
                border: "1px solid #1e2636",
                color: "#94a3b8",
                borderRadius: "3px",
                padding: "3px 10px",
                cursor: "pointer",
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono)",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>[SYNC]</span> REFRESH TELEMETRY
            </button>

            <a
              href="https://radar.cloudflare.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#94a3b8", textDecoration: "none" }}
            >
              RADAR_PORTAL ↗
            </a>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#94a3b8", textDecoration: "none" }}
            >
              API_SCHEMA ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
