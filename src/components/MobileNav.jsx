import React from "react";
import {
  CloudSun,
  Zap,
  Activity,
  Radar,
  Bot,
} from "lucide-react";

export default function MobileNav({ activeSection, onSelectSection }) {
  const navItems = [
    { id: "overview", label: "Overview", icon: CloudSun },
    { id: "lightning", label: "Lightning", icon: Zap },
    { id: "volatility", label: "Volatility", icon: Activity },
    { id: "radar", label: "Radar", icon: Radar },
    { id: "ai", label: "AI Advisor", icon: Bot },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md lg:hidden"
    >
      <div className="glass-heavy px-3 py-2 rounded-2xl flex items-center justify-around shadow-2xl border border-white/20 backdrop-blur-3xl bg-slate-950/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? "text-cyan-400 font-black scale-105"
                  : "text-slate-400 hover:text-slate-200 font-semibold"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400 drop-shadow-md" : ""}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-2 h-1 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
