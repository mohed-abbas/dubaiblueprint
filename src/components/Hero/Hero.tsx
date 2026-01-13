"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { splitText } from "@/lib/gsap/splitText";
import styles from "./Hero.module.css";

// Local Assets
const ASSETS = {
  heroImage: "/assets/hero-crystal.png",
  arrowIcon: "/assets/icon-arrow-up-right.svg",
};

export interface HeroProps {
  headline?: {
    primary: string;
    gradient: string;
  };
  tagline?: string;
  cta?: {
    label: string;
    href: string;
  };
}

const defaultProps: Required<HeroProps> = {
  headline: {
    primary: "See Clearly.",
    gradient: "Decide Better.",
  },
  tagline: "Independent Insight for the City of the Future.",
  cta: {
    label: "Get Clarity On Whatsapp",
    href: "#contact",
  },
};

export function Hero({
  headline = defaultProps.headline,
  tagline = defaultProps.tagline,
  cta = defaultProps.cta,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const headlinePrimaryRef = useRef<HTMLSpanElement>(null);
  const headlineGradientRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const assetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Animate hero asset (scale + fade)
      if (assetRef.current) {
        tl.fromTo(
          assetRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1.2 },
          0
        );
      }

      // Animate primary headline with stagger
      if (headlinePrimaryRef.current) {
        const splitPrimary = splitText(headlinePrimaryRef.current, { type: "words" });
        tl.fromTo(
          splitPrimary.words,
          { opacity: 0, y: 60, rotateX: -45 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.08,
          },
          0.3
        );
      }

      // Animate gradient headline with stagger
      if (headlineGradientRef.current) {
        const splitGradient = splitText(headlineGradientRef.current, { type: "words" });
        tl.fromTo(
          splitGradient.words,
          { opacity: 0, y: 60, rotateX: -45 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.08,
          },
          0.5
        );
      }

      // Animate tagline
      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.8
        );
      }

      // Animate CTA button
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          1
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} data-node-id="98:50">
      {/* Hero 3D Asset */}
      <div ref={assetRef} className={styles.heroAsset} data-node-id="98:56">
        <Image
          src={ASSETS.heroImage}
          alt="3D Crystal Burj Khalifa"
          width={894}
          height={1150}
          className={styles.heroAssetImage}
          priority
          unoptimized
        />
      </div>

      {/* Headline Section */}
      <div className={styles.headline} data-node-id="98:53">
        <div className={styles.headlineWrapper} data-node-id="98:92">
          <span ref={headlinePrimaryRef} className={styles.headlinePrimary}>
            {headline.primary}
          </span>
        </div>
        <div className={styles.headlineWrapper} data-node-id="98:93">
          <span ref={headlineGradientRef} className={styles.headlineGradient}>
            {headline.gradient}
          </span>
        </div>
      </div>

      {/* Hero Details */}
      <div className={styles.heroDetails} data-node-id="98:94">
        <p ref={taglineRef} className={styles.tagline} data-node-id="98:52">
          {tagline}
        </p>

        <a
          ref={ctaRef}
          href={cta.href}
          className={styles.ctaButton}
          data-node-id="98:86"
        >
          <span className={styles.ctaText}>{cta.label}</span>
          <Image
            src={ASSETS.arrowIcon}
            alt=""
            width={24}
            height={24}
            className={styles.ctaIcon}
            unoptimized
          />
          <span className={styles.glassOverlay} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export default Hero;
