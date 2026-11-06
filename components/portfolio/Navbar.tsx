"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Designs", href: "/designs" },
  { label: "Contact me", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (href: string) =>
    `font-mono text-sm uppercase tracking-[.12em] transition sm:text-base ${
      pathname === href ? "text-[#fdcc1e]" : "text-[#fdcc1e]/80 hover:text-[#fdcc1e]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#fdcc1e]/20 bg-black/90 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 lg:px-[82px]"
      >
        <Link
          href="/"
          aria-label="Nimi home"
          className="font-serif text-3xl font-semibold tracking-[-.08em] text-[#fdcc1e] transition hover:opacity-75"
        >
          Nimi<span aria-hidden="true" className="ml-1 text-sm">✦</span>
        </Link>

        <ul className="hidden items-center gap-5 md:flex lg:gap-9">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex size-12 items-center justify-center border border-[#fdcc1e]/40 text-[#fdcc1e] transition hover:bg-[#fdcc1e] hover:text-black md:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
            {menuOpen ? (
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-[#fdcc1e]/20 bg-black/95 px-6 py-3 md:hidden">
          <ul className="mx-auto flex max-w-[1440px] flex-col">
            {navigationItems.map((item, index) => (
              <li key={item.href} className="border-b border-[#fdcc1e]/15 last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`flex min-h-14 items-center justify-between text-base transition hover:text-[#fdcc1e] ${pathname === item.href ? "text-[#fdcc1e]" : "text-[#fdcc1e]/80"}`}
                >
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
