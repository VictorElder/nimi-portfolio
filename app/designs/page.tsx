import RevealObserver from "@/components/portfolio/RevealObserver";
import WorkSection from "@/components/portfolio/WorkSection";
import { getPublishedProjects } from "@/lib/projects";

export const metadata = {
  title: "Designs — Nimi",
  description: "Selected design projects and campaigns by Nimi.",
};

export const dynamic = "force-dynamic";

export default async function DesignsPage() {
  const projects = await getPublishedProjects();
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1440px] overflow-hidden bg-black text-[#fdcc1e] pb-12">
      <RevealObserver />
      <WorkSection projects={projects} />
    </main>
  );
}

