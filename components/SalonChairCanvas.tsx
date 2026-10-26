"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RotateCcw, Move } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SalonChairCanvasProps {
  wrapperId?: string;
  isFloating?: boolean;
}

const TOTAL_FRAMES = 96;
const FRAME_BASE_PATH = "/chair-frames/frame_";

// Crop window to focus cleanly on the chair (460x450 within 800x450),
// magnifying it by ~1.7x while preserving exact center of rotation (X=380, Y=225)
const CROP_SX = 150;
const CROP_SY = 0;
const CROP_SWIDTH = 460;
const CROP_SHEIGHT = 450;

// Global shared frame cache
const sharedImages: HTMLImageElement[] = [];
const sharedLoaded: boolean[] = new Array(TOTAL_FRAMES).fill(false);
const frameListeners: Array<() => void> = [];
let isPreloadStarted = false;

function preloadFrames(onFirstReady: () => void) {
  if (sharedLoaded[0]) {
    onFirstReady();
    return;
  }

  frameListeners.push(onFirstReady);
  if (isPreloadStarted) return;
  isPreloadStarted = true;

  const notifyAll = () => {
    while (frameListeners.length > 0) {
      const cb = frameListeners.shift();
      if (cb) cb();
    }
  };

  const getPath = (i: number) => {
    const pad = String(i).padStart(2, "0");
    return `${FRAME_BASE_PATH}${pad}.webp`;
  };

  const loadImg = (i: number) => {
    if (sharedImages[i]) return;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      sharedLoaded[i] = true;
      if (i === 0) notifyAll();
    };
    img.onerror = () => {
      if (i === 0) notifyAll();
    };
    img.src = getPath(i);
    if (img.complete && img.naturalWidth > 0) {
      sharedLoaded[i] = true;
      if (i === 0) notifyAll();
    }
    sharedImages[i] = img;
  };

  // 1. Priority: Frame 00
  loadImg(0);

  // 2. Keyframes for instant 360 responsiveness
  const keyframes = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90];
  keyframes.forEach((k) => loadImg(k));

  // 3. Batch load remaining frames
  const remaining: number[] = [];
  for (let i = 1; i < TOTAL_FRAMES; i++) {
    if (!keyframes.includes(i)) remaining.push(i);
  }

  let batch = 0;
  const nextBatch = () => {
    if (batch >= remaining.length) return;
    const slice = remaining.slice(batch, batch + 4);
    slice.forEach((idx) => loadImg(idx));
    batch += 4;
    setTimeout(nextBatch, 30);
  };
  setTimeout(nextBatch, 100);
}

