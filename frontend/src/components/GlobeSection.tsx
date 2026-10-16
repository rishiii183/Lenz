import { useMemo, useState } from "react";
import { World, type GlobeConfig } from "./ui/Globe";
import { getCountryCoord } from "../data/countryCoordinates";
import type { CountryEntry, RegionData } from "@/types";

interface GlobeSectionProps {
  originCountries: (RegionData | CountryEntry)[];
  targetCountries: (RegionData | CountryEntry)[];
  loading: boolean;
}

// Cold tactical vector palette: high threat crimson, elevated warning amber, cold steel telemetry
const ARC_COLORS = ["#ef4444", "#f59e0b", "#94a3b8", "#cbd5e1", "#dc2626", "#e2e8f0"];

export function GlobeSection({
  originCountries,
  targetCountries,
  loading,
}: GlobeSectionProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.4);

  // Generate dynamic 3D attack arcs between origin and target countries
  const globeArcs = useMemo(() => {
    if (!originCountries.length || !targetCountries.length) {
      return [
        {
          order: 1,
          startLat: 37.0902,
          startLng: -95.7129,
          endLat: 51.1657,
          endLng: 10.4515,
          arcAlt: 0.25,
          color: "#ef4444",
        },
        {
          order: 2,
          startLat: 35.8617,
          startLng: 104.1954,
          endLat: 37.0902,
          endLng: -95.7129,
          arcAlt: 0.35,
          color: "#94a3b8",
        },
        {
          order: 3,
          startLat: 61.524,
          startLng: 105.3188,
          endLat: 48.3794,
          endLng: 31.1656,
          arcAlt: 0.2,
          color: "#f59e0b",
        },
      ];
    }

    const arcs = [];
    let order = 1;

    const origins = originCountries.slice(0, 5);
    const targets = targetCountries.slice(0, 5);

    for (let i = 0; i < origins.length; i++) {
      const orig = origins[i];
      const origCoord = getCountryCoord(orig.country_code);

      for (let j = 0; j < targets.length; j++) {
        if (orig.country_code === targets[j].country_code) continue;

        const targ = targets[j];
        const targCoord = getCountryCoord(targ.country_code);

        const color = ARC_COLORS[(i + j) % ARC_COLORS.length];
        const arcAlt = 0.12 + ((i + j) % 4) * 0.08;

        arcs.push({
          order: order++,
          startLat: origCoord.lat,
          startLng: origCoord.lng,
          endLat: targCoord.lat,
          endLng: targCoord.lng,
          arcAlt,
          color,
        });

        if (arcs.length >= 12) break;
      }
      if (arcs.length >= 12) break;
    }

    return arcs;
  }, [originCountries, targetCountries]);

  const globeConfig: GlobeConfig = useMemo(
    () => ({
      pointSize: 1.0,
      globeColor: "#080c14",
      showAtmosphere: true,
      atmosphereColor: "#334155",
      atmosphereAltitude: 0.08,
      emissive: "#05070a",
      emissiveIntensity: 0.05,
      shininess: 0.3,
      polygonColor: "rgba(100, 116, 139, 0.4)",
      ambientLight: "#e2e8f0",
      directionalLeftLight: "#94a3b8",
      directionalTopLight: "#cbd5e1",
      pointLight: "#e2e8f0",
      arcTime: 2200,
      arcLength: 0.8,
      rings: 1,
      maxRings: 2,
      autoRotate,
      autoRotateSpeed: rotationSpeed,
    }),
    [autoRotate, rotationSpeed]
  );

  return (
    <div
      className="soc-card"
      style={{
        position: "relative",
        height: "600px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Globe Top Tactical HUD */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "20px",
          right: "20px",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ef4444",
                display: "inline-block",
              }}
            />
            <h2
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#f1f5f9",
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: "uppercase",
              }}
            >
              GEO-SPATIAL ATTACK TELEMETRY
            </h2>
          </div>
          <p
            style={{
              fontSize: "0.7rem",
              color: "#64748b",
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: "2px",
            }}
          >
            ACTIVE_ARCS: {globeArcs.length} | SAMPLING: COUNTRY_LEVEL_AGGREGATE
          </p>
        </div>

        {/* Tactical Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            pointerEvents: "auto",
            background: "#0e131d",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #1e2636",
          }}
        >
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              background: autoRotate ? "#161e2e" : "transparent",
              color: autoRotate ? "#cbd5e1" : "#64748b",
              border: "1px solid",
              borderColor: autoRotate ? "#2e3b52" : "transparent",
              borderRadius: "3px",
              padding: "3px 8px",
              fontSize: "0.68rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ROTATE: {autoRotate ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setRotationSpeed((s) => (s >= 1.0 ? 0.2 : s + 0.2))}
            style={{
              background: "transparent",
              color: "#94a3b8",
              border: "none",
              padding: "3px 8px",
              fontSize: "0.68rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {rotationSpeed.toFixed(1)}X
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ flex: 1, width: "100%", height: "100%", minHeight: "500px" }}>
        <World globeConfig={globeConfig} data={globeArcs} />
      </div>

      {/* Bottom HUD Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "20px",
          right: "20px",
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
            gap: "14px",
            background: "#0e131d",
            padding: "5px 12px",
            borderRadius: "4px",
            border: "1px solid #1e2636",
            pointerEvents: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
              CRITICAL VECTOR
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
            <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
              ELEVATED FLOW
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8" }} />
            <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
              STANDARD TELEMETRY
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: "0.68rem",
            color: "#64748b",
            background: "#0e131d",
            padding: "5px 12px",
            borderRadius: "4px",
            border: "1px solid #1e2636",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          ORBIT_CONTROLS: DRAG TO PAN // PASSIVE ROTATION
        </div>
      </div>
    </div>
  );
}
