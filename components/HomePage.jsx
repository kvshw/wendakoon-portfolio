"use client";

import { useEffect, useState } from "react";
import { Chat } from "@/components/Chat";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { CurrentFocus } from "@/components/sections/CurrentFocus";
import { Experience } from "@/components/sections/Experience";
import { Journey } from "@/components/sections/Journey";
import { Orientation } from "@/components/sections/Orientation";
import { PerspectiveSelector } from "@/components/sections/PerspectiveSelector";
import { Projects } from "@/components/sections/Projects";
import { Publications } from "@/components/sections/Publications";
import { ResearchAreas } from "@/components/sections/ResearchAreas";

export const HomePage = ({ initialContent, blogPosts }) => {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const ids = ["about", "perspective", "research", "projects", "journey", "focus", "cv", "publications", "blog", "contact"];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { threshold: [0.15, 0.4, 0.7] });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const c = initialContent ?? {};

  return (
    <>
      <ScrollProgress />
      <Nav active={active} />
      <main>
        <Hero content={c.hero} />
        <Orientation content={c.orientation} />
        <PerspectiveSelector content={c.perspectives} />
        <ResearchAreas content={c.research} />
        <Projects content={c.projects} />
        <Journey content={c.journey} />
        <CurrentFocus content={c.focus} />
        <Experience content={c.experience} />
        <Publications content={c.publications} />
        <Blog posts={blogPosts} />
        <Contact content={c.contact} />
      </main>
      <Footer />
      <Chat />
    </>
  );
};
