"use client";

import CustomDatePicker from "./CustomDatePicker";

import React, { useState, useEffect } from "react";
import { SALON_SERVICES, SERVICE_CATEGORIES, STYLISTS } from "@/data/services";
import { useSalonData } from "@/context/SalonDataContext";
import { X, Calendar, Clock, CheckCircle2, Scissors, ArrowRight } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  preselectedServiceId,
}: BookingModalProps) {
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

  const [serviceId, setServiceId] = useState<string>(
    preselectedServiceId || services[0]?.id || "mens-haircut"
  );
  const [stylistId, setStylistId] = useState<string>("elena");
  const todayStr = typeof window !== "undefined" ? new Date().toLocaleDateString("en-CA") : "2026-10-25";
  const [date, setDate] = useState<string>(todayStr);
  const [time, setTime] = useState<string>("11:00 AM");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [ticketRef, setTicketRef] = useState<string>("");
  const [whatsappUrl, setWhatsappUrl] = useState<string>("");

  useEffect(() => {
    if (preselectedServiceId) {
      setServiceId(preselectedServiceId);
    }
  }, [preselectedServiceId]);

  if (!isOpen) return null;

  const currentService =
    services.find((s) => s.id === serviceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    // Record booking in backend
    try {
      const stylistObj = stylists.find((st) => st.id === stylistId);
      fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: name,
          phone,
          serviceId: currentService.id,
          serviceName: currentService.name,
          servicePrice: currentService.priceFormatted,
          stylistId: stylistObj?.id || "",
          stylistName: stylistObj?.name || "Master Stylist",
          date,
          time,
        }),
      }).catch(() => {});
    } catch (err) {}
    e.preventDefault();
    const ref = "RS-" + Math.floor(100000 + Math.random() * 900000);
    setTicketRef(ref);

    const stylistObj = stylists.find((st) => st.id === stylistId);
    const msg = `*New Appointment Booking - Riverstone Hair Salon*
━━━━━━━━━━━━━━━━━━━━━
💇 *Service:* ${currentService.name} (${currentService.priceFormatted})
⏳ *Duration:* ${currentService.duration}
✂️ *Stylist:* ${stylistObj?.name || "First Available Master Stylist"}
📅 *Date:* ${date}
⏰ *Time:* ${time}
👤 *Guest Name:* ${name}
📞 *Phone:* ${phone}
🔖 *Booking Ref:* ${ref}
━━━━━━━━━━━━━━━━━━━━━
Please confirm my appointment. Thank you!`;

    const whatsappNum = settings.whatsappNumber || "61448858949";
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`;
    setWhatsappUrl(url);
    setSubmitted(true);

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-[32px] p-6 sm:p-8 shadow-2xl border border-black/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white border border-black/10 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                <Scissors className="w-4 h-4 text-[#00C865]" />
              </div>
              <span className="text-xs uppercase tracking-widest font-semibold text-neutral-500">
                Quick Reservation
              </span>
            </div>

            <h3 className="font-display uppercase text-2xl sm:text-3xl font-bold text-black tracking-tight">
              BOOK YOUR APPOINTMENT
            </h3>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Service Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-display">
                  Select Service
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                >
                  {categories.map((cat) => (
                    <optgroup key={cat.key} label={`— ${cat.name} —`}>
                      {services.filter((s) => s.category === cat.key).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.priceFormatted} ({s.duration})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Stylist Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-display">
                  Stylist
                </label>
                <select
                  value={stylistId}
                  onChange={(e) => setStylistId(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                >
                  {stylists.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-display">
                    Date
                  </label>
                  <CustomDatePicker
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    buttonClassName="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-display">
                    Time
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl px-3 py-2 text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Name & Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-display">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-display">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#00C865]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-sm uppercase tracking-wide rounded-full shadow-[0_4px_16px_rgba(0,200,101,0.35)] transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>CONFIRM & BOOK VIA WHATSAPP ({currentService.priceFormatted})</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
                <p className="text-center text-[11px] text-neutral-500 mt-2">
                  Instant booking via WhatsApp Concierge: <span className="font-bold text-black">0448 858 949</span>
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#00C865]/15 border-2 border-[#00C865] flex items-center justify-center mx-auto text-[#00C865] mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="font-display uppercase text-2xl font-bold text-black tracking-tight">
              Booking Ready on WhatsApp!
            </h3>
            <p className="mt-2 text-xs text-neutral-600">
              Reference code:{" "}
              <span className="font-mono font-bold text-black">{ticketRef}</span>
            </p>
            <div className="mt-4 p-4 rounded-xl bg-white border border-black/5 text-xs text-left space-y-1.5">
              <div>
                <span className="text-neutral-500">Guest:</span>{" "}
                <span className="font-semibold text-black">{name}</span>
              </div>
              <div>
                <span className="text-neutral-500">Service:</span>{" "}
                <span className="font-semibold text-black">
                  {currentService.name} ({currentService.priceFormatted})
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Date/Time:</span>{" "}
                <span className="font-semibold text-black">
                  {date} at {time}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Concierge:</span>{" "}
                <span className="font-semibold text-black">+61 448 858 949</span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full py-3 rounded-full bg-[#00C865] hover:bg-[#00B259] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Open in WhatsApp (0448 858 949)</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>

            <button
              onClick={onClose}
              className="mt-3 w-full py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              Done & Return to Site
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
