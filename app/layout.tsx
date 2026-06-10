import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bay Forge",
  description:
    "Bay Forge brings Bay Area builders, designers, and dreamers together to build, ship, and launch impactful projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
