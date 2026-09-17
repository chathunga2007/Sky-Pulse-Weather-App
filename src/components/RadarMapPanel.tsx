import React, { useState, useEffect, useRef } from "react";
import {
  Radar,
  Play,
  Pause,
  Droplets,
  Wind,
  Thermometer,
  Compass,
} from "lucide-react";
import type { WeatherCurrent } from "../types/weather";

interface RadarMapPanelProps {
  current: WeatherCurrent | null;
  currentCity: { name: string; lat?: number; lon?: number } | null;
  darkMode?: boolean;
  onOpenMap?: () => void;
}

interface WindParticle {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

export default function RadarMapPanel({
  current,
  currentCity,
  darkMode = true,
  onOpenMap,
}: RadarMapPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<"rain" | "wind" | "thermal">("rain");
  const [rangeKm, setRangeKm] = useState<number>(100); // 50, 100, 250

  const angleRef = useRef<number>(0);
  const particlesRef = useRef<WindParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize random wind particles
  useEffect(() => {
    const p: WindParticle[] = [];
    for (let i = 0; i < 70; i++) {
      p.push({
        x: Math.random() * 680,
        y: Math.random() * 380,
        speed: 1 + Math.random() * 2.5,
        length: 8 + Math.random() * 12,
        opacity: 0.3 + Math.random() * 0.6,
      });
    }
    particlesRef.current = p;
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isCancelled = false;

    const render = () => {
      if (isCancelled) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(cx, cy) - 20;

      // 1. Clear background adapted to theme
      ctx.fillStyle = darkMode ? "#040813" : "#f1f6fc";
      ctx.fillRect(0, 0, w, h);

      // Subtle light mode radial gradient overlay
      if (!darkMode) {
        const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        bgGrad.addColorStop(0, "rgba(224, 242, 254, 0.7)");
        bgGrad.addColorStop(1, "rgba(241, 245, 249, 0.4)");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Draw Radar Grid Rings
      ctx.strokeStyle = darkMode ? "rgba(6, 182, 212, 0.22)" : "rgba(14, 165, 233, 0.35)";
      ctx.lineWidth = 1.2;
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * ratio, 0, Math.PI * 2);
        ctx.stroke();

        // Distance text
        ctx.fillStyle = darkMode ? "rgba(6, 182, 212, 0.6)" : "rgba(3, 105, 161, 0.85)";
        ctx.font = "bold 10px monospace";
        ctx.fillText(`${Math.round(rangeKm * ratio)}km`, cx + 6, cy - maxR * ratio + 12);
      });

      // Crosshairs
      ctx.strokeStyle = darkMode ? "rgba(6, 182, 212, 0.15)" : "rgba(14, 165, 233, 0.25)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Render Active Layer
      if (activeLayer === "rain") {
        // Draw precipitation reflectivity cells (dBZ blobs)
        const cells = [
          { x: cx + maxR * 0.35, y: cy - maxR * 0.25, r: 45, dbz: 48 },
          { x: cx - maxR * 0.45, y: cy + maxR * 0.15, r: 60, dbz: 35 },
          { x: cx + maxR * 0.1, y: cy + maxR * 0.5, r: 35, dbz: 55 },
          { x: cx - maxR * 0.15, y: cy - maxR * 0.4, r: 50, dbz: 28 },
        ];

        cells.forEach((cell) => {
          const grad = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, cell.r);
          if (cell.dbz >= 50) {
            // Severe thunderstorm echo (Red / Magenta)
            grad.addColorStop(0, "rgba(225, 29, 72, 0.88)");
            grad.addColorStop(0.4, "rgba(245, 158, 11, 0.75)");
            grad.addColorStop(0.7, "rgba(16, 185, 129, 0.45)");
            grad.addColorStop(1, "rgba(6, 182, 212, 0)");
          } else if (cell.dbz >= 35) {
            // Moderate Rain echo (Yellow / Green)
            grad.addColorStop(0, "rgba(234, 179, 8, 0.8)");
            grad.addColorStop(0.5, "rgba(16, 185, 129, 0.55)");
            grad.addColorStop(1, "rgba(6, 182, 212, 0)");
          } else {
            // Light Rain echo (Cyan / Blue)
            grad.addColorStop(0, "rgba(6, 182, 212, 0.7)");
            grad.addColorStop(0.6, "rgba(59, 130, 246, 0.4)");
            grad.addColorStop(1, "rgba(6, 182, 212, 0)");
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, cell.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Sweeping Radar Beam
        if (isPlaying) {
          angleRef.current = (angleRef.current + 0.025) % (Math.PI * 2);
        }
        const beamAngle = angleRef.current;

        const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        sweepGrad.addColorStop(0, darkMode ? "rgba(6, 182, 212, 0.45)" : "rgba(2, 132, 199, 0.35)");
        sweepGrad.addColorStop(1, darkMode ? "rgba(6, 182, 212, 0.05)" : "rgba(2, 132, 199, 0.02)");

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, beamAngle - 0.45, beamAngle);
        ctx.closePath();
        ctx.fillStyle = sweepGrad;
        ctx.fill();

        // Beam leading edge
        ctx.strokeStyle = darkMode ? "rgba(34, 211, 238, 0.95)" : "rgba(2, 132, 199, 0.95)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(beamAngle) * maxR, cy + Math.sin(beamAngle) * maxR);
        ctx.stroke();
        ctx.restore();
      } else if (activeLayer === "wind") {
        // Wind particle streamlines
        ctx.lineWidth = 1.6;
        particlesRef.current.forEach((p) => {
          if (isPlaying) {
            p.x += p.speed;
            p.y += (Math.sin(p.x * 0.02) * p.speed) / 2;
            if (p.x > w) p.x = 0;
            if (p.y > h) p.y = 0;
          }

          ctx.strokeStyle = darkMode
            ? `rgba(56, 189, 248, ${p.opacity})`
            : `rgba(2, 132, 199, ${p.opacity * 1.1})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.length, p.y + p.length * 0.25);
          ctx.stroke();
        });
      } else if (activeLayer === "thermal") {
        // Thermal heat distribution overlay
        const thermGrad = ctx.createLinearGradient(0, 0, w, h);
        thermGrad.addColorStop(0, "rgba(244, 63, 94, 0.38)"); // warm
        thermGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.28)");
        thermGrad.addColorStop(1, "rgba(6, 182, 212, 0.38)"); // cooler

        ctx.fillStyle = thermGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Center City Location Beacon
      ctx.fillStyle = darkMode ? "#22d3ee" : "#0284c7";
      ctx.beginPath();
      ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = darkMode ? "#ffffff" : "#0f172a";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = darkMode ? "#ffffff" : "#0f172a";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(currentCity?.name || "Target Hub", cx + 10, cy - 8);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isCancelled = true;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, activeLayer, rangeKm, currentCity, darkMode]);

  return (
    <div className="lg:col-span-3 glass-panel p-5 sm:p-7 rounded-3xl relative overflow-hidden shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-100 text-cyan-700 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30 icon-glow-cyan shadow-xs">
            <Radar className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Atmospheric Radar & Vector Streamline Simulator
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-950 border border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30 uppercase tracking-wider">
                Live Scanner
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              High-Frequency Doppler Echo Simulation centered on {currentCity?.name || "Local Coordinates"}
            </p>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenMap && (
            <button
              type="button"
              onClick={onOpenMap}
              className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black shadow-md shadow-cyan-600/30 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Interactive Map Scanner</span>
            </button>
          )}

          {/* Layer Selector */}
          <div className="glass-pill p-1 rounded-2xl flex items-center shadow-xs">
            <button
              type="button"
              onClick={() => setActiveLayer("rain")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayer === "rain"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                  : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Precipitation (dBZ)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("wind")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayer === "wind"
                  ? "bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md"
                  : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Wind Vectors</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("thermal")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayer === "thermal"
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md"
                  : "text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Thermal</span>
            </button>
          </div>

          {/* Range Distance Switcher */}
          <div className="glass-pill p-1 rounded-2xl flex items-center text-xs font-bold shadow-xs">
            {[50, 100, 250].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setRangeKm(km)}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  rangeKm === km
                    ? "bg-cyan-600 text-white dark:bg-white/20 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {km}km
              </button>
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="glass-pill p-2 rounded-2xl text-slate-800 dark:text-slate-200 hover:text-cyan-500 cursor-pointer shadow-xs active:scale-95 transition"
            title={isPlaying ? "Pause Radar Sweep" : "Resume Radar Sweep"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Radar Screen - Fully theme adaptive */}
      <div
        className={`w-full relative rounded-3xl overflow-hidden border shadow-xl flex items-center justify-center min-h-[300px] sm:min-h-[360px] transition-colors duration-500 ${
          darkMode
            ? "border-cyan-500/25 bg-[#040813]"
            : "border-sky-200 bg-gradient-to-b from-sky-50 via-slate-50 to-sky-100 shadow-inner"
        }`}
      >
        <canvas
          ref={canvasRef}
          width={680}
          height={380}
          className="w-full h-full max-h-[400px] object-cover"
        />

        {/* Radar Corner Telemetry Overlay */}
        <div
          className={`absolute top-3 left-3 p-2.5 rounded-2xl border text-[11px] font-mono space-y-0.5 pointer-events-none backdrop-blur-md shadow-xs ${
            darkMode
              ? "bg-black/60 border-white/10 text-cyan-300"
              : "bg-white/90 border-slate-300/80 text-cyan-900"
          }`}
        >
          <div>LOC: {currentCity?.lat?.toFixed(2)}°N, {currentCity?.lon?.toFixed(2)}°E</div>
          <div>SWEEP: {rangeKm} KM RADIAL</div>
          <div>ECHO REFLECT: {activeLayer.toUpperCase()} MODE</div>
        </div>

        {/* Reflectivity Legend (dBZ) if precipitation layer is active */}
        {activeLayer === "rain" && (
          <div
            className={`absolute bottom-3 right-3 p-2 rounded-xl border flex items-center gap-1.5 text-[10px] font-mono pointer-events-none backdrop-blur-md shadow-xs ${
              darkMode
                ? "bg-black/60 border-white/10 text-white"
                : "bg-white/90 border-slate-300/80 text-slate-800"
            }`}
          >
            <span className={darkMode ? "text-slate-400" : "text-slate-600"}>dBZ:</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-600 text-white font-bold">15 (Light)</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">35 (Mod)</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">50 (Heavy)</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold">65+ (Severe)</span>
          </div>
        )}
      </div>
    </div>
  );
}
