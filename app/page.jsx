"use client";

import React from "react";
import PixelShaderCanvas from "@/components/PixelShaderCanvas";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Guestbook from "@/components/Guestbook";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import EffectPanel from "@/components/EffectPanel";

export default function Home() {
  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Background Interactive Pixel Fluid Shader */}
      <PixelShaderCanvas />

      {/* Fixed Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <div className="relative z-10">
        <Hero />
        <Projects />
        <Skills />
        <Experience />
        <Guestbook />
        <Contact />
        <Footer />
      </div>

      {/* Floating Visual Effect & Palette Control Widget */}
      <EffectPanel />
    </main>
  );
}
