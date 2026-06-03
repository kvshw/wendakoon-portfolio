"use client";

import Image from "next/image";
import { HERO_STATS } from "@/lib/data";
import { MagneticButton } from "./primitives/MagneticButton";
import { Reveal } from "./primitives/Reveal";

export const Hero = ({ content }) => {
  const stats = content?.stats ?? HERO_STATS;
  const kicker = content?.kicker ?? "Doctoral researcher · software engineer";
  const lead =
    content?.lead ??
    "I research how to make adaptive AI in clinical settings trustworthy, then I build things to prove it.";
  const body =
    content?.body ??
    "PhD candidate at the University of Oulu. My research asks one question: how do you build clinical AI that keeps working safely as conditions change, and how do you prove it?";
  const ctaPrimary = content?.ctaPrimary ?? "View CV";
  const ctaSecondary = content?.ctaSecondary ?? "Selected Research";

  return (
  <header id="top" className="hero" data-screen-label="01 Hero">
    <div className="hero-orb o1" data-parallax="0.22" aria-hidden="true"></div>
    <div className="hero-orb o2" data-parallax="0.14" aria-hidden="true"></div>

    <div className="container" style={{ position: "relative" }}>
      <div className="hero-meta-bar">
        <div className="bracket">Portfolio · Edition 2026</div>
        <div className="hero-meta-mid">Oulu · 65.0121° N · 25.4651° E</div>
        <div className="bracket">Doctoral Researcher · Engineer</div>
      </div>

      <div className="hero-grid">
        <div className="hero-tagline">
          <Reveal delay={120}>
            <p className="section-kicker" style={{ margin: 0 }}>{kicker}</p>
            <p className="lead" style={{ marginTop: 14 }}>{lead}</p>
          </Reveal>
          <Reveal delay={220}>
            <p className="body">{body}</p>
          </Reveal>
          <Reveal delay={280}>
            <div
              className="foryou-teaser"
              onClick={() => document.getElementById("perspective")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span className="ping"></span>
              <span className="lbl"><span className="h">For You</span> · Pick a perspective ↓</span>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="hero-ctas">
              <MagneticButton primary href="#cv">{ctaPrimary}</MagneticButton>
              <MagneticButton href="#research">{ctaSecondary}</MagneticButton>
              <MagneticButton href="#contact">Contact</MagneticButton>
            </div>
          </Reveal>
        </div>

        <Reveal delay={140} className="hero-portrait-col">
          <figure className="hero-portrait-wrap">
            <div className="hero-portrait" data-parallax="-0.04">
              <Image
                src="/assets/portrait.png"
                alt="Kavishwa Wendakoon"
                fill
                sizes="320px"
                priority
                style={{ objectFit: "cover", objectPosition: "center center" }}
              />
              <span className="portrait-bracket tl" aria-hidden="true"></span>
              <span className="portrait-bracket tr" aria-hidden="true"></span>
              <span className="portrait-bracket bl" aria-hidden="true"></span>
              <span className="portrait-bracket br" aria-hidden="true"></span>
            </div>
            <figcaption className="portrait-caption">
              <span><span className="bracket">Portrait</span></span>
              <span>Oulu · 2026</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>

      <h1 className="hero-name display reveal-name" data-parallax="0.04">
        <span className="name-line"><span className="name-inner">Kavi<span className="accent-line">shwa</span></span></span>
        <span className="name-line"><span className="name-inner stroke">Wendakoon</span></span>
      </h1>

      <Reveal delay={420} className="hero-stats-wrap">
        <div className="hero-stats">
          {stats.map((s, i) => (
            <div className="hero-stat" key={i}>
              <div className="val">
                {s.acc ? <span className="acc">{s.val}</span> : s.val}
              </div>
              <div className="lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <span className="line"></span>
        <span>01 / 12</span>
      </div>
    </div>
  </header>
  );
};
