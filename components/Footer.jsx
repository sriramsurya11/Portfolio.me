"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { Terminal } from "lucide-react";

export default function Footer() {
  const { currentPalette } = useTheme();

  return (
    <footer className="border-t border-zinc-900 bg-black/60 backdrop-blur-md py-10 px-6 sm:px-12 md:px-20 lg:px-32 text-zinc-500 font-mono text-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Terminal Path */}
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span style={{ color: currentPalette.primary }}>/home/sriram</span>
          <span className="text-zinc-600">~</span>
        </div>

        {/* Copyright & Info */}
        <div className="text-center sm:text-right text-zinc-400 text-[11px]">
          &copy; {new Date().getFullYear()} Sriram Elangovan. Built with JavaScript, React &amp; Canvas Shaders.
        </div>
      </div>
    </footer>
  );
}