export default function SalonChairCanvas({
  wrapperId = "chair-story-wrapper",
  isFloating = true,
}: SalonChairCanvasProps) {
  const chairWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [initialFrameReady, setInitialFrameReady] = useState<boolean>(false);
  const [currentDisplayFrame, setCurrentDisplayFrame] = useState<number>(0);

  // Trajectory coordinates (vertical Y in parent coordinates, only used if isFloating)
  const startYRef = useRef<number>(0);
  const endYRef = useRef<number>(973);
  const scrollProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  // Frame control state
  const scrollTargetFrameRef = useRef<number>(0);
  const dragOffsetFrameRef = useRef<number>(0);
  const currentRenderedFrameRef = useRef<number>(0);

  // User drag state
  const isDraggingRef = useRef<boolean>(false);
  const previousPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Passive hover parallax
  const hoverParallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetHoverRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset to current scroll frame
  const handleReset = useCallback(() => {
    dragOffsetFrameRef.current = 0;
  }, []);

  // Preload frames safely
  useEffect(() => {
    let isCancelled = false;

    preloadFrames(() => {
      if (!isCancelled) setInitialFrameReady(true);
    });

    // Safety timeout ensures ready state within 500ms
    const safety = setTimeout(() => {
      if (!isCancelled) setInitialFrameReady(true);
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(safety);
    };
  }, []);

  // Main Canvas Render & Trajectory Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const chairWrapper = chairWrapperRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let scrollTriggerInstance: ScrollTrigger | null = null;
    let isDisposed = false;

    // Handle high-DPI retina display resolution
    const updateCanvasSize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const displayWidth = Math.round(rect.width) || 360;
      const displayHeight = Math.round(rect.height) || 360;

      if (
        canvas.width !== displayWidth * dpr ||
        canvas.height !== displayHeight * dpr
      ) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }
    };

    updateCanvasSize();

    // Trajectory measurement (Only needed in desktop floating mode)
    const updatePositions = () => {
      if (!isFloating || !chairWrapper) return;
      const story = document.getElementById(wrapperId);
      const sec2Slot = document.getElementById("chair-slot-experience");
      const sec3Slot = document.getElementById("chair-slot-transformation");

      if (!story || !sec2Slot || !sec3Slot) return;

      const storyRect = story.getBoundingClientRect();
      const sec2Rect = sec2Slot.getBoundingClientRect();
      const sec3Rect = sec3Slot.getBoundingClientRect();

      const canvasHeight = container.offsetHeight || 500;

      const start =
        sec2Rect.top - storyRect.top + (sec2Rect.height - canvasHeight) / 2;
      const end =
        sec3Rect.top - storyRect.top + (sec3Rect.height - canvasHeight) / 2;

      startYRef.current = start;
      endYRef.current = end;
    };

    if (isFloating) {
      updatePositions();
      const t1 = setTimeout(updatePositions, 150);
      const t2 = setTimeout(updatePositions, 500);

      const sec2 = document.getElementById("experience");
      const sec3 = document.getElementById("transformation");
      const storyElement = document.getElementById(wrapperId);

      if (storyElement) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: sec2 || storyElement,
          start: "center center",
          endTrigger: sec3 || storyElement,
          end: "center center",
          scrub: 0.25,
          onUpdate: (self) => {
            const p = Math.min(1.0, Math.max(0.0, self.progress));
            scrollProgressRef.current = p;
            scrollTargetFrameRef.current = p * (TOTAL_FRAMES - 1);

            if (
              !isDraggingRef.current &&
              Math.abs(dragOffsetFrameRef.current) > 0.01
            ) {
              dragOffsetFrameRef.current *= 0.92;
            }
          },
        });
      }
    }

    const handleResize = () => {
      updateCanvasSize();
      if (isFloating) updatePositions();
    };
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Animation Render Loop
    const startTime = performance.now();

    const render = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(render);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // 1. Lerp Trajectory Position (Only in desktop floating mode)
      if (isFloating && chairWrapperRef.current) {
        currentProgressRef.current +=
          (scrollProgressRef.current - currentProgressRef.current) * 0.12;

        const currentY =
          startYRef.current +
          currentProgressRef.current * (endYRef.current - startYRef.current);

        chairWrapperRef.current.style.transform = `translate3d(0, ${currentY}px, 0)`;
      }

      // 2. Calculate Target Frame (scroll target + user drag offset)
      let combinedTarget =
        scrollTargetFrameRef.current + dragOffsetFrameRef.current;

      while (combinedTarget < 0) combinedTarget += TOTAL_FRAMES;
      while (combinedTarget >= TOTAL_FRAMES) combinedTarget -= TOTAL_FRAMES;

      currentRenderedFrameRef.current +=
        (combinedTarget - currentRenderedFrameRef.current) * 0.15;

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentRenderedFrameRef.current))
      );

      setCurrentDisplayFrame(frameIndex);

      // 3. Hover Parallax Lerp
      hoverParallaxRef.current.x +=
        (targetHoverRef.current.x - hoverParallaxRef.current.x) * 0.08;
      hoverParallaxRef.current.y +=
        (targetHoverRef.current.y - hoverParallaxRef.current.y) * 0.08;

      const breathY = Math.sin(elapsedTime * 1.8) * 2.5;

      // 4. Draw with nearest loaded frame fallback
      let img = sharedImages[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        let found: HTMLImageElement | null = null;
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = (frameIndex - offset + TOTAL_FRAMES) % TOTAL_FRAMES;
          if (
            sharedImages[prev]?.complete &&
            sharedImages[prev]?.naturalWidth > 0
          ) {
            found = sharedImages[prev];
            break;
          }
          const next = (frameIndex + offset) % TOTAL_FRAMES;
          if (
            sharedImages[next]?.complete &&
            sharedImages[next]?.naturalWidth > 0
          ) {
            found = sharedImages[next];
            break;
          }
        }
        img = found || sharedImages[0];
      }

      if (img && img.complete && img.naturalWidth > 0) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const cw = (canvas.width / dpr) || 360;
        const ch = (canvas.height / dpr) || 360;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(dpr, dpr);

        ctx.translate(
          hoverParallaxRef.current.x,
          hoverParallaxRef.current.y + breathY
        );

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const cropAspect = CROP_SWIDTH / CROP_SHEIGHT;
        const canvasAspect = cw / ch;

        let drawWidth: number;
        let drawHeight: number;
        let drawX: number;
        let drawY: number;

        if (canvasAspect > cropAspect) {
          drawHeight = ch * 0.95;
          drawWidth = drawHeight * cropAspect;
          drawX = (cw - drawWidth) / 2;
          drawY = (ch - drawHeight) / 2;
        } else {
          drawWidth = cw * 0.95;
          drawHeight = drawWidth / cropAspect;
          drawX = (cw - drawWidth) / 2;
          drawY = (ch - drawHeight) / 2;
        }

        if (drawWidth > 0 && drawHeight > 0 && !isNaN(drawX) && !isNaN(drawY)) {
          ctx.drawImage(
            img,
            CROP_SX,
            CROP_SY,
            CROP_SWIDTH,
            CROP_SHEIGHT,
            drawX,
            drawY,
            drawWidth,
            drawHeight
          );
        }

        ctx.restore();
      }
    };

    render();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [wrapperId, isFloating]);

  // Pointer Drag Handlers (Interactive 360° rotation)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDraggingRef.current = true;
    previousPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousPointerRef.current.x;
    previousPointerRef.current = { x: e.clientX, y: e.clientY };
    const sensitivity = 0.35;
    dragOffsetFrameRef.current += deltaX * sensitivity;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Content of the interactive chair canvas & controls
  const chairContent = (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full max-w-[440px] aspect-square flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-pan-y pointer-events-auto mx-auto"
      title="Drag horizontally to rotate chair 360°"
    >
      {/* 1. Base Image - Instant hardware-accelerated display, guarantees chair is ALWAYS visible */}
      <img
        src="/chair-frames/frame_00.webp"
        alt="Riverstone 3D Studio Chair"
        className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
        style={{
          transform: "scale(1.45)",
          transformOrigin: "center center",
          clipPath: "inset(0% 18% 0% 18%)",
          display: initialFrameReady && currentDisplayFrame !== 0 ? "none" : "block",
        }}
      />

      {/* 2. Interactive Canvas: Active during 360° scrub and drag */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full filter drop-shadow-md absolute inset-0 block transition-opacity duration-150 ${
          initialFrameReady && currentDisplayFrame !== 0 ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 3. Interactive Badges & Scrub Controls */}
      <div className="absolute bottom-3 right-4 z-30 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-black/10 shadow-sm text-xs font-medium text-neutral-800 transition-transform hover:scale-105">
          <Move className="w-3.5 h-3.5 text-[#00C865]" />
          <span className="hidden sm:inline">Drag to rotate 360°</span>
          <span className="sm:hidden">Drag 360°</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-900/5 font-mono text-neutral-500">
            {String(currentDisplayFrame + 1).padStart(2, "0")}/{TOTAL_FRAMES}
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-full bg-white/90 backdrop-blur-md border border-black/10 shadow-sm hover:bg-neutral-100 text-neutral-700 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Reset angle to scroll position"
          aria-label="Reset angle"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
        </button>
      </div>
    </div>
  );

  // If mobile / embedded mode: Render directly in document flow with ZERO overlay
  if (!isFloating) {
    return chairContent;
  }

  // If desktop floating mode: Render in traveling right-column container
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full grid grid-cols-12 gap-12 pointer-events-none">
      {/* Empty Left 6 columns so chair NEVER covers left storytelling text or buttons */}
      <div className="col-span-6 pointer-events-none" />

      {/* Right 6 columns: Traveling Chair Container */}
      <div className="col-span-6 relative pointer-events-none">
        <div
          ref={chairWrapperRef}
          style={{ willChange: "transform" }}
          className="absolute top-0 left-0 w-full flex items-center justify-center pointer-events-none"
        >
          {chairContent}
        </div>
      </div>
    </div>
  );
}
