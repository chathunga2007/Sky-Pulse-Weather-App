<div align="center">

# ⚡ SkyPulse — Atmospheric Telemetry & Forecast

**Next-generation meteorological dashboard and hyper-local atmospheric radar engineered with cutting-edge Glassmorphism aesthetics.**

[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.10.1-22c55e?style=for-the-badge)](https://recharts.org/)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-FF6F00?style=for-the-badge)](https://open-meteo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[Explore Features](#-key-features) • [Tech Stack](#-technology-stack) • [Quick Start](#-quick-start) • [Project Architecture](#-project-structure) • [Author](#-author--credits)

</div>

---

## 🌟 Overview

**SkyPulse** is a high-performance, precision atmospheric weather dashboard designed to provide real-time meteorological intelligence. Built with **React 19**, **Tailwind CSS v4**, and **Vite**, SkyPulse combines high-fidelity glassmorphism visual design with live radar feeds, 24-hour predictive trend graphs, air quality indexing, and extended 7-day forecasts.

Whether navigating daylight clarity or sleek midnight dark mode, SkyPulse delivers fluid responsiveness and zero-latency weather insights across all screen form factors.

---

## ✨ Key Features

### 🌐 Global Geo-Spatial Search & Fast Autocomplete
- Search any city, capital, or region worldwide with debounced real-time geocoding suggestions.
- Instant country code badges and administrative division tagging.
- Quick-access hotspot pills for rapid navigation between major global metropolitan hubs.

### 📍 GPS Hardware Location Detection
- One-click geolocation API integration automatically resolves your exact geographic coordinates and streams local weather conditions.

### 📊 24-Hour Predictive Telemetry Chart
- Interactive area chart powered by **Recharts** with smooth gradient fills and responsive custom tooltips.
- One-touch toggle across three vital data streams:
  - **Temperature Trends (°C / °F)**
  - **Precipitation Probability (%)**
  - **Wind Speed (km/h)**
- Horizontal scrollable hourly snapshot strip with condition badges.

### 🍃 Real-Time Air Quality & EPA AQI Monitoring
- Live US EPA Air Quality Index (AQI) tracking with intuitive color-coded risk bands (Good, Moderate, Unhealthy, Hazardous).
- Detailed concentration metrics for particulate matter: **PM2.5** and **PM10** ($\mu\text{g/m}^3$).
- Actionable health recommendations and atmospheric advisories.

### 📡 Atmospheric Radar & Comprehensive Telemetry (6 Sensor Feeds)
- **Relative Humidity & Dew Point**: Precise moisture measurement.
- **Wind Vector & Gusts**: Velocity and peak wind gust tracking.
- **UV Solar Radiation Index**: Real-time UV rating with safety advisories (sun lotion, shade alerts).
- **Visibility**: Horizon clarity measured in kilometers.
- **Surface Pressure**: High/low barometric pressure trends in hPa.
- **Thermal Index**: Apparent "Feels Like" temperature and perceived comfort index.

### 📅 7-Day Extended Meteorological Outlook
- Daily weather conditions with high-resolution condition iconography.
- Dynamic high/low temperature ranges and precipitation likelihood.
- Fully responsive card grid optimizing from mobile pairs to desktop weekly panoramas.

### 🌓 Dual Ultra-Glassmorphism Engine (Light & Dark)
- Built on a customized Tailwind v4 variant system (`@custom-variant dark`) for pixel-perfect class-based switching.
- **Light Mode**: High-contrast slate typography (`#0f172a`), frosted pearl glass panels, and deep cyan accenting.
- **Dark Mode**: Deep space nebula aesthetics, neon cyan/emerald glow borders, and translucent obsidian glass.

### ⚡ Zero API Key Friction
- Directly connects to the **Open-Meteo** API network — high precision, global coverage, no hidden keys, and zero rate-limit friction.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19.2** | Concurrent mode, reactive component state, and modern hooks |
| **Build Tool** | **Vite 8.3** | Lightning-fast Hot Module Replacement (HMR) and optimized rollup bundle |
| **Styling & Theme** | **Tailwind CSS v4** | Pure utility-first design, custom glass tokens, dynamic backdrop filters |
| **Data Visualization** | **Recharts 3.10** | Responsive SVG charts with custom gradients, tooltips, and transitions |
| **Iconography** | **Lucide React** | Clean, lightweight, and modern vector icon suite |
| **HTTP Client** | **Axios** | Robust API requests with error interception and timeout handling |
| **Meteorological Data**| **Open-Meteo API** | Free, open-source global weather, forecast, and air quality telemetry |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### 1. Clone the Repository
```bash
git clone https://github.com/chathunga2007/Sky-Pulse-Weather-App.git
cd Sky-Pulse-Weather-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The production bundle will be generated in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```text
sky-pulse/
├── public/
│   ├── favicon.ico          # Application favicon
│   └── weather-icon.png     # Brand logo asset
├── src/
│   ├── components/
│   │   ├── AirQualityPanel.jsx   # US EPA AQI gauge & PM2.5/PM10 metrics
│   │   ├── CityChips.jsx         # Hotspot quick-select city pills
│   │   ├── DailyForecast.jsx     # 7-day forecast cards with responsive grid
│   │   ├── DetailedMetrics.jsx   # 6 live atmospheric radar sensor cards
│   │   ├── Footer.jsx            # Sleek developer attribution & brand links
│   │   ├── ForecastChart.jsx     # 24-hour Recharts predictive telemetry graph
│   │   ├── Header.jsx            # Unified glass header with Live Radar & controls
│   │   ├── HeroCard.jsx          # Current weather overview & solar cycle bar
│   │   └── SearchBar.jsx         # Debounced geocoding search & autocomplete
│   ├── utils/
│   │   ├── weatherCodes.js       # WMO weather code dictionary & metadata
│   │   └── weatherIcons.jsx      # Weather condition dynamic vector mapping
│   ├── App.jsx                   # Master dashboard orchestration & data fetching
│   ├── index.css                 # Tailwind v4 theme setup & glassmorphism tokens
│   └── main.jsx                  # Application entry point
├── package.json                  # Dependencies and project scripts
├── vite.config.js                # Vite build configuration
└── README.md                     # Project documentation
```

---

## 🎨 Design Philosophy

SkyPulse is crafted with the **Glassmorphism 2.0** paradigm:
- **Multi-layered Translucency**: Distinct background blur levels (`backdrop-blur-xl`, `backdrop-blur-2xl`) create spatial hierarchy.
- **Luminescent Accent Lights**: Ambient colored radial gradients simulate volumetric light behind weather modules.
- **Ergonomic Typography**: High-contrast type weights (Slate 900 in Light mode, White in Dark mode) ensure readability in any environment.
- **Adaptive Layout**: Responsive grids automatically re-orient layouts from single-column mobile displays to full multi-column dashboard monitors.

---

## 👨‍💻 Author & Credits

- **Developer**: **Chathunga Bimsara**
- **GitHub**: [@chathunga2007](https://github.com/chathunga2007)
- **Repository**: [Sky-Pulse-Weather-App](https://github.com/chathunga2007/Sky-Pulse-Weather-App)
- **Weather Data**: Powered by [Open-Meteo](https://open-meteo.com/)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to inspect, fork, and enhance for personal or educational use.

<div align="center">
  <sub>Developed with ⚡ and precision by Chathunga Bimsara</sub>
</div>
