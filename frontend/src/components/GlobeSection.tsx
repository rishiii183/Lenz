import { useMemo, useState } from "react";
import { World, type GlobeConfig } from "./ui/Globe";
import { getCountryCoord } from "../data/countryCoordinates";
import type { CountryEntry, RegionData } from "@/types";

interface GlobeSectionProps {
  originCountries: (RegionData | CountryEntry)[];
  targetCountries: (RegionData | CountryEntry)[];
  loading: boolean;
}

const ARC_COLORS = ["#f43f5e", "#f59e0b", "#06b6d4", "#8b5cf6", "#ec4899", "#3b82f6"];

export function GlobeSection({
  originCountries,
  targetCountries,
  loading,
}: GlobeSectionProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.8);

  // Generate dynamic 3D attack arcs between origin and target countries
  const globeArcs = useMemo(() => {
    if (!originCountries.length || !targetCountries.length) {
      // Default fallback arcs if data is not yet loaded
      return [
        {
          order: 1,
          startLat: 37.0902,
          startLng: -95.7129,
          endLat: 51.1657,
          endLng: 10.4515,
          arcAlt: 0.3,
          color: "#f43f5e",
        },
        {
          order: 2,
          startLat: 35.8617,
          startLng: 104.1954,
          endLat: 37.0902,
          endLng: -95.7129,
          arcAlt: 0.45,
          color: "#06b6d4",
        },
        {
          order: 3,
          startLat: 61.524,
          startLng: 105.3188,
          endLat: 48.3794,
          endLng: 31.1656,
          arcAlt: 0.25,
          color: "#f59e0b",
        },
      ];
    }

    const arcs = [];
    let order = 1;

    // Create pairwise attack vectors between top origins and top targets
    const origins = originCountries.slice(0, 5);
    const targets = targetCountries.slice(0, 5);

    for (let i = 0; i < origins.length; i++) {
      const orig = origins[i];
      const origCoord = getCountryCoord(orig.country_code);

      for (let j = 0; j < targets.length; j++) {
        // Skip identical country self-attacks for visual clarity
        if (orig.country_code === targets[j].country_code) continue;

        const targ = targets[j];
        const targCoord = getCountryCoord(targ.country_code);

        const color = ARC_COLORS[(i + j) % ARC_COLORS.length];
        const arcAlt = 0.15 + ((i + j) % 4) * 0.1;

        arcs.push({
          order: order++,
          startLat: origCoord.lat,
          startLng: origCoord.lng,
          endLat: targCoord.lat,
          endLng: targCoord.lng,
          arcAlt,
          color,
        });

        if (arcs.length >= 14) break; // Keep visual clutter optimal
      }
      if (arcs.length >= 14) break;
    }

    return arcs;
  }, [originCountries, targetCountries]);

  const globeConfig: GlobeConfig = useMemo(
    () => ({
      pointSize: 1.2,
      globeColor: "#050914",
      showAtmosphere: true,
      atmosphereColor: "#38bdf8",
      atmosphereAltitude: 0.18,
      emissive: "#02040a",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      polygonColor: "rgba(255, 255, 255, 0.7)",
      ambientLight: "#38bdf8",
      directionalLeftLight: "#818cf8",
      directionalTopLight: "#ffffff",
      pointLight: "#6366f1",
      arcTime: 2000,
      arcLength: 0.75,
      rings: 2,
      maxRings: 3,
      autoRotate,
      autoRotateSpeed: rotationSpeed,
    }),
    [autoRotate, rotationSpeed]
  );

  return (
    <div
      className="glass-card"
      style={{
        position: "relative",
        height: "600px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Globe Top HUD / Header */}
      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "24px",
          right: "24px",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              className="pulse-dot"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#f43f5e",
                display: "inline-block",
              }}
            />
            Live Global DDoS Vectors
          </h2>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Real-time volumetric attack telemetry & geographic propagation
          </p>
        </div>

        {/* Controls Overlay */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            pointerEvents: "auto",
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            padding: "4px 10px",
            borderRadius: "8px",
            border: "1px solid var(--border-primary)",
          }}
        >
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              background: autoRotate ? "rgba(99, 102, 241, 0.2)" : "transparent",
              color: autoRotate ? "#818cf8" : "var(--text-muted)",
              border: "1px solid",
              borderColor: autoRotate ? "rgba(99, 102, 241, 0.4)" : "transparent",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "0.7rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {autoRotate ? "Auto-Rotate: ON" : "Auto-Rotate: OFF"}
          </button>

          <button
            onClick={() => setRotationSpeed((s) => (s >= 1.5 ? 0.4 : s + 0.4))}
            style={{
              background: "transparent",
              color: "var(--text-secondary)",
              border: "none",
              padding: "4px 8px",
              fontSize: "0.7rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {rotationSpeed.toFixed(1)}x
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div style={{ flex: 1, width: "100%", height: "100%", minHeight: "500px" }}>
        <World globeConfig={globeConfig} data={globeArcs} />
      </div>

      {/* Globe Bottom HUD / Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "24px",
          right: "24px",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid var(--border-primary)",
            pointerEvents: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f43f5e" }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>High Intensity</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Medium Vector</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#06b6d4" }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Standard Flow</span>
          </div>
        </div>

        <div
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid var(--border-primary)",
          }}
        >
          Drag to rotate • Click & drag controls active
        </div>
      </div>
    </div>
  );
}
