"""ThreatLens Backend — Pydantic models for API contracts."""

from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class DataSourceStatus(str, Enum):
    LIVE = "live"
    STALE = "stale"
    DEMO = "demo"
    ERROR = "error"
    LOADING = "loading"


class ThreatSummary(BaseModel):
    """Normalized summary of DDoS threat intelligence."""

    source: str = "cloudflare_radar"
    total_attack_percentage: float | None = None
    top_attack_protocols: dict[str, float] = Field(default_factory=dict)
    top_origin_countries: list[dict] = Field(default_factory=list)
    top_target_countries: list[dict] = Field(default_factory=list)
    period_start: str | None = None
    period_end: str | None = None
    retrieved_at: str | None = None
    is_simulated: bool = False
    source_url: str = "https://developers.cloudflare.com/radar/"


class TimeSeriesPoint(BaseModel):
    """A single data point in a time-series."""

    timestamp: str
    value: float


class TimeSeriesData(BaseModel):
    """Time-series DDoS trend data."""

    source: str = "cloudflare_radar"
    metric: str = "ddos_attack_traffic_percentage"
    unit: str = "percentage"
    series: list[TimeSeriesPoint] = Field(default_factory=list)
    aggregation_interval: str | None = None
    period_start: str | None = None
    period_end: str | None = None
    retrieved_at: str | None = None
    is_simulated: bool = False
    source_url: str = "https://developers.cloudflare.com/radar/"


class RegionData(BaseModel):
    """Geographic region attack data."""

    country_code: str
    country_name: str
    value: float
    rank: int
    metric: str = "attack_traffic_percentage"


class RegionsResponse(BaseModel):
    """Response for geographic attack data."""

    source: str = "cloudflare_radar"
    origin_regions: list[RegionData] = Field(default_factory=list)
    target_regions: list[RegionData] = Field(default_factory=list)
    period_start: str | None = None
    period_end: str | None = None
    retrieved_at: str | None = None
    is_simulated: bool = False
    source_url: str = "https://developers.cloudflare.com/radar/"


class DataStatus(BaseModel):
    """Status of the data source and freshness."""

    source: str = "cloudflare_radar"
    status: DataSourceStatus = DataSourceStatus.DEMO
    has_api_token: bool = False
    last_successful_fetch: str | None = None
    observation_period_start: str | None = None
    observation_period_end: str | None = None
    cache_ttl_seconds: int = 600
    next_refresh_at: str | None = None
    error_message: str | None = None
    is_simulated: bool = True


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = "ok"
    version: str = "0.1.0"
    data_source: str = "cloudflare_radar"
    has_api_token: bool = False
