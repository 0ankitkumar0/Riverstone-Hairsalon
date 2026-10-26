import { SALON_SERVICES, STYLISTS, SERVICE_CATEGORIES } from "@/data/services";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "salon-data.json");

export const DEFAULT_SALON_DATA = {
  services: SALON_SERVICES,
  stylists: STYLISTS,
  categories: SERVICE_CATEGORIES,
  settings: {
    salonName: "Riverstone Hair Salon",
    phone: "0448 858 949",
    whatsappNumber: "61448858949",
    address: "Shop 1 / 52 Garfield Road East Riverstone",
    website: "www.Riverstonehairsalon.com.au",
    adminPin: "1234",
  },
  bookings: [],
};

export async function getSalonData() {
  // 1. Try Netlify Blobs first (works automatically in Netlify production)
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("salon-data");
    const blobData = await store.get("salon_config", { type: "json" });
    if (blobData && typeof blobData === "object") {
      return blobData;
    }
  } catch (err) {
    // Expected in local development (MissingBlobsEnvironmentError)
  }

  // 2. Local filesystem fallback (local dev)
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Local file read error:", err);
  }

  return DEFAULT_SALON_DATA;
}

export async function saveSalonData(data: unknown) {
  let savedToNetlify = false;

  // 1. Try Netlify Blobs first (works automatically in Netlify production)
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("salon-data");
    await store.setJSON("salon_config", data);
    savedToNetlify = true;
  } catch (err) {
    // Not running on Netlify or MissingBlobsEnvironmentError
  }

  // 2. Also write to local file if accessible (for local development)
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // In read-only serverless lambdas on Netlify, fs.writeFileSync may throw EROFS.
    // If savedToNetlify is true, that's expected and completely fine.
    if (!savedToNetlify) {
      throw err;
    }
  }

  return true;
}

