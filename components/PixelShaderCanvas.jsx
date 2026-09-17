"use client";

import React, { useRef, useEffect } from "react";
import { useTheme } from "./ThemeContext";

// Helper to convert hex to normalized RGB array [0..1]
function hexToRgbNorm(hex) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_mouse_active;
uniform float u_time;
uniform float u_pixel_size;
uniform float u_depth;
uniform float u_speed;
uniform float u_color_levels;

uniform vec3 u_color0;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;

// Bayer 4x4 matrix values normalized for retro dithering
float bayer4(vec2 p) {
  vec2 m = mod(p, 4.0);
  int x = int(m.x);
  int y = int(m.y);
  float val = 0.0;
  if (y == 0) {
    if (x == 0) val = 0.0; else if (x == 1) val = 8.0; else if (x == 2) val = 2.0; else val = 10.0;
  } else if (y == 1) {
    if (x == 0) val = 12.0; else if (x == 1) val = 4.0; else if (x == 2) val = 14.0; else val = 6.0;
  } else if (y == 2) {
    if (x == 0) val = 3.0; else if (x == 1) val = 11.0; else if (x == 2) val = 1.0; else val = 9.0;
  } else {
    if (x == 0) val = 15.0; else if (x == 1) val = 7.0; else if (x == 2) val = 13.0; else val = 5.0;
  }
  return val / 16.0 - 0.5;
}

// Pseudo random hash
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Organic 2D Value/Simplex noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Multi-octave continuous fluid FBM
float fbm(vec2 p, float t) {
  float v = 0.0;
  // Ambient continuous roaming flow
  v += 0.500 * noise(p + vec2(t * 0.35, t * 0.22));
  v += 0.250 * noise(p * 2.02 - vec2(t * 0.25, t * 0.35));
  v += 0.125 * noise(p * 4.04 + vec2(t * 0.45, -t * 0.3));
  return v;
}

vec3 getPaletteColor(float t) {
  t = clamp(t, 0.0, 1.0);
  float seg = t * 5.0;
  float idx = floor(seg);
  float f = fract(seg);
  
  if (idx < 1.0) return mix(u_color0, u_color1, f);
  if (idx < 2.0) return mix(u_color1, u_color2, f);
  if (idx < 3.0) return mix(u_color2, u_color3, f);
  if (idx < 4.0) return mix(u_color3, u_color4, f);
  return mix(u_color4, u_color5, f);
}

