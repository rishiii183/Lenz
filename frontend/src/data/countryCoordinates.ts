export interface Coordinates {
  lat: number;
  lng: number;
  name: string;
}

export const COUNTRY_COORDINATES: Record<string, Coordinates> = {
  US: { lat: 37.0902, lng: -95.7129, name: "United States" },
  CN: { lat: 35.8617, lng: 104.1954, name: "China" },
  RU: { lat: 61.5240, lng: 105.3188, name: "Russia" },
  DE: { lat: 51.1657, lng: 10.4515, name: "Germany" },
  GB: { lat: 55.3781, lng: -3.4360, name: "United Kingdom" },
  FR: { lat: 46.2276, lng: 2.2137, name: "France" },
  BR: { lat: -14.2350, lng: -51.9253, name: "Brazil" },
  IN: { lat: 20.5937, lng: 78.9629, name: "India" },
  JP: { lat: 36.2048, lng: 138.2529, name: "Japan" },
  KR: { lat: 35.9078, lng: 127.7669, name: "South Korea" },
  SG: { lat: 1.3521, lng: 103.8198, name: "Singapore" },
  NL: { lat: 52.1326, lng: 5.2913, name: "Netherlands" },
  CA: { lat: 56.1304, lng: -106.3468, name: "Canada" },
  AU: { lat: -25.2744, lng: 133.7751, name: "Australia" },
  UA: { lat: 48.3794, lng: 31.1656, name: "Ukraine" },
  ID: { lat: -0.7893, lng: 113.9213, name: "Indonesia" },
  VN: { lat: 14.0583, lng: 108.2772, name: "Vietnam" },
  IR: { lat: 32.4279, lng: 53.6880, name: "Iran" },
  TR: { lat: 38.9637, lng: 35.2433, name: "Turkey" },
  HK: { lat: 22.3193, lng: 114.1694, name: "Hong Kong" },
  TW: { lat: 23.6978, lng: 120.9605, name: "Taiwan" },
  PL: { lat: 51.9194, lng: 19.1451, name: "Poland" },
  RO: { lat: 45.9432, lng: 24.9668, name: "Romania" },
  ES: { lat: 40.4637, lng: -3.7492, name: "Spain" },
  IT: { lat: 41.8719, lng: 12.5674, name: "Italy" },
  SE: { lat: 60.1282, lng: 18.6435, name: "Sweden" },
  CH: { lat: 46.8182, lng: 8.2275, name: "Switzerland" },
  ZA: { lat: -30.5595, lng: 22.9375, name: "South Africa" },
  MX: { lat: 23.6345, lng: -102.5528, name: "Mexico" },
  IL: { lat: 31.0461, lng: 34.8516, name: "Israel" },
};

export function getCountryCoord(code: string): Coordinates {
  const upper = (code || "").toUpperCase();
  if (COUNTRY_COORDINATES[upper]) {
    return COUNTRY_COORDINATES[upper];
  }
  // Fallback random spread based on char codes
  const hash = upper.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const lat = ((hash * 17) % 120) - 60;
  const lng = ((hash * 37) % 340) - 170;
  return { lat, lng, name: code };
}
