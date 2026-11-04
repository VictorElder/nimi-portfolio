import Link from "next/link";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="mx-6 grid lg:mx-[82px] lg:grid-cols-2"
    >
      <div className="reveal from-left relative min-h-[440px] overflow-hidden md:min-h-[520px]">
        <img
          src="/images/nimi.jpg"
          alt="Portrait of Nimi"
          className="size-full object-cover grayscale transition duration-500 hover:scale-105"
        />
      </div>

      <div className="reveal from-right border-t border-[#fdcc1e] px-6 py-16 lg:border-l lg:border-t-0 lg:px-[13%] lg:py-24">
        <h2 className="mt-12 text-[clamp(40px,4.2vw,67px)] font-medium leading-[.92] tracking-[-.07em]">
          A curious mind with a sharp point of view.
        </h2>
        <p className="mt-8 max-w-sm text-base leading-6 md:text-lg">
          I’m Nimi, an independent graphic designer working across visual identity, image-making, and culture. I’m drawn to the relationship between ideas and visuals, and how thoughtful design can shape the way people see, feel, and connect with a brand. I enjoy exploring different creative directions, experimenting with typography, imagery, and composition, and finding ways to make each project feel distinctive. I create work that balances clarity with character, always aiming for something that feels considered, unexpected, and impossible to ignore. I’m currently available for freelance work, and I’d love to hear about your project.
        </p>

        <div className="mt-8 flex w-full items-center justify-between sm:mt-9 sm:w-auto sm:justify-start sm:gap-4">
          <Link
            href="/designs"
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 border border-[#fdcc1e] bg-[#fdcc1e] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-normal text-black transition hover:bg-transparent hover:text-[#fdcc1e] sm:min-h-12 sm:gap-4 sm:px-5 sm:text-sm sm:tracking-wider"
          >
            Explore the work <span aria-hidden="true">↓</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-9 shrink-0 items-center justify-end gap-1 whitespace-nowrap px-1 text-xs text-[#fdcc1e]/85 underline decoration-[#fdcc1e]/40 underline-offset-4 transition hover:text-[#fdcc1e] sm:min-h-12 sm:gap-2.5 sm:px-2 sm:text-base"
          >
            Start a conversation <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
