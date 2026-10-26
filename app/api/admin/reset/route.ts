import { NextResponse } from "next/server";
import { DEFAULT_SALON_DATA, saveSalonData } from "@/lib/salonStorage";

export async function POST() {
  try {
    await saveSalonData(DEFAULT_SALON_DATA);

    return NextResponse.json({
      success: true,
      message: "Salon data reset to default successfully",
      data: DEFAULT_SALON_DATA,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset salon data" },
      { status: 500 }
    );
  }
}

