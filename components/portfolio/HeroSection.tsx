export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[790px] items-center overflow-hidden px-6 pb-20 pt-24 md:min-h-[860px] lg:px-[130px] lg:pt-28"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src="/images/nimi.jpg"
          alt=""
          className="size-full object-cover object-center grayscale"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/65 to-black/30" />
      </div>

      <div className="relative z-10 w-full md:w-[58%]">
        <p className="reveal from-left font-mono text-[10px] uppercase tracking-[.08em]">
          Independent graphic designer
        </p>
        <h1 className="reveal from-left my-9 text-[clamp(58px,8.4vw,128px)] font-medium leading-[.84] tracking-[-.075em]">
          Visual <em className="font-serif font-medium">energy</em>
          <br />
          for bold ideas.
        </h1>
        <div className="reveal from-up flex w-full max-w-[590px] items-end justify-between gap-6">
          <p className="max-w-[270px] text-sm leading-6">
            I build distinctive identities, editorial worlds, and campaigns
            for people with something to say.
          </p>
        </div>
      </div>
    </section>
  );
}
