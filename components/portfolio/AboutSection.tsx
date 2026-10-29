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
        <p className="mt-8 max-w-sm text-base leading-6">
          I’m Nimi, an independent graphic designer working across identity,
          image-making, and culture. I partner with ambitious teams and
          founders to make work that is clear, unexpected, and impossible to
          ignore.
        </p>
      </div>
    </section>
  );
}
