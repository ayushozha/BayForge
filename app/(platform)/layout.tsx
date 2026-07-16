import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./platform.css";

const platformSans = Inter({
  subsets: ["latin"],
  variable: "--platform-sans",
});

const platformSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--platform-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Platform - Bay Forge",
    template: "%s - Bay Forge",
  },
  description:
    "The authenticated Bay Forge workspace for hackathon submissions, judging, and event operations.",
};

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${platformSans.variable} ${platformSerif.variable} platform-root`}
    >
      {children}
    </div>
  );
}
