"""ThreatLens Backend — Cloudflare Radar API client."""

import httpx
import logging
import time
from datetime import datetime, timezone

from .config import get_settings
from .models import (
    ThreatSummary,
    TimeSeriesData,
    TimeSeriesPoint,
    RegionsResponse,
    RegionData,
)
from .cache import cache

logger = logging.getLogger(__name__)

BASE_URL = "https://api.cloudflare.com/client/v4/radar"

# ISO country code to name mapping (top DDoS countries)
COUNTRY_NAMES = {
    "US": "United States", "CN": "China", "DE": "Germany", "FR": "France",
    "GB": "United Kingdom", "RU": "Russia", "BR": "Brazil", "IN": "India",
    "JP": "Japan", "KR": "South Korea", "NL": "Netherlands", "SG": "Singapore",
    "AU": "Australia", "CA": "Canada", "ID": "Indonesia", "VN": "Vietnam",
    "TW": "Taiwan", "HK": "Hong Kong", "TH": "Thailand", "IT": "Italy",
    "ES": "Spain", "PL": "Poland", "UA": "Ukraine", "TR": "Turkey",
    "MX": "Mexico", "AR": "Argentina", "CO": "Colombia", "ZA": "South Africa",
    "EG": "Egypt", "SA": "Saudi Arabia", "AE": "UAE", "IL": "Israel",
    "SE": "Sweden", "NO": "Norway", "FI": "Finland", "DK": "Denmark",
    "CH": "Switzerland", "AT": "Austria", "BE": "Belgium", "CZ": "Czechia",
    "RO": "Romania", "BG": "Bulgaria", "PH": "Philippines", "MY": "Malaysia",
    "BD": "Bangladesh", "PK": "Pakistan", "NG": "Nigeria", "KE": "Kenya",
    "CL": "Chile", "PE": "Peru", "IR": "Iran",
}


def _get_country_name(code: str) -> str:
    return COUNTRY_NAMES.get(code.upper(), code.upper())


async def _make_request(endpoint: str, params: dict | None = None) -> dict | None:
    """Make authenticated request to Cloudflare Radar API with retry/backoff."""
    settings = get_settings()
    if not settings.has_api_token:
        logger.warning("No Cloudflare API token configured")
        return None

    headers = {
        "Authorization": f"Bearer {settings.cloudflare_api_token}",
        "Content-Type": "application/json",
    }

    for attempt in range(settings.max_retries):
        try:
            async with httpx.AsyncClient(timeout=settings.request_timeout_seconds) as client:
                response = await client.get(
                    f"{BASE_URL}{endpoint}",
                    headers=headers,
                    params=params or {},
                )

                if response.status_code == 429:
                    retry_after = int(response.headers.get("retry-after", 60))
                    logger.warning(f"Rate limited. Retry after {retry_after}s")
                    return None

                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        return data.get("result", {})
                    else:
                        logger.error(f"API error: {data.get('errors', [])}")
                        return None

                logger.error(f"HTTP {response.status_code} from Radar API")

        except httpx.TimeoutException:
            logger.error(f"Timeout on attempt {attempt + 1}/{settings.max_retries}")
        except httpx.RequestError as e:
            logger.error(f"Request error on attempt {attempt + 1}: {e}")

        # Exponential backoff
        if attempt < settings.max_retries - 1:
            import asyncio
            await asyncio.sleep(2 ** attempt)

    return None


async def fetch_threat_summary(date_range: str = "7d") -> ThreatSummary:
    """Fetch and normalize DDoS threat summary."""
    cache_key = f"summary_{date_range}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    now = datetime.now(timezone.utc).isoformat()

    # Fetch protocol summary
    protocol_data = await _make_request(
        "/attacks/layer3/summary/protocol",
        {"dateRange": date_range, "format": "json"},
    )

    # Fetch top origin countries
    origin_data = await _make_request(
        "/attacks/layer3/top/locations/origin",
        {"dateRange": date_range, "limit": "10", "format": "json"},
    )

    # Fetch top target countries
    target_data = await _make_request(
        "/attacks/layer3/top/locations/target",
        {"dateRange": date_range, "limit": "10", "format": "json"},
    )

    if not any([protocol_data, origin_data, target_data]):
        # All requests failed — return stale if available
        stale = cache.get_stale(cache_key)
        if stale:
            stale.is_simulated = False  # Still real data, just stale
            return stale
        return _get_demo_summary()

    # Normalize protocol breakdown
    protocols = {}
    if protocol_data:
        summary = protocol_data.get("summary_0", protocol_data.get("summary", {}))
        if isinstance(summary, dict):
            for proto, pct in summary.items():
                try:
                    protocols[proto.upper()] = round(float(pct), 2)
                except (ValueError, TypeError):
                    pass

    # Normalize origin countries
    origins = []
    if origin_data:
        top_list = origin_data.get("top_0", origin_data.get("top", []))
        if isinstance(top_list, list):
            for i, entry in enumerate(top_list):
                code = entry.get("clientCountryAlpha2", entry.get("originCountryAlpha2", ""))
                value = entry.get("value", 0)
                try:
                    origins.append({
                        "country_code": code,
                        "country_name": _get_country_name(code),
                        "value": round(float(value), 2),
                        "rank": i + 1,
                    })
                except (ValueError, TypeError):
                    pass

    # Normalize target countries
    targets = []
    if target_data:
        top_list = target_data.get("top_0", target_data.get("top", []))
        if isinstance(top_list, list):
            for i, entry in enumerate(top_list):
                code = entry.get("clientCountryAlpha2", entry.get("targetCountryAlpha2", ""))
                value = entry.get("value", 0)
                try:
                    targets.append({
                        "country_code": code,
                        "country_name": _get_country_name(code),
                        "value": round(float(value), 2),
                        "rank": i + 1,
                    })
                except (ValueError, TypeError):
                    pass

    # Calculate total from protocol breakdown
    total = sum(protocols.values()) if protocols else None

    result = ThreatSummary(
        source="cloudflare_radar",
        total_attack_percentage=total,
        top_attack_protocols=protocols,
        top_origin_countries=origins,
        top_target_countries=targets,
        period_start=None,  # Radar doesn't always return these explicitly
        period_end=None,
        retrieved_at=now,
        is_simulated=False,
    )

    cache.set(cache_key, result)
    return result


