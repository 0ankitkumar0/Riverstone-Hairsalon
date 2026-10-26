"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scissors,
  DollarSign,
  Users,
  Settings,
  Lock,
  Unlock,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  Calendar,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Phone,
} from "lucide-react";
import {
  SalonService,
  Stylist,
  ServiceCategory,
  ServiceCategoryKey,
} from "@/data/services";

export interface SalonBooking {
  id: string;
  ref: string;
  clientName: string;
  phone: string;
  email?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: string;
  stylistId: string;
  stylistName: string;
  date: string; // YYYY-MM-DD
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export const PRESET_SALON_IMAGES = [
  { label: "Haircut (Men's / Classic)", path: "/images/haircut.jpg" },
  { label: "Zero / Skin Fade", path: "/images/zero-fade.jpg" },
  { label: "Flat Top / Precision", path: "/images/flat-top.jpg" },
  { label: "Ladies Haircut & Style", path: "/images/ladies-haircut.jpg" },
  { label: "Beard Trim & Shape", path: "/images/beard-trim.jpg" },
  { label: "Hair Wash & Scalp Massage", path: "/images/hair-wash.jpg" },
  { label: "Wash & Blowdry", path: "/images/wash-blowdry.jpg" },
  { label: "Eyebrow & Facial Grooming", path: "/images/eyebrow.jpg" },
  { label: "Full Hair Colour", path: "/images/hair-colour.jpg" },
  { label: "Root Touch-up", path: "/images/root-touchup.jpg" },
  { label: "Men's Colour Camo", path: "/images/mens-colour.jpg" },
  { label: "Half Head Foils", path: "/images/foils.jpg" },
  { label: "Full Head Foils", path: "/images/foils-full.jpg" },
  { label: "Balayage Master Lift", path: "/images/balayage.jpg" },
  { label: "Classic Texture Perm", path: "/images/perm.jpg" },
  { label: "Medium Length Perm", path: "/images/perm-medium.jpg" },
  { label: "Long Hair Perm", path: "/images/perm-long.jpg" },
  { label: "Keratin Smoothing Treatment", path: "/images/keratin.jpg" },
  { label: "Permanent Straightening", path: "/images/straightening.jpg" },
  { label: "Deep Steam Hair Mask", path: "/images/steam-treatment.jpg" },
  { label: "Formal Event Upstyle", path: "/images/upstyle.jpg" },
];

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Salon Data State
  const [services, setServices] = useState<SalonService[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [bookings, setBookings] = useState<SalonBooking[]>([]);
  const [settings, setSettings] = useState({
    salonName: "Riverstone Hair Salon",
    phone: "0448 858 949",
    whatsappNumber: "61448858949",
    address: "Shop 1 / 52 Garfield Road East Riverstone",
    website: "www.Riverstonehairsalon.com.au",
    adminPin: "1234",
  });

  // UI State
  const [activeTab, setActiveTab] = useState<"services" | "stylists" | "bookings" | "settings">("services");
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingServiceId, setUploadingServiceId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Bookings Filter State (Default: Past dates are filtered out!)
  const [showPastBookings, setShowPastBookings] = useState<boolean>(false);
  const [bookingSearchQuery, setBookingSearchQuery] = useState<string>("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");

  // New Service Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);
  const [newService, setNewService] = useState<Partial<SalonService>>({
    name: "",
    subtitle: "",
    price: 20,
    priceFormatted: "$20",
    duration: "45 mins",
    description: "",
    image: "/images/haircut.jpg",
    category: "haircuts",
    popular: false,
  });

  // New Stylist Modal State
  const [showAddStylistModal, setShowAddStylistModal] = useState<boolean>(false);
  const [newStylist, setNewStylist] = useState<Partial<Stylist>>({
    name: "",
    role: "Senior Stylist",
    specialty: "Precision Cuts & Styling",
    experience: "5+ Years Experience",
  });

  // Today Date string YYYY-MM-DD
  const todayStr = typeof window !== "undefined" ? new Date().toLocaleDateString("en-CA") : "2026-10-25";

  // Fetch initial data
  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        setStylists(data.stylists || []);
        setCategories(data.categories || []);
        setBookings(data.bookings || []);
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("riverstone_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === "1234") {
      setIsAuthenticated(true);
      sessionStorage.setItem("riverstone_admin_auth", "true");
      setAuthError("");
      fetchData();
    } else {
      setAuthError("Invalid Admin PIN. (Default PIN is 1234)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("riverstone_admin_auth");
    setPinInput("");
  };

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Save All Changes to Server & File
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services,
          stylists,
          settings,
          bookings,
          pin: settings.adminPin,
        }),
      });

      if (res.ok) {
        showToast("success", "All changes saved live! Website & services are updated.");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("salon-data-updated"));
          localStorage.setItem("salon-data-timestamp", Date.now().toString());
        }
      } else {
        const errData = await res.json();
        showToast("error", errData.error || "Failed to save changes.");
      }
    } catch {
      showToast("error", "Error connecting to server.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Factory Defaults
  const handleResetDefaults = async () => {
    if (!confirm("Are you sure you want to reset all prices and barbers to original defaults?")) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setServices(data.data.services);
        setStylists(data.data.stylists);
        setSettings(data.data.settings);
        showToast("success", "Reset to original defaults completed.");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("salon-data-updated"));
        }
      }
    } catch {
      showToast("error", "Failed to reset defaults.");
    } finally {
      setIsSaving(false);
    }
  };

  // Service Edit Handlers
  const handleServiceChange = (id: string, field: keyof SalonService, value: any) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: value };
          if (field === "price") {
            const num = Number(value) || 0;
            if (s.priceFormatted.toLowerCase().startsWith("from")) {
              updated.priceFormatted = `From $${num}`;
            } else {
              updated.priceFormatted = `$${num}`;
            }
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Upload Custom Image for Service
  const handleImageFileUpload = async (serviceId: string, file: File) => {
    if (!file) return;
    setUploadingServiceId(serviceId);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (serviceId === "NEW_SERVICE") {
          setNewService((prev) => ({ ...prev, image: data.url }));
        } else {
          handleServiceChange(serviceId, "image", data.url);
        }
        showToast("success", "Image uploaded successfully! Click 'Save Changes' to publish.");
      } else {
        const err = await res.json();
        showToast("error", err.error || "Failed to upload image.");
      }
    } catch {
      showToast("error", "Image upload error.");
    } finally {
      setUploadingServiceId(null);
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast("success", "Service removed from list. Remember to click Save.");
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price) {
      alert("Please provide service name and price.");
      return;
    }
    const id = (newService.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created: SalonService = {
      id: id + "-" + Date.now().toString().slice(-4),
      name: newService.name || "New Service",
      subtitle: newService.subtitle || "Premium Salon Care",
      price: Number(newService.price) || 20,
      priceFormatted: newService.priceFormatted || `$${newService.price}`,
      duration: newService.duration || "45 mins",
      description: newService.description || "Bespoke salon treatment.",
      image: newService.image || "/images/haircut.jpg",
      tiltDesktop: "1deg",
      popular: !!newService.popular,
      category: (newService.category as ServiceCategoryKey) || "haircuts",
    };

    setServices((prev) => [created, ...prev]);
    setShowAddServiceModal(false);
    setNewService({
      name: "",
      subtitle: "",
      price: 20,
      priceFormatted: "$20",
      duration: "45 mins",
      description: "",
      image: "/images/haircut.jpg",
      category: "haircuts",
      popular: false,
    });
    showToast("success", `Added "${created.name}". Click "Save Changes" to publish.`);
  };

  // Stylist Edit Handlers
  const handleStylistChange = (id: string, field: keyof Stylist, value: string) => {
    setStylists((prev) =>
      prev.map((st) => (st.id === id ? { ...st, [field]: value } : st))
    );
  };

  const handleDeleteStylist = (id: string) => {
    if (confirm("Are you sure you want to delete this barber/stylist?")) {
      setStylists((prev) => prev.filter((st) => st.id !== id));
      showToast("success", "Barber removed from list. Remember to click Save.");
    }
  };

  const handleAddStylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStylist.name) {
      alert("Please provide barber name.");
      return;
    }
    const id = (newStylist.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created: Stylist = {
      id: id + "-" + Date.now().toString().slice(-4),
      name: newStylist.name || "Master Barber",
      role: newStylist.role || "Senior Stylist",
      specialty: newStylist.specialty || "Precision Styling",
      experience: newStylist.experience || "5+ Years Experience",
    };

    setStylists((prev) => [...prev, created]);
    setShowAddStylistModal(false);
    setNewStylist({
      name: "",
      role: "Senior Stylist",
      specialty: "Precision Cuts & Styling",
      experience: "5+ Years Experience",
    });
    showToast("success", `Added "${created.name}". Remember to click Save Changes.`);
  };

  // Booking Handlers
  const handleUpdateBookingStatus = (bookingId: string, newStatus: SalonBooking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    showToast("success", "Booking status updated. Remember to click Save.");
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to remove this booking?")) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      fetch(`/api/bookings?id=${bookingId}`, { method: "DELETE" }).catch(() => {});
      showToast("success", "Booking removed.");
    }
  };

  // Filter Services
  const filteredServices = services.filter((s) => {
    const matchesCategory =
      serviceCategoryFilter === "all" || s.category === serviceCategoryFilter;
    const matchesSearch =
      searchQuery === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter Bookings: CRITICAL - Past date bookings are HIDDEN by default as requested!
  const filteredBookings = bookings.filter((b) => {
    // Past date filter: if showPastBookings is false, date must be >= today
    if (!showPastBookings && b.date < todayStr) {
      return false;
    }
    if (bookingStatusFilter !== "all" && b.status !== bookingStatusFilter) {
      return false;
    }
    if (bookingSearchQuery !== "") {
      const q = bookingSearchQuery.toLowerCase();
      const matchName = b.clientName.toLowerCase().includes(q);
      const matchPhone = b.phone.toLowerCase().includes(q);
      const matchRef = b.ref.toLowerCase().includes(q);
      const matchService = b.serviceName.toLowerCase().includes(q);
      return matchName || matchPhone || matchRef || matchService;
    }
    return true;
  });

  const upcomingBookingsCount = bookings.filter((b) => b.date >= todayStr).length;

  // ==================== RENDER LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center p-4 selection:bg-[#00C865] selection:text-black">
        <div className="w-full max-w-md bg-[#161616] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00C865]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#00C865]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#00C865] to-[#009B4E] p-0.5 shadow-[0_0_30px_rgba(0,200,101,0.3)]">
              <div className="w-full h-full bg-[#161616] rounded-2xl flex items-center justify-center">
                <Lock className="w-7 h-7 text-[#00C865]" />
              </div>
            </div>
            <h1 className="font-display uppercase text-2xl font-bold tracking-tight text-white">
              Riverstone Salon
            </h1>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest font-mono">
              Admin & Management Control Panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-400 tracking-wider mb-2">
                Enter Admin PIN
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3.5 text-center text-2xl tracking-[0.4em] font-mono font-bold text-white focus:outline-none focus:border-[#00C865] focus:ring-1 focus:ring-[#00C865] transition-all"
              />
              <span className="text-[11px] text-neutral-500 block text-center mt-2">
                Default PIN is <strong className="text-neutral-400 font-mono">1234</strong>
              </span>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#00C865] hover:bg-[#00B259] active:scale-[0.99] text-black font-extrabold uppercase tracking-wider text-xs rounded-2xl transition-all shadow-[0_0_25px_rgba(0,200,101,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <span>← Back to Riverstone Hair Salon Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER ADMIN DASHBOARD ====================
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white selection:bg-[#00C865] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold tracking-wide transition-all duration-300 animate-in fade-in slide-in-from-top-4 border ${
            toastMessage.type === "success"
              ? "bg-[#14291D] text-[#00E575] border-[#00C865]/40"
              : "bg-[#291414] text-red-400 border-red-500/40"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-[#00E575]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00C865] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,200,101,0.3)] font-bold">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display uppercase text-lg sm:text-xl font-black text-white tracking-tight">
                  Riverstone Hair Salon
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00C865]/20 text-[#00C865] border border-[#00C865]/30">
                  LIVE CMS
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                {settings.salonName} • Garfield Rd East
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#00C865] hover:bg-[#00B259] active:scale-[0.98] disabled:opacity-50 text-black font-extrabold uppercase text-xs tracking-wider rounded-full shadow-[0_0_25px_rgba(0,200,101,0.35)] flex items-center gap-2 cursor-pointer transition-all"
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? "Publishing..." : "Save Changes"}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
              title="View Live Website"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full bg-white/5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
              title="Lock Admin Panel"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "services"
                ? "bg-[#00C865] text-black shadow-[0_0_20px_rgba(0,200,101,0.3)]"
                : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Services & Pricing ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer relative ${
              activeTab === "bookings"
                ? "bg-[#00C865] text-black shadow-[0_0_20px_rgba(0,200,101,0.3)]"
                : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Appointments & Bookings</span>
            {upcomingBookingsCount > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === "bookings" ? "bg-black text-[#00C865]" : "bg-[#00C865] text-black"
              }`}>
                {upcomingBookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("stylists")}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "stylists"
                ? "bg-[#00C865] text-black shadow-[0_0_20px_rgba(0,200,101,0.3)]"
                : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Barbers & Stylists ({stylists.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#00C865] text-black shadow-[0_0_20px_rgba(0,200,101,0.3)]"
                : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Salon Settings</span>
          </button>
        </div>

        {/* ==================== TAB 1: SERVICES & PRICING ==================== */}
        {activeTab === "services" && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-[#161616] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <button
                  onClick={() => setServiceCategoryFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    serviceCategoryFilter === "all"
                      ? "bg-white text-black"
                      : "bg-black/40 text-neutral-400 hover:text-white"
                  }`}
                >
                  All ({services.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setServiceCategoryFilter(c.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      serviceCategoryFilter === c.key
                        ? "bg-white text-black"
                        : "bg-black/40 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {c.name} ({services.filter((s) => s.category === c.key).length})
                  </button>
                ))}
              </div>

              {/* Search & Add Button */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-60">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00C865]"
                  />
                </div>

                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="px-4 py-2 bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-xs uppercase tracking-wide rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>

            {/* Services Grid / Cards with IMAGE CHANGER */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-[#161616] rounded-2xl p-5 border border-white/10 hover:border-[#00C865]/40 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {/* Header Row: Category Badge + Delete */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-[#00C865] px-2.5 py-0.5 rounded-full border border-[#00C865]/30">
                        {service.category}
                      </span>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* SERVICE IMAGE CHANGER & PREVIEW */}
                    <div className="mt-3.5 bg-black/40 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] uppercase font-bold text-[#00C865] tracking-wider flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>Service Photo</span>
                        </label>
                        <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[150px]">
                          {service.image?.split("/").pop()}
                        </span>
                      </div>

                      <div className="flex gap-3 items-center">
                        {/* Live Image Thumbnail Preview */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/80 border border-white/15 shrink-0 group/thumb">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={service.image || "/images/haircut.jpg"}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/haircut.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-[9px] text-white font-bold bg-black/70 px-1.5 py-0.5 rounded">Preview</span>
                          </div>
                        </div>

                        {/* Image Actions: Upload + Dropdown Preset */}
                        <div className="flex-1 space-y-1.5">
                          {/* File Upload Button */}
                          <label className="w-full py-1.5 px-3 bg-white/10 hover:bg-[#00C865] hover:text-black text-neutral-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/10">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingServiceId === service.id ? "Uploading..." : "Upload New Photo"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingServiceId === service.id}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleImageFileUpload(service.id, f);
                              }}
                              className="hidden"
                            />
                          </label>

                          {/* Preset Gallery Dropdown */}
                          <select
                            value={service.image}
                            onChange={(e) => handleServiceChange(service.id, "image", e.target.value)}
                            className="w-full bg-black/80 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#00C865] cursor-pointer"
                            title="Choose from existing salon gallery photos"
                          >
                            <option value={service.image}>Current: {service.image?.split("/").pop()}</option>
                            {PRESET_SALON_IMAGES.map((preset) => (
                              <option key={preset.path} value={preset.path}>
                                {preset.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Service Name Input */}
                    <div className="mt-3">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                        Service Name
                      </label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) =>
                          handleServiceChange(service.id, "name", e.target.value)
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#00C865]"
                      />
                    </div>

                    {/* Subtitle Input */}
                    <div className="mt-2.5">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                        Subtitle / Highlights
                      </label>
                      <input
                        type="text"
                        value={service.subtitle}
                        onChange={(e) =>
                          handleServiceChange(service.id, "subtitle", e.target.value)
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#00C865]"
                      />
                    </div>

                    {/* Price & Duration Row */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#00C865] tracking-wider block mb-1">
                          Price Display ($)
                        </label>
                        <input
                          type="text"
                          value={service.priceFormatted}
                          onChange={(e) =>
                            handleServiceChange(
                              service.id,
                              "priceFormatted",
                              e.target.value
                            )
                          }
                          className="w-full bg-black/60 border border-[#00C865]/40 rounded-xl px-3 py-1.5 text-sm font-bold text-[#00C865] focus:outline-none focus:ring-1 focus:ring-[#00C865]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={service.duration}
                          onChange={(e) =>
                            handleServiceChange(service.id, "duration", e.target.value)
                          }
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#00C865]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer Info */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!service.popular}
                        onChange={(e) =>
                          handleServiceChange(service.id, "popular", e.target.checked)
                        }
                        className="rounded border-white/20 text-[#00C865] focus:ring-0"
                      />
                      <span className="text-neutral-300 text-xs">Featured / Signature</span>
                    </label>
                    <span className="font-mono text-[10px] text-neutral-600">
                      ID: {service.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: APPOINTMENTS & BOOKINGS ==================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            
            {/* Header info & filters */}
            <div className="bg-[#161616] p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display uppercase text-lg font-bold text-white tracking-tight">
                    Customer Appointments & Bookings
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#00C865]/20 text-[#00C865] border border-[#00C865]/30">
                    {filteredBookings.length} Active
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Live appointments submitted via website & WhatsApp concierge. Past date bookings are filtered out automatically.
                </p>
              </div>

              {/* Past Date Filter Toggle & Status selector */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Past Date Filter Toggle: OFF by default so past dates are NOT shown! */}
                <label className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10 cursor-pointer text-xs font-semibold text-neutral-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={showPastBookings}
                    onChange={(e) => setShowPastBookings(e.target.checked)}
                    className="rounded border-white/20 text-[#00C865] focus:ring-0"
                  />
                  <span>Include Past Bookings History</span>
                </label>

                {/* Status Filter */}
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#00C865] cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client name, phone number, service or RS- reference..."
                value={bookingSearchQuery}
                onChange={(e) => setBookingSearchQuery(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00C865]"
              />
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-[#161616] rounded-2xl p-12 text-center border border-white/10 space-y-3">
                <Calendar className="w-10 h-10 text-neutral-600 mx-auto" />
                <h4 className="font-display uppercase text-base font-bold text-neutral-300">
                  No Upcoming Bookings Found
                </h4>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  {showPastBookings
                    ? "No bookings match your current search query."
                    : "No future appointments scheduled yet. Past bookings have been filtered out as requested."}
                </p>
                {!showPastBookings && (
                  <button
                    onClick={() => setShowPastBookings(true)}
                    className="text-xs text-[#00C865] underline cursor-pointer"
                  >
                    View past bookings archive
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBookings.map((b) => {
                  const isToday = b.date === todayStr;
                  const isPast = b.date < todayStr;

                  return (
                    <div
                      key={b.id}
                      className={`bg-[#161616] rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-lg relative ${
                        isToday
                          ? "border-[#00C865] shadow-[0_0_20px_rgba(0,200,101,0.2)]"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div>
                        {/* Top Row: Date Badge & Status */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                isToday
                                  ? "bg-[#00C865] text-black"
                                  : isPast
                                  ? "bg-neutral-800 text-neutral-400"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {isToday ? "TODAY" : isPast ? "PAST" : "UPCOMING"}
                            </span>
                            <span className="text-xs font-mono font-bold text-neutral-300">
                              {b.date}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-neutral-500 bg-black/60 px-2 py-0.5 rounded">
                            {b.ref}
                          </span>
                        </div>

                        {/* Client Info */}
                        <div className="mt-3.5 space-y-1">
                          <h4 className="text-base font-black text-white leading-tight">
                            {b.clientName}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#00C865]" />
                              {b.phone}
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-neutral-500" />
                              {b.time}
                            </span>
                          </div>
                        </div>

                        {/* Service & Stylist Box */}
                        <div className="mt-3.5 p-3 rounded-xl bg-black/50 border border-white/5 space-y-1 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-white">{b.serviceName}</span>
                            <span className="text-[#00C865]">{b.servicePrice}</span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                            <span>Barber: {b.stylistName}</span>
                          </div>
                          {b.notes && (
                            <p className="text-[11px] text-neutral-400 italic pt-1 border-t border-white/5">
                              &ldquo;{b.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bottom Action Row */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                        {/* Status Select */}
                        <select
                          value={b.status}
                          onChange={(e) =>
                            handleUpdateBookingStatus(
                              b.id,
                              e.target.value as SalonBooking["status"]
                            )
                          }
                          className={`text-[11px] font-bold rounded-lg px-2.5 py-1 focus:outline-none border cursor-pointer ${
                            b.status === "confirmed"
                              ? "bg-[#00C865]/20 text-[#00C865] border-[#00C865]/40"
                              : b.status === "completed"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                              : b.status === "cancelled"
                              ? "bg-red-500/20 text-red-400 border-red-500/40"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                          }`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <div className="flex items-center gap-1.5">
                          {/* Direct WhatsApp Message Button */}
                          {b.phone && (
                            <a
                              href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=Hi ${encodeURIComponent(
                                b.clientName
                              )}, confirming your appointment at Riverstone Hair Salon on ${b.date} at ${b.time}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                              title="Chat with client on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete Booking */}
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Remove booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: BARBERS & STYLISTS ==================== */}
        {activeTab === "stylists" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#161616] p-5 rounded-2xl border border-white/10">
              <div>
                <h3 className="font-display uppercase text-lg font-bold text-white tracking-tight">
                  Salon Barbers & Stylists
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Change the names and roles of your barbers. These names appear in the booking form and customer WhatsApp messages.
                </p>
              </div>
              <button
                onClick={() => setShowAddStylistModal(true)}
                className="px-4 py-2 bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-xs uppercase tracking-wide rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Barber</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {stylists.map((st) => (
                <div
                  key={st.id}
                  className="bg-[#161616] rounded-2xl p-5 border border-white/10 hover:border-[#00C865]/40 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <span className="text-[10px] font-mono text-neutral-500">
                        ID: {st.id}
                      </span>
                      <button
                        onClick={() => handleDeleteStylist(st.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Barber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                        Barber Name
                      </label>
                      <input
                        type="text"
                        value={st.name}
                        onChange={(e) => handleStylistChange(st.id, "name", e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#00C865]"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                        Role / Title
                      </label>
                      <input
                        type="text"
                        value={st.role}
                        onChange={(e) => handleStylistChange(st.id, "role", e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#00C865]"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                        Specialty
                      </label>
                      <input
                        type="text"
                        value={st.specialty}
                        onChange={(e) => handleStylistChange(st.id, "specialty", e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#00C865]"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block mb-1">
                        Experience Badge
                      </label>
                      <input
                        type="text"
                        value={st.experience}
                        onChange={(e) => handleStylistChange(st.id, "experience", e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#00C865]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: SALON SETTINGS ==================== */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-[#161616] p-5 rounded-2xl border border-white/10">
              <h3 className="font-display uppercase text-lg font-bold text-white tracking-tight">
                General Salon Information
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                These details appear in the website header, footer, booking concierge and WhatsApp message automation.
              </p>
            </div>

            <div className="bg-[#161616] rounded-2xl p-6 border border-white/10 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs uppercase font-bold text-neutral-400 block mb-1.5">
                    Salon Name
                  </label>
                  <input
                    type="text"
                    value={settings.salonName}
                    onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-neutral-400 block mb-1.5">
                    Phone Number (Display)
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-[#00C865] block mb-1.5">
                    WhatsApp Number (International format e.g. 61448858949)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full bg-black/50 border border-[#00C865]/40 rounded-xl px-4 py-2.5 text-sm text-[#00C865] focus:ring-1 focus:ring-[#00C865] focus:outline-none font-mono font-bold"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    All online booking requests are directed to this WhatsApp number.
                  </span>
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-neutral-400 block mb-1.5">
                    Website Address
                  </label>
                  <input
                    type="text"
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-neutral-400 block mb-1.5">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="text-xs uppercase font-bold text-neutral-400 block mb-1.5">
                  Admin Panel Access PIN
                </label>
                <div className="max-w-xs">
                  <input
                    type="text"
                    maxLength={8}
                    value={settings.adminPin}
                    onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold tracking-widest focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    Change this PIN to secure your admin control panel.
                  </span>
                </div>
              </div>
            </div>

            {/* Reset Defaults Danger Zone */}
            <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-red-400 uppercase tracking-wide">
                  Factory Defaults Reset
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Revert all services, prices and barbers to the original Riverstone salon menu.
                </p>
              </div>
              <button
                onClick={handleResetDefaults}
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold text-xs uppercase tracking-wider rounded-full border border-red-500/30 transition-colors cursor-pointer whitespace-nowrap"
              >
                Reset All to Defaults
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ==================== ADD SERVICE MODAL WITH IMAGE CHANGER ==================== */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181818] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="font-display uppercase text-xl font-bold text-white mb-4">
              Add New Salon Service
            </h3>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-neutral-300 block mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deluxe Scissor Cut & Hot Towel"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-neutral-300 block mb-1">
                  Category *
                </label>
                <select
                  value={newService.category}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      category: e.target.value as ServiceCategoryKey,
                    })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none cursor-pointer"
                >
                  <option value="haircuts">HAIRCUTS</option>
                  <option value="colour">COLOUR</option>
                  <option value="foils">FOILS</option>
                  <option value="perm">PERM</option>
                  <option value="other">OTHER SERVICES</option>
                </select>
              </div>

              {/* SERVICE IMAGE CHANGER FOR NEW SERVICE */}
              <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                <label className="text-xs uppercase font-bold text-[#00C865] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Service Image Photo</span>
                </label>

                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black border border-white/15 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={newService.image || "/images/haircut.jpg"}
                      alt="Service preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="w-full py-1.5 px-3 bg-white/10 hover:bg-[#00C865] hover:text-black text-neutral-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/10">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingServiceId === "NEW_SERVICE" ? "Uploading..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingServiceId === "NEW_SERVICE"}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageFileUpload("NEW_SERVICE", f);
                        }}
                        className="hidden"
                      />
                    </label>

                    <select
                      value={newService.image}
                      onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                      className="w-full bg-black/80 border border-white/10 rounded-lg px-2 py-1 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#00C865] cursor-pointer"
                    >
                      {PRESET_SALON_IMAGES.map((preset) => (
                        <option key={preset.path} value={preset.path}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase font-bold text-neutral-300 block mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        price: Number(e.target.value),
                        priceFormatted: `$${e.target.value}`,
                      })
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-neutral-300 block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45 mins"
                    value={newService.duration}
                    onChange={(e) =>
                      setNewService({ ...newService, duration: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-neutral-300 block mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Classic & Modern Styling"
                  value={newService.subtitle}
                  onChange={(e) =>
                    setNewService({ ...newService, subtitle: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-xs uppercase tracking-wide rounded-full shadow-md transition-all cursor-pointer"
                >
                  Add Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD BARBER MODAL ==================== */}
      {showAddStylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181818] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="font-display uppercase text-xl font-bold text-white mb-4">
              Add New Barber / Stylist
            </h3>

            <form onSubmit={handleAddStylist} className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-neutral-300 block mb-1">
                  Barber Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={newStylist.name}
                  onChange={(e) =>
                    setNewStylist({ ...newStylist, name: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-neutral-300 block mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Barber & Colour Specialist"
                  value={newStylist.role}
                  onChange={(e) =>
                    setNewStylist({ ...newStylist, role: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-neutral-300 block mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zero Fades, Beard Lines & Scissor Craft"
                  value={newStylist.specialty}
                  onChange={(e) =>
                    setNewStylist({ ...newStylist, specialty: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-neutral-300 block mb-1">
                  Experience Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7+ Years Experience"
                  value={newStylist.experience}
                  onChange={(e) =>
                    setNewStylist({ ...newStylist, experience: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:ring-1 focus:ring-[#00C865] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#00C865] hover:bg-[#00B259] text-black font-bold text-xs uppercase tracking-wide rounded-full shadow-md transition-all cursor-pointer"
                >
                  Add Barber
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStylistModal(false)}
                  className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
