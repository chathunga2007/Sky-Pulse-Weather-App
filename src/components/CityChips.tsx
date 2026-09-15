import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export interface HotspotCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface CityChipsProps {
  cities: HotspotCity[];
  currentCity: HotspotCity | { name: string; country: string; lat: number; lon: number } | null;
  onSelect: (city: HotspotCity) => void;
}

export default function CityChips({ cities, currentCity, onSelect }: CityChipsProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex items-center gap-2 w-full py-1">
      {/* Label */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-900 dark:text-cyan-400 shrink-0 pl-1">
        <MapPin className="w-3.5 h-3.5 animate-pulse text-cyan-600 dark:text-cyan-400" />
        <span>Hotspots:</span>
      </div>

      {/* Left scroll arrow */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        className="hidden sm:flex p-1.5 rounded-xl glass-pill text-slate-800 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0 shadow-xs"
        title="Scroll left"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 w-full"
      >
        {cities.map((city) => {
          const isSelected =
            currentCity &&
            currentCity.name.toLowerCase() === city.name.toLowerCase();

          return (
            <button
              key={`${city.name}-${city.lat}`}
              type="button"
              onClick={() => onSelect(city)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? "bg-cyan-600 text-white border border-cyan-700 shadow-md shadow-cyan-600/30 dark:bg-gradient-to-r dark:from-cyan-500/30 dark:to-blue-600/30 dark:text-cyan-300 dark:border-cyan-400/60 scale-[1.02]"
                  : "glass-pill text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-cyan-400/50"
              }`}
            >
              {city.name}
              {isSelected && (
                <span className="inline-block w-1.5 h-1.5 ml-2 rounded-full bg-white dark:bg-cyan-400 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right scroll arrow */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        className="hidden sm:flex p-1.5 rounded-xl glass-pill text-slate-800 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0 shadow-xs"
        title="Scroll right"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
