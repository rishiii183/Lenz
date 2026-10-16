/* API response types matching the backend contracts */

export interface ThreatSummary {
  source: string;
  total_attack_percentage: number | null;
  top_attack_protocols: Record<string, number>;
  top_origin_countries: CountryEntry[];
  top_target_countries: CountryEntry[];
  period_start: string | null;
  period_end: string | null;
  retrieved_at: string | null;
  is_simulated: boolean;
  source_url: string;
}

export interface CountryEntry {
  country_code: string;
  country_name: string;
  value: number;
  rank: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface TimeSeriesData {
  source: string;
  metric: string;
  unit: string;
  series: TimeSeriesPoint[];
  aggregation_interval: string | null;
  period_start: string | null;
  period_end: string | null;
  retrieved_at: string | null;
  is_simulated: boolean;
  source_url: string;
}

export interface RegionData {
  country_code: string;
  country_name: string;
  value: number;
  rank: number;
  metric: string;
}

export interface RegionsResponse {
  source: string;
  origin_regions: RegionData[];
  target_regions: RegionData[];
  period_start: string | null;
  period_end: string | null;
  retrieved_at: string | null;
  is_simulated: boolean;
  source_url: string;
}

export interface DataStatus {
  source: string;
  status: 'live' | 'stale' | 'demo' | 'error' | 'loading';
  has_api_token: boolean;
  last_successful_fetch: string | null;
  observation_period_start: string | null;
  observation_period_end: string | null;
  cache_ttl_seconds: number;
  next_refresh_at: string | null;
  error_message: string | null;
  is_simulated: boolean;
}

export interface HealthResponse {
  status: string;
  version: string;
  data_source: string;
  has_api_token: boolean;
}

/* Globe arc position type for the Aceternity Globe */
export interface GlobeArcPosition {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
}
