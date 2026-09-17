"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { INITIAL_DOODLES } from "@/lib/initialDoodles";
import ScribbleModal from "./ScribbleModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export default function Guestbook() {
  const { currentPalette } = useTheme();
  const [doodles, setDoodles] = useState(INITIAL_DOODLES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDoodle, setActiveDoodle] = useState(null);

  // Fetch live doodles on mount
  useEffect(() => {
    async function loadDoodles() {
      try {
        const res = await fetch("/api/doodles");
        if (res.ok) {
          const data = await res.json();
          if (data && data.doodles && data.doodles.length > 0) {
            // Merge custom doodles with initials
            setDoodles(data.doodles);
          }
        }
      } catch (err) {
        console.warn("Using local doodles fallback:", err);
      }
    }
    loadDoodles();
  }, []);

  const handleDoodleSubmitted = (newDoodle) => {
    setDoodles((prev) => [newDoodle, ...prev]);
  };

  return (
    <section id="guestbook" className="relative py-24 px-6 sm:px-12 md:px-20 lg:px-32">
      <div className="max-w-6xl mx-auto">
        {/* Section Header & ADD A NOTE Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-zinc-900">
          <div>
            <span
              className="font-mono text-xs tracking-widest uppercase transition-colors"
              style={{ color: currentPalette.primary }}
            >
              // GUESTBOOK
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-sans tracking-tight">
              Visitors' Scribbles
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Doodles left behind by people who passed through.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto px-5 py-2.5 rounded font-mono text-xs tracking-wider uppercase font-bold text-white border border-zinc-800 bg-black/60 hover:bg-white/10 transition-all duration-300 flex items-center gap-2 shadow-lg active:scale-95"
            style={{
              borderColor: currentPalette.primary,
              boxShadow: `0 0 15px ${currentPalette.glow}`,
            }}
          >
            <Plus className="w-3.5 h-3.5" style={{ color: currentPalette.primary }} />
            <span>ADD A NOTE</span>
          </button>
        </div>

        {/* Doodles Cards Showcase (Horizontal / Grid Display) */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1">
            {doodles.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setActiveDoodle(item)}
                className="group cursor-pointer flex flex-col"
              >
                {/* White Doodle Canvas Card */}
                <div className="relative aspect-square w-full rounded bg-[#f0f0f4] p-3 flex items-center justify-center overflow-hidden border border-zinc-800/80 group-hover:border-zinc-400 group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.drawing}
                    alt={`Doodle by ${item.author}`}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    loading="lazy"
                  />
                  {item.note && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3 text-center">
                      <p className="font-mono text-xs text-white line-clamp-3">
                        &ldquo;{item.note}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Author Name Tag */}
                <div className="mt-2.5 flex items-center justify-between">
                  <span
                    className="font-mono text-xs truncate transition-colors"
                    style={{ color: currentPalette.text }}
                  >
                    {item.author}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scribble Drawing Modal */}
      <ScribbleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDoodleSubmitted={handleDoodleSubmitted}
      />

      {/* Detail Inspection Modal for clicked doodle */}
      <AnimatePresence>
        {activeDoodle && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveDoodle(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f15] border border-zinc-800 rounded-lg p-5 max-w-sm w-full text-center shadow-2xl"
              style={{ borderColor: currentPalette.primary }}
            >
              <div className="aspect-square bg-[#f0f0f4] rounded p-4 mb-4 flex items-center justify-center border border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeDoodle.drawing}
                  alt={`Doodle by ${activeDoodle.author}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3
                className="font-mono text-base font-bold"
                style={{ color: currentPalette.primary }}
              >
                {activeDoodle.author}
              </h3>
              {activeDoodle.note && (
                <p className="text-xs text-zinc-300 font-mono mt-1">
                  &ldquo;{activeDoodle.note}&rdquo;
                </p>
              )}
              <button
                onClick={() => setActiveDoodle(null)}
                className="mt-4 px-4 py-1.5 rounded text-xs font-mono uppercase bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              >
                CLOSE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
