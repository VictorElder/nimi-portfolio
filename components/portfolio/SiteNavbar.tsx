"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/portfolio/Navbar";

export default function SiteNavbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
}