void main() {
  vec2 pixelCoord = gl_FragCoord.xy;
  
  // Apply pixelation block step
  float pStep = max(1.0, u_pixel_size);
  vec2 pixelBlock = floor(pixelCoord / pStep) * pStep;

  // Normalized UV coordinates
  vec2 uv = pixelBlock / u_resolution.xy;
  uv.y = 1.0 - uv.y;
  
  float aspect = u_resolution.x / u_resolution.y;
  vec2 st = uv;
  st.x *= aspect;

  // Continuous background animation time
  float t = u_time * 0.6;
  float n = fbm(st * (2.0 + u_depth * 1.5), t);

  // Fine grain noise overlay
  float grain = (hash(pixelBlock + vec2(u_time * 8.0)) - 0.5) * 0.07 * u_depth;
  
  // Bayer dithering matrix offset
  float dither = bayer4(gl_FragCoord.xy / pStep) * 0.12;

  // Final intensity value
  float intensity = clamp(n + grain + dither, 0.0, 1.0);

  // Optional quantization according to color levels
  if (u_color_levels > 1.0) {
    intensity = floor(intensity * u_color_levels) / (u_color_levels - 1.0);
    intensity = clamp(intensity, 0.0, 1.0);
  }

  // Map to palette
  vec3 color = getPaletteColor(intensity);

  // Subtle dark shadow/vignette spotlight under mouse cursor (NO bright white/glow)
  if (u_mouse_active > 0.5) {
    vec2 toMouse = pixelBlock - u_mouse;
    float dist = length(toMouse);
    float radius = 130.0;
    
    if (dist < radius) {
      float norm = dist / radius; // 0 at center, 1 at edge
      // Smooth dark shadow curve: darker at center (0.45), blending softly back to 1.0 at edge
      float shadow = smoothstep(0.0, 1.0, norm) * 0.55 + 0.45;
      color *= shadow;
    }
  }

  // Overall subtle screen vignette for contrast
  vec2 vigUV = gl_FragCoord.xy / u_resolution.xy;
  float vig = vigUV.x * vigUV.y * (1.0 - vigUV.x) * (1.0 - vigUV.y);
  float vignette = clamp(16.0 * vig * 0.5 + 0.35, 0.0, 1.0);
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function PixelShaderCanvas() {
  const canvasRef = useRef(null);
  const { currentPalette, pixelSize, depth, speed, colorLevels, animate } = useTheme();

  const glRef = useRef(null);
  const programRef = useRef(null);
  const uniformsRef = useRef({});
  const animFrameRef = useRef(null);
  const timeRef = useRef(0);

  // Synchronous Zero-Latency Mouse Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const gl = glRef.current;
      const uLocs = uniformsRef.current;
      if (!gl || !uLocs || !uLocs.u_mouse) return;

      const dpr = window.devicePixelRatio || 1;
      const x = e.clientX * dpr;
      const y = (window.innerHeight - e.clientY) * dpr;

      // Update shader uniforms synchronously on mousemove (0ms lag)
      gl.useProgram(programRef.current);
      gl.uniform2f(uLocs.u_mouse, x, y);
      gl.uniform1f(uLocs.u_mouse_active, 1.0);
    };

    const handleMouseLeave = () => {
      const gl = glRef.current;
      const uLocs = uniformsRef.current;
      if (!gl || !uLocs || !uLocs.u_mouse_active) return;
      gl.useProgram(programRef.current);
      gl.uniform1f(uLocs.u_mouse_active, 0.0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Initialize WebGL Context and compile shaders
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: false, antialias: false, depth: false }) ||
      canvas.getContext("experimental-webgl");
    if (!gl) {
      console.warn("WebGL not supported, rendering fallback.");
      return;
    }

    glRef.current = gl;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link failed:", gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Quad geometry (Full Screen 2D Quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    uniformsRef.current = {
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_mouse: gl.getUniformLocation(program, "u_mouse"),
      u_mouse_active: gl.getUniformLocation(program, "u_mouse_active"),
      u_time: gl.getUniformLocation(program, "u_time"),
      u_pixel_size: gl.getUniformLocation(program, "u_pixel_size"),
      u_depth: gl.getUniformLocation(program, "u_depth"),
      u_speed: gl.getUniformLocation(program, "u_speed"),
      u_color_levels: gl.getUniformLocation(program, "u_color_levels"),
      u_color0: gl.getUniformLocation(program, "u_color0"),
      u_color1: gl.getUniformLocation(program, "u_color1"),
      u_color2: gl.getUniformLocation(program, "u_color2"),
      u_color3: gl.getUniformLocation(program, "u_color3"),
      u_color4: gl.getUniformLocation(program, "u_color4"),
      u_color5: gl.getUniformLocation(program, "u_color5"),
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.useProgram(program);
      gl.uniform2f(uniformsRef.current.u_resolution, w, h);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Update uniform values & Continuous Render Loop
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const uLocs = uniformsRef.current;
    if (!gl || !program || !uLocs) return;

    gl.useProgram(program);

    // Set Palette Uniform Colors
    const paletteList = currentPalette.bgColors || [
      "#030712",
      "#0b1528",
      "#172554",
      "#1e3a8a",
      "#2563eb",
      "#60a5fa",
    ];

    const c0 = hexToRgbNorm(paletteList[0] || "#030712");
    const c1 = hexToRgbNorm(paletteList[1] || "#0b1528");
    const c2 = hexToRgbNorm(paletteList[2] || "#172554");
    const c3 = hexToRgbNorm(paletteList[3] || "#1e3a8a");
    const c4 = hexToRgbNorm(paletteList[4] || "#2563eb");
    const c5 = hexToRgbNorm(paletteList[5] || "#60a5fa");

    gl.uniform3f(uLocs.u_color0, c0[0], c0[1], c0[2]);
    gl.uniform3f(uLocs.u_color1, c1[0], c1[1], c1[2]);
    gl.uniform3f(uLocs.u_color2, c2[0], c2[1], c2[2]);
    gl.uniform3f(uLocs.u_color3, c3[0], c3[1], c3[2]);
    gl.uniform3f(uLocs.u_color4, c4[0], c4[1], c4[2]);
    gl.uniform3f(uLocs.u_color5, c5[0], c5[1], c5[2]);

    gl.uniform1f(uLocs.u_pixel_size, (pixelSize || 6.0) * (window.devicePixelRatio || 1));
    gl.uniform1f(uLocs.u_depth, depth ?? 0.30);
    gl.uniform1f(uLocs.u_speed, speed ?? 0.04);
    gl.uniform1f(uLocs.u_color_levels, colorLevels || 4.0);

    // Continuous autonomous animation render loop
    const currentSpeed = speed !== undefined ? speed : 0.04;
    const render = () => {
      if (animate) {
        // Continuous roaming motion scaled directly by the Speed control in the UI panel
        timeRef.current += (currentSpeed * 22.0 + 0.25) * 0.016;
      }

      gl.useProgram(program);
      gl.uniform1f(uLocs.u_time, timeRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentPalette, pixelSize, depth, speed, colorLevels, animate]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{
          filter: "brightness(0.96) contrast(1.15)",
        }}
      />
    </div>
  );
}
