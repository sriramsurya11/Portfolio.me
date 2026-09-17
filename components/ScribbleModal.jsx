"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Pen, Eraser, RotateCcw, RotateCw, Trash2 } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { motion } from "framer-motion";

const DRAWING_COLORS = [
  "#18181b", // Charcoal Black
  "#854d0e", // Brown
  "#06b6d4", // Cyan
  "#eab308", // Yellow
  "#f97316", // Orange
  "#ec4899", // Pink
  "#a855f7", // Purple
];

export default function ScribbleModal({ isOpen, onClose, onDoodleSubmitted }) {
  const { currentPalette } = useTheme();

  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(DRAWING_COLORS[0]);
  const [brushSize, setBrushSize] = useState(20);
  const [tool, setTool] = useState("pen"); // 'pen' | 'eraser'
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [authorName, setAuthorName] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_NOTE_LENGTH = 40;

  // Initialize and clear canvas when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Ensure crisp display on high-dpi displays
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Fill with light canvas background
      ctx.fillStyle = "#f0f0f4";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Save initial blank state to history
      const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialSnapshot]);
      setHistoryIndex(0);
      setErrorMessage("");
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#f0f0f4";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveToHistory();
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === "eraser" ? "#f0f0f4" : selectedColor;

    // Draw single dot if click without moving
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.closePath();
    saveToHistory();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setErrorMessage("Please enter your name!");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const dataUrl = canvas.toDataURL("image/png");

      const newDoodle = {
        id: "doodle-" + Date.now(),
        author: authorName.trim(),
        note: note.trim(),
        drawing: dataUrl,
        createdAt: new Date().toISOString(),
      };

      // Call API route
      const response = await fetch("/api/doodles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoodle),
      });

      if (!response.ok) {
        throw new Error("Failed to save doodle to server");
      }

      const result = await response.json();
      onDoodleSubmitted(result.doodle || newDoodle);

      // Reset fields
      setAuthorName("");
      setNote("");
      onClose();
    } catch (err) {
      console.warn("API save error, saving locally fallback:", err);
      // Fallback local save if network is offline or no backend
      const fallbackDoodle = {
        id: "doodle-" + Date.now(),
        author: authorName.trim(),
        note: note.trim(),
        drawing: canvas.toDataURL("image/png"),
        createdAt: new Date().toISOString(),
      };
      onDoodleSubmitted(fallbackDoodle);
      setAuthorName("");
      setNote("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-[440px] rounded-lg border border-zinc-800 bg-[#0f0f15] shadow-2xl p-4 sm:p-5 font-terminal text-zinc-300 relative"
        style={{
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 30px ${currentPalette.glow}`,
        }}
      >
        {/* Top Controls: Palette Colors & Tool Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* 7 Color Swatches */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {DRAWING_COLORS.map((c) => {
              const isSelected = tool === "pen" && selectedColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedColor(c);
                    setTool("pen");
                  }}
                  className={`w-6 h-6 rounded-sm border transition-all ${
                    isSelected
                      ? "border-white ring-2 ring-white/60 scale-110"
                      : "border-zinc-700 hover:border-zinc-400"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              );
            })}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded border border-zinc-800">
            {/* Pen */}
            <button
              type="button"
              onClick={() => setTool("pen")}
              className={`p-1.5 rounded transition-colors ${
                tool === "pen"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Pen Tool"
              aria-label="Pen Tool"
            >
              <Pen className="w-3.5 h-3.5" />
            </button>

            {/* Eraser */}
            <button
              type="button"
              onClick={() => setTool("eraser")}
              className={`p-1.5 rounded transition-colors ${
                tool === "eraser"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Eraser Tool"
              aria-label="Eraser Tool"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>

            {/* Undo */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
              title="Undo"
              aria-label="Undo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Redo */}
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
              title="Redo"
              aria-label="Redo"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Clear / Trash */}
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded text-zinc-400 hover:text-red-400"
              title="Clear Canvas"
              aria-label="Clear Canvas"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Brush Size Slider */}
        <div className="flex items-center justify-between gap-3 text-xs mb-3 text-zinc-400">
          <label htmlFor="brush-size-slider" className="cursor-pointer">
            Size
          </label>
          <input
            id="brush-size-slider"
            name="brushSize"
            aria-label="Brush size"
            type="range"
            min="2"
            max="40"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="flex-1"
            style={{ accentColor: currentPalette.primary }}
          />
          <span className="w-6 text-right font-mono text-zinc-300">{brushSize}</span>
        </div>

        {/* Drawing Board Canvas */}
        <div className="relative w-full aspect-square bg-[#f0f0f4] rounded overflow-hidden border border-zinc-700 mb-3 shadow-inner cursor-crosshair">
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Form Inputs with unique id and name attributes */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Your Name */}
          <input
            id="visitor-author-name"
            name="authorName"
            type="text"
            placeholder="Your name"
            aria-label="Your name"
            autoComplete="name"
            required
            maxLength={30}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-900/90 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono transition-colors"
          />

          {/* Short Note */}
          <input
            id="visitor-note-content"
            name="noteContent"
            type="text"
            placeholder="Leave a short note (optional)"
            aria-label="Leave a short note"
            autoComplete="off"
            maxLength={MAX_NOTE_LENGTH}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-900/90 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono transition-colors"
          />

          {errorMessage && (
            <p className="text-[11px] text-red-400 font-mono">{errorMessage}</p>
          )}

          {/* Bottom Bar: Character count, Cancel, Submit */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-zinc-500 px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
              {MAX_NOTE_LENGTH - note.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-xs font-mono font-semibold uppercase text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-white hover:border-zinc-600 transition-colors"
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded text-xs font-mono font-bold uppercase transition-all shadow active:scale-95 disabled:opacity-50"
                style={{
                  backgroundColor: currentPalette.primary,
                  color: "#0a0a0c",
                }}
              >
                {isSubmitting ? "SAVING..." : "SUBMIT"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
