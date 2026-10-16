"""Lenz Backend — In-memory TTL cache."""

import time
from typing import Any


class TTLCache:
    """Simple in-memory cache with time-to-live expiration."""

    def __init__(self, ttl_seconds: int = 600):
        self._store: dict[str, tuple[Any, float]] = {}
        self._ttl = ttl_seconds

    def get(self, key: str) -> Any | None:
        """Return cached value if not expired, else None."""
        if key in self._store:
            value, expiry = self._store[key]
            if time.time() < expiry:
                return value
            # Expired — clean up
            del self._store[key]
        return None

    def set(self, key: str, value: Any, ttl: int | None = None) -> None:
        """Store a value with TTL."""
        expiry = time.time() + (ttl or self._ttl)
        self._store[key] = (value, expiry)

    def get_stale(self, key: str) -> Any | None:
        """Return cached value even if expired (for stale-while-error)."""
        if key in self._store:
            value, _ = self._store[key]
            return value
        return None

    def is_stale(self, key: str) -> bool:
        """Check if a cached key is expired."""
        if key in self._store:
            _, expiry = self._store[key]
            return time.time() >= expiry
        return True

    def clear(self) -> None:
        """Clear all cached entries."""
        self._store.clear()


# Global cache instance
cache = TTLCache(ttl_seconds=600)
