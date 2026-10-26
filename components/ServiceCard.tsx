"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { SalonService } from "@/data/services";

interface ServiceCardProps {
  service: SalonService;
  index: number;
  onSelect: (serviceId: string) => void;
}

export default function ServiceCard({
  service,
  index,
  onSelect,
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center group transition-transform duration-500 ease-out w-full max-w-[270px] sm:max-w-[280px] lg:max-w-[285px]"
      style={{
        transform: `rotate(${service.tiltDesktop})`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Green Clip / Peg with white pinhole (hanging from wire) */}
      <div className="relative -mb-3 z-20 flex flex-col items-center">
        <div className="w-5 h-7 rounded-t-sm rounded-b-md bg-[#00C865] shadow-md flex items-center justify-center border border-white/20">
          <div className="w-2 h-2 rounded-full bg-white shadow-inner" />
        </div>
      </div>

      {/* Radiant Green Corner Glow Bloom radiating from outside corners */}
      <div className="absolute -inset-1.5 rounded-[30px] bg-gradient-to-br from-[#00C865]/45 via-transparent to-[#00C865]/45 blur-md opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300 pointer-events-none -z-10" />

      {/* Main Card Container with green corner shadow */}
      <div
        onClick={() => onSelect(service.id)}
        className="w-full bg-white rounded-[26px] p-4 sm:p-5 shadow-[0_10px_32px_-4px_rgba(0,200,101,0.32),0_0_18px_rgba(0,200,101,0.22)] hover:shadow-[0_18px_45px_-3px_rgba(0,200,101,0.55),0_0_32px_rgba(0,200,101,0.4)] transition-all duration-300 border border-[#00C865]/35 hover:border-[#00C865]/70 cursor-pointer hover:-translate-y-2.5 relative flex flex-col"
      >
        {/* Service Image with rounded frame and hover zoom */}
        <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-neutral-100 shadow-inner">
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 280px, 290px"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          />
          {service.popular && (
            <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#00C865]" />
              <span>Signature</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="mt-4 flex flex-col flex-1">
          <h3 className="font-display font-bold text-lg sm:text-xl uppercase tracking-tight text-black group-hover:text-[#00C865] transition-colors leading-snug min-h-[3rem] flex items-center">
            {service.name}
          </h3>
          <p className="text-xs text-neutral-500 font-medium mt-0.5 tracking-tight line-clamp-1">
            {service.subtitle}
          </p>

          {/* Bottom Row: Price + Circular Arrow Button */}
          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#00C865] tracking-tight">
                {service.priceFormatted}
              </span>
              <span className="text-[10px] text-neutral-600 font-medium uppercase">
                / {service.duration}
              </span>
            </div>

            {/* Circular Arrow Button */}
            <div className="w-9 h-9 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center text-black group-hover:bg-[#00C865] group-hover:border-[#00C865] group-hover:text-black transition-all duration-300 group-hover:scale-110">
              <ChevronRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
