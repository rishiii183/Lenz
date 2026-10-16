import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant: "indigo" | "cyan" | "emerald" | "rose" | "amber" | "purple";
  delay?: number;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  variant,
  delay = 0,
  loading = false,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={`glass-card kpi-card ${variant}`}
      style={{ padding: "20px 22px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              marginBottom: "8px",
            }}
          >
            {title}
          </p>
          {loading ? (
            <div className="skeleton" style={{ width: "80px", height: "32px" }} />
          ) : (
            <p
              style={{
                fontSize: "1.65rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--text-primary)",
              }}
            >
              {value}
            </p>
          )}
          {subtitle && !loading && (
            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                marginTop: "6px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            background: `rgba(var(--${variant}-rgb, 99, 102, 241), 0.1)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

/* Preset icon components */
export function ShieldIcon({ color = "#6366f1" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function ActivityIcon({ color = "#06b6d4" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export function GlobeIcon({ color = "#10b981" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function ZapIcon({ color = "#f43f5e" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function TargetIcon({ color = "#f59e0b" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function ServerIcon({ color = "#8b5cf6" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}
