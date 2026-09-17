import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  X,
  MapPin,
  Compass,
  Navigation,
  Loader2,
  CheckCircle2,
  Globe,
  Sparkles,
  Layers,
  Sun,
  Moon,
} from "lucide-react";
import { reverseGeocodePlace, type ResolvedPlace } from "../services/weatherApi";

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (lat: number, lon: number, cityName: string, countryName?: string) => void;
  initialLat: number;
  initialLon: number;
  currentCityName: string;
  darkMode?: boolean;
}

interface SelectedLocation {
  lat: number;
  lon: number;
  name: string;
  country: string;
  fullName: string;
}

type MapLayerType = "dark" | "street" | "satellite";

const SRI_LANKA_PRESETS = [
  { label: "🇱🇰 Sri Lanka (Overview)", lat: 7.8731, lon: 80.7718, zoom: 8 },
  { label: "Colombo", lat: 6.9271, lon: 79.8612, zoom: 12 },
  { label: "Kandy", lat: 7.2906, lon: 80.6337, zoom: 12 },
  { label: "Galle", lat: 6.0535, lon: 80.221, zoom: 12 },
  { label: "Jaffna", lat: 9.6615, lon: 80.0255, zoom: 12 },
  { label: "Nuwara Eliya", lat: 6.9497, lon: 80.7891, zoom: 13 },
  { label: "🌍 World", lat: 20.0, lon: 0.0, zoom: 2 },
];

