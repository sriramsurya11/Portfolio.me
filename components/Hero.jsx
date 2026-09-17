"use client";

import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { MapPin, Download } from "lucide-react";

export default function Hero() {
  const { currentPalette } = useTheme();
  const [doNothingCount, setDoNothingCount] = useState(0);
  const [doNothingMsg, setDoNothingMsg] = useState("");

  const handleDoNothing = (e) => {
    const nextCount = doNothingCount + 1;
    setDoNothingCount(nextCount);

    const messages = [
      "Task successfully not done! 😴",
      "Procrastination level +100 ✨",
      "Productivity avoided flawlessly! 🚀",
      "Still doing nothing... beautifully ☕",
      "Master of non-action unlocked 🏆",
    ];
    setDoNothingMsg(messages[(nextCount - 1) % messages.length]);

    // Small celebratory confetti burst for doing nothing
    try {
      const rect = e.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { x, y },
        colors: [currentPalette.primary, currentPalette.secondary, "#ffffff"],
        ticks: 120,
        scalar: 0.8,
      });
    } catch (err) {}

    setTimeout(() => {
      setDoNothingMsg("");
    }, 2500);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-start px-6 sm:px-12 md:px-20 lg:px-32 pt-28 pb-20">
      <div className="max-w-4xl w-full">
        {/* Status indicator tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-xs font-mono mb-6 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentPalette.primary }} />
          <span className="text-zinc-300">Available for Software Engineer Roles</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Chennai, India
          </span>
        </motion.div>

        {/* Animated Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-1 mb-8"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight font-sans select-none leading-none">
            <span className="text-white drop-shadow-md block">Sriram</span>
            <span
              className="block transition-colors duration-500 text-glow"
              style={{
                color: currentPalette.primary,
                textShadow: `0 0 35px ${currentPalette.glow}`,
              }}
            >
              E
            </span>
          </h1>
        </motion.div>

        {/* Bio / Description matching Resume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="space-y-3 mb-10 text-base sm:text-lg text-zinc-300 font-sans max-w-2xl leading-relaxed"
        >
          <p className="font-semibold text-white">
            Software Engineer / Full Stack Developer
          </p>
          <p className="text-zinc-400 text-sm sm:text-base">
            Hands-on experience in Java, Spring Boot, Node.js, Express.js, React.js, MongoDB,
            MySQL, REST APIs, and JWT Authentication. Passionate about architecting scalable
            backend systems and solving complex DSA challenges.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="flex flex-wrap items-center gap-4 relative"
        >
          {/* DO NOTHING Button */}
          <button
            onClick={handleDoNothing}
            className="px-6 py-3 rounded-none font-mono text-xs tracking-wider font-bold transition-all duration-300 uppercase shadow-lg active:scale-95 cursor-pointer"
            style={{
              backgroundColor: currentPalette.primary,
              color: "#080808",
              boxShadow: `0 0 20px ${currentPalette.glow}`,
            }}
          >
            DO NOTHING
          </button>

          {/* RESUME DOWNLOAD Button */}
          <a
            href="/resume.pdf"
            download="Sriram_E_Resume.pdf"
            className="px-6 py-3 rounded-none font-mono text-xs tracking-wider text-white border border-zinc-800/90 bg-black/40 backdrop-blur-sm hover:border-white/40 hover:bg-white/5 transition-all duration-300 uppercase flex items-center gap-2 group"
          >
            <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            RESUME
          </a>

          {/* CONTACT Button */}
          <a
            href="#contact"
            className="px-6 py-3 rounded-none font-mono text-xs tracking-wider text-white border border-zinc-800/90 bg-black/40 backdrop-blur-sm hover:border-white/40 hover:bg-white/5 transition-all duration-300 uppercase"
          >
            CONTACT
          </a>

          {/* Easter egg message notification */}
          {doNothingMsg && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-mono py-1 px-3 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300"
              style={{ borderColor: currentPalette.primary }}
            >
              {doNothingMsg} {doNothingCount > 1 && `(${doNothingCount}x)`}
            </motion.span>
          )}
        </motion.div>
      </div>
    </section>
  );
}