async def fetch_timeseries(date_range: str = "7d", agg_interval: str = "1d") -> TimeSeriesData:
    """Fetch and normalize DDoS time-series data."""
    cache_key = f"timeseries_{date_range}_{agg_interval}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    now = datetime.now(timezone.utc).isoformat()

    data = await _make_request(
        "/attacks/layer3/timeseries",
        {"dateRange": date_range, "aggInterval": agg_interval, "format": "json"},
    )

    if not data:
        stale = cache.get_stale(cache_key)
        if stale:
            return stale
        return _get_demo_timeseries()

    # Normalize time-series
    series = []
    timestamps = data.get("timestamps", [])
    values = data.get("values", {})

    # The API may return values under different keys
    value_list = None
    if isinstance(values, dict):
        # Take the first available series
        for key in values:
            if isinstance(values[key], list):
                value_list = values[key]
                break
    elif isinstance(values, list):
        value_list = values

    # Fallback: check for series_0 pattern
    if not value_list:
        for key in data:
            if key.startswith("serie") and isinstance(data[key], list):
                # This might be a list of dicts with timestamps
                for entry in data[key]:
                    if isinstance(entry, dict) and "timestamps" in entry:
                        timestamps = entry["timestamps"]
                        value_list = entry.get("values", [])
                        break

    if timestamps and value_list and len(timestamps) == len(value_list):
        for ts, val in zip(timestamps, value_list):
            try:
                series.append(TimeSeriesPoint(
                    timestamp=ts,
                    value=round(float(val), 4),
                ))
            except (ValueError, TypeError):
                pass

    result = TimeSeriesData(
        series=series,
        aggregation_interval=agg_interval,
        retrieved_at=now,
        is_simulated=False,
    )

    cache.set(cache_key, result)
    return result


async def fetch_regions(date_range: str = "7d") -> RegionsResponse:
    """Fetch and normalize geographic region data."""
    cache_key = f"regions_{date_range}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    now = datetime.now(timezone.utc).isoformat()

    origin_data = await _make_request(
        "/attacks/layer3/top/locations/origin",
        {"dateRange": date_range, "limit": "20", "format": "json"},
    )

    target_data = await _make_request(
        "/attacks/layer3/top/locations/target",
        {"dateRange": date_range, "limit": "20", "format": "json"},
    )

    if not any([origin_data, target_data]):
        stale = cache.get_stale(cache_key)
        if stale:
            return stale
        return _get_demo_regions()

    def _parse_locations(data: dict | None) -> list[RegionData]:
        regions = []
        if not data:
            return regions
        top_list = data.get("top_0", data.get("top", []))
        if isinstance(top_list, list):
            for i, entry in enumerate(top_list):
                code = entry.get("clientCountryAlpha2",
                        entry.get("originCountryAlpha2",
                        entry.get("targetCountryAlpha2", "")))
                value = entry.get("value", 0)
                try:
                    regions.append(RegionData(
                        country_code=code,
                        country_name=_get_country_name(code),
                        value=round(float(value), 2),
                        rank=i + 1,
                    ))
                except (ValueError, TypeError):
                    pass
        return regions

    result = RegionsResponse(
        origin_regions=_parse_locations(origin_data),
        target_regions=_parse_locations(target_data),
        retrieved_at=now,
        is_simulated=False,
    )

    cache.set(cache_key, result)
    return result


# ── Demo fixtures ─────────────────────────────────────────────────────────────
# Clearly labelled as simulated data for development without API token

