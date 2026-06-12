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
      <body>
        {children}
        <script
          defer
          src="https://pulse.ayushojha.com/api/script.js"
          data-api="https://pulse.ayushojha.com"
          data-key="pa_live_CuTXyZWUl_dTX5JqxqYnBAC8"
        ></script>
      </body>
    </html>
  );
}
