interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  delay?: number;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  loading = false,
}: KPICardProps) {
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
              <div className="skeleton" style={{ width: "90px", height: "30px", margin: "4px 0" }} />
            ) : (
              <p className="kpi-value">{value}</p>
            )}
            {subtitle && !loading && (
              <p className="kpi-meta">{subtitle}</p>
            )}
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "4px",
              background: "#141923",
              border: "1px solid #1e2636",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
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

/* Cold Tactical Icon Components */
export function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function ActivityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function ZapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
