"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, Star } from "lucide-react";

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure instant zero-latency autoplay on all modern browsers
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.debug("Autoplay note:", err);
        });
      }
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full pt-20 sm:pt-24 pb-12 sm:pb-16 flex flex-col justify-center items-center bg-[#FAF7F2]"
    >
      {/* Hidden semantic H1 for SEO compliance */}
      <h1 className="sr-only">
        Riverstone Hair Salon — Premium Hair & Grooming Services
      </h1>

      {/* Subtle ambient warm lighting glow in background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#00C865]/10 via-[#FAF7F2]/40 to-amber-100/30 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* HERO VIDEO: Frameless, direct showcase */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="w-full aspect-[16/9] overflow-hidden bg-neutral-900 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <video
            ref={videoRef}
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover block"
          />
        </div>

        {/* PRIMARY CTA BUTTON DIRECTLY UNDER HERO VIDEO */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenBooking}
            className="group relative px-9 py-4 bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-base sm:text-lg rounded-full shadow-[0_6px_25px_rgba(0,200,101,0.35)] hover:shadow-[0_8px_30px_rgba(0,200,101,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
          >
            <span>Book Appointment</span>
            <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4 text-black" />
            </div>
          </button>
        </div>

        {/* TRUST & EXPERIENCE STATS STRIP */}
        <div className="mt-10 sm:mt-12 w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-black/10 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-black font-display text-2xl sm:text-3xl font-bold">
              <span>4.9</span>
              <Star className="w-5 h-5 fill-[#00C865] text-[#00C865]" />
            </div>
            <span className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
              1,200+ Client Reviews
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-black font-display text-2xl sm:text-3xl font-bold">
              12+
            </div>
            <span className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
              Master Stylists
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-black font-display text-2xl sm:text-3xl font-bold">
              100%
            </div>
            <span className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
              Organic Formulations
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-black font-display text-2xl sm:text-3xl font-bold">
              15k+
            </div>
            <span className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
              Crafted Looks
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
