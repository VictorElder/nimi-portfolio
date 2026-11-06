import Link from "next/link";

export const metadata = {
  title: "Page not found — Nimi",
  description: "The page you’re looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-[1440px] flex-col justify-center overflow-hidden px-6 py-20 lg:px-[82px]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 select-none font-serif text-[min(70vw,620px)] leading-none tracking-[-.12em] text-[#fdcc1e]/[.035]">404</div>
      <div className="relative max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[.24em] text-[#fdcc1e]/60">Lost in the layout</p>
        <h1 className="mt-6 text-[clamp(54px,9vw,112px)] font-medium leading-[.86] tracking-[-.08em]">This page<br /><em className="font-serif font-normal">isn’t here.</em></h1>
        <p className="mt-7 max-w-md text-sm leading-6 text-[#fdcc1e]/70">The link may be outdated, or the page may have moved. Let’s get you back to the work.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex min-h-12 items-center bg-[#fdcc1e] px-5 font-mono text-[10px] uppercase tracking-[.14em] text-black transition hover:bg-white">Back home</Link>
          <Link href="/designs" className="inline-flex min-h-12 items-center border border-[#fdcc1e]/40 px-5 font-mono text-[10px] uppercase tracking-[.14em] text-[#fdcc1e] transition hover:bg-[#fdcc1e] hover:text-black">Explore designs</Link>
        </div>
        <p className="mt-16 font-mono text-[9px] uppercase tracking-[.2em] text-[#fdcc1e]/35">Nimi <span className="mx-2">✦</span> Independent graphic designer</p>
      </div>
    </main>
  );
}
