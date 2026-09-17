"use client";

import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { currentPalette } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "PROJECTS", href: "#projects" },
    { label: "SKILLS", href: "#skills" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "VISITORS", href: "#guestbook" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        {/* Logo / Initials */}
        <a
          href="#"
          className="font-mono text-sm tracking-widest font-bold transition-all duration-200 hover:scale-105 flex items-center gap-1"
          style={{ color: "#ffffff" }}
        >
          <span style={{ color: currentPalette.primary }}>[</span>
          <span>SE</span>
          <span style={{ color: currentPalette.primary }}>]</span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-xs tracking-widest text-zinc-400 hover:text-white transition-colors duration-200 uppercase relative group py-1"
            >
              <span>{link.label}</span>
              <span
                className="absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: currentPalette.primary }}
              />
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-white p-2"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-xs tracking-widest text-zinc-300 hover:text-white py-2"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
