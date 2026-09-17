"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function Projects() {
  const { currentPalette } = useTheme();

  const projects = [
    {
      title: "Course Selling Application",
      category: "Full Stack Platform",
      description:
        "Full-stack course marketplace with separate user and admin portals, JWT authentication, role-based access control, password hashing with bcrypt, and complete course management.",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "REST APIs"],
      features: [
        "User registration, login, and course browsing/purchasing",
        "Role-based authorization & protected routes",
        "Admin interface for course creation, pricing & student analytics",
        "Responsive, high-performance React UI",
      ],
      github: "https://github.com/sriramsurya11/course_selling_app",
      demo: null,
    },
    {
      title: "Workflow Orchestration Platform",
      category: "Backend & Systems",
      description:
        "High-throughput workflow orchestration engine designed to resolve complex task dependencies, monitor executions in real-time, and optimize DAG workflows with scalable microservice architecture.",
      tags: ["Java", "Spring Boot", "Spring Data JPA", "REST APIs", "MySQL", "OOP"],
      features: [
        "Modular RESTful APIs for workflow creation & execution",
        "DAG-based dependency resolution and execution tracking",
        "Robust database integration and relational schema design",
        "Optimized data structures for fast queue scheduling",
      ],
      github: "https://github.com/sriramsurya11/workflow-Frontend_inital",
      demo: "https://sriflow-dev.vercel.app/",
    },
  ];

  return (
    <section id="projects" className="relative py-20 px-6 sm:px-12 md:px-20 lg:px-32">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <span
            className="font-mono text-xs tracking-widest uppercase transition-colors"
            style={{ color: currentPalette.primary }}
          >
            // FEATURED PROJECTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 font-sans tracking-tight">
            Crafted Software & Systems
          </h2>
        </div>

        {/* Clean Direct Layout */}
        <div className="space-y-12">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="border-b border-white/10 pb-10 last:border-b-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span
                  className="font-mono text-xs uppercase tracking-wider font-semibold"
                  style={{ color: currentPalette.primary }}
                >
                  {proj.category}
                </span>

                {/* Links: LIVE DEMO + SOURCE CODE */}
                <div className="flex items-center gap-2 flex-wrap">
                  {proj.demo && (
                    <a
                      href={proj.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-black bg-white hover:bg-zinc-200 transition-all cursor-pointer shadow-sm active:scale-95"
                      style={{
                        backgroundColor: currentPalette.primary,
                        color: "#080808",
                      }}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>LIVE DEMO</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-200 hover:text-white border border-white/15 bg-black/60 hover:border-white/50 hover:bg-white/10 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span className="font-bold">SOURCE CODE</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>
              </div>

              {/* Clickable Project Title */}
              <a
                href={proj.demo || proj.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <h3 className="text-2xl font-bold text-white font-sans mb-3 group-hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                  <span>{proj.title}</span>
                </h3>
              </a>

              <p className="text-zinc-400 text-sm leading-relaxed mb-5 max-w-3xl">
                {proj.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-xs text-zinc-300 font-sans">
                {proj.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-none flex-shrink-0"
                      style={{ backgroundColor: currentPalette.primary }}
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Sharp Rectangular Tech Tags */}
              <div className="flex flex-wrap gap-2">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-none text-xs font-mono border border-white/10 bg-black/40 text-zinc-300"
                  >
                    {tag}
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
