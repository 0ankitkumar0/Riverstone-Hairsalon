"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ChairExperienceWrapper from "@/components/ChairExperienceWrapper";
import ServicesPricingSection from "@/components/ServicesPricingSection";
import BookingSection from "@/components/BookingSection";
import BookingModal from "@/components/BookingModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#111111] antialiased selection:bg-[#00C865] selection:text-black">
      {/* Global Header */}
      <Header onOpenBooking={handleOpenBooking} />

      {/* 5 APPROVED CORE SECTIONS */}
      <main className="flex-1 w-full">
        {/* SECTION 01: HERO */}
        <HeroSection onOpenBooking={() => handleOpenBooking()} />

        {/* SECTION 02 & 03: PERSISTENT 3D CHAIR STORYTELLING */}
        {/* Section 02: Salon Experience */}
        {/* Section 03: Transformation / Chair Experience */}
        <ChairExperienceWrapper onOpenBooking={() => handleOpenBooking()} />

        {/* SECTION 04: SERVICES & PRICING */}
        <ServicesPricingSection
          onSelectService={(id) => handleOpenBooking(id)}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* SECTION 05: BOOK APPOINTMENT / CONTACT */}
        <BookingSection preselectedServiceId={selectedServiceId} />
      </main>

      {/* Salon Footer */}
      <Footer />

      {/* Interactive Quick Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedServiceId={selectedServiceId}
      />
    </div>
  );
}
