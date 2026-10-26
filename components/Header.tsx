"use client";

import React, { useState, useEffect } from "react";
import { Scissors, Menu, X, ArrowRight } from "lucide-react";

interface HeaderProps {
  onOpenBooking: (serviceId?: string) => void;
}

export default function Header({ onOpenBooking }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Our Stylists", href: "#experience" },
    { label: "Gallery", href: "#transformation" },
    { label: "Book Appointment", href: "#booking" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF7F2]/90 backdrop-blur-md py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-b border-black/[0.05]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo with scissors icon */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Riverstone Hair Salon Home"
          >
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45">
              <Scissors className="w-5 h-5 text-[#00C865]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display tracking-tight text-xl font-bold uppercase leading-none text-black">
                RIVERSTONE
              </span>
              <span className="text-[10px] tracking-[0.25em] font-medium uppercase text-neutral-500 leading-tight">
                HAIR SALON
              </span>
            </div>
          </a>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-neutral-700 hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#00C865] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* RIGHT: BOOK NOW CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenBooking()}
              className="relative group overflow-hidden bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-sm px-6 py-2.5 rounded-full shadow-[0_2px_12px_rgba(0,200,101,0.25)] hover:shadow-[0_4px_18px_rgba(0,200,101,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>BOOK NOW</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => onOpenBooking()}
              className="bg-[#00C865] text-black font-semibold text-xs px-3.5 py-1.5 rounded-full"
            >
              BOOK
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-black hover:bg-black/5 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-black/10 px-6 py-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-neutral-800 hover:text-black py-1 border-b border-black/5"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-center py-3 rounded-full flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>BOOK APPOINTMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
