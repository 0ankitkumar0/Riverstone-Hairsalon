import type { Metadata } from "next";
import "./globals.css";
import { SalonDataProvider } from "@/context/SalonDataContext";

export const metadata: Metadata = {
  title: "RIVERSTONE HAIR SALON — Premium Hair Care For A Better You",
  description:
    "Expert stylists, modern salon, look good and feel confident. Book your bespoke haircut, beard sculpt, hair color, and grooming experience at Riverstone Hair Salon.",
  keywords: [
    "Riverstone Hair Salon",
    "Luxury Salon",
    "Haircut",
    "Beard Trim",
    "Hair Colour",
    "Grooming",
    "Editorial Hair",
    "Appointment Booking",
  ],
  openGraph: {
    title: "RIVERSTONE HAIR SALON — Premium Hair Care For A Better You",
    description:
      "A modern sanctuary designed around comfort, precision and personal style. Book your transformation today.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#111111]">
        <SalonDataProvider>{children}</SalonDataProvider>
      </body>
    </html>
  );
}
