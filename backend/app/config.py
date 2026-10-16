"""Lenz Backend — Configuration via environment variables."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    cloudflare_api_token: str = ""
    cache_ttl_seconds: int = 600  # 10 minutes
    polling_interval_seconds: int = 300  # 5 minutes
    cors_origins: str = "http://localhost:5173"
    request_timeout_seconds: int = 30
    max_retries: int = 3

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def has_api_token(self) -> bool:
        return bool(self.cloudflare_api_token) and self.cloudflare_api_token != "your_token_here"


@lru_cache
def get_settings() -> Settings:
    return Settings()
