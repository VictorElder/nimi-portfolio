import { Button } from "@/component/ui/button";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="flex min-h-[580px] flex-col px-6 py-24 lg:min-h-[670px] lg:px-[130px] lg:py-36"
    >
      <p className="reveal from-up font-mono text-[10px] uppercase tracking-wider">
        (03) Have a project in mind?
      </p>
      <h1 className="reveal from-up my-12 text-[clamp(56px,9vw,136px)] font-medium leading-[.82] tracking-[-.08em]">
        Let’s make
        <br />
        <em className="font-serif">something matter.</em>
      </h1>
      <Button
        asChild
        variant="ghost"
        className="reveal from-up w-fit border-b border-[#fdcc1e] bg-transparent pb-2 font-mono text-[clamp(17px,2vw,30px)] text-[#fdcc1e] transition hover:translate-x-2"
      >
        <a href="mailto:hello@santino.design">
          hello@santino.design <span className="ml-4">↗</span>
        </a>
      </Button>

      <footer className="mt-auto flex flex-wrap justify-between gap-3 pt-16 font-mono text-[9px] tracking-wider">
        <span>© SANTINO 2025</span>
        <span>INSTAGRAM &nbsp; LINKEDIN</span>
        <span className="max-sm:hidden">MADE WITH INTENT</span>
      </footer>
    </section>
  );
}
