/* API client for Lenz backend */

const API_BASE = '/api';

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  health: () => fetchJSON<import('../types').HealthResponse>('/health'),
  dataStatus: () => fetchJSON<import('../types').DataStatus>('/data-status'),
  summary: (range = '7d') =>
    fetchJSON<import('../types').ThreatSummary>(`/threats/summary?date_range=${range}`),
  timeseries: (range = '7d', interval = '1d') =>
    fetchJSON<import('../types').TimeSeriesData>(
      `/threats/timeseries?date_range=${range}&agg_interval=${interval}`
    ),
  regions: (range = '7d') =>
    fetchJSON<import('../types').RegionsResponse>(`/threats/regions?date_range=${range}`),
};
