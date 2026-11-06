import type { Metadata } from "next";
import SiteNavbar from "@/components/portfolio/SiteNavbar";
import InviteSessionBridge from "@/components/auth/InviteSessionBridge";
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
        <SiteNavbar />
        <InviteSessionBridge />
        {children}
      </body>
    </html>
  );
}
