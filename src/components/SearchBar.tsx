import React, { useEffect, useRef, useState } from "react";
import { Search, MapPin, X, Loader2, Compass, Layers, CheckCircle2 } from "lucide-react";
import type { CityItem } from "../types/weather";

interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  suggestions: CityItem[];
  setSuggestions: React.Dispatch<React.SetStateAction<CityItem[]>>;
  isSearching: boolean;
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectCity: (item: CityItem) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  onOpenMap?: () => void;
}

export default function SearchBar({
  query,
  setQuery,
  suggestions,
  setSuggestions,
  isSearching,
  showDropdown,
  setShowDropdown,
  handleSelectCity,
  handleSearchSubmit,
  onOpenMap,
}: SearchBarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Close dropdown on click outside or handle keyboard navigation
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showDropdown || suggestions.length === 0) {
        if (e.key === "Escape") {
          setShowDropdown(false);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectCity(suggestions[selectedIndex]);
      } else if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDropdown, suggestions, selectedIndex, handleSelectCity, setShowDropdown]);

  // Detect if multiple suggestions share the exact same town/city name
  const isAmbiguousQuery =
    suggestions.length > 1 &&
    suggestions.filter(
      (s) => s.name.toLowerCase().trim() === suggestions[0]?.name.toLowerCase().trim()
    ).length > 1;

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400/70 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim().length < 2) {
                setSuggestions([]);
                setShowDropdown(false);
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Search city, town or place..."
            className="w-full pl-10 pr-24 sm:pr-32 py-2 rounded-2xl bg-white/95 border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 dark:bg-slate-900/80 dark:border-slate-700/70 dark:text-slate-100 dark:placeholder:text-slate-500 transition-all outline-none backdrop-blur-xl shadow-xs dark:shadow-inner font-semibold"
            aria-label="Search city or location"
            aria-expanded={showDropdown}
            role="combobox"
          />

          {/* Right Action icons inside the search input */}
          <div className="absolute right-1.5 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  setShowDropdown(false);
                }}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {onOpenMap && (
              <button
                type="button"
                onClick={onOpenMap}
                className="p-1 sm:px-2 sm:py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 transition cursor-pointer flex items-center gap-1 text-[11px] font-bold shrink-0"
                title="Pick location on Interactive Map"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Map</span>
              </button>
            )}

            {isSearching ? (
              <div className="px-2">
                <Loader2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-spin" />
              </div>
            ) : (
              <button
                type="submit"
                className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-[11px] sm:text-xs font-black shadow-md shadow-cyan-600/30 active:scale-95 transition cursor-pointer shrink-0"
              >
                Search
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Autocomplete & Disambiguation Dropdown - Fixed Centered Large Container */}
      {showDropdown && suggestions.length > 0 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[calc(100vw-28px)] sm:w-[520px] md:w-[600px] max-w-[95vw] glass-dropdown rounded-3xl overflow-hidden z-50 shadow-2xl animate-fade-in border border-cyan-500/30 dark:border-cyan-500/20"
          role="listbox"
        >
          {/* Header indicator when multiple matches exist for the same name */}
          {isAmbiguousQuery ? (
            <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/20 via-cyan-500/15 to-transparent border-b border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs font-bold flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  Multiple locations found for <strong>"{suggestions[0].name}"</strong>:
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-lg bg-amber-500/25 text-amber-950 dark:text-amber-100 border border-amber-500/40 shrink-0">
                Choose District
              </span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-between">
              <span>Matching Locations ({suggestions.length})</span>
              <span className="text-[10px] opacity-70">Use ↑↓ to navigate, Enter to select</span>
            </div>
          )}

          {/* Results List */}
          <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {suggestions.map((item, idx) => {
              const badgeCode = (item.countryCode || (item as any).country_code || "").toLowerCase();
              const isSriLanka = badgeCode === "lk" || item.country?.toLowerCase() === "sri lanka";
              const isSelected = selectedIndex === idx;

              // Extract district name
              const districtName = item.district || item.admin2 || "";
              const provinceName = item.province || "";

              return (
                <button
                  key={`${item.id || item.name}-${item.latitude}-${item.longitude}-${idx}`}
                  type="button"
                  onClick={() => handleSelectCity(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition cursor-pointer group ${
                    isSelected
                      ? "bg-cyan-500/20 dark:bg-cyan-500/25 text-cyan-950 dark:text-white"
                      : "hover:bg-cyan-50/90 dark:hover:bg-cyan-500/10 text-slate-800 dark:text-slate-200"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-xl shrink-0 transition shadow-xs ${
                        isSriLanka
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30"
                          : "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Name and District Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition">
                          {item.name}
                        </span>

                        {/* Prominent District Badge (e.g. Galle District, Gampaha District) */}
                        {districtName && (
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-cyan-100 text-cyan-950 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 shadow-xs whitespace-nowrap">
                            🏛️ {districtName}
                          </span>
                        )}

                        {/* Province Badge */}
                        {provinceName && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 whitespace-nowrap">
                            {provinceName}
                          </span>
                        )}

                        {isSriLanka && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 whitespace-nowrap">
                            🇱🇰 Sri Lanka
                          </span>
                        )}
                      </div>

                      {/* Subtitle with Administrative hierarchy */}
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate mt-1">
                        {item.admin1 ? item.admin1 : ""}
                        {item.country && !item.admin1?.includes(item.country) ? ` • ${item.country}` : ""}
                      </div>
                    </div>
                  </div>

                  {/* Right side selection cue */}
                  <div className="ml-3 shrink-0 flex items-center gap-1.5">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition shadow-xs ${
                        isSelected
                          ? "bg-cyan-500 text-white shadow-cyan-500/40"
                          : "bg-slate-100 dark:bg-slate-800/90 text-cyan-800 dark:text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span>Select</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
