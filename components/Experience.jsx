"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";

export default function Experience() {
  const { currentPalette } = useTheme();

  return (
    <section id="experience" className="relative py-20 px-6 sm:px-12 md:px-20 lg:px-32">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <span
            className="font-mono text-xs tracking-widest uppercase transition-colors"
            style={{ color: currentPalette.primary }}
          >
            // EXPERIENCE & EDUCATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 font-sans tracking-tight">
            Background & Milestones
          </h2>
        </div>

        {/* Clean Direct Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="font-mono text-xs tracking-widest text-zinc-400 uppercase mb-6 flex items-center gap-2">
              <span style={{ color: currentPalette.primary }}>—</span>
              <span>Work Experience</span>
            </h3>

            <div className="border-l-2 border-white/10 pl-6 space-y-6 relative">
              <div className="relative">
                <div
                  className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-none"
                  style={{ backgroundColor: currentPalette.primary }}
                />

                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <h4 className="text-lg font-bold text-white">
                    Web Development Intern
                  </h4>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-none bg-black/60 text-zinc-300 border border-white/10">
                    2024
                  </span>
                </div>

                <p
                  className="text-xs font-mono mb-3"
                  style={{ color: currentPalette.text }}
                >
                  Connect Infosystems, Chennai
                </p>

                <ul className="space-y-2 text-xs text-zinc-300 leading-relaxed list-disc list-inside">
                  <li>
                    Completed Full Stack Web Development internship, gaining hands-on
                    experience with React.js, HTML5, CSS3, and JavaScript.
                  </li>
                  <li>
                    Built responsive web interfaces, interactive UI components, forms, and
                    integrated client-server web architecture.
                  </li>
                  <li>
                    Implemented component-based architectures using modern React Hooks
                    (useState, useEffect).
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Education & Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="font-mono text-xs tracking-widest text-zinc-400 uppercase mb-6 flex items-center gap-2">
              <span style={{ color: currentPalette.primary }}>—</span>
              <span>Education & Honors</span>
            </h3>

            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-base font-bold text-white">
                    B.E. Computer Science and Engineering
                  </h4>
                  <span className="text-xs font-mono text-zinc-400">2023 – 2027</span>
                </div>
                <p className="text-xs text-zinc-400">Saveetha Engineering College</p>
                <p
                  className="text-xs font-mono font-semibold mt-1"
                  style={{ color: currentPalette.primary }}
                >
                  CGPA: 8.45 / 10
                </p>
              </div>

              <div className="border-b border-white/10 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-base font-bold text-white">
                    Higher Secondary Certificate (HSC)
                  </h4>
                  <span className="text-xs font-mono text-zinc-400">2023</span>
                </div>
                <p className="text-xs text-zinc-400">
                  St. Joseph Matriculation Higher Secondary School, Villupuram
                </p>
                <p
                  className="text-xs font-mono font-semibold mt-1"
                  style={{ color: currentPalette.primary }}
                >
                  Score: 94%
                </p>
              </div>

              {/* Badges */}
              <div className="pt-2">
                <p className="font-mono text-xs uppercase text-zinc-400 mb-3">
                  Certifications & Algorithms
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-none text-xs font-mono border border-white/10 bg-black/40 text-zinc-200">
                    200+ LeetCode Solved (Java)
                  </span>
                  <span className="px-3 py-1 rounded-none text-xs font-mono border border-white/10 bg-black/40 text-zinc-200">
                    Oracle Database SQL Certified
                  </span>
                  <span className="px-3 py-1 rounded-none text-xs font-mono border border-white/10 bg-black/40 text-zinc-200">
                    Mastering Java + SpringBoot
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
