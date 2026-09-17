"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";

export default function Skills() {
  const { currentPalette } = useTheme();

  const skillCategories = [
    {
      title: "Backend & Systems",
      skills: [
        "Java",
        "Spring Boot",
        "Spring Data JPA",
        "REST APIs",
        "Node.js",
        "Express.js",
        "JWT Authentication",
        "Microservices",
        "Bcrypt Hashing",
      ],
    },
    {
      title: "Frontend Development",
      skills: [
        "React.js",
        "JavaScript (ES6+)",
        "HTML5 / CSS3",
        "Responsive Web Design",
        "Tailwind CSS",
        "React Hooks",
        "Component Architecture",
      ],
    },
    {
      title: "Databases & Storage",
      skills: [
        "MySQL",
        "MongoDB",
        "Oracle SQL",
        "Database Indexing",
        "Schema Design",
        "Data Modeling",
      ],
    },
    {
      title: "Tools & Platforms",
      skills: [
        "Git",
        "GitHub",
        "Postman",
        "VS Code",
        "Linux / WSL",
        "NPM / Node Tools",
      ],
    },
    {
      title: "Core Engineering Concepts",
      skills: [
        "Data Structures & Algorithms",
        "200+ LeetCode Solved",
        "Object-Oriented Programming (OOP)",
        "API Architecture",
        "DBMS Principles",
        "Problem Solving",
      ],
    },
  ];

  return (
    <section id="skills" className="relative py-20 px-6 sm:px-12 md:px-20 lg:px-32">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <span
            className="font-mono text-xs tracking-widest uppercase transition-colors"
            style={{ color: currentPalette.primary }}
          >
            // SKILLS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 font-sans tracking-tight">
            Technical Stack
          </h2>
        </div>

        {/* Minimal Direct Layout (No Heavy Frosted Cards) */}
        <div className="space-y-10">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="border-b border-white/5 pb-8 last:border-b-0"
            >
              <h3 className="font-mono text-xs tracking-widest text-zinc-400 uppercase mb-4 flex items-center gap-2">
                <span style={{ color: currentPalette.primary }}>—</span>
                <span>{cat.title}</span>
              </h3>

              {/* Sharp Rectangular Pills */}
              <div className="flex flex-wrap gap-2.5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 rounded-none text-xs font-mono border border-white/10 bg-black/50 text-zinc-200 hover:text-white hover:border-white/40 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
