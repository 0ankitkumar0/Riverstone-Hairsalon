"use client";

import React from "react";
import { Scissors, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00C865] flex items-center justify-center text-black">
                <Scissors className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-display tracking-tight text-xl font-bold uppercase leading-none text-white">
                  RIVERSTONE
                </span>
                <span className="text-[9px] tracking-[0.25em] font-medium uppercase text-neutral-400">
                  HAIR SALON
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-400 max-w-sm font-light leading-relaxed">
              An architectural approach to modern hair design, beard grooming,
              and color chemistry. Designed for effortless confidence.
            </p>

            <div className="pt-2 text-xs text-neutral-500">
              <p>Shop 1 / 52 Garfield Road East</p>
              <p>Riverstone • 0448 858 949</p>
              <p className="text-neutral-400">www.Riverstonehairsalon.com.au</p>
            </div>
          </div>

          {/* Nav: Services */}
          <div>
            <h4 className="font-display uppercase text-sm font-bold tracking-wider text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <a href="#services" className="hover:text-[#00C865] transition-colors">
                  Precision Scissor Cut
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#00C865] transition-colors">
                  Beard Sculpt & Razor
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#00C865] transition-colors">
                  Balayage & Color
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#00C865] transition-colors">
                  Eyebrow Architecture
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#00C865] transition-colors">
                  Scalp Detox Wash
                </a>
              </li>
            </ul>
          </div>

          {/* Nav: Atmosphere */}
          <div>
            <h4 className="font-display uppercase text-sm font-bold tracking-wider text-white mb-4">
              Sanctuary
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <a href="#experience" className="hover:text-[#00C865] transition-colors">
                  The Salon Space
                </a>
              </li>
              <li>
                <a href="#transformation" className="hover:text-[#00C865] transition-colors">
                  The 3D Chair Story
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#00C865] transition-colors">
                  Master Stylists
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#00C865] transition-colors">
                  Formulation Partners
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#00C865] transition-colors">
                  Concierge Service
                </a>
              </li>
            </ul>
          </div>

          {/* Hours & Schedule */}
          <div>
            <h4 className="font-display uppercase text-sm font-bold tracking-wider text-white mb-4">
              Hours
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <div>
                <span className="text-white block font-medium">Monday – Wednesday</span>
                <span>9:00 AM – 6:00 PM</span>
              </div>
              <div>
                <span className="text-white block font-medium">Thursday – Saturday</span>
                <span>9:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and back-to-top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2026 Riverstone Hair Salon. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">
              Privacy Notice
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Terms of Visit
            </span>
            <a
              href="/admin"
              className="hover:text-[#00C865] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Admin Portal</span>
            </a>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#00C865] flex items-center justify-center text-white hover:text-[#00C865] transition-all ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
