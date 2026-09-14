import React, { useEffect, useRef } from "react";

export default function LiveWeatherCanvas({
  weatherCode = 0,
  cape = 0,
  isDay = true,
  windSpeed = 10,
  enabled = true,
  darkMode = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Weather condition flags
    const isThunder = weatherCode >= 95 || cape >= 1200;
    const isRain =
      (weatherCode >= 51 && weatherCode <= 67) ||
      (weatherCode >= 80 && weatherCode <= 82) ||
      isThunder;
    const isSnow = weatherCode >= 71 && weatherCode <= 77;
    const isClear = weatherCode <= 2 && !isRain && !isSnow;

    // Rain particles
    const rainDrops = [];
    const dropCount = isThunder ? 150 : isRain ? 100 : 0;
    for (let i = 0; i < dropCount; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 14 + Math.random() * 20,
        speed: 15 + Math.random() * 11,
        opacity: darkMode ? 0.35 + Math.random() * 0.45 : 0.55 + Math.random() * 0.35,
        thickness: darkMode ? 1.2 + Math.random() * 1.4 : 1.4 + Math.random() * 1.5,
      });
    }

    // Splashes for rain on ground
    const splashes = [];
    const addSplash = (x, y) => {
      splashes.push({
        x,
        y,
        radius: 1,
        maxRadius: 4 + Math.random() * 6,
        opacity: darkMode ? 0.55 : 0.7,
      });
    };

    // Lightning strike variables
    let lightningTimer = 0;
    let lightningFlash = 0; // 0 to 1 opacity
    let currentBolt = null; // array of points for branching lightning

    const generateBolt = () => {
      const startX = width * 0.15 + Math.random() * (width * 0.7);
      const points = [{ x: startX, y: 0 }];
      let curX = startX;
      let curY = 0;

      while (curY < height * 0.8) {
        curY += 15 + Math.random() * 25;
        curX += (Math.random() - 0.5) * 50;
        points.push({ x: curX, y: curY });
      }
      return points;
    };

    // Sun / Ambient particles for clear skies
    const sunParticles = [];
    if (isClear) {
      for (let i = 0; i < 30; i++) {
        sunParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.5 + Math.random() * 3,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.3 - Math.random() * 0.6,
          opacity: 0.2 + Math.random() * 0.35,
        });
      }
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render Rain with theme-adaptive contrast
      if (isRain && rainDrops.length > 0) {
        const windShift = (windSpeed / 15) * 4;

        rainDrops.forEach((drop) => {
          ctx.lineWidth = drop.thickness;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + windShift, drop.y + drop.length);

          // In Light Mode: use crisp, rich slate-cyan rain
          // In Dark Mode: use luminous pale cyan rain
          ctx.strokeStyle = darkMode
            ? `rgba(186, 230, 253, ${drop.opacity})`
            : `rgba(2, 132, 199, ${drop.opacity})`;
          ctx.stroke();

          // Move drop
          drop.y += drop.speed;
          drop.x += windShift;

          // Reset if bottom or side reached
          if (drop.y > height) {
            addSplash(drop.x, height - 2);
            drop.y = -20;
            drop.x = Math.random() * width;
          }
          if (drop.x > width) drop.x = 0;
          if (drop.x < 0) drop.x = width;
        });

        // Splashes
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i];
          ctx.strokeStyle = darkMode
            ? `rgba(186, 230, 253, ${s.opacity})`
            : `rgba(2, 132, 199, ${s.opacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.radius * 2, s.radius, 0, 0, Math.PI * 2);
          ctx.stroke();

          s.radius += 0.45;
          s.opacity -= 0.04;
          if (s.opacity <= 0) splashes.splice(i, 1);
        }
      }

      // 2. Render Lightning (Akunu) with high contrast for both modes
      if (isThunder) {
        lightningTimer++;

        // Trigger flash every ~4 to 7 seconds
        if (lightningTimer > 180 && Math.random() < 0.025) {
          lightningFlash = 0.75 + Math.random() * 0.25;
          currentBolt = generateBolt();
          lightningTimer = 0;
        }

        // Draw Sky Flash illumination
        if (lightningFlash > 0.01) {
          ctx.fillStyle = darkMode
            ? `rgba(238, 242, 255, ${lightningFlash * 0.28})`
            : `rgba(56, 189, 248, ${lightningFlash * 0.22})`;
          ctx.fillRect(0, 0, width, height);

          // Draw Lightning Bolt
          if (currentBolt && currentBolt.length > 1) {
            ctx.save();
            ctx.shadowColor = darkMode ? "#38bdf8" : "#0284c7";
            ctx.shadowBlur = darkMode ? 25 : 18;

            // Main bolt stroke
            ctx.strokeStyle = darkMode
              ? `rgba(255, 255, 255, ${lightningFlash})`
              : `rgba(3, 105, 161, ${lightningFlash})`;
            ctx.lineWidth = darkMode ? 2.5 : 3.0;

            ctx.beginPath();
            ctx.moveTo(currentBolt[0].x, currentBolt[0].y);
            for (let i = 1; i < currentBolt.length; i++) {
              ctx.lineTo(currentBolt[i].x, currentBolt[i].y);
            }
            ctx.stroke();

            // Inner core highlight for light mode
            if (!darkMode) {
              ctx.strokeStyle = `rgba(56, 189, 248, ${lightningFlash * 0.9})`;
              ctx.lineWidth = 1.6;
              ctx.stroke();
            }

            // Branching secondary arcs
            ctx.strokeStyle = darkMode
              ? `rgba(186, 230, 253, ${lightningFlash * 0.75})`
              : `rgba(2, 132, 199, ${lightningFlash * 0.8})`;
            ctx.lineWidth = 1.3;
            for (let i = 2; i < currentBolt.length - 2; i += 2) {
              const b = currentBolt[i];
              ctx.beginPath();
              ctx.moveTo(b.x, b.y);
              ctx.lineTo(b.x + (Math.random() - 0.5) * 65, b.y + 40);
              ctx.stroke();
            }
            ctx.restore();
          }

          lightningFlash *= 0.84; // Decay flash
        } else {
          currentBolt = null;
        }
      }

      // 3. Render Sun Bokeh particles for clear skies
      if (isClear && sunParticles.length > 0) {
        sunParticles.forEach((p) => {
          ctx.fillStyle = darkMode
            ? isDay
              ? `rgba(254, 240, 138, ${p.opacity})`
              : `rgba(186, 230, 253, ${p.opacity})`
            : isDay
            ? `rgba(245, 158, 11, ${p.opacity * 0.75})`
            : `rgba(14, 116, 144, ${p.opacity * 0.7})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [weatherCode, cape, isDay, windSpeed, enabled, darkMode]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
      style={{ mixBlendMode: darkMode ? "screen" : "normal" }}
    />
  );
}
