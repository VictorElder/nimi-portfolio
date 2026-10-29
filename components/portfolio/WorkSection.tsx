import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function WorkSection() {
  return (
    <section id="work" className="px-6 py-28 lg:px-[82px] lg:py-40">
      <div className="reveal from-left mb-16 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[.2em]">
          Selected client work / 2025
        </p>
        <h1 className="mt-5 text-[clamp(42px,6vw,88px)] font-medium leading-[.9] tracking-[-.07em]">
          Design that makes
          <br />
          <em className="font-serif font-normal">people feel something.</em>
        </h1>
        <p className="mt-7 max-w-md text-sm leading-6 text-[#fdcc1e]/80">
          A focused selection of promotional design, brand communication, and
          event artwork made to stand out in the real world.
        </p>
      </div>

      <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
