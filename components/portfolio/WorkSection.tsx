"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function WorkSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current === null ? null : (current + 1) % projects.length));
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + projects.length) % projects.length,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  const activeProject = activeIndex === null ? null : projects[activeIndex];

  return (
    <section id="work" className="px-6 py-28 lg:px-[82px] lg:py-40">
      <div className="reveal from-left mb-16 max-w-3xl">
        
        <h1 className="mt-5 text-[clamp(42px,6vw,88px)] font-medium leading-[.9] tracking-[-.07em]">
          Design that makes
          <br />
          <em className="font-serif font-normal">people feel something.</em>
        </h1>
        <p className="mt-7 max-w-md text-sm leading-6 text-[#fdcc1e]/80">
          A curated collection of visual identities, promotional designs, and creative campaigns developed for clients and brands. Each project reflects a thoughtful approach to visual communication, balancing strong concepts with purposeful execution and distinctive aesthetics.
        </p>
      </div>

        <p className="font-mono text-[10px] uppercase tracking-[.2em]">
          Selected client work
        </p>
        
      <div className="grid gap-x-10 gap-y-20 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={index}
            onImageClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {activeProject && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeProject.title} image viewer`}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 z-10 flex size-11 items-center justify-center border border-[#fdcc1e]/40 bg-black/60 text-2xl text-[#fdcc1e] transition hover:bg-[#fdcc1e] hover:text-black"
          >
            <span aria-hidden="true">×</span>
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex((activeIndex - 1 + projects.length) % projects.length);
            }}
            aria-label="Previous design"
            className="absolute left-3 z-10 hidden size-12 items-center justify-center border border-[#fdcc1e]/40 bg-black/60 text-[#fdcc1e] transition hover:bg-[#fdcc1e] hover:text-black sm:flex sm:left-8 sm:size-14"
          >
            <Chevron direction="left" />
          </button>

          <figure
            className="flex max-h-full max-w-5xl flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              const touch = event.touches[0];
              touchStart.current = touch
                ? { x: touch.clientX, y: touch.clientY }
                : null;
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              const touch = event.changedTouches[0];
              touchStart.current = null;
              if (!start || !touch) return;

              const deltaX = touch.clientX - start.x;
              const deltaY = touch.clientY - start.y;
              if (Math.abs(deltaY) >= 40 && Math.abs(deltaY) > Math.abs(deltaX)) {
                if (deltaY > 0) setActiveIndex(null);
                return;
              }
              if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

              setActiveIndex((current) => {
                if (current === null) return null;
                return deltaX < 0
                  ? (current + 1) % projects.length
                  : (current - 1 + projects.length) % projects.length;
              });
            }}
          >
            <img
              src={activeProject.image}
              alt={`${activeProject.title} design project`}
              className="max-h-[78vh] max-w-full object-contain"
            />
            <figcaption className="text-center font-mono text-xs uppercase tracking-[.16em] text-[#fdcc1e]">
              {activeProject.title} <span className="mx-2 text-[#fdcc1e]/50">/</span>
              {activeIndex + 1} of {projects.length}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex((activeIndex + 1) % projects.length);
            }}
            aria-label="Next design"
            className="absolute right-3 z-10 hidden size-12 items-center justify-center border border-[#fdcc1e]/40 bg-black/60 text-[#fdcc1e] transition hover:bg-[#fdcc1e] hover:text-black sm:flex sm:right-8 sm:size-14"
          >
            <Chevron direction="right" />
          </button>
        </div>
      )}
    </section>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-6"
    >
      <path
        d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
