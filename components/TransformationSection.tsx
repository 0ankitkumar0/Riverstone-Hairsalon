"use client";

import React from "react";
import { ArrowRight, Check, Armchair, Scissors, ShieldCheck, Sparkles } from "lucide-react";

interface TransformationSectionProps {
  onOpenBooking: () => void;
}

export default function TransformationSection({
  onOpenBooking,
}: TransformationSectionProps) {
  return (
    <section
      id="transformation"
      className="relative min-h-screen flex items-center py-20 lg:py-32 bg-gradient-to-b from-[#FAF7F2] via-[#FAF9F6] to-[#FAF7F2]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Two column layout: Left editorial storytelling, Right reserved for 3D Chair landing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: Transformation Storytelling */}
          <div className="lg:col-span-6 relative z-30 pointer-events-auto">
            {/* Section Index Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-black/10 text-xs font-semibold uppercase tracking-widest text-neutral-800 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00C865]" />
              <span>03 / The Transformation</span>
            </div>

            {/* Display Headline */}
            <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.92] text-black">
              YOUR <br />
              TRANSFORMATION <br />
              <span className="text-[#00C865]">STARTS HERE</span>
            </h2>

            {/* Supporting Copy */}
            <p className="mt-6 text-lg sm:text-xl text-neutral-700 font-light leading-relaxed max-w-xl">
              Precision styling, thoughtful care and a space designed to make
              every visit feel effortless. Settle into our bespoke hydraulic
              seating while our artisans work with master blades and tailored
              treatments.
            </p>

            {/* Transformation Pillar Highlights */}
            <div className="mt-8 space-y-3.5 max-w-xl">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/80 border border-black/5 shadow-xs">
                <div className="w-6 h-6 rounded-full bg-[#00C865]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#00C865] stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black uppercase tracking-tight font-display">
                    Ergonomic Zero-Pressure Seating
                  </h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Designed for effortless cervical and lumbar support during every treatment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/80 border border-black/5 shadow-xs">
                <div className="w-6 h-6 rounded-full bg-[#00C865]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#00C865] stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black uppercase tracking-tight font-display">
                    360° Studio Lighting Alignment
                  </h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    High-CRI daylight illumination ensures true-to-life tone and texture precision.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/80 border border-black/5 shadow-xs">
                <div className="w-6 h-6 rounded-full bg-[#00C865]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#00C865] stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black uppercase tracking-tight font-display">
                    Hand-Forged Japanese Steel Shears
                  </h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Ultra-sharp convex edges preserve hair cuticle integrity without split ends.
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-9 flex items-center gap-4 flex-wrap">
              <button
                onClick={onOpenBooking}
                className="group relative px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-semibold text-sm sm:text-base rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
              >
                <span>Reserve Your Chair</span>
                <div className="w-6 h-6 rounded-full bg-[#00C865] flex items-center justify-center text-black transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </button>

              <a
                href="#services"
                className="text-sm font-medium text-neutral-700 hover:text-black transition-colors underline underline-offset-4 decoration-neutral-300 hover:decoration-black"
              >
                Explore Services & Pricing ↓
              </a>
            </div>
          </div>

          {/* RIGHT: Visual area where the 3D chair anchors & stabilizes */}
          <div
            id="chair-slot-transformation"
            className="lg:col-span-6 min-h-[300px] lg:min-h-[550px] relative flex items-center justify-center"
          >
            {/* Soft luminous glow behind the landed chair */}
            <div className="w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-br from-amber-100/30 via-[#00C865]/10 to-transparent blur-3xl pointer-events-none absolute" />

            {/* MOBILE ONLY: Stylist Station Card */}
            <div className="w-full max-w-sm mx-auto lg:hidden relative z-10 p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-black/10 shadow-lg text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#00C865]/15 text-[#00C865] flex items-center justify-center mx-auto mb-4">
                <Armchair className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-black/5 text-[11px] font-semibold text-neutral-800 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#00C865]" />
                <span>Station 01 • Master Chair</span>
              </div>
              <h3 className="font-display uppercase text-lg font-bold tracking-tight text-black">
                Precision Hydraulic Chair
              </h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Experience artisanal styling in zero-gravity ergonomic comfort. Designed for tailored treatments and master blade artistry.
              </p>
              <button
                onClick={onOpenBooking}
                className="mt-5 w-full py-3 px-6 bg-black text-white font-semibold text-xs uppercase tracking-wider rounded-full shadow-md hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book This Chair</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00C865]" />
              </button>
            </div>

            {/* DESKTOP ONLY: Landed state label */}
            <div className="hidden lg:flex absolute top-6 right-4 sm:right-10 z-30 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/10 shadow-xs text-[11px] font-medium text-neutral-700 items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#00C865]" />
              <span>Chair Anchored • Ready For Styling</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