def _get_demo_summary() -> ThreatSummary:
    return ThreatSummary(
        total_attack_percentage=3.5,
        top_attack_protocols={"TCP": 52.3, "UDP": 38.1, "ICMP": 6.2, "GRE": 3.4},
        top_origin_countries=[
            {"country_code": "US", "country_name": "United States", "value": 18.5, "rank": 1},
            {"country_code": "CN", "country_name": "China", "value": 15.2, "rank": 2},
            {"country_code": "DE", "country_name": "Germany", "value": 8.7, "rank": 3},
            {"country_code": "RU", "country_name": "Russia", "value": 7.1, "rank": 4},
            {"country_code": "BR", "country_name": "Brazil", "value": 5.9, "rank": 5},
            {"country_code": "IN", "country_name": "India", "value": 5.3, "rank": 6},
            {"country_code": "GB", "country_name": "United Kingdom", "value": 4.8, "rank": 7},
            {"country_code": "FR", "country_name": "France", "value": 4.2, "rank": 8},
            {"country_code": "NL", "country_name": "Netherlands", "value": 3.9, "rank": 9},
            {"country_code": "KR", "country_name": "South Korea", "value": 3.6, "rank": 10},
        ],
        top_target_countries=[
            {"country_code": "US", "country_name": "United States", "value": 22.1, "rank": 1},
            {"country_code": "CN", "country_name": "China", "value": 12.8, "rank": 2},
            {"country_code": "DE", "country_name": "Germany", "value": 9.4, "rank": 3},
            {"country_code": "GB", "country_name": "United Kingdom", "value": 7.6, "rank": 4},
            {"country_code": "FR", "country_name": "France", "value": 6.3, "rank": 5},
            {"country_code": "JP", "country_name": "Japan", "value": 5.1, "rank": 6},
            {"country_code": "BR", "country_name": "Brazil", "value": 4.7, "rank": 7},
            {"country_code": "AU", "country_name": "Australia", "value": 3.8, "rank": 8},
            {"country_code": "SG", "country_name": "Singapore", "value": 3.2, "rank": 9},
            {"country_code": "IN", "country_name": "India", "value": 2.9, "rank": 10},
        ],
        retrieved_at=datetime.now(timezone.utc).isoformat(),
        is_simulated=True,
    )


def _get_demo_timeseries() -> TimeSeriesData:
    import random
    from datetime import timedelta

    now = datetime.now(timezone.utc)
    series = []
    for i in range(7):
        ts = (now - timedelta(days=6 - i)).isoformat()
        series.append(TimeSeriesPoint(
            timestamp=ts,
            value=round(random.uniform(2.0, 6.0), 2),
        ))

    return TimeSeriesData(
        series=series,
        aggregation_interval="1d",
        retrieved_at=now.isoformat(),
        is_simulated=True,
    )


def _get_demo_regions() -> RegionsResponse:
    return RegionsResponse(
        origin_regions=[
            RegionData(country_code="US", country_name="United States", value=18.5, rank=1),
            RegionData(country_code="CN", country_name="China", value=15.2, rank=2),
            RegionData(country_code="DE", country_name="Germany", value=8.7, rank=3),
            RegionData(country_code="RU", country_name="Russia", value=7.1, rank=4),
            RegionData(country_code="BR", country_name="Brazil", value=5.9, rank=5),
            RegionData(country_code="IN", country_name="India", value=5.3, rank=6),
            RegionData(country_code="GB", country_name="United Kingdom", value=4.8, rank=7),
            RegionData(country_code="FR", country_name="France", value=4.2, rank=8),
            RegionData(country_code="NL", country_name="Netherlands", value=3.9, rank=9),
            RegionData(country_code="KR", country_name="South Korea", value=3.6, rank=10),
            RegionData(country_code="JP", country_name="Japan", value=3.3, rank=11),
            RegionData(country_code="SG", country_name="Singapore", value=2.8, rank=12),
            RegionData(country_code="AU", country_name="Australia", value=2.5, rank=13),
            RegionData(country_code="CA", country_name="Canada", value=2.3, rank=14),
            RegionData(country_code="ID", country_name="Indonesia", value=2.1, rank=15),
        ],
        target_regions=[
            RegionData(country_code="US", country_name="United States", value=22.1, rank=1),
            RegionData(country_code="CN", country_name="China", value=12.8, rank=2),
            RegionData(country_code="DE", country_name="Germany", value=9.4, rank=3),
            RegionData(country_code="GB", country_name="United Kingdom", value=7.6, rank=4),
            RegionData(country_code="FR", country_name="France", value=6.3, rank=5),
            RegionData(country_code="JP", country_name="Japan", value=5.1, rank=6),
            RegionData(country_code="BR", country_name="Brazil", value=4.7, rank=7),
            RegionData(country_code="AU", country_name="Australia", value=3.8, rank=8),
            RegionData(country_code="SG", country_name="Singapore", value=3.2, rank=9),
            RegionData(country_code="IN", country_name="India", value=2.9, rank=10),
        ],
        retrieved_at=datetime.now(timezone.utc).isoformat(),
        is_simulated=True,
    )
