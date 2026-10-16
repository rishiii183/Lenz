import { motion } from "framer-motion";
import type { DataStatus } from "@/types";

interface HeaderProps {
  dataStatus: DataStatus | null;
  loading: boolean;
}

export function Header({ dataStatus, loading }: HeaderProps) {
  const status = dataStatus?.status ?? "loading";
  const isSimulated = dataStatus?.is_simulated ?? true;

  const statusConfig: Record<string, { label: string; class: string }> = {
    live: { label: "LIVE DATA", class: "status-live" },
    demo: { label: "DEMO DATA", class: "status-demo" },
    stale: { label: "STALE DATA", class: "status-stale" },
    error: { label: "ERROR", class: "status-error" },
    loading: { label: "LOADING", class: "status-demo" },
  };

  const { label, class: badgeClass } = statusConfig[status] || statusConfig.loading;

  return (
    <header
      style={{
        background: "linear-gradient(180deg, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.6) 100%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-primary)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Logo & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            style={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
              className="gradient-text"
            >
              ThreatLens
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                letterSpacing: "0.02em",
              }}
            >
              Global DDoS Threat Intelligence
            </motion.p>
          </div>
        </div>

        {/* Status & Source */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className={`status-badge ${badgeClass}`}>
              <span
                className="pulse-dot"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "currentColor",
                  display: "inline-block",
                }}
              />
              {label}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}
          >
            <span>Source: </span>
            <a
              href="https://developers.cloudflare.com/radar/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-cyan)", textDecoration: "none" }}
            >
              Cloudflare Radar
            </a>
          </motion.div>

          {dataStatus?.last_successful_fetch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}
            >
              Last fetch:{" "}
              {new Date(dataStatus.last_successful_fetch).toLocaleTimeString()}
            </motion.div>
          )}
        </div>
      </div>

      {/* Simulated data banner */}
      {isSimulated && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: "0 24px 12px" }}
        >
          <div className="simulated-banner">
            ⚠️ SIMULATED DEMO DATA — Configure a Cloudflare Radar API token for real data
          </div>
        </motion.div>
      )}
    </header>
  );
}
