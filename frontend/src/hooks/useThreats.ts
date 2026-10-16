/* Custom hooks for fetching threat data with polling and error handling */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import type {
  ThreatSummary,
  TimeSeriesData,
  RegionsResponse,
  DataStatus,
} from '../types';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useFetch<T>(
  fetcher: () => Promise<T>,
  pollIntervalMs: number = 300000 // 5 minutes
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading((prev) => !data ? true : prev); // only show loading on initial
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      // Keep stale data if available
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();

    intervalRef.current = setInterval(fetchData, pollIntervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, pollIntervalMs]);

  return { data, loading, error, refetch: fetchData };
}

export function useThreatSummary(range = '7d') {
  return useFetch<ThreatSummary>(
    useCallback(() => api.summary(range), [range])
  );
}

export function useTimeSeries(range = '7d', interval = '1d') {
  return useFetch<TimeSeriesData>(
    useCallback(() => api.timeseries(range, interval), [range, interval])
  );
}

export function useRegions(range = '7d') {
  return useFetch<RegionsResponse>(
    useCallback(() => api.regions(range), [range])
  );
}

export function useDataStatus() {
  return useFetch<DataStatus>(
    useCallback(() => api.dataStatus(), []),
    60000 // Check status every minute
  );
}
