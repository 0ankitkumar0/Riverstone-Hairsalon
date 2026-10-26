import { NextResponse } from "next/server";
import { getSalonData, saveSalonData } from "@/lib/salonStorage";

export async function GET() {
  const data: any = await getSalonData();
  const bookings = data.bookings || [];
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  try {
    const bookingData = await request.json();
    const data: any = await getSalonData();
    const bookings = data.bookings || [];

    const newBooking = {
      id: "bk_" + Date.now().toString(),
      ref: bookingData.ref || ("RS-" + Math.floor(100000 + Math.random() * 900000)),
      clientName: bookingData.clientName || bookingData.name || "Guest Client",
      phone: bookingData.phone || "",
      email: bookingData.email || "",
      serviceId: bookingData.serviceId || "",
      serviceName: bookingData.serviceName || "",
      servicePrice: bookingData.servicePrice || "",
      stylistId: bookingData.stylistId || "",
      stylistName: bookingData.stylistName || "Any Available Stylist",
      date: bookingData.date, // YYYY-MM-DD
      time: bookingData.time || "10:00 AM",
      notes: bookingData.notes || "",
      status: bookingData.status || "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Prepend to list
    const updatedBookings = [newBooking, ...bookings];
    const updatedData = { ...data, bookings: updatedBookings };

    await saveSalonData(updatedData);

    return NextResponse.json({
      success: true,
      message: "Booking recorded successfully",
      booking: newBooking,
    });
  } catch (err: any) {
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const data: any = await getSalonData();
    const bookings = (data.bookings || []).filter((b: any) => b.id !== id);
    const updatedData = { ...data, bookings };

    await saveSalonData(updatedData);

    return NextResponse.json({ success: true, message: "Booking removed" });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
