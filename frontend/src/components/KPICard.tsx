interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: React.ReactNode;
  loading?: boolean;
  isMonoValue?: boolean;
  variant?: "danger" | "warning" | "info" | "success" | "neutral";
}

const VARIANT_STYLES: Record<
  NonNullable<KPICardProps["variant"]>,
  { bg: string; border: string; color: string }
> = {
  danger: {
    bg: "#160f14",
    border: "1px solid #381c24",
    color: "#f87171",
  },
  warning: {
    bg: "#17140e",
    border: "1px solid #3c2d18",
    color: "#fbbf24",
  },
  info: {
    bg: "#0c1722",
    border: "1px solid #163249",
    color: "#38bdf8",
  },
  success: {
    bg: "#0b1816",
    border: "1px solid #14362f",
    color: "#34d399",
  },
  neutral: {
    bg: "#121722",
    border: "1px solid #1e2636",
    color: "#94a3b8",
  },
};

export function KPICard({
  title,
  value,
  unit,
  subtitle,
  icon,
  loading = false,
  isMonoValue = false,
  variant = "neutral",
}: KPICardProps) {
  let displayValue = String(value);
  let displayUnit = unit;

  if (!displayUnit && typeof value === "string" && value.endsWith("%")) {
    displayValue = value.slice(0, -1);
    displayUnit = "%";
  }

  const vStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;

  return (
    <div className="soc-card">
      <div className="kpi-container">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="kpi-label">{title}</p>
            {loading ? (
              <div className="skeleton" style={{ width: "95px", height: "32px", margin: "4px 0" }} />
            ) : (
              <div className="kpi-value-row">
                <span className={isMonoValue ? "kpi-value-mono" : "kpi-value"}>
                  {displayValue}
                </span>
                {displayUnit && <span className="kpi-unit">{displayUnit}</span>}
              </div>
            )}
            {subtitle && !loading && (
              <p className="kpi-meta">{subtitle}</p>
            )}
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "5px",
              background: vStyle.bg,
              border: vStyle.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: vStyle.color,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Professional SOC & Telemetry Icons ─────────────────────────────── */

/** 1. Volumetric Ratio: Telemetry threat gauge & active sweep */
export function VolumetricGaugeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 0 0-9 9c0 3.12 1.58 5.87 4 7.48" opacity="0.35" />
      <path d="M17 19.48A9 9 0 0 0 21 12a9 9 0 0 0-9-9" opacity="0.35" />
      <path d="M12 3a9 9 0 0 1 8.49 6" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.75" />
      <line x1="12" y1="12" x2="18.5" y2="7.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** 2. Attack Origin: Outbound telemetry beacon & wavefronts */
export function OutboundBeaconIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 8.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.75" />
      <path d="M5.5 5.5a9.2 9.2 0 0 1 13 0" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.75" />
      <path d="M2.5 2.5a13.5 13.5 0 0 1 19 0" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M12 15v6m-4 0h8" opacity="0.5" />
    </svg>
  );
}

/** 3. Ingress Target: Tactical crosshair targeting reticle */
export function IngressTargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8V4h4" opacity="0.4" />
      <path d="M20 8V4h-4" opacity="0.4" />
      <path d="M4 16v4h4" opacity="0.4" />
      <path d="M20 16v4h-4" opacity="0.4" />
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.75" />
      <line x1="12" y1="3" x2="12" y2="7" stroke="currentColor" strokeWidth="1.75" />
      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.75" />
      <line x1="3" y1="12" x2="7" y2="12" stroke="currentColor" strokeWidth="1.75" />
      <line x1="17" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

/** 4. Dominant Vector: Protocol transmission conduit */
export function ProtocolVectorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.75" fill="currentColor" fillOpacity="0.2" />
      <line x1="18" y1="4" x2="22" y2="4" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
      <line x1="17" y1="7" x2="22" y2="7" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.5" />
    </svg>
  );
}
