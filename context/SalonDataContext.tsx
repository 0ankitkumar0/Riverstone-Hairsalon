"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SALON_SERVICES,
  STYLISTS,
  SERVICE_CATEGORIES,
  SalonService,
  Stylist,
  ServiceCategory,
} from "@/data/services";

interface SalonSettings {
  salonName: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  website: string;
  adminPin: string;
}

interface SalonDataContextType {
  services: SalonService[];
  stylists: Stylist[];
  categories: ServiceCategory[];
  settings: SalonSettings;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateServicePrice: (serviceId: string, newPrice: number, newPriceFormatted: string) => void;
  updateStylistName: (stylistId: string, newName: string) => void;
}

const defaultSettings: SalonSettings = {
  salonName: "Riverstone Hair Salon",
  phone: "0448 858 949",
  whatsappNumber: "61448858949",
  address: "Shop 1 / 52 Garfield Road East Riverstone",
  website: "www.Riverstonehairsalon.com.au",
  adminPin: "1234",
};

const SalonDataContext = createContext<SalonDataContextType>({
  services: SALON_SERVICES,
  stylists: STYLISTS,
  categories: SERVICE_CATEGORIES,
  settings: defaultSettings,
  isLoading: false,
  refreshData: async () => {},
  updateServicePrice: () => {},
  updateStylistName: () => {},
});

export function SalonDataProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<SalonService[]>(SALON_SERVICES);
  const [stylists, setStylists] = useState<Stylist[]>(STYLISTS);
  const [categories, setCategories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);
  const [settings, setSettings] = useState<SalonSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.services && Array.isArray(data.services)) {
          setServices(data.services);
        }
        if (data.stylists && Array.isArray(data.stylists)) {
          setStylists(data.stylists);
        }
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.error("Failed to fetch live salon data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Listen for custom event from admin page
    const handleDataUpdate = () => {
      refreshData();
    };

    window.addEventListener("salon-data-updated", handleDataUpdate);
    window.addEventListener("storage", handleDataUpdate);

    return () => {
      window.removeEventListener("salon-data-updated", handleDataUpdate);
      window.removeEventListener("storage", handleDataUpdate);
    };
  }, [refreshData]);

  const updateServicePrice = (
    serviceId: string,
    newPrice: number,
    newPriceFormatted: string
  ) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? { ...s, price: newPrice, priceFormatted: newPriceFormatted }
          : s
      )
    );
  };

  const updateStylistName = (stylistId: string, newName: string) => {
    setStylists((prev) =>
      prev.map((st) => (st.id === stylistId ? { ...st, name: newName } : st))
    );
  };

  return (
    <SalonDataContext.Provider
      value={{
        services,
        stylists,
        categories,
        settings,
        isLoading,
        refreshData,
        updateServicePrice,
        updateStylistName,
      }}
    >
      {children}
    </SalonDataContext.Provider>
  );
}

export function useSalonData() {
  return useContext(SalonDataContext);
}
