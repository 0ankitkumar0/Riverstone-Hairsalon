"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  className?: string;
  buttonClassName?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
  className = "",
  buttonClassName = "",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse today
  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth(); // 0-indexed
  const todayDate = now.getDate();
  const todayStr = `${todayYear}-${String(todayMonth + 1).padStart(2, "0")}-${String(todayDate).padStart(2, "0")}`;

  // Currently viewed month/year in calendar
  const initialDate = value ? new Date(value + "T00:00:00") : now;
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear() || todayYear);
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth() ?? todayMonth);

  // Close calendar on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Is viewing the current month (meaning we cannot go back to past months)
  const isViewingCurrentMonth = viewYear === todayYear && viewMonth === todayMonth;
  const isViewingPastMonth = viewYear < todayYear || (viewYear === todayYear && viewMonth < todayMonth);

  // If somehow viewing past month, reset to current
  useEffect(() => {
    if (isViewingPastMonth) {
      setViewYear(todayYear);
      setViewMonth(todayMonth);
    }
  }, [isViewingPastMonth, todayYear, todayMonth]);

  const handlePrevMonth = () => {
    if (isViewingCurrentMonth) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Days calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday

  const handleSelectDay = (day: number) => {
    const selected = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(selected);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    setViewYear(todayYear);
    setViewMonth(todayMonth);
    onChange(todayStr);
    setIsOpen(false);
  };

  const handleSelectTomorrow = () => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    const tmrwYear = tmrw.getFullYear();
    const tmrwMonth = tmrw.getMonth();
    const tmrwDate = tmrw.getDate();
    const tmrwStr = `${tmrwYear}-${String(tmrwMonth + 1).padStart(2, "0")}-${String(tmrwDate).padStart(2, "0")}`;
    setViewYear(tmrwYear);
    setViewMonth(tmrwMonth);
    onChange(tmrwStr);
    setIsOpen(false);
  };

  // Format display string
  const formatDisplay = (val: string) => {
    if (!val) return "Select appointment date";
    const [y, m, d] = val.split("-").map(Number);
    if (!y || !m || !d) return val;
    const dateObj = new Date(y, m - 1, d);
    if (val === todayStr) {
      return `Today, ${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Clickable Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left transition-all cursor-pointer ${buttonClassName}`}
      >
        <span className="truncate">{formatDisplay(value)}</span>
        <CalendarIcon className="w-4 h-4 text-[#00C865] shrink-0 ml-2" />
      </button>

      {/* Popover Calendar Grid */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 bg-[#161616] text-white border border-white/15 rounded-2xl p-4 shadow-2xl animate-in fade-in duration-150 backdrop-blur-md">
          {/* Calendar Header: Month + Year & Navigation */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <span className="font-display uppercase text-xs sm:text-sm font-bold tracking-wider text-white">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isViewingCurrentMonth}
                title={isViewingCurrentMonth ? "Cannot go to past months" : "Previous month"}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isViewingCurrentMonth
                    ? "opacity-20 cursor-not-allowed border-white/5 text-neutral-600"
                    : "hover:bg-white/10 border-white/10 text-white cursor-pointer"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons (Today, Tomorrow) */}
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={handleSelectToday}
              className={`flex-1 py-1 px-2 text-[11px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                value === todayStr
                  ? "bg-[#00C865] text-black border-[#00C865]"
                  : "bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleSelectTomorrow}
              className="flex-1 py-1 px-2 text-[11px] font-bold uppercase rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-all cursor-pointer"
            >
              Tomorrow
            </button>
          </div>

          {/* Day of week labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {dayLabels.map((lbl) => (
              <span key={lbl} className="text-[10px] font-bold uppercase text-neutral-500 py-1">
                {lbl}
              </span>
            ))}
          </div>

          {/* Days Grid: PAST DATES ARE COMPLETELY HIDDEN AS REQUESTED */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots for first day offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`offset-${i}`} className="h-8" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const isPast =
                viewYear < todayYear ||
                (viewYear === todayYear && viewMonth < todayMonth) ||
                (viewYear === todayYear && viewMonth === todayMonth && day < todayDate);

              // CRITICAL: Past date is NOT rendered/shown at all!
              if (isPast) {
                return (
                  <div
                    key={`past-${day}`}
                    className="h-8 rounded-lg flex items-center justify-center pointer-events-none select-none"
                  >
                    {/* Empty blank cell so past dates are literally not shown! */}
                  </div>
                );
              }

              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = value === dateStr;
              const isToday =
                viewYear === todayYear && viewMonth === todayMonth && day === todayDate;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-full rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer relative ${
                    isSelected
                      ? "bg-[#00C865] text-black shadow-[0_0_12px_rgba(0,200,101,0.4)] scale-105"
                      : isToday
                      ? "bg-white/15 text-[#00C865] border border-[#00C865]/40 hover:bg-[#00C865]/20"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  <span>{day}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#00C865] absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C865]" />
              <span>Future dates only</span>
            </span>
            <span className="font-mono text-[9px] text-neutral-500">
              Past dates hidden
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
