"use client";

import CustomDatePicker from "./CustomDatePicker";

import React, { useState } from "react";
import {
  SALON_SERVICES,
  SERVICE_CATEGORIES,
  ServiceCategoryKey,
  STYLISTS,
} from "@/data/services";
import { useSalonData } from "@/context/SalonDataContext";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  Scissors,
  User,
  GlassWater,
  Wifi,
  Sparkles,
} from "lucide-react";

interface BookingSectionProps {
  preselectedServiceId?: string | null;
}

export default function BookingSection({
  preselectedServiceId,
}: BookingSectionProps) {
  const {
    services: dynamicServices,
    stylists: dynamicStylists,
    categories: dynamicCategories,
    settings,
  } = useSalonData();
  const services =
    dynamicServices && dynamicServices.length > 0
      ? dynamicServices
      : SALON_SERVICES;
  const stylists =
    dynamicStylists && dynamicStylists.length > 0 ? dynamicStylists : STYLISTS;
  const categories =
    dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories
      : SERVICE_CATEGORIES;

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || services[0]?.id || "mens-haircut"
  );
  const [bookingCategory, setBookingCategory] = useState<
    ServiceCategoryKey | "all"
  >("all");
  const [selectedStylistId, setSelectedStylistId] = useState<string>("elena");
  const todayStr = typeof window !== "undefined" ? new Date().toLocaleDateString("en-CA") : "2026-10-25";
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>("11:00 AM");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>("");

  const timeSlots = [
    "09:30 AM",
    "11:00 AM",
    "01:30 PM",
    "03:00 PM",
    "04:30 PM",
    "06:00 PM",
  ];

  const currentService =
    services.find((s) => s.id === selectedServiceId) || services[0];
  const currentStylist =
    stylists.find((s) => s.id === selectedStylistId) || stylists[0];

  const [whatsappUrl, setWhatsappUrl] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    // Record booking in backend
    try {
      fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: fullName,
          phone,
          email,
          serviceId: currentService.id,
          serviceName: currentService.name,
          servicePrice: currentService.priceFormatted,
          stylistId: currentStylist.id,
          stylistName: currentStylist.name,
          date: selectedDate,
          time: selectedTime,
          notes,
        }),
      }).catch(() => {});
    } catch (err) {}
    e.preventDefault();
    const generatedRef = "RS-" + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(generatedRef);
    setIsSubmitted(true);

    const msg = `*New Appointment Booking - Riverstone Hair Salon*
━━━━━━━━━━━━━━━━━━━━━
💇 *Service:* ${currentService.name} (${currentService.priceFormatted})
⏳ *Duration:* ${currentService.duration}
✂️ *Stylist:* ${currentStylist.name}
📅 *Date:* ${selectedDate}
⏰ *Time:* ${selectedTime}
👤 *Client Name:* ${fullName}
📞 *Client Phone:* ${phone}
📧 *Email:* ${email || "Not specified"}
📝 *Notes:* ${notes || "None"}
🔖 *Booking Ref:* ${generatedRef}
━━━━━━━━━━━━━━━━━━━━━
Please confirm my appointment. Thank you!`;

    const whatsappNum = settings.whatsappNumber || "61448858949";
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`;
    setWhatsappUrl(url);

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName("");
    setPhone("");
    setEmail("");
    setNotes("");
  };

  return (
    <section
      id="booking"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE4] to-[#FAF7F2] overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#00C865]/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-black/10 text-xs font-semibold uppercase tracking-widest text-neutral-800 mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00C865]" />
            <span>05 / Reservations</span>
          </div>

          <h2 className="font-display uppercase tracking-tight text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.92] text-black">
            BOOK YOUR <span className="text-[#00C865]">APPOINTMENT</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 font-normal max-w-xl">
            Choose your service, pick your time and let our stylists take care of
            the rest. Your personalized transformation awaits.
          </p>
        </div>

        {/* MAIN BOOKING GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Salon Information & Sanctuary Amenities */}
          <div className="lg:col-span-5 space-y-6">
            {/* Salon Details Card */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)] border border-black/5">
              <div className="flex items-center gap-3 pb-6 border-b border-black/5">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                  <Scissors className="w-5 h-5 text-[#00C865]" />
                </div>
                <div>
                  <h3 className="font-display uppercase text-xl font-bold text-black tracking-tight">
                    Riverstone Flagship
                  </h3>
                  <p className="text-xs text-neutral-500">Riverstone</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3.5 text-sm">
                  <MapPin className="w-5 h-5 text-[#00C865] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-black block">Location</span>
                    <span className="text-neutral-600">
                      Shop 1 / 52 Garfield Road East Riverstone
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm">
                  <Clock className="w-5 h-5 text-[#00C865] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-black block">Opening Hours</span>
                    <span className="text-neutral-600 block">
                      Monday – Wednesday: 9:00 AM – 6:00 PM
                    </span>
                    <span className="text-neutral-600 block">
                      Thursday – Saturday: 9:00 AM – 8:00 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm">
                  <Phone className="w-5 h-5 text-[#00C865] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-black block">WhatsApp Concierge</span>
                    <a
                      href="https://wa.me/61448858949?text=Hello%20Riverstone%20Hair%20Salon!%20I%20would%20like%20to%20book%20an%20appointment."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-700 hover:text-[#00C865] transition-colors font-medium flex items-center gap-1.5"
                    >
                      <span>0448 858 949</span>
                      <span className="text-[10px] bg-[#00C865]/15 text-[#00C865] font-bold px-1.5 py-0.5 rounded">WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm">
                  <Mail className="w-5 h-5 text-[#00C865] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-black block">Inquiries & Booking</span>
                    <a
                      href="https://www.Riverstonehairsalon.com.au"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-700 hover:text-[#00C865] transition-colors"
                    >
                      www.Riverstonehairsalon.com.au
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Hospitality Perks */}
            <div className="bg-white/80 rounded-[28px] p-6 shadow-sm border border-black/5">
              <h4 className="font-display uppercase text-sm font-bold text-black tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00C865]" />
                <span>Complimentary With Every Visit</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700 font-medium">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2]">
                  <GlassWater className="w-4 h-4 text-[#00C865] shrink-0" />
                  <span>Complimentary water or juice drinks</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2]">
                  <Wifi className="w-4 h-4 text-[#00C865] shrink-0" />
                  <span>Free Wi-Fi</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Appointment Booking Form or Confirmation */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[36px] p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-black/5">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Step 1: Select Service */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-display text-sm uppercase tracking-wider font-bold text-black">
                        1. Select Your Service
                      </label>
                      <span className="text-xs text-neutral-500 font-medium">
                        {services.find((s) => s.id === selectedServiceId)?.name}
                      </span>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <button
                        type="button"
                        onClick={() => setBookingCategory("all")}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          bookingCategory === "all"
                            ? "bg-black text-white"
                            : "bg-[#FAF7F2] text-neutral-600 hover:text-black"
                        }`}
                      >
                        All ({services.length})
                      </button>
                      {categories.map((c) => {
                        const count = services.filter((s) => s.category === c.key).length;
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setBookingCategory(c.key)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              bookingCategory === c.key
                                ? "bg-black text-white"
                                : "bg-[#FAF7F2] text-neutral-600 hover:text-black"
                            }`}
                          >
                            {c.name} ({count})
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                      {services.filter(
                        (s) => bookingCategory === "all" || s.category === bookingCategory
                      ).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedServiceId(s.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            selectedServiceId === s.id
                              ? "bg-black text-white border-black shadow-md scale-[1.02]"
                              : "bg-[#FAF7F2] text-neutral-800 border-black/5 hover:border-black/20"
                          }`}
                        >
                          <div className="text-xs font-bold leading-tight uppercase font-display line-clamp-2">
                            {s.name}
                          </div>
                          <div
                            className={`text-sm font-extrabold mt-1 ${
                              selectedServiceId === s.id
                                ? "text-[#00C865]"
                                : "text-black"
                            }`}
                          >
                            {s.priceFormatted}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select Stylist */}
                  <div>
                    <label className="block font-display text-sm uppercase tracking-wider font-bold text-black mb-3">
                      2. Choose Your Stylist
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {stylists.map((stylist) => (
                        <button
                          key={stylist.id}
                          type="button"
                          onClick={() => setSelectedStylistId(stylist.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            selectedStylistId === stylist.id
                              ? "bg-[#00C865]/10 border-[#00C865] ring-2 ring-[#00C865]/30"
                              : "bg-[#FAF7F2] border-black/5 hover:border-black/20"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-black">
                              {stylist.name}
                            </span>
                            {selectedStylistId === stylist.id && (
                              <CheckCircle className="w-4 h-4 text-[#00C865]" />
                            )}
                          </div>
                          <span className="text-xs text-neutral-500 block mt-0.5">
                            {stylist.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Date & Time Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-display text-sm uppercase tracking-wider font-bold text-black mb-2 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#00C865]" />
                        <span>3. Pick A Date</span>
                      </label>
                      <CustomDatePicker
                        value={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate)}
                        buttonClassName="w-full bg-[#FAF7F2] border border-black/10 rounded-xl px-4 py-3 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                      />
                    </div>

                    <div>
                      <label className="block font-display text-sm uppercase tracking-wider font-bold text-black mb-2 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#00C865]" />
                        <span>Available Slots</span>
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-black/10 rounded-xl px-4 py-3 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Step 4: Client Contact Details */}
                  <div className="space-y-4 pt-2 border-t border-black/5">
                    <label className="block font-display text-sm uppercase tracking-wider font-bold text-black">
                      4. Your Contact Details
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name *"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          placeholder="Mobile Phone Number *"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address (for calendar invite) *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        placeholder="Special styling notes, allergies, or reference links (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#00C865] resize-none"
                      />
                    </div>
                  </div>

                  {/* Summary & Submit */}
                  <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left w-full sm:w-auto">
                      <span className="text-xs text-neutral-500 uppercase tracking-wide block font-semibold">
                        Service Total
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-bold text-3xl text-black">
                          {currentService.priceFormatted}
                        </span>
                        <span className="text-xs text-neutral-500">
                          ({currentService.duration})
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-9 py-4 bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-base rounded-full shadow-[0_4px_20px_rgba(0,200,101,0.35)] hover:shadow-[0_6px_25px_rgba(0,200,101,0.45)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <span>CONFIRM & BOOK VIA WHATSAPP (0448858949)</span>
                      <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
                    </button>
                  </div>
                </form>
              ) : (
                /* Interactive Confirmation Card */
                <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 rounded-full bg-[#00C865]/15 border-2 border-[#00C865] flex items-center justify-center mx-auto text-[#00C865] mb-5">
                    <CheckCircle className="w-8 h-8 stroke-[2.5]" />
                  </div>

                  <h3 className="font-display uppercase text-3xl sm:text-4xl font-bold text-black tracking-tight">
                    Booking Ready on WhatsApp!
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto">
                    Thank you, <span className="font-bold text-black">{fullName}</span>.
                    Your booking details have been prepared for Riverstone Concierge on WhatsApp (+61 448 858 949).
                  </p>

                  {/* Summary ticket */}
                  <div className="mt-6 p-5 rounded-2xl bg-[#FAF7F2] border border-black/5 text-left max-w-md mx-auto space-y-2.5">
                    <div className="flex justify-between items-center text-xs text-neutral-500 pb-2 border-b border-black/5">
                      <span>Confirmation Reference:</span>
                      <span className="font-mono font-bold text-black bg-white px-2 py-0.5 rounded border border-black/10">
                        {bookingRef}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Service:</span>
                      <span className="font-bold text-black">{currentService.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Stylist:</span>
                      <span className="font-bold text-black">{currentStylist.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Date & Time:</span>
                      <span className="font-bold text-black">
                        {selectedDate} at {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Location:</span>
                      <span className="font-bold text-black">Shop 1 / 52 Garfield Road East Riverstone</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-black/5 font-display text-base">
                      <span className="font-bold text-black">Total Due at Salon:</span>
                      <span className="font-bold text-[#00C865]">
                        {currentService.priceFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105"
                    >
                      <span>Open in WhatsApp (0448 858 949)</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </a>

                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-black/15 text-sm font-semibold text-neutral-800 hover:bg-black/5 transition-colors cursor-pointer"
                    >
                      Book Another Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
