"""ThreatLens Backend — FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .models import (
    HealthResponse,
    DataStatus,
    DataSourceStatus,
    ThreatSummary,
    TimeSeriesData,
    RegionsResponse,
)
from .radar_client import fetch_threat_summary, fetch_timeseries, fetch_regions
from .cache import cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown."""
    settings = get_settings()
    logger.info("ThreatLens backend starting")
    logger.info(f"API token configured: {settings.has_api_token}")
    logger.info(f"CORS origins: {settings.cors_origins_list}")
    yield
    logger.info("ThreatLens backend shutting down")
    cache.clear()


app = FastAPI(
    title="ThreatLens API",
    description="DDoS threat intelligence visualization backend",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS configuration
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health():
    """Application health check — does not leak secrets."""
    return HealthResponse(
        status="ok",
        version="0.1.0",
        data_source="cloudflare_radar",
        has_api_token=get_settings().has_api_token,
    )


@app.get("/api/data-status", response_model=DataStatus)
async def data_status():
    """Data source status and freshness information."""
    s = get_settings()
    cached_summary = cache.get("summary_7d")
    stale_summary = cache.get_stale("summary_7d")

    status = DataSourceStatus.DEMO
    if s.has_api_token:
        if cached_summary:
            status = DataSourceStatus.LIVE
        elif stale_summary:
            status = DataSourceStatus.STALE
        else:
            status = DataSourceStatus.LOADING

    return DataStatus(
        status=status,
        has_api_token=s.has_api_token,
        last_successful_fetch=stale_summary.retrieved_at if stale_summary else None,
        cache_ttl_seconds=s.cache_ttl_seconds,
        is_simulated=not s.has_api_token,
    )


@app.get("/api/threats/summary", response_model=ThreatSummary)
async def threats_summary(
    date_range: str = Query("7d", description="Time range: 1d, 7d, 14d, 28d"),
):
    """Latest normalized DDoS threat summary."""
    return await fetch_threat_summary(date_range)


@app.get("/api/threats/timeseries", response_model=TimeSeriesData)
async def threats_timeseries(
    date_range: str = Query("7d", description="Time range: 1d, 7d, 14d, 28d"),
    agg_interval: str = Query("1d", description="Aggregation: 1h, 1d, 1w"),
):
    """DDoS time-series trend data."""
    return await fetch_timeseries(date_range, agg_interval)


@app.get("/api/threats/regions", response_model=RegionsResponse)
async def threats_regions(
    date_range: str = Query("7d", description="Time range: 1d, 7d, 14d, 28d"),
):
    """Geographic DDoS attack data — origin and target countries."""
    return await fetch_regions(date_range)
