import { NextResponse } from "next/server";
import { getSalonData, saveSalonData } from "@/lib/salonStorage";
import { SERVICE_CATEGORIES } from "@/data/services";

export async function GET() {
  const data = await getSalonData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { services, stylists, settings, pin } = body;

    const currentData: any = await getSalonData();
    const correctPin = currentData.settings?.adminPin || "1234";

    // Validate PIN
    if (pin && pin !== correctPin) {
      return NextResponse.json(
        { error: "Incorrect Admin PIN" },
        { status: 401 }
      );
    }

    const updatedData = {
      services: services || currentData.services,
      stylists: stylists || currentData.stylists,
      categories: currentData.categories || SERVICE_CATEGORIES,
      bookings: body.bookings || currentData.bookings || [],
      settings: {
        ...currentData.settings,
        ...settings,
      },
    };

    await saveSalonData(updatedData);

    return NextResponse.json({
      success: true,
      message: "Salon data updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error saving salon data:", error);
    return NextResponse.json(
      { error: "Failed to save salon data" },
      { status: 500 }
    );
  }
}

