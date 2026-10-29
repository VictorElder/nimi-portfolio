import type { Metadata } from "next";
import Navbar from "@/components/portfolio/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nimi — Independent Graphic Designer",
  description:
    "Distinctive identities, editorial worlds, and campaigns by Nimi, an independent graphic designer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-[#fdcc1e]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
