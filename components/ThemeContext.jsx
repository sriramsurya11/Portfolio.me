"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PALETTES } from "@/lib/palettes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Default to the Crimson Red palette shown in screenshots 2, 3, 4, or Toxic Green in screenshot 1
  const [currentPalette, setCurrentPalette] = useState(PALETTES[0]);
  const [pixelSize, setPixelSize] = useState(7); // User mentioned pixel size 7
  const [depth, setDepth] = useState(0.30);
  const [speed, setSpeed] = useState(0.04);
  const [colorLevels, setColorLevels] = useState(4);
  const [animate, setAnimate] = useState(true);
  const [isEffectPanelOpen, setIsEffectPanelOpen] = useState(false);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPaletteId = localStorage.getItem("portfolio_palette_id");
      if (savedPaletteId) {
        const found = PALETTES.find((p) => p.id === savedPaletteId);
        if (found) setCurrentPalette(found);
      }

      const savedPixelSize = localStorage.getItem("portfolio_pixel_size");
      if (savedPixelSize) setPixelSize(Number(savedPixelSize));

      const savedDepth = localStorage.getItem("portfolio_depth");
      if (savedDepth) setDepth(Number(savedDepth));

      const savedSpeed = localStorage.getItem("portfolio_speed");
      if (savedSpeed) setSpeed(Number(savedSpeed));

      const savedColorLevels = localStorage.getItem("portfolio_color_levels");
      if (savedColorLevels) setColorLevels(Number(savedColorLevels));

      const savedAnimate = localStorage.getItem("portfolio_animate");
      if (savedAnimate !== null) setAnimate(savedAnimate === "true");
    } catch (e) {
      console.error("Failed to load theme preferences:", e);
    }
  }, []);

  // Update CSS root variables when palette changes
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--accent-color", currentPalette.primary);
    root.style.setProperty("--accent-secondary", currentPalette.secondary);
    root.style.setProperty("--accent-dark", currentPalette.dark);
    root.style.setProperty("--accent-glow", currentPalette.glow);
    root.style.setProperty("--accent-text", currentPalette.text);

    try {
      localStorage.setItem("portfolio_palette_id", currentPalette.id);
    } catch (e) {}
  }, [currentPalette]);

  const updatePixelSize = (val) => {
    setPixelSize(val);
    try {
      localStorage.setItem("portfolio_pixel_size", val.toString());
    } catch (e) {}
  };

  const updateDepth = (val) => {
    setDepth(val);
    try {
      localStorage.setItem("portfolio_depth", val.toString());
    } catch (e) {}
  };

  const updateSpeed = (val) => {
    setSpeed(val);
    try {
      localStorage.setItem("portfolio_speed", val.toString());
    } catch (e) {}
  };

  const updateColorLevels = (val) => {
    setColorLevels(val);
    try {
      localStorage.setItem("portfolio_color_levels", val.toString());
    } catch (e) {}
  };

  const updateAnimate = (val) => {
    setAnimate(val);
    try {
      localStorage.setItem("portfolio_animate", val.toString());
    } catch (e) {}
  };

  return (
    <ThemeContext.Provider
      value={{
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
        palettes: PALETTES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
