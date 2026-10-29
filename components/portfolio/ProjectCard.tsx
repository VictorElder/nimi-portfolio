import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      className={`reveal ${index % 2 ? "from-right" : "from-left"}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <figure className="group relative aspect-[4/5] overflow-hidden border border-[#fdcc1e]/20 bg-[#101010] p-3 transition-colors hover:border-[#fdcc1e]/55">
        <img
          src={project.image}
          alt={`${project.title} design project`}
          className="size-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
        />
      </figure>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-xl font-medium tracking-tight">{project.title}</h2>
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#fdcc1e]/75">
          {project.type}
        </p>
      </div>

      <div className="mt-5 max-w-lg border-l border-[#fdcc1e]/50 pl-4">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-[.16em] text-[#fdcc1e]/60">
          Project note
        </p>
        <p className="text-sm leading-6 text-[#fdcc1e]/85">
          {project.description}
        </p>
      </div>
    </article>
  );
}
