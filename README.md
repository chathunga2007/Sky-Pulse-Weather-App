<div align="center">

<img src="./public/app_logo.png" alt="SkyPulse Logo" width="120" height="120" style="border-radius: 28px; box-shadow: 0 10px 30px rgba(6, 182, 212, 0.35);" />

# ⚡ SkyPulse — Next-Gen Atmospheric Intelligence & Radar

**The most advanced, hyper-immersive meteorological platform and Doppler radar simulator, engineered with Glassmorphism 2.0 aesthetics, end-to-end TypeScript type safety, and enterprise-grade API security.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Audio-Procedural_Web_Audio-A855F7?style=for-the-badge&logo=soundcharts&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![HTML5 Canvas](https://img.shields.io/badge/Canvas-Live_Particles-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-FF6F00?style=for-the-badge)](https://open-meteo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-38BDF8.svg?style=for-the-badge)](LICENSE)

[🌟 Flagship Features](#-flagship-features) • [🛡️ API Security](#️-enterprise-api-security--defense-layer) • [📐 Architecture & Types](#-type-safety--architectural-integrity) • [📡 Radar Simulator](#3-️-atmospheric-radar--vector-streamline-simulator) • [⚡ Lightning Telemetry](#1-️-lightning-strike--severe-thunderstorm-threat-center) • [🚀 Quick Start](#-quick-start) • [👨‍💻 Author](#-author--credits)

</div>

---

## 🌌 Overview

**SkyPulse** redefines the modern weather application. Beyond standard temperature figures, SkyPulse operates as a comprehensive **meteorological intelligence terminal** designed for precision, beauty, situational awareness, and enterprise-grade resilience.

From monitoring **atmospheric convective energy (CAPE)** to tracking **15-minute precipitation pulses**, calculating **lightning strike proximity** in real-time, synthesizing **ambient procedural soundscapes**, running a **live canvas Doppler radar simulator**, and defending external API communications through an **enterprise security & rate-limiting layer**, SkyPulse delivers an unmatched weather monitoring experience.

Built on **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**, SkyPulse features an adaptive **Dual Glassmorphism Engine** that effortlessly adapts between an airy, aero-marine **Daylight Mode** and an obsidian, luminescent **Midnight Dark Mode**.

---

## ⚡ Flagship Features

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SKY-PULSE PLATFORM                                    │
├───────────────────┬───────────────────┬───────────────────┬───────────────┬─────────────┤
│ ⚡ LIGHTNING CTR  │  🌊 VOLATILITY    │  🛰️ LIVE RADAR    │  🤖 AI ENGINE │ 🛡️ SECURITY │
│  CAPE Energy Index│  15m Rain Pulse   │  Doppler Echo     │  6-Domain Life│ Rate Limiter│
│  Flash-to-Bang    │  Barometric Trend │  Wind Streamlines │  Activity     │ TTL Caching │
│  30/30 Safety Rule│  Shift Probability│  Thermal Heatmap  │  Readiness    │ Geo Clamping│
└───────────────────┴───────────────────┴───────────────────┴───────────────┴─────────────┘
```

---

### 1. ⚡ Lightning Strike & Severe Thunderstorm Threat Center
*Hyper-local convective instability telemetry and real-time electrical storm hazard monitoring.*

- **Atmospheric CAPE Index**: Tracks **Convective Available Potential Energy** (measured in J/kg) directly from high-resolution telemetry:
  - `0 - 300 J/kg`: Stable atmosphere / minimal lightning potential
  - `300 - 1,000 J/kg`: Moderate convective activity / isolated thunder
  - `1,000 - 2,500 J/kg`: Elevated risk / frequent cloud-to-ground strikes
  - `> 2,500 J/kg`: Extreme danger / severe thunderstorm & microburst potential
- **Interactive "Flash-to-Bang" Proximity Stopwatch**: Tap when seeing lightning and tap again on thunder; SkyPulse instantly calculates the strike distance in **kilometers** and **miles** using the speed of sound ($343\text{ m/s}$) and alerts if you are inside the **10km Danger Zone**.
- **The 30/30 Lightning Safety Protocol**: Integrated safety checklist recommending prompt indoor shelter and electronics disconnection.
- **12-Hour CAPE Trajectory Sparkline**: Hourly convective energy forecast allowing users to anticipate evening or afternoon electrical storms.

---

### 2. 🌊 Rapid Weather Change & Volatility Radar
*Predict sudden squalls, rapid pressure drops, and precipitation onset before they happen.*

- **Sudden Change Probability Index (0–100%)**: Multi-variable algorithm calculating the precise probability of sudden weather shifts in the next 1–2 hours.
- **15-Minute Next Precipitation Pulse**: High-resolution 4-hour timeline displaying rain accumulation in 15-minute intervals, letting users know exactly when rain starts or stops.
- **3-Hour Barometric Delta ($\Delta P$) Tendency**: Detects rapidly falling barometers (indicating approaching squall lines or tropical fronts) vs rising barometers (clearing skies).
- **Gust Differential Telemetry**: Compares steady wind speed against peak gusts to alert for sudden shear winds.

---

### 3. 🛰️ Atmospheric Radar & Vector Streamline Simulator
*A canvas-rendered interactive Doppler radar terminal with full multi-layer switching.*

- **Precipitation Reflectivity Mode (dBZ)**: Animated rotating radar beam sweeping across regional echo cells with official Doppler reflectivity scales:
  - `15 dBZ` (Light Rain) • `35 dBZ` (Moderate Rain) • `50 dBZ` (Heavy Downpour) • `65+ dBZ` (Severe Thunderstorm / Hail)
- **Wind Particle Vector Flow**: Fluid particle streamlines dynamically flowing with current wind speed and directional headings.
- **Thermal Heatmap Layer**: Isothermal regional temperature gradient overlay.
- **Full Theme Adaptation**:
  - **Dark Mode**: High-contrast deep space navy terminal (`#040813`) with neon cyan grid rings and luminous radar sweep.
  - **Light Mode**: Aeronautical light aero-marine sky theme (`#f1f6fc`) with high-contrast ocean-blue grid rings and vivid echo blobs.
- **Interactive Radial Controls**: Switch sweep radius between `50km`, `100km`, and `250km` with play/pause animations.

---

### 4. 🤖 SkyPulse AI Meteorologist & Life Advisor
*Context-aware atmospheric diagnostic engine paired with a 6-domain outdoor life matrix.*

- **Executive Diagnostic Briefing**: Plain-language synthesis analyzing temperature, perceived comfort, lightning threat, air quality, humidity, and barometric trends.
- **6-Domain Outdoor Life & Activity Readiness Matrix**:
  | Activity Domain | Metric Evaluated | Diagnostic Output |
  | :--- | :--- | :--- |
  | ⚡ **Outdoor Sports** | CAPE & Lightning Strike Hazard | Safe vs Severe Lightning Hazard (Suspension alert) |
  | 🚗 **Driving & Commuting** | Precipitation & Road Wetness | Clear Roads vs Severe Hydroplaning Risk |
  | 🧺 **Laundry Drying** | Solar Radiation & Evaporation | Rapid Drying (<2h) vs Damp Delay |
  | 🏃 **Running & Workout** | Thermal Index & US EPA AQI | Optimal Window vs Heat/Pollution Stress |
  | 🛸 **Drone & UAV Flight** | Wind Gusts & Convective Turbulence| Stable Envelope vs Grounded / Extreme Shear |
  | 🔭 **Astronomy & Stargazing**| Cloud Opacity & Atmospheric Clarity | Crystal Night Skies vs Heavy Cloud Obscurity |

---

### 5. 🎧 Procedural Ambient Weather Soundscape Engine
*Zero-asset, zero-latency generative atmospheric audio synthesized via the browser's native Web Audio API.*

- **100% Procedural Synthesis**: Requires **zero external MP3 files**; all audio is synthesized mathematically in real-time.
- **Weather-Responsive Moods**:
  - **Rain Mood**: Filtered brown/pink noise patter simulating continuous rainfall.
  - **Thunderstorm Mood**: Deep resonant oscillator bursts and decaying crackle bursts simulating distant thunder.
  - **Wind Mood**: LFO-modulated bandpass noise sweeping with wind gusts.
  - **Sunny / Night Mood**: Soft ambient breezes with organic birdsong or nocturnal crickets.
- **Precision Volume Control**: Interactive popover featuring step buttons (**`-`** / **`+`**), quick presets (**25%**, **50%**, **75%**, **100%**), and animated equalizer bars.

---

### 6. 🌧️ Real-Time Live Weather Canvas (Falling Rain & Lightning Bolts)
*Dynamic full-viewport particle system overlaying live conditions onto your screen.*

- **Falling Rain Particles**: Hundreds of raindrops falling at wind-calibrated angles with ground splash ripples.
- **Live Lightning Flashes**: Periodic sky flashes paired with procedural branching electric bolts cutting through the atmosphere.
- **Theme-Adaptive Contrast**:
  - Crisp slate-cyan droplets with high-contrast electric blue lightning in **Light Mode**.
  - Luminous crystal-blue droplets with brilliant white/cyan branching lightning in **Dark Mode**.
- **Live FX Header Toggle**: One-click button in the navigation bar to enable or disable background particles.

---

## 🛡️ Enterprise API Security & Defense Layer

SkyPulse incorporates an enterprise-grade API security module located at [`src/services/apiSecurity.ts`](src/services/apiSecurity.ts) to guarantee platform availability, prevent denial-of-service, protect against injection attacks, and adhere to strict third-party provider usage policies:

```
[User Input / Telemetry Trigger]
             │
             ▼
   [Sanitize & Validate]
   • Strip script/HTML injection vectors
   • Restrict query lengths (2 - 60 chars)
   • Strict Earth bounds check (Lat: ±90°, Lon: ±180°)
             │
             ▼
    [In-Memory TTL Cache] ─── (Cache Hit?) ───► [Instant Response]
             │ (Cache Miss)
             ▼
  [Rate Limiter & Throttle]
   • Nominatim: 1,050ms enforced delay (Prevents IP bans)
   • Token Bucket Limiter (25 tokens, 5/sec refill)
             │
             ▼
  [Secured Axios Network Call]
   • 9,000ms hard timeout fail-safe
   • Masked & sanitized error propagation
```

### Key Security Safeguards:
1. **Input Sanitization & Injection Defense**:
   - `sanitizeSearchQuery`: Strips all control characters, HTML tags, script injection patterns, and limits search lengths to 60 characters to eliminate URI malformation and injection attacks.
2. **Geographical Coordinate Bounding**:
   - `validateCoordinates`: Ensures coordinates are finite numerical numbers, rejects `NaN`/`Infinity`, strictly clamps latitude to `[-90, 90]` and longitude to `[-180, 180]`, and rounds to 5 decimal places (~1.1 meter physical accuracy) to eliminate float noise and maximize cache hits.
3. **OpenStreetMap Nominatim 1-Req/Sec Policy Enforcer**:
   - `throttleNominatim`: Strict algorithmic throttling ensuring consecutive reverse geocoding requests maintain an enforced delay of at least 1,050ms, permanently eliminating rate-limit blocks and IP bans.
4. **Token Bucket Rate Limiter**:
   - `weatherApiLimiter`: Regulates outgoing bursts (25 max tokens, 5 refills/sec) to shield both client performance and external telemetry endpoints from flooding.
5. **Multi-Tier In-Memory TTL Cache**:
   - Forecast queries cached for **4 minutes** (`240,000 ms`).
   - City search autocomplete queries cached for **10 minutes** (`600,000 ms`).
   - Reverse geocoded GPS locations cached for **30 minutes** (`1,800,000 ms`).
   - Cap of 200 items with automatic LRU eviction preventing memory leaks.
6. **Network Timeouts & Error Masking**:
   - Hard **9-second connection timeout** (`API_TIMEOUT_MS`) prevents stalled threads.
   - `sanitizeErrorMessage`: Automatically sanitizes network errors, stripping raw URLs, server paths, and credentials before errors surface in the interface.

---

## 📐 Type Safety & Architectural Integrity

SkyPulse is 100% written in **TypeScript**, delivering end-to-end type safety from external API payloads down to component props:

- **Strict Type System ([`src/types/weather.ts`](src/types/weather.ts))**:
  - `WeatherForecastResponse`: Full schema covering `current`, `hourly`, `daily`, and `minutely_15`.
  - `WeatherCurrent`: Type-checked thermal, barometric, CAPE, and lightning potential metrics.
  - `AirQualityResponse`: European AQI, US EPA AQI, and detailed particulate matter concentrations (`pm2_5`, `pm10`, `ozone`, `carbon_monoxide`, `nitrogen_dioxide`, `sulphur_dioxide`).
  - `CityItem` & `HotspotCity`: Geolocation metadata, country codes, and coordinates.
- **Zero Type Errors**: Compiles cleanly with `npx tsc --noEmit` under strict TypeScript compiler rules.
- **Vite Environment Typing**: Configured with [`src/vite-env.d.ts`](src/vite-env.d.ts) for Vite client and CSS module support.

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **TypeScript** | `^5.x` | Static typing, interface contracts, compiler type verification |
| **React** | `^19.2.8` | Next-generation UI rendering, concurrent features, and state hooks |
| **Vite** | `^8.3.0` | Ultra-fast build tool, instant HMR, and optimized production bundling |
| **Tailwind CSS** | `^4.3.3` | Modern utility styling with `@custom-variant dark` and custom glass tokens |
| **Recharts** | `^3.10.1` | Responsive SVG charts with custom gradient fills and tooltips |
| **Web Audio API** | Native | Procedural weather sound synthesis (rain, thunder, wind, nature) |
| **HTML5 Canvas** | Native | High-frequency Doppler radar scanner & live particle rain/lightning FX |
| **Lucide React** | `^1.45.0` | Clean, modern vector iconography |
| **Axios** | `^1.20.0` | Robust asynchronous HTTP networking with timeouts and rate limiting |
| **Open-Meteo API** | v1 | Open-source global forecast, hourly CAPE, minutely-15, and AQI telemetry |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (`v18.x` or higher recommended)
- [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### 1. Clone the Repository
```bash
git clone https://github.com/chathunga2007/Sky-Pulse-Weather-App.git
cd Sky-Pulse-Weather-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Type Checking
```bash
npx tsc --noEmit
```

### 4. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### 5. Build for Production
```bash
npm run build
```
Generates an optimized, minified production bundle in the `dist/` directory.

### 6. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Directory Structure

```text
sky-pulse/
├── public/
│   ├── app_logo.png               # Official SkyPulse brand logo
│   └── favicon.ico                # Application favicon
├── src/
│   ├── components/
│   │   ├── AiMeteorologistPanel.tsx   # AI atmospheric brief & 6-domain activity matrix
│   │   ├── AirQualityPanel.tsx        # US EPA AQI gauge & PM2.5/PM10 metrics
│   │   ├── AmbientSoundscape.tsx      # Web Audio controller with volume stepper & presets
│   │   ├── CityChips.tsx              # Quick-access global hotspot city pills
│   │   ├── DailyForecast.tsx          # 7-day extended forecast with daily temperature spans
│   │   ├── DetailedMetrics.tsx        # 6 sensor cards (humidity, dew point, wind, UV, pressure)
│   │   ├── Footer.tsx                 # Glassmorphic developer attribution & copyright
│   │   ├── ForecastChart.tsx          # 24-hour predictive telemetry curve (temp, rain, wind)
│   │   ├── Header.tsx                 # Redesigned glass navigation bar with audio & FX toggles
│   │   ├── HeroCard.tsx               # Current weather overview, feels-like, & solar cycle arc
│   │   ├── LightningThreatPanel.tsx   # Akunu Sara / CAPE index & Flash-to-Bang distance tool
│   │   ├── LiveWeatherCanvas.tsx      # Live canvas falling rain particles & lightning strikes
│   │   ├── MobileNav.tsx              # Floating mobile bottom navigation dock
│   │   ├── RadarMapPanel.tsx          # Interactive Doppler radar simulator (dBZ, wind, thermal)
│   │   ├── SearchBar.tsx              # Debounced global geocoding search & autocomplete
│   │   ├── WeatherIcon.tsx            # Lucide icon dynamic map resolver
│   │   └── WeatherVolatilityPanel.tsx # Sudden shift probability barometer & 15-min rain pulse
│   ├── services/
│   │   ├── apiSecurity.ts             # Enterprise API security: sanitization, throttling, caching
│   │   └── weatherApi.ts              # Type-safe Open-Meteo & Nominatim network client
│   ├── types/
│   │   └── weather.ts                 # Meteorological & Geolocation TypeScript interfaces
│   ├── utils/
│   │   ├── weatherCodes.ts            # WMO meteorological code mappings & visual metadata
│   │   └── weatherSynth.ts            # Procedural Web Audio API sound synthesis engine
│   ├── App.tsx                        # Master dashboard state orchestration & telemetry loader
│   ├── index.css                      # Tailwind v4 theme, glass tokens, & custom keyframes
│   ├── main.tsx                       # Application entry point with strict root null checks
│   └── vite-env.d.ts                  # Vite client & CSS module type declarations
├── package.json                       # Project configuration, dependencies & scripts
├── tsconfig.json                      # Strict modern TypeScript compiler configuration
├── vite.config.js                     # Vite build & bundler configuration
└── README.md                          # Platform documentation
```

---

## 🎨 Design System & Aesthetics

SkyPulse is built upon the **Glassmorphism 2.0** design philosophy:
- **Spatial Translucency**: Multi-layered backdrop blurs (`backdrop-blur-xl`, `backdrop-blur-3xl`) establish intuitive optical depth.
- **Volumetric Ambient Lighting**: Dynamic animated ambient orbs float in the background, morphing color based on current weather conditions (golden sun, electric cyan, storm indigo).
- **High-Contrast Micro-Interactions**: Hover elevation, glowing borders, active state scales, and pulsing indicators provide immediate tactile feedback.
- **Theme Invariance**: Both Light Mode and Dark Mode are treated as first-class citizens, featuring tailored contrast ratios, distinct radar palettes, and custom canvas blend modes.

---

## 👨‍💻 Author & Credits

- **Lead Developer**: **Chathunga Bimsara**
- **GitHub**: [@chathunga2007](https://github.com/chathunga2007)
- **Repository**: [Sky-Pulse-Weather-App](https://github.com/chathunga2007/Sky-Pulse-Weather-App)
- **Telemetry Feeds**: Powered by [Open-Meteo](https://open-meteo.com/) (Open-source Global Weather & Air Quality Models)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Engineered with ⚡ precision, mathematical audio synthesis, TypeScript type safety, and modern web design by <strong>Chathunga Bimsara</strong>.</sub>
</div>