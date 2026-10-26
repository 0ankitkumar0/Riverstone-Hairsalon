"use client";

import React, { useRef, useState, useTransition } from "react";
import {
  SALON_SERVICES,
  SERVICE_CATEGORIES,
  ServiceCategoryKey,
  SalonService,
} from "@/data/services";
import { useSalonData } from "@/context/SalonDataContext";
import ServiceCard from "./ServiceCard";
import {
  Scissors,
  Palette,
  Sparkles,
  Waves,
  Layers,
  ArrowRight,
  Phone,
  Check,
} from "lucide-react";

interface ServicesPricingSectionProps {
  onSelectService: (serviceId: string) => void;
  onOpenBooking: () => void;
}

export default function ServicesPricingSection({
  onSelectService,
  onOpenBooking,
}: ServicesPricingSectionProps) {
  const { services: dynamicServices, categories: dynamicCategories, settings } = useSalonData();
  const services = dynamicServices && dynamicServices.length > 0 ? dynamicServices : SALON_SERVICES;
  const categories = dynamicCategories && dynamicCategories.length > 0 ? dynamicCategories : SERVICE_CATEGORIES;

  const [activeCategory, setActiveCategory] = useState<
    ServiceCategoryKey | "all"
  >("all");
  const [, startTransition] = useTransition();

  const handleCategoryChange = (cat: ServiceCategoryKey | "all") => {
    startTransition(() => {
      setActiveCategory(cat);
    });
  };

  const getCategoryIcon = (key: ServiceCategoryKey | "all") => {
    switch (key) {
      case "haircuts":
        return <Scissors className="w-3.5 h-3.5" />;
      case "colour":
        return <Palette className="w-3.5 h-3.5" />;
      case "foils":
        return <Sparkles className="w-3.5 h-3.5" />;
      case "perm":
        return <Waves className="w-3.5 h-3.5" />;
      case "other":
        return <Layers className="w-3.5 h-3.5" />;
      default:
        return <Scissors className="w-3.5 h-3.5" />;
    }
  };

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const activeCategoryInfo = categories.find(
    (c) => c.key === activeCategory
  );

  return (
    <section
      id="services"
      className="relative py-24 lg:py-32 bg-[#FAF7F2] overflow-hidden"
    >
      {/* Subtle radial ambient warm green illumination */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-t from-[#00C865]/12 via-amber-100/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/10 text-xs font-semibold uppercase tracking-widest text-neutral-800 mb-5 shadow-xs">
            <Scissors className="w-3.5 h-3.5 text-[#00C865]" />
            <span>04 / Transparent Menu & Price List</span>
          </div>

          <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.92] text-black">
            SERVICES & <span className="text-[#00C865]">PRICING</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 font-normal max-w-xl">
            Thoughtfully curated treatments using clean, sustainable salon
            products. No hidden extras. Simply pure craft and attention to
            detail.
          </p>
        </div>

        {/* CATEGORY SELECTOR TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-5xl mx-auto px-2">
          {/* ALL SERVICES TAB (FIRST & DEFAULT) */}
          <button
            onClick={() => handleCategoryChange("all")}
            className={`group px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeCategory === "all"
                ? "bg-black text-white shadow-lg shadow-[#00C865]/20 ring-2 ring-[#00C865]"
                : "bg-white/90 text-neutral-700 hover:text-black hover:bg-white border border-black/10 shadow-xs hover:border-[#00C865]/40"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#00C865]" />
            <span className="uppercase tracking-wider font-display font-bold">
              ALL SERVICES
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeCategory === "all"
                  ? "bg-[#00C865] text-black"
                  : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
              }`}
            >
              {services.length}
            </span>
          </button>

          {categories.map((category) => {
            const isActive = activeCategory === category.key;
            const catCount = services.filter((s) => s.category === category.key).length;
            return (
              <button
                key={category.key}
                onClick={() => handleCategoryChange(category.key)}
                className={`group px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-black text-white shadow-lg shadow-[#00C865]/20 ring-2 ring-[#00C865]"
                    : "bg-white/90 text-neutral-700 hover:text-black hover:bg-white border border-black/10 shadow-xs hover:border-[#00C865]/40"
                }`}
              >
                <span
                  className={
                    isActive ? "text-[#00C865]" : "text-neutral-500 group-hover:text-[#00C865]"
                  }
                >
                  {getCategoryIcon(category.key)}
                </span>
                <span className="uppercase tracking-wider font-display font-bold">
                  {category.name}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-[#00C865] text-black"
                      : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                  }`}
                >
                  {catCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE CATEGORY BANNER / INFO */}
        {activeCategory !== "all" && activeCategoryInfo && (
          <div className="flex flex-col items-center text-center mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#00C865] mb-1 font-display">
              <span>Section {activeCategoryInfo.badge}</span>
              <span>•</span>
              <span>{activeCategoryInfo.count} Services</span>
            </div>
            <p className="text-sm text-neutral-500 font-medium max-w-lg">
              {activeCategoryInfo.description}
            </p>
          </div>
        )}

        {/* HANGING CARDS CONTAINER */}
        <div className="relative pt-4 pb-8 min-h-[500px]">
          {/* Subtle curved hanging wire (SVG) */}
          <div className="hidden lg:block absolute top-[16px] left-0 right-0 w-full pointer-events-none z-10">
            <svg
              viewBox="0 0 1200 60"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-14 opacity-25"
            >
              <path
                d="M 20 15 Q 600 55 1180 15"
                stroke="#111111"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            </svg>
          </div>

          {/* VIEW: SINGLE CATEGORY (Clean Grid) */}
          {activeCategory !== "all" && (
            <div
              key={activeCategory}
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                filteredServices.length === 3
                  ? "lg:grid-cols-3 max-w-4xl"
                  : "lg:grid-cols-3 max-w-5xl"
              } gap-6 sm:gap-8 justify-items-center mx-auto pb-8 pt-4 px-4 sm:px-6 animate-in fade-in duration-300`}
            >
              {filteredServices.map((service, idx) => (
                <div key={service.id} className="w-full flex justify-center">
                  <ServiceCard
                    service={service}
                    index={idx}
                    onSelect={onSelectService}
                  />
                </div>
              ))}
            </div>
          )}

          {/* VIEW: ALL CATEGORIES (Stacked with Official Flyer Section Headers) */}
          {activeCategory === "all" && (
            <div className="space-y-16 pt-2">
              {categories.map((cat) => {
                const catServices = services.filter(
                  (s) => s.category === cat.key
                );
                return (
                  <div key={cat.key} className="space-y-8">
                    {/* Flyer Style Category Header Strip */}
                    <div className="flex items-center justify-center gap-4 max-w-xl mx-auto px-4">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#00C865]/60 to-[#00C865]" />
                      <div className="px-5 py-1.5 rounded-full bg-black text-[#00C865] border border-[#00C865]/40 shadow-sm flex items-center gap-2">
                        {getCategoryIcon(cat.key)}
                        <span className="font-display font-bold uppercase tracking-widest text-xs sm:text-sm text-white">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-[#00C865] font-mono font-bold">
                          ({catServices.length})
                        </span>
                      </div>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#00C865]/60 to-[#00C865]" />
                    </div>

                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 ${
                        catServices.length === 3
                          ? "lg:grid-cols-3 max-w-4xl"
                          : "lg:grid-cols-3 max-w-5xl"
                      } gap-6 sm:gap-8 justify-items-center mx-auto px-4 sm:px-6`}
                    >
                      {catServices.map((service, idx) => (
                        <div
                          key={service.id}
                          className="w-full flex justify-center"
                        >
                          <ServiceCard
                            service={service}
                            index={idx}
                            onSelect={onSelectService}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Booking Callout & Direct Concierge Details from Flyer */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onOpenBooking}
            className="group px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-semibold text-sm rounded-full shadow-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
          >
            <span>Book Your Appointment</span>
            <div className="w-5 h-5 rounded-full bg-[#00C865] flex items-center justify-center text-black">
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </div>
          </button>

          <a
            href="https://wa.me/61448858949?text=Hello%20Riverstone%20Hair%20Salon!%20I%20would%20like%20to%20book%20an%20appointment."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-white hover:bg-neutral-50 text-black border border-black/15 font-semibold text-sm rounded-full shadow-xs transition-all duration-300 hover:border-[#00C865] flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C865] animate-pulse" />
            <span>WhatsApp Booking: 0448 858 949</span>
          </a>
        </div>

        {/* BRAND STRIP (Aura, K18, Organic) */}
        <div className="mt-20 pt-12 border-t border-black/10">
          <div className="text-center mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-neutral-600">
              Trusted Studio Product Partners
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 lg:gap-24 opacity-80 hover:opacity-100 transition-all duration-500">
            {/* Aura */}
            <div className="flex flex-col items-center group cursor-default">
              <span className="font-sans tracking-[0.28em] text-xl sm:text-2xl font-bold text-neutral-900 uppercase transition-colors group-hover:text-black">
                AURA
              </span>
              <span className="text-[9px] tracking-[0.28em] font-medium text-neutral-500 uppercase -mt-0.5">
                SMOOTHING & BOTANICALS
              </span>
            </div>

            {/* K18 */}
            <div className="flex flex-col items-center group cursor-default">
              <div className="flex items-baseline gap-1">
                <span className="font-display tracking-[0.08em] text-2xl sm:text-3xl font-black text-black">
                  K18
                </span>
                <span className="text-[10px] font-bold text-[#00C865] uppercase">™</span>
              </div>
              <span className="text-[8px] tracking-[0.3em] font-bold text-neutral-500 uppercase -mt-0.5">
                BIOMIMETIC HAIRSCIENCE
              </span>
            </div>

            {/* Organic */}
            <div className="flex flex-col items-center group cursor-default">
              <span className="font-serif tracking-[0.22em] text-xl sm:text-2xl font-medium text-neutral-900 uppercase transition-colors group-hover:text-black">
                ORGANIC
              </span>
              <span className="text-[9px] tracking-[0.28em] font-medium text-neutral-500 uppercase -mt-0.5">
                COLOUR & HAIR SYSTEMS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
