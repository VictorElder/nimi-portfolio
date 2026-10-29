import Link from "next/link";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Designs", href: "/designs" },
  { label: "Contact me", href: "/contact" },
];

export default function Navbar() {
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

        <ul className="flex items-center gap-5 sm:gap-9">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="font-mono text-[10px] uppercase tracking-[.12em] text-[#fdcc1e]/80 transition hover:text-[#fdcc1e] sm:text-xs"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
