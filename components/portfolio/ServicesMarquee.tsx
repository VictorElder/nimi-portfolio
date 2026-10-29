const tools = ["Canva", "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign"];
const repeatedGroups = Array.from({ length: 5 }, (_, index) => index);

export default function ServicesMarquee() {
  return (
    <section
      aria-label="Tools: Canva, Adobe Photoshop, Adobe Illustrator, and Adobe InDesign"
      className="overflow-hidden border-b border-[#fdcc1e]/35 py-5 font-mono text-sm uppercase"
    >
      <div className="services-marquee-track" aria-hidden="true">
        {repeatedGroups.map((group) => (
          <div
            key={group}
            className="flex shrink-0 items-center gap-6 pr-6"
          >
            {tools.map((tool) => (
              <span key={tool} className="flex shrink-0 items-center gap-6">
                <span>{tool}</span>
                <span aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
