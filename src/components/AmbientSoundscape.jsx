import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Sliders, Plus, Minus } from "lucide-react";
import { weatherAudio } from "../utils/weatherSynth";

export default function AmbientSoundscape({ weatherCode, isDay, cape }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [showSlider, setShowSlider] = useState(false);

  // Sync volume with sound engine immediately
  const updateVolume = (val) => {
    const clamped = Math.max(0, Math.min(1, Math.round(val * 100) / 100));
    setVolume(clamped);
    weatherAudio.setVolume(clamped);
  };

  useEffect(() => {
    weatherAudio.setVolume(volume);
  }, [volume]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      weatherAudio.stop();
    };
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      weatherAudio.stop();
      setIsPlaying(false);
      setShowSlider(false);
    } else {
      weatherAudio.playWeatherMood(weatherCode || 0, isDay !== false, cape || 0);
      setIsPlaying(true);
      weatherAudio.setVolume(volume);
    }
  };

  return (
    <div className="relative z-50">
      <div className="flex items-center gap-1.5">
        {/* Main Soundscape On/Off Button */}
        <button
          type="button"
          onClick={toggleAudio}
          title={isPlaying ? "Mute Ambient Weather Audio" : "Play Ambient Weather Soundscape"}
          className={`glass-pill px-3 py-2 rounded-2xl flex items-center gap-2 cursor-pointer active:scale-95 transition-all text-xs font-bold shadow-xs ${
            isPlaying
              ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300"
              : "text-slate-800 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300"
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
              {/* Equalizer animated bars */}
              <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                <span
                  className="w-1 bg-cyan-600 dark:bg-cyan-400 rounded-full animate-[equalizer_0.8s_ease-in-out_infinite_alternate]"
                  style={{ height: "60%" }}
                />
                <span
                  className="w-1 bg-cyan-600 dark:bg-cyan-400 rounded-full animate-[equalizer_1.1s_ease-in-out_infinite_alternate_0.2s]"
                  style={{ height: "100%" }}
                />
                <span
                  className="w-1 bg-cyan-600 dark:bg-cyan-400 rounded-full animate-[equalizer_0.6s_ease-in-out_infinite_alternate_0.4s]"
                  style={{ height: "40%" }}
                />
              </div>
              <span className="hidden md:inline font-bold">Soundscape</span>
              <span className="text-[10px] opacity-80 font-mono">({Math.round(volume * 100)}%)</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline font-medium">Ambient Audio</span>
            </>
          )}
        </button>

        {/* Volume Settings Toggle Button */}
        {isPlaying && (
          <button
            type="button"
            onClick={() => setShowSlider((p) => !p)}
            className={`glass-pill p-2 rounded-2xl cursor-pointer active:scale-95 transition shadow-xs ${
              showSlider
                ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-500/50"
                : "text-slate-700 dark:text-slate-300 hover:text-cyan-600"
            }`}
            title="Adjust volume"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating Volume Adjustment Panel with High Stacking Context */}
      {showSlider && isPlaying && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute right-0 top-12 z-[100] glass-dropdown p-4 rounded-3xl shadow-2xl w-64 space-y-3 border-2 border-cyan-500/50 backdrop-blur-2xl bg-slate-950/95 text-white animate-fade-in"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span>Atmospheric Volume</span>
            <span className="text-cyan-400 font-mono text-sm font-black">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Plus / Minus Quick Stepper + Slider */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => updateVolume(volume - 0.1)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition cursor-pointer border border-white/10"
              title="Decrease volume by 10%"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => updateVolume(parseFloat(e.target.value))}
              onInput={(e) => updateVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition"
            />

            <button
              type="button"
              onClick={() => updateVolume(volume + 0.1)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white transition cursor-pointer border border-white/10"
              title="Increase volume by 10%"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-4 gap-1.5 text-center">
            {[0.25, 0.5, 0.75, 1.0].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateVolume(preset)}
                className={`py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                  Math.abs(volume - preset) < 0.05
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md shadow-cyan-500/30"
                    : "bg-slate-900/80 text-slate-400 border-white/10 hover:text-white hover:border-cyan-500/40"
                }`}
              >
                {Math.round(preset * 100)}%
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
