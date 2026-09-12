import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export default function CityChips({ cities, currentCity, onSelect }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex items-center gap-2 w-full py-1">
      {/* Label */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400/80 shrink-0 pl-1">
        <MapPin className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
        <span>Hotspots:</span>
      </div>

      {/* Left scroll arrow */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        className="hidden sm:flex p-1.5 rounded-xl glass-pill text-slate-300 hover:text-cyan-300 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-300 border border-cyan-400/60 shadow-md shadow-cyan-500/20 scale-[1.02]"
                  : "glass-pill text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-slate-800/40"
              }`}
            >
              {city.name}
              {isSelected && (
                <span className="inline-block w-1.5 h-1.5 ml-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right scroll arrow */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        className="hidden sm:flex p-1.5 rounded-xl glass-pill text-slate-300 hover:text-cyan-300 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
        title="Scroll right"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
