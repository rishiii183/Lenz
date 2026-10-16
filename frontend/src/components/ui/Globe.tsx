"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        threeGlobe: any;
      }
    }
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

const defaultGlobeConfig: Required<
  Omit<GlobeConfig, "initialPosition"> & { initialPosition: { lat: number; lng: number } }
> = {
  pointSize: 1,
  globeColor: "#1d072e",
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.1,
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function Globe({ globeConfig, data }: { globeConfig: GlobeConfig; data: Position[] }) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [globeReady, setGlobeReady] = useState(false);

  const config = useMemo(
    () => ({ ...defaultGlobeConfig, ...globeConfig }),
    [globeConfig]
  );

  useEffect(() => {
    if (!globeRef.current) return;
    setGlobeReady(true);
  }, []);

  // Build material
  useEffect(() => {
    if (!globeRef.current || !globeReady) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(config.globeColor);
    globeMaterial.emissive = new Color(config.emissive);
    globeMaterial.emissiveIntensity = config.emissiveIntensity;
    globeMaterial.shininess = config.shininess;
  }, [globeReady, config]);

  // Build data
  useEffect(() => {
    if (!globeRef.current || !globeReady) return;

    const arcs = data;
    const points: any[] = [];

    for (const arc of arcs) {
      const rgb = hexToRgb(arc.color);
      if (!rgb) continue;
      points.push({
        size: config.pointSize,
        order: arc.order,
        color: () => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: config.pointSize,
        order: arc.order,
        color: () => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // Deduplicate points
    const uniquePoints = points.filter(
      (v, i, a) => a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i
    );

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(config.showAtmosphere)
      .atmosphereColor(config.atmosphereColor)
      .atmosphereAltitude(config.atmosphereAltitude)
      .hexPolygonColor(() => config.polygonColor);

    globeRef.current
      .arcsData(arcs)
      .arcColor((e: any) => e.color)
      .arcAltitude((e: any) => e.arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(config.arcLength)
      .arcDashInitialGap((e: any) => e.order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => config.arcTime);

    globeRef.current
      .pointsData(uniquePoints)
      .pointColor((e: any) => e.color)
      .pointsMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.25);

    globeRef.current
      .ringsData([])
      .ringColor((e: any) => (t: number) => e.color(t))
      .ringMaxRadius(config.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((config.arcTime * config.arcLength) / config.rings);
  }, [globeReady, data, config]);

  // Emit rings on intervals
  useEffect(() => {
    if (!globeRef.current || !globeReady || data.length === 0) return;

    const interval = setInterval(() => {
      if (!globeRef.current) return;
      const arcs = data;
      const numRings = genRandomNumbers(0, arcs.length, Math.floor(arcs.length * 0.5));

      const ringsData = numRings.map((idx) => {
        const arc = arcs[idx];
        const rgb = hexToRgb(arc.color);
        return {
          lat: arc.endLat,
          lng: arc.endLng,
          color: (t: number) =>
            rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})` : `rgba(255, 255, 255, ${1 - t})`,
        };
      });

      globeRef.current.ringsData(ringsData);
    }, 2000);

    return () => clearInterval(interval);
  }, [globeReady, data]);

  return <threeGlobe ref={globeRef as any} />;
}

function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);

  return null;
}

export function World({
  globeConfig,
  data,
}: {
  globeConfig: GlobeConfig;
  data: Position[];
}) {
  const config = useMemo(
    () => ({ ...defaultGlobeConfig, ...globeConfig }),
    [globeConfig]
  );

  const aspect = 1.2;

  return (
    <Canvas
      camera={{
        position: [0, 0, cameraZ],
        fov: 50,
        near: 180,
        far: 1800,
      }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <WebGLRendererConfig />
      <ambientLight color={config.ambientLight} intensity={0.6} />
      <directionalLight
        color={config.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={config.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={config.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe globeConfig={globeConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotate={config.autoRotate}
        autoRotateSpeed={config.autoRotateSpeed}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export default World;