export default function InteractiveMapModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialLat,
  initialLon,
  currentCityName,
  darkMode = true,
}: InteractiveMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapLayer, setMapLayer] = useState<MapLayerType>(darkMode ? "dark" : "street");
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({
    lat: initialLat,
    lon: initialLon,
    name: currentCityName,
    country: "",
    fullName: currentCityName,
  });
  const [isResolving, setIsResolving] = useState<boolean>(false);

  // Sync default layer with darkMode when opening
  useEffect(() => {
    if (isOpen) {
      setMapLayer(darkMode ? "dark" : "street");
    }
  }, [isOpen, darkMode]);

  // Custom Neon Radar Pulse Marker Icon
  const createPulseIcon = () =>
    L.divIcon({
      className: "custom-radar-pulse-marker",
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; transform: translate(-9px, -9px);">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(6, 182, 212, 0.5); animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background: linear-gradient(135deg, #06b6d4, #2563eb); border: 2.5px solid #ffffff; box-shadow: 0 0 16px rgba(6, 182, 212, 0.9); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; border-radius: 9999px; background: #ffffff;"></div>
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

  // Handle Location Resolution using zoom=15 for exact village / town
  const handleResolveCoords = async (lat: number, lon: number) => {
    setIsResolving(true);
    try {
      const place: ResolvedPlace = await reverseGeocodePlace(lat, lon);
      setSelectedLocation({
        lat: Math.round(lat * 10000) / 10000,
        lon: Math.round(lon * 10000) / 10000,
        name: place.name || "Selected Location",
        country: place.region ? `${place.region}, ${place.country}` : place.country,
        fullName: place.fullName,
      });
    } catch {
      setSelectedLocation({
        lat: Math.round(lat * 10000) / 10000,
        lon: Math.round(lon * 10000) / 10000,
        name: `Location (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`,
        country: "Sri Lanka",
        fullName: `Coordinates (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`,
      });
    } finally {
      setIsResolving(false);
    }
  };

  // Helper to get Tile Layer config (100% Free, NO API Key, ZERO Watermark)
  const getTileConfig = (layer: MapLayerType) => {
    if (layer === "satellite") {
      return {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        options: {
          maxZoom: 19,
          className: "satellite-map-tiles",
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a> Satellite',
        },
      };
    }
    if (layer === "dark") {
      return {
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        options: {
          maxZoom: 19,
          className: "dark-map-tiles",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      };
    }
    // Street mode
    return {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        maxZoom: 19,
        className: "",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    };
  };

  // Switch Tile Layer dynamically
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const { url, options } = getTileConfig(mapLayer);
    const newLayer = L.tileLayer(url, options).addTo(map);
    tileLayerRef.current = newLayer;
  }, [mapLayer]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        tileLayerRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: 11,
        zoomControl: false,
      });

      // Zoom Control on top right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Clean OpenStreetMap tiles without any watermark
      const { url, options } = getTileConfig(mapLayer);
      const layer = L.tileLayer(url, options).addTo(map);
      tileLayerRef.current = layer;

      // Add Pulse Marker
      const marker = L.marker([initialLat, initialLon], {
        icon: createPulseIcon(),
      }).addTo(map);

      markerRef.current = marker;
      mapInstanceRef.current = map;

      // Click on Map to Select Location
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleResolveCoords(lat, lng);
      });

      map.invalidateSize();
    }, 120);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fly to Preset
  const handleFlyTo = (lat: number, lon: number, zoom: number) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lon], zoom, { duration: 1.2 });
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]);
    }
    handleResolveCoords(lat, lon);
  };

  // Confirm selection
  const handleConfirm = () => {
    onSelectLocation(
      selectedLocation.lat,
      selectedLocation.lon,
      selectedLocation.name,
      selectedLocation.country
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[820px] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 shadow-sm">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wide">
                  Interactive Atmospheric Map Scanner
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  <Sparkles className="w-2.5 h-2.5" /> 100% Free • No Watermark
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Click anywhere on Sri Lanka or the globe to pinpoint exact villages, towns and inspect live telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Map Tile Layer Switcher */}
            <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/60 flex items-center text-xs font-bold shadow-xs">
              <button
                type="button"
                onClick={() => setMapLayer("dark")}
                className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                  mapLayer === "dark"
                    ? "bg-slate-950 text-cyan-400 shadow-sm font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Dark Radar Style (No Watermark)"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setMapLayer("street")}
                className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                  mapLayer === "street"
                    ? "bg-white text-blue-600 dark:bg-slate-700 dark:text-white shadow-sm font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="OpenStreetMap Street View (No Watermark)"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Street</span>
              </button>
              <button
                type="button"
                onClick={() => setMapLayer("satellite")}
                className={`px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                  mapLayer === "satellite"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm font-black"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Satellite Terrain (No Watermark)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Satellite</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close Map Scanner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Bookmarks */}
        <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
            <Navigation className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Quick Jump:</span>
          </div>
          {SRI_LANKA_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleFlyTo(preset.lat, preset.lon, preset.zoom)}
              className="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap bg-white/90 dark:bg-slate-800/90 hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700/60 transition active:scale-95 cursor-pointer shadow-xs"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Map View Area */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Helper Badge */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-lg">
            <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Click any village, town or junction to inspect</span>
          </div>
        </div>

        {/* Bottom Location Confirmation Bar */}
        <div className="p-4 sm:p-5 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3.5 backdrop-blur-xl">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 shrink-0">
              {isResolving ? (
                <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
              ) : (
                <MapPin className="w-5 h-5 text-cyan-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-600 dark:text-cyan-400">
                  Target Destination
                </span>
                {isResolving && (
                  <span className="text-[11px] text-slate-400 animate-pulse font-mono">
                    Resolving exact place name...
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white truncate">
                {selectedLocation.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {selectedLocation.country ? `${selectedLocation.country} • ` : ""}
                <span className="font-mono text-cyan-700 dark:text-cyan-300">
                  {selectedLocation.lat > 0 ? `${selectedLocation.lat}° N` : `${Math.abs(selectedLocation.lat)}° S`},{" "}
                  {selectedLocation.lon > 0 ? `${selectedLocation.lon}° E` : `${Math.abs(selectedLocation.lon)}° W`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isResolving}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Load Live Weather Here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
