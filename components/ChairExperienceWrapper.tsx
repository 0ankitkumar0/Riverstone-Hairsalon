"use client";

import React, { useState, useEffect } from "react";
import SalonChairCanvas from "./SalonChairCanvas";
import SalonExperienceSection from "./SalonExperienceSection";
import TransformationSection from "./TransformationSection";

interface ChairExperienceWrapperProps {
  onOpenBooking: () => void;
}

export default function ChairExperienceWrapper({
  onOpenBooking,
}: ChairExperienceWrapperProps) {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div id="chair-story-wrapper" className="relative w-full">
      {/* DESKTOP ONLY: Traveling 3D Chair between Section 02 and Section 03 (Zero presence on mobile DOM) */}
      {isDesktop && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <SalonChairCanvas wrapperId="chair-story-wrapper" isFloating={true} />
        </div>
      )}

      {/* CONTENT SECTIONS OVERLAID IN NATURAL SCROLL ORDER */}
      <div className="relative z-10">
        {/* SECTION 02: THE SALON EXPERIENCE */}
        <SalonExperienceSection />

        {/* SECTION 03: TRANSFORMATION / CHAIR EXPERIENCE */}
        <TransformationSection onOpenBooking={onOpenBooking} />
      </div>
    </div>
  );
}
