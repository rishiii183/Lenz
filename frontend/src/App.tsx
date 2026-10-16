import { useState } from "react";
import { Header } from "./components/Header";
import {
  KPICard,
  VolumetricGaugeIcon,
  OutboundBeaconIcon,
  IngressTargetIcon,
  ProtocolVectorIcon,
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
      {/* Clean Top Command Header */}
      <Header isSimulated={dataStatus?.is_simulated} />

      {/* Main SOC Dashboard */}
      <main style={{ flex: 1, maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
        {/* Row 1: KPI Telemetry Cards with Refined Icons */}
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
            icon={<VolumetricGaugeIcon />}
            loading={summaryLoading}
            isMonoValue={true}
            variant="danger"
          />

          <KPICard
            title="PRIMARY ATTACK ORIGIN"
            value={topOrigin?.country_name || topOrigin?.country_code || "Unknown"}
            subtitle={
              topOrigin
                ? `${topOrigin.value.toFixed(1)}% of total outbound vectors`
                : undefined
            }
            icon={<OutboundBeaconIcon />}
            loading={summaryLoading}
            variant="warning"
          />

          <KPICard
            title="PRIMARY INGRESS TARGET"
            value={topTarget?.country_name || topTarget?.country_code || "Unknown"}
            subtitle={
              topTarget
                ? `${topTarget.value.toFixed(1)}% of inbound attack traffic`
                : undefined
            }
            icon={<IngressTargetIcon />}
            loading={summaryLoading}
            variant="info"
          />

          <KPICard
            title="DOMINANT VECTOR"
            value={dominantProtocol ? dominantProtocol[0].toUpperCase() : "N/A"}
            subtitle={
              dominantProtocol
                ? `${dominantProtocol[1].toFixed(1)}% of volumetric floods`
                : undefined
            }
            icon={<ProtocolVectorIcon />}
            loading={summaryLoading}
            isMonoValue={true}
            variant="success"
          />
        </section>

        {/* Row 2: CENTERPIECE 3D GLOBE */}
        <section style={{ padding: "0 24px 20px" }}>
          <GlobeSection
            originCountries={
              regions?.origin_regions || summary?.top_origin_countries || []
            }
            targetCountries={
              regions?.target_regions || summary?.top_target_countries || []
            }
            loading={summaryLoading || regionsLoading}
          />
        </section>

        {/* Row 3: Balanced Analytics Deck (TimeSeries Trends & Protocol Distribution) */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "16px",
            padding: "0 24px 20px",
          }}
        >
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
        </section>

        {/* Row 4: Regional Telemetry Table */}
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

      {/* Cold Tactical Footer with Lenz Branding */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: dataStatus?.has_api_token ? "#34d399" : "#fbbf24",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "currentColor",
                }}
              />
              {dataStatus?.has_api_token ? "LIVE INGESTION ACTIVE" : "SIMULATED TELEMETRY"}
            </span>
            <span>•</span>
            <span>LENZ // CLOUDFLARE_RADAR_REST_V4</span>
            {dataStatus?.last_successful_fetch && (
              <>
                <span>•</span>
                <span>SYNC: {new Date(dataStatus.last_successful_fetch).toLocaleTimeString()}</span>
              </>
            )}
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
