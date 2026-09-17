<div align="center">

<img src="./public/app_logo.png" alt="SkyPulse Logo" width="120" height="120" style="border-radius: 28px; box-shadow: 0 10px 35px rgba(6, 182, 212, 0.4);" />

# ⚡ SkyPulse — Next-Gen Atmospheric Intelligence & Radar

**The ultimate meteorological intelligence platform, interactive Leaflet GIS Doppler radar scanner, and procedural ambient weather station — engineered with Glassmorphism 2.0 aesthetics, Sri Lankan 25-district smart disambiguation, end-to-end TypeScript safety, and enterprise-grade API resilience.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Web Audio API](https://img.shields.io/badge/Audio-Procedural_Web_Audio-A855F7?style=for-the-badge&logo=soundcharts&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![HTML5 Canvas](https://img.shields.io/badge/Canvas-Live_Particles-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-FF6F00?style=for-the-badge)](https://open-meteo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-38BDF8.svg?style=for-the-badge)](LICENSE)

<br/>

[🌟 Flagship Features](#-flagship-features) • [🗺️ Interactive GIS Map](#1-️-interactive-gis-satellite--radar-map-scanner) • [🇱🇰 Sri Lanka District Engine](#2--sri-lanka-25-district-intelligence--smart-disambiguation) • [🛡️ API Security](#️-enterprise-api-security--defense-layer) • [📐 Architecture](#-system-architecture--data-flow) • [🚀 Quick Start](#-quick-start) • [👨‍💻 Author](#-author--credits)

</div>

---

## 🌌 Overview

**SkyPulse** elevates weather monitoring into an ultra-modern, high-fidelity meteorological command terminal. Moving far beyond traditional temperature forecasts, SkyPulse equips enthusiasts, meteorologists, outdoor athletes, and commuters with real-time situational intelligence and tactile atmospheric simulations.

From tracking high-altitude **Convective Available Potential Energy (CAPE)** and measuring **lightning strike distance** with a digital Flash-to-Bang stopwatch, to exploring hyper-local weather via an **interactive Leaflet GIS satellite map scanner**, predicting **15-minute precipitation pulses**, and synthesizing **zero-latency procedural soundscapes** through the native Web Audio API — SkyPulse redefines what a weather web application can be.

Engineered natively in **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite 8**, SkyPulse features an adaptive **Dual Glassmorphism 2.0 Engine** that glides seamlessly between an airy, aero-marine **Daylight Mode** and a deep, luminescent **Midnight Obsidian Dark Mode**.

---

## 🏗️ System Architecture & Data Flow

```
                                      ┌────────────────────────────────────────────────────────┐
                                      │                   USER INTERACTION                     │
                                      │  • Debounced Search  • Interactive GIS Map Pin Drop    │
                                      │  • Hotspot Pills     • Browser Geolocation (GPS)       │
                                      └───────────────────────────┬────────────────────────────┘
                                                                  │
                                                                  ▼
                                      ┌────────────────────────────────────────────────────────┐
                                      │             API SECURITY & DEFENSE SHIELD              │
                                      │  • Input Sanitizer (XSS & Injection Vector Stripping)   │
                                      │  • Coordinate Normalizer (Lat: ±90°, Lon: ±180°)       │
                                      │  • Token Bucket Rate Limiter (25 tokens, 5 refills/s)  │
                                      │  • Nominatim 1,050ms Throttle Queue (Anti-Ban Guard)   │
                                      │  • In-Memory Multi-Tier TTL Cache (4m / 10m / 30m)     │
                                      └───────────────────────────┬────────────────────────────┘
                                                                  │
                                           ┌──────────────────────┴──────────────────────┐
                                           ▼                                             ▼
                        ┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
                        │      OPEN-METEO TELEMETRY SUITE      │     │      NOMINATIM & GIS GEO SERVICES    │
                        │  • 15-Minute Rain & Lightning Pulses │     │  • Reverse Geocoding (Zoom 15 Town)  │
                        │  • Hourly Atmospheric CAPE & Winds   │     │  • Sri Lanka 25-District Resolver    │
                        │  • 7-Day Solar & Thermal Trajectory  │     │  • Multi-Tile Carto / ESRI Imagery   │
                        │  • European & US EPA AQI Particulate │     │  • Smart Disambiguation Classifier   │
                        └──────────────────┬───────────────────┘     └──────────────────┬───────────────────┘
                                           │                                            │
                                           └──────────────────────┬─────────────────────┘
                                                                  │
                                                                  ▼
                                      ┌────────────────────────────────────────────────────────┐
                                      │               REACT 19 CORE ORCHESTRATION              │
                                      │  • Dual Glassmorphism 2.0 State Engine                 │
                                      │  • Real-Time Live Clock Pill with Second Precision     │
                                      │  • Disambiguation Modal & Autocomplete Suggestions    │
                                      └───────────────────────────┬────────────────────────────┘
                                                                  │
              ┌───────────────────────────┬───────────────────────┴───────┬────────────────────────────┐
              ▼                           ▼                               ▼                            ▼
┌──────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐
│   LEAFLET GIS SCANNER    │ │  WEB AUDIO SOUNDSCAPES   │ │    LIVE PARTICLE CANVAS   │ │   AI LIFE ADVISOR MATRIX   │
│ • Dark Matter Radar      │ │ • Mathematical Synthesis │ │ • Dynamic Rain Droplets   │ │ • 6-Domain Life Safety   │
│ • Clean Street View      │ │ • Rainfall Noise Patter  │ │ • Electric Branching Bolt │ │ • Sports, Drone, Drive,  │
│ • True ESRI Satellite    │ │ • Resonant Thunder Claps │ │ • Wind-Calibrated Angles  │ │   Laundry, Run, Stargaze │
│ • Neon Pulse Marker      │ │ • Stepper & 4 Vol Presets│ │ • Theme-Adaptive Blends   │ │ • CAPE Hazard Evaluator  │
└──────────────────────────┘ └──────────────────────────┘ └──────────────────────────┘ └──────────────────────────┘
```

---

## ⚡ Flagship Features

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       SKY-PULSE PLATFORM                                         │
├────────────────────┬────────────────────┬────────────────────┬──────────────────┬────────────────┤
│  🗺️ GIS MAP MODAL  │  🇱🇰 LK DISTRICTS   │  ⚡ LIGHTNING CTR  │  🛰️ LIVE RADAR   │  🎧 SYNTH AUDIO│
│   Leaflet Scanner  │   25-District DB   │   CAPE Energy Tele │   Doppler Echo   │   Web Audio API│
│   3 Custom Layers  │   Smart Disambig   │   Flash-to-Bang    │   Wind Vectors   │   Zero MP3 Deps│
│   Village Geocode  │   Token Matcher    │   30/30 Safety Rule│   Thermal Flow   │   Vol Stepper  │
└────────────────────┴────────────────────┴────────────────────┴──────────────────┴────────────────┘
```

---

### 1. 🗺️ Interactive GIS Satellite & Radar Map Scanner
*Pinpoint anywhere on the planet with a full-screen interactive Leaflet geospatial scanner.*

- **Interactive Location Pin-Drop**: Click or tap anywhere on Earth or Sri Lanka to instantly drop a pin and retrieve micro-climate telemetry.
- **3 Dynamic Map Layers**:
  - 🌑 **Dark Radar (CartoDB Dark Matter)**: Luminous high-contrast neon styling optimized for dark mode radar monitoring.
  - 🗺️ **Clean Street (OpenStreetMap Carto)**: Crisp vector cartography with distinct road networks and district borders.
  - 🛰️ **True Satellite (ESRI World Imagery)**: High-resolution satellite orthophotos showing terrain, cloud cover, and coastal geography.
- **Glowing Radar Pulse Marker**: Custom animated SVG beacon featuring an electric cyan center with continuous radial ping wave animation.
- **Sri Lanka Regional Jump Presets**: Dedicated one-tap navigation chips for:
  - 🇱🇰 **Sri Lanka (Overview)** • **Colombo** • **Kandy** • **Galle** • **Jaffna** • **Nuwara Eliya** • 🌍 **Global**
- **High-Precision Reverse Geocoding (Zoom 15)**: Automatically resolves raw coordinates to exact village, town, suburb, district, and province names with zero geographic ambiguity.
- **Dual Launch Access**: Accessible directly via the Search Bar's `Map` compass icon or from the Doppler Radar panel's `Open Interactive Map Scanner` trigger.

---

### 2. 🇱🇰 Sri Lanka 25-District Intelligence & Smart Disambiguation
*Engineered with native expertise for Sri Lankan geography, provinces, and identical town names.*

- **Comprehensive 25-District Registry**: Built-in support covering all 9 provinces and 25 administrative districts:
  > Colombo • Gampaha • Kalutara • Kandy • Matale • Nuwara Eliya • Galle • Matara • Hambantota • Jaffna • Kilinochchi • Mannar • Vavuniya • Mullaitivu • Batticaloa • Ampara • Trincomalee • Kurunegala • Puttalam • Anuradhapura • Polonnaruwa • Badulla • Monaragala • Ratnapura • Kegalle
- **Multi-Word Search Token Matching**: Type queries like `"Nagoda Galle"`, `"Nagoda Southern"`, or `"Nagoda Gampaha"` — SkyPulse intelligently identifies the district/province token and boosts the intended location score by +200.
- **Smart Disambiguation Warning & Selection**: When multiple towns share the identical name (e.g. *Nagoda* in Galle vs *Nagoda* in Gampaha), SkyPulse surfaces an interactive amber alert banner (**"Multiple locations found — Choose District"**) with district badges so users never land in the wrong region.
- **Emerald Country & District Badges**: Sri Lankan locations are highlighted with distinct emerald `🇱🇰 Sri Lanka` pill badges alongside administrative district indicators (`Galle District`, `Western Province`).

---

### 3. 🔍 Revamped Global Search Terminal & Mobile Autocomplete
*An intuitive, keyboard-navigable geocoding interface designed for all screens.*

- **Debounced Live Autocomplete**: Real-time suggestions query Open-Meteo's geocoding engine with graceful automated fallback to OpenStreetMap Nominatim.
- **Full Keyboard Navigation**:
  - `Arrow Down` / `Arrow Up` to cycle through matches.
  - `Enter` to confirm selection.
  - `Escape` to close dropdown.
- **Responsive Mobile Dropdown**: Specially adapted dropdown layout that eliminates viewport overflow, featuring glassmorphism backdrops and clean badge alignments.
- **One-Click Clear**: Instant `X` button to reset search queries and autocomplete lists with a single tap.

---

### 4. ⏱️ Integrated Live Telemetry Clock & Responsive Glass Header
*Always in sync with local time, live seconds, and ergonomic atmospheric controls.*

- **Live Ticking Telemetry Clock**:
  - **Desktop**: Integrated header display with 12-hour/24-hour time, active seconds ticker, day of the week, and formatted date.
  - **Mobile**: Sleek, compact top-right glass pill badge displaying live time and date without consuming precious horizontal real estate.
- **Brand Identity**: Featuring the official high-resolution SkyPulse rounded emblem with animated ambient cyan glow effects.
- **Floating Controls**:
  - 🎧 **Soundscape Controller Popover** with equalizer wave bars.
  - 🌧️ **Live Canvas FX Particle Toggle** (instant on/off for rain & lightning particles).
  - 🌡️ **Temperature Unit Selector** (°C / °F).
  - 🔄 **Instant Telemetry Refresh** with animated spin feedback.
  - 🌓 **Daylight / Midnight Dark Mode Toggle**.

---

### 5. ⚡ Lightning Strike & Severe Thunderstorm Threat Center
*Hyper-local convective instability telemetry and real-time electrical storm hazard monitoring.*

- **Atmospheric CAPE Index**: Tracks **Convective Available Potential Energy** (measured in J/kg) directly from high-resolution atmospheric soundings:
  - `0 - 300 J/kg`: Stable atmosphere / minimal lightning potential
  - `300 - 1,000 J/kg`: Moderate convective activity / isolated thunder
  - `1,000 - 2,500 J/kg`: Elevated risk / frequent cloud-to-ground strikes
  - `> 2,500 J/kg`: Extreme danger / severe thunderstorm & microburst potential
- **Interactive "Flash-to-Bang" Proximity Stopwatch**: Tap when seeing lightning and tap again on thunder; SkyPulse instantly calculates the strike distance in **kilometers** and **miles** using the speed of sound ($343\text{ m/s}$) and alerts if you are inside the **10km Danger Zone**.
- **The 30/30 Lightning Safety Protocol**: Integrated safety checklist recommending prompt indoor shelter and electronics disconnection.
- **12-Hour CAPE Trajectory Sparkline**: Hourly convective energy forecast allowing users to anticipate evening or afternoon electrical storms.

---

### 6. 🌊 Rapid Weather Change & Volatility Radar
*Predict sudden squalls, rapid pressure drops, and precipitation onset before they happen.*

- **Sudden Change Probability Index (0–100%)**: Multi-variable algorithm calculating the precise probability of sudden weather shifts in the next 1–2 hours.
- **15-Minute Next Precipitation Pulse**: High-resolution 4-hour timeline displaying rain accumulation in 15-minute intervals, letting users know exactly when rain starts or stops.
- **3-Hour Barometric Delta ($\Delta P$) Tendency**: Detects rapidly falling barometers (indicating approaching squall lines or tropical fronts) vs rising barometers (clearing skies).
- **Gust Differential Telemetry**: Compares steady wind speed against peak gusts to alert for sudden shear winds.

---

### 7. 🛰️ Atmospheric Radar & Vector Streamline Simulator
*A canvas-rendered interactive Doppler radar terminal with full multi-layer switching.*

- **Precipitation Reflectivity Mode (dBZ)**: Animated rotating radar beam sweeping across regional echo cells with official Doppler reflectivity scales:
  - `15 dBZ` (Light Rain) • `35 dBZ` (Moderate Rain) • `50 dBZ` (Heavy Downpour) • `65+ dBZ` (Severe Thunderstorm / Hail)
- **Wind Particle Vector Flow**: Fluid particle streamlines dynamically flowing with current wind speed and directional headings.
- **Thermal Heatmap Layer**: Isothermal regional temperature gradient overlay.
- **Full Theme Adaptation**:
  - **Dark Mode**: High-contrast deep space navy terminal (`#040813`) with neon cyan grid rings and luminous radar sweep.
  - **Light Mode**: Aeronautical light aero-marine sky theme (`#f1f6fc`) with high-contrast ocean-blue grid rings and vivid echo blobs.
- **Interactive Radial Controls**: Switch sweep radius between `50km`, `100km`, and `250km` with play/pause animations.
- **Launch Interactive Map**: Direct bridge to open the Leaflet full-screen satellite scanner.

---

### 8. 🤖 SkyPulse AI Meteorologist & Life Advisor
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

### 9. 🎧 Procedural Ambient Weather Soundscape Engine
*Zero-asset, zero-latency generative atmospheric audio synthesized via the browser's native Web Audio API.*

- **100% Procedural Synthesis**: Requires **zero external MP3 files**; all audio is synthesized mathematically in real-time.
- **Weather-Responsive Moods**:
  - **Rain Mood**: Filtered brown/pink noise patter simulating continuous rainfall.
  - **Thunderstorm Mood**: Deep resonant oscillator bursts and decaying crackle bursts simulating distant thunder.
  - **Wind Mood**: LFO-modulated bandpass noise sweeping with wind gusts.
  - **Sunny / Night Mood**: Soft ambient breezes with organic birdsong or nocturnal crickets.
- **Precision Volume Control**: Interactive popover featuring step buttons (**`-`** / **`+`**), quick presets (**25%**, **50%**, **75%**, **100%**), and animated equalizer bars.

---

### 10. 🌧️ Real-Time Live Weather Canvas (Falling Rain & Lightning Bolts)
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
  - `CityItem` & `HotspotCity`: Geolocation metadata, country codes, district/province hierarchy, and coordinates.
  - `ResolvedPlace`: Structured reverse geocoding schema (name, region, country, fullName).
- **Zero Type Errors**: Compiles cleanly with `npx tsc --noEmit` under strict TypeScript compiler rules.
- **Vite Environment Typing**: Configured with [`src/vite-env.d.ts`](src/vite-env.d.ts) for Vite client, Leaflet icons, and CSS module support.

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **TypeScript** | `^7.0.2` | Static typing, interface contracts, compiler type verification |
| **React** | `^19.2.8` | Next-generation UI rendering, concurrent features, and state hooks |
| **Vite** | `^8.3.0` | Ultra-fast build tool, instant HMR, and optimized production bundling |
| **Tailwind CSS** | `^4.3.3` | Modern utility styling with `@custom-variant dark` and custom glass tokens |
| **Leaflet** | `^1.9.4` | Interactive GIS mapping engine with custom tiles and animated pulse marker |
| **@types/leaflet** | `^1.9.22` | Strict TypeScript definitions for Leaflet maps, layers, and events |
| **Recharts** | `^3.10.1` | Responsive SVG charts with custom gradient fills and tooltips |
| **Web Audio API** | Native | Procedural weather sound synthesis (rain, thunder, wind, nature) |
| **HTML5 Canvas** | Native | High-frequency Doppler radar scanner & live particle rain/lightning FX |
| **Lucide React** | `^1.45.0` | Clean, modern vector iconography |
| **Axios** | `^1.20.0` | Robust asynchronous HTTP networking with timeouts and rate limiting |
| **Open-Meteo API** | v1 | Open-source global forecast, hourly CAPE, minutely-15, and AQI telemetry |
| **OSM Nominatim** | v1 | Precision reverse geocoding with 1,050ms throttled queuing |

---

## 📁 Project Directory Structure

```text
sky-pulse/
├── public/
│   ├── app_logo.png                   # Official SkyPulse brand logo
│   └── favicon.ico                    # Application favicon
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
│   │   ├── Header.tsx                 # Glass navigation bar with live clock pill, audio & FX toggles
│   │   ├── HeroCard.tsx               # Current weather overview, feels-like, & solar cycle arc
│   │   ├── InteractiveMapModal.tsx    # Full-screen Leaflet GIS scanner (3 layers, presets, reverse geocode)
│   │   ├── LightningThreatPanel.tsx   # Akunu Sara / CAPE index & Flash-to-Bang distance tool
│   │   ├── LiveWeatherCanvas.tsx      # Live canvas falling rain particles & lightning strikes
│   │   ├── MobileNav.tsx              # Floating mobile bottom navigation dock
│   │   ├── RadarMapPanel.tsx          # Interactive Doppler radar simulator (dBZ, wind, thermal)
│   │   ├── SearchBar.tsx              # Debounced search, keyboard nav, district badges & disambiguation
│   │   ├── WeatherIcon.tsx            # Lucide icon dynamic map resolver
│   │   └── WeatherVolatilityPanel.tsx # Sudden shift probability barometer & 15-min rain pulse
│   ├── services/
│   │   ├── apiSecurity.ts             # Enterprise API security: sanitization, throttling, caching
│   │   └── weatherApi.ts              # Sri Lanka 25-district matcher, Open-Meteo & Nominatim client
│   ├── types/
│   │   └── weather.ts                 # Meteorological & Geolocation TypeScript interfaces
│   ├── utils/
│   │   ├── weatherCodes.ts            # WMO meteorological code mappings & visual metadata
│   │   └── weatherSynth.ts            # Procedural Web Audio API sound synthesis engine
│   ├── App.tsx                        # Master dashboard state orchestration & telemetry loader
│   ├── index.css                      # Tailwind v4 theme, Leaflet dark/light map styles & glass tokens
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
- **Theme Invariance**: Both Light Mode and Dark Mode are treated as first-class citizens, featuring tailored contrast ratios, distinct radar palettes, custom map tile invert filters, and canvas blend modes.

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
Verify all TypeScript interfaces and compile rules:
```bash
npx tsc --noEmit
```

### 4. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your web browser.

### 5. Build for Production
```bash
npm run build
```
Generates an ultra-optimized, minified production bundle in the `dist/` directory.

### 6. Preview Production Build
```bash
npm run preview
```

---

## ⌨️ Pro Tips & Shortcuts

- **Search Navigation**: Use `↑` and `↓` keys to navigate autocomplete results and press `Enter` to select.
- **Pinpoint Location**: Click the **Compass** icon in the search bar to launch the Leaflet GIS scanner and click anywhere on the planet.
- **Flash-to-Bang Stopwatch**: In the Lightning Panel, tap **Start** upon seeing lightning and tap **Stop** on hearing thunder to get the exact strike distance.
- **Sound Presets**: Click the audio badge in the header and pick `25%`, `50%`, `75%`, or `100%` to set soundscape volume instantly.
- **Toggle Rain Particles**: Click the **Sparkles** icon in the header to toggle live falling rain and lightning canvas particles on or off.

---

## 👨‍💻 Author & Credits

- **Lead Developer**: **Chathunga Bimsara**
- **GitHub**: [@chathunga2007](https://github.com/chathunga2007)
- **Repository**: [Sky-Pulse-Weather-App](https://github.com/chathunga2007/Sky-Pulse-Weather-App)
- **Telemetry Feeds**: Powered by [Open-Meteo](https://open-meteo.com/) (Open-source Global Weather & Air Quality Models)
- **Map Cartography**: Powered by [Leaflet](https://leafletjs.com/), [OpenStreetMap](https://www.openstreetmap.org/), [CartoDB](https://carto.com/), and [ESRI](https://www.esri.com/)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Engineered with ⚡ precision, mathematical audio synthesis, TypeScript type safety, Leaflet GIS mapping, and modern web design by <strong>Chathunga Bimsara</strong>.</sub>
</div>