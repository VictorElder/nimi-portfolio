import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Divider line above footer — inset to match the portfolio lines (not end-to-end) */}
      <div className="mx-6 mt-20 border-t border-[#fdcc1e]/30 sm:mt-28 lg:mx-[82px]" />

      <footer
        aria-label="Site footer"
        className="reveal from-up mx-6 mt-16 border border-[#fdcc1e]/35 bg-[#0b0b0b] px-6 py-12 sm:mt-20 sm:px-10 sm:py-16 lg:mx-[82px] lg:px-16 lg:py-20"
      >
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono text-xs uppercase tracking-[.18em] text-[#fdcc1e]/70">
              Have a good one in mind?
            </p>
            <h2 className="mt-4 max-w-3xl text-[clamp(38px,6vw,76px)] font-medium leading-[.93] tracking-[-.07em]">
              Let’s make something <em className="font-serif font-normal">matter.</em>
            </h2>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <p className="mb-5 max-w-sm text-base leading-7 text-[#fdcc1e]/75">
              Bring the first idea. We can shape the rest together.
            </p>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center gap-5 border border-[#fdcc1e] px-5 font-mono text-sm uppercase tracking-wider transition hover:bg-[#fdcc1e] hover:text-black"
            >
              Get in touch <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
