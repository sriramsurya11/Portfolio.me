"use client";

import React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function EffectPanel() {
  const {
    currentPalette,
    setCurrentPalette,
    pixelSize,
    updatePixelSize,
    depth,
    updateDepth,
    speed,
    updateSpeed,
    colorLevels,
    updateColorLevels,
    animate,
    updateAnimate,
    isEffectPanelOpen,
    setIsEffectPanelOpen,
    palettes,
  } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popover Settings Panel */}
      <AnimatePresence>
        {isEffectPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mb-3 w-80 sm:w-96 rounded-lg border border-zinc-800/80 bg-[#0c0c10]/95 backdrop-blur-xl p-5 shadow-2xl text-zinc-300 font-terminal text-xs"
            style={{
              borderColor: "rgba(255, 255, 255, 0.08)",
              boxShadow: `0 20px 40px -15px rgba(0,0,0,0.8), 0 0 25px ${currentPalette.glow}`,
            }}
          >
            {/* Header / PALETTE */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 font-mono tracking-wider text-[11px]">
                // PALETTE
              </span>
              <button
                onClick={() => setIsEffectPanelOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors p-1"
                aria-label="Close Effect Panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Palettes Grid (10 Swatches) */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {palettes.map((p) => {
                const isSelected = currentPalette.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCurrentPalette(p)}
                    title={p.name}
                    aria-label={`Select ${p.name} palette`}
                    className={`group relative h-7 rounded overflow-hidden border transition-all flex ${
                      isSelected
                        ? "border-white scale-105 shadow-md ring-1 ring-white/50"
                        : "border-zinc-800 hover:border-zinc-500"
                    }`}
                  >
                    <div
                      className="w-1/2 h-full"
                      style={{ backgroundColor: p.swatch[0] }}
                    />
                    <div
                      className="w-1/2 h-full"
                      style={{ backgroundColor: p.swatch[1] }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-zinc-800/80 mb-5" />

            {/* Header / EFFECT */}
            <div className="mb-4">
              <span className="text-zinc-400 font-mono tracking-wider text-[11px]">
                // EFFECT
              </span>
            </div>

            {/* Sliders & Controls */}
            <div className="space-y-4">
              {/* Pixel size */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <label htmlFor="effect-pixel-size" className="text-zinc-400 cursor-pointer">
                    Pixel size
                  </label>
                  <span className="text-zinc-300 font-mono">{pixelSize}px</span>
                </div>
                <input
                  id="effect-pixel-size"
                  name="pixelSize"
                  aria-label="Pixel size"
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={pixelSize}
                  onChange={(e) => updatePixelSize(Number(e.target.value))}
                  className="w-full"
                  style={{
                    accentColor: currentPalette.primary,
                  }}
                />
              </div>

              {/* Depth */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <label htmlFor="effect-depth" className="text-zinc-400 cursor-pointer">
                    Depth
                  </label>
                  <span className="text-zinc-300 font-mono">
                    {depth.toFixed(2)}
                  </span>
                </div>
                <input
                  id="effect-depth"
                  name="depth"
                  aria-label="Depth"
                  type="range"
                  min="0.00"
                  max="1.00"
                  step="0.01"
                  value={depth}
                  onChange={(e) => updateDepth(Number(e.target.value))}
                  className="w-full"
                  style={{
                    accentColor: currentPalette.primary,
                  }}
                />
              </div>

              {/* Speed */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <label htmlFor="effect-speed" className="text-zinc-400 cursor-pointer">
                    Speed
                  </label>
                  <span className="text-zinc-300 font-mono">
                    {speed.toFixed(2)}
                  </span>
                </div>
                <input
                  id="effect-speed"
                  name="speed"
                  aria-label="Speed"
                  type="range"
                  min="0.00"
                  max="0.20"
                  step="0.01"
                  value={speed}
                  onChange={(e) => updateSpeed(Number(e.target.value))}
                  className="w-full"
                  style={{
                    accentColor: currentPalette.primary,
                  }}
                />
              </div>

              {/* Color levels */}
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <label htmlFor="effect-color-levels" className="text-zinc-400 cursor-pointer">
                    Color levels
                  </label>
                  <span className="text-zinc-300 font-mono">{colorLevels}</span>
                </div>
                <input
                  id="effect-color-levels"
                  name="colorLevels"
                  aria-label="Color levels"
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={colorLevels}
                  onChange={(e) => updateColorLevels(Number(e.target.value))}
                  className="w-full"
                  style={{
                    accentColor: currentPalette.primary,
                  }}
                />
              </div>

              {/* Animate Switch */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-zinc-400 text-[11px]">Animate</span>
                <button
                  type="button"
                  aria-label="Toggle continuous background animation"
                  onClick={() => updateAnimate(!animate)}
                  className={`switch-toggle ${animate ? "active" : ""}`}
                  style={{
                    backgroundColor: animate
                      ? currentPalette.primary
                      : "#27272a",
                  }}
                >
                  <div className="switch-thumb" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsEffectPanelOpen(!isEffectPanelOpen)}
          className="w-10 h-10 rounded border border-zinc-800 bg-[#0c0c10]/90 backdrop-blur-md flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            borderColor: isEffectPanelOpen ? currentPalette.primary : "rgba(255, 255, 255, 0.15)",
            boxShadow: isEffectPanelOpen
              ? `0 0 15px ${currentPalette.glow}`
              : "0 4px 20px rgba(0,0,0,0.5)",
          }}
          aria-label="Toggle Shader & Color Effects"
        >
          <SlidersHorizontal
            className="w-4 h-4 transition-colors"
            style={{
              color: isEffectPanelOpen ? currentPalette.primary : "currentColor",
            }}
          />
        </button>
      </div>
    </div>
  );
}
