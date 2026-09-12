import React, { useEffect, useRef } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";

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
}) {
  const containerRef = useRef(null);

  // Close dropdown on click outside or ESC key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowDropdown]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400/70 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
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
            placeholder="Search city, capital or region..."
            className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-white/90 border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm text-slate-900 placeholder:text-slate-500 dark:bg-slate-900/60 dark:border-slate-700/60 dark:text-slate-100 dark:placeholder:text-slate-500 transition-all outline-none backdrop-blur-xl shadow-sm dark:shadow-inner font-semibold"
            aria-label="Search city or location"
            aria-expanded={showDropdown}
            role="combobox"
          />

          {/* Right Action icons */}
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

            {isSearching ? (
              <div className="px-2">
                <Loader2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-spin" />
              </div>
            ) : (
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-cyan-600/30 active:scale-95 transition cursor-pointer"
              >
                Search
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full mt-2 glass-dropdown rounded-2xl overflow-hidden z-50 divide-y divide-slate-200 dark:divide-slate-800/60 shadow-2xl animate-fade-in"
          role="listbox"
        >
          {suggestions.map((item) => (
            <button
              key={`${item.id || item.name}-${item.latitude}-${item.longitude}`}
              type="button"
              onClick={() => handleSelectCity(item)}
              className="w-full px-4 py-3 text-left hover:bg-cyan-50 dark:hover:bg-cyan-500/10 flex items-center justify-between transition group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-500/20 group-hover:scale-110 transition">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {item.admin1 ? `${item.admin1}, ` : ""}
                    {item.country || ""}
                  </div>
                </div>
              </div>
              {item.country_code && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-cyan-900 dark:text-cyan-300/80 border border-slate-300 dark:border-slate-700/80">
                  {item.country_code}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
