<div align="center">

# Lenz
### Autonomous Global DDoS Threat Intelligence & 3D Telemetry Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0+-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Globe-black.svg?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Cloudflare Radar](https://img.shields.io/badge/Telemetry-Cloudflare_Radar_REST_v4-F38020.svg?style=for-the-badge&logo=cloudflare&logoColor=white)](https://radar.cloudflare.com)

<p align="center">
  <b>A mission-critical cybersecurity operations console visualizing real-time volumetric DDoS attack flows across the globe.</b><br/>
  Powered by Cloudflare Radar's global edge network, Python FastAPI, and an interactive Aceternity-style Three.js 3D Globe.
</p>

</div>

---

## ⚡ Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │    CLOUDFLARE RADAR GLOBAL SENSORS     │
                      │  (330+ Cities, 120+ Tbps Edge Network) │
                      └──────────────────┬─────────────────────┘
                                         │ Bearer Auth / REST v4
                                         ▼
                      ┌────────────────────────────────────────┐
                      │         FASTAPI INGESTION ENGINE       │
                      │  • Asynchronous HTTPX Client           │
                      │  • Adaptive 5-min TTL Cache Layer      │
                      │  • Stale-While-Error Fallback Circuit  │
                      └──────────────────┬─────────────────────┘
                                         │ JSON Stream / REST APIs
                                         ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                            LENZ FRONTEND CONSOLE                            │
 │  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
 │  │   3D GitHub Globe     │  │  Recharts Volumetric │  │ Vector Protocol  │  │
 │  │   • Country-Pair Arcs │  │  • 24H / 7D / 28D    │  │ • UDP / TCP /    │  │
 │  │   • Tactical Shaders  │  │  • Tabular Numerals  │  │   DNS / ICMP     │  │
 │  └───────────────────────┘  └──────────────────────┘  └──────────────────┘  │
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Capabilities

- **Interactive 3D GitHub-Style Globe**:
  - Architectural cold slate sphere with hex-polygon continents.
  - Dynamically calculated bezier 3D attack arcs linking observed top threat origins to top ingress targets.
  - Multi-tiered tactical severity vectors (Critical Crimson `#ef4444`, Elevated Amber `#f59e0b`, Standard Steel `#94a3b8`).
  - Seamless orbit pan, auto-rotation toggle, and speed throttle controls.
- **Enterprise Cold SOC Palette**:
  - High-contrast matte obsidian theme (`#07090e`, `#0e121b`) designed for Security Operations Centers (SOC).
  - Multi-tier typography hierarchy using **Plus Jakarta Sans** for display headings, **Inter** for UI, and **JetBrains Mono** with tabular numerals (`tabular-nums`) to eliminate number jitter.
  - Zero "AI-slop" neon glows or fuzzy borders; strictly defined 1px tactical borders.
- **Volumetric Trend Analytics**:
  - Interactive Recharts area chart displaying attack intensity over time.
  - Multi-interval switching (`24H` hourly resolution, `7D` daily aggregation, `28D` long-term trends).
- **L3/L4 & L7 Protocol Breakdown**:
  - Real-time distribution analysis of flood vectors (UDP volumetric floods, TCP SYN/ACK exhaustion, DNS amplification, HTTP floods).
- **Geographic Concentration Matrix**:
  - Ranked country origin and target ingress tables with ISO country code badges and volumetric ratio meters.
- **Autonomous Fallback & Resilience**:
  - In-memory `TTLCache` ensures the dashboard continues rendering seamlessly even during upstream rate limits or network outages.
  - Automatic graceful degradation to realistic simulation telemetry when no API token is supplied.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`

### 2. Backend Setup

```bash
# Clone the repository
git clone https://github.com/rishiii183/Lenz.git
cd Lenz/backend

# Install Python dependencies
pip install -r requirements.txt

# Create your environment file
cp .env.example .env
```

*(Optional)* Configure your free Cloudflare Radar API token in `backend/.env`:
```env
CLOUDFLARE_API_TOKEN=your_token_here
CACHE_TTL_SECONDS=300
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Start the FastAPI backend server:
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API runs at **http://127.0.0.1:8000** (Swagger documentation: **http://127.0.0.1:8000/docs**).

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd ../frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at **http://127.0.0.1:5173**.

---

## 🔑 Cloudflare Radar API Integration

Lenz natively integrates with Cloudflare Radar REST API v4:

1. Visit [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens).
2. Click **Create Token** → **Custom Token**.
3. Set **Permissions**: `Account` → `Radar` → `Read`.
4. Set **Account Resources**: `Include` → `All accounts`.
5. Click **Continue to summary** → **Create Token**.
6. Place the token into `backend/.env` under `CLOUDFLARE_API_TOKEN`.

The dashboard header will automatically flip to:
```
[RADAR // INGESTION ACTIVE]  ● LIVE EDGE STREAM
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | System heartbeat, version, and active token status (non-leaking) |
| `/api/data-status` | `GET` | Cache freshness, last synchronization time, and data mode |
| `/api/threats/summary` | `GET` | Aggregated DDoS traffic ratio, protocols, and top 10 origin/target countries |
| `/api/threats/timeseries` | `GET` | Volumetric trend data points over `24h`, `7d`, or `28d` |
| `/api/threats/regions` | `GET` | Comprehensive top 20 origin and ingress target country distributions |

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, `@react-three/fiber`, `@react-three/drei`, `three-globe`, `recharts`, `framer-motion`.
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, HTTPX, Uvicorn.
- **Data Source**: Cloudflare Radar REST API v4 (Global Attack Telemetry).

---

## 🛡 License

Distributed under the **MIT License**. See `LICENSE` for more information.
