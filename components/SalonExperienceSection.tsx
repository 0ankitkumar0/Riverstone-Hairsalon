"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Compass } from "lucide-react";
import SalonChairCanvas from "./SalonChairCanvas";

export default function SalonExperienceSection() {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="experience"
      className="relative min-h-screen flex items-center py-20 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Two-column layout: Left editorial text, Right reserved for 3D Chair */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: Editorial Content */}
          <div className="lg:col-span-6 relative z-30 pointer-events-auto">
            {/* Section Index Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/10 text-xs font-semibold uppercase tracking-widest text-neutral-800 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00C865]" />
              <span>02 / The Atmosphere</span>
            </div>

            {/* Display Headline */}
            <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.92] text-black">
              THE SALON <br />
              <span className="text-[#00C865]">EXPERIENCE</span>
            </h2>

            {/* Supporting Editorial Message */}
            <p className="mt-6 text-lg sm:text-xl text-neutral-700 font-light leading-relaxed max-w-xl">
              A modern space designed around comfort, precision and personal
              style. From the moment you cross our threshold, the city noise
              fades into quiet luxury, bespoke acoustic curation, and focused
              artistry.
            </p>

            {/* Salon Experience Detail Cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-black/5 flex items-center justify-center text-black mb-3">
                  <Compass className="w-5 h-5 text-[#00C865]" />
                </div>
                <h3 className="font-display uppercase text-lg font-bold tracking-tight text-black">
                  Bespoke Consultation
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 leading-normal">
                  In-depth scalp, bone structure, and lifestyle assessment before
                  a single blade touches your hair.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-black/5 flex items-center justify-center text-black mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#00C865]" />
                </div>
                <h3 className="font-display uppercase text-lg font-bold tracking-tight text-black">
                  Artisanal Formulations
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 leading-normal">
                  Zero harsh sulfates, pure botanical infusions, and dermatologically
                  certified pigments.
                </p>
              </div>
            </div>

            {/* Quote / Philosophy Pill */}
            <div className="mt-8 p-4 rounded-2xl bg-black/[0.03] border-l-4 border-[#00C865] max-w-xl">
              <p className="text-xs sm:text-sm text-neutral-600 italic">
                “We believe grooming is not maintenance; it is an architectural expression of who you are.”
              </p>
            </div>
          </div>

          {/* RIGHT: Visual area for 3D Chair */}
          <div
            id="chair-slot-experience"
            className="lg:col-span-6 min-h-[380px] sm:min-h-[420px] lg:min-h-[550px] relative flex items-center justify-center"
          >
            {/* Ambient circular halo behind the chair */}
            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#00C865]/15 via-amber-100/20 to-transparent blur-2xl pointer-events-none absolute" />

            {/* MOBILE ONLY: Embedded 3D Interactive Chair (Mounts ONLY on mobile) */}
            {isMounted && !isDesktop && (
              <div className="w-full relative z-10 py-2">
                <SalonChairCanvas isFloating={false} />
              </div>
            )}

            {/* DESKTOP ONLY: Interactive hint badge (Desktop traveling chair hovers here) */}
            {isDesktop && (
              <div className="absolute bottom-6 right-4 sm:right-10 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/10 shadow-sm text-[11px] font-medium text-neutral-600 flex items-center gap-2 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-[#00C865]" />
                <span>Scroll to navigate 3D space</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
