"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { splitText } from "@/lib/gsap/splitText";
import { UnicornEmbed } from "@/components/UnicornEmbed";
import styles from "./HeroDay.module.css";

// Local Assets
const ASSETS = {
  background: "/assets/hero-day-bg-2.png",
  heroImage: "/assets/hero-burj-realistic.png",
  arrowIcon: "/assets/icon-arrow-up-right.svg",
};

// Cycling headlines for primary text animation (from Figma node 122:134)
const CYCLING_HEADLINES = [
  "Know More.",
  "See Clearly.",
  "Think Sharper",
  "Act Confidently",
];

export interface HeroDayProps {
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

const defaultProps: Required<HeroDayProps> = {
  headline: {
    primary: "Know More.",
    gradient: "Decide Better.",
  },
  tagline: "Independent Insight for the City of the Future.",
  cta: {
    label: "Get Clarity On Whatsapp",
    href: "#contact",
  },
};

export function HeroDay({
  headline = defaultProps.headline,
  tagline = defaultProps.tagline,
  cta = defaultProps.cta,
}: HeroDayProps) {
  const heroRef = useRef<HTMLElement>(null);
  const headlinePrimaryRef = useRef<HTMLSpanElement>(null);
  const headlineGradientRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const assetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Initial entrance timeline for static elements
      const entranceTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Animate hero asset (scale + fade)
      if (assetRef.current) {
        entranceTl.fromTo(
          assetRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1.2 },
          0
        );
      }

      // Animate gradient headline with stagger
      if (headlineGradientRef.current) {
        const splitGradient = splitText(headlineGradientRef.current, { type: "words" });
        entranceTl.fromTo(
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
        entranceTl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.8
        );
      }

      // Animate CTA button
      if (ctaRef.current) {
        entranceTl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          1
        );
      }

      // Cycling animation for primary headline
      let currentIndex = 0;

      const animateCycle = () => {
        const textElement = headlinePrimaryRef.current;
        if (!textElement) return;

        // Set new text content
        textElement.textContent = CYCLING_HEADLINES[currentIndex];

        // Split into characters
        const split = splitText(textElement, { type: "chars" });

        // Create timeline for this cycle
        const cycleTl = gsap.timeline({
          onComplete: () => {
            split.revert();
            currentIndex = (currentIndex + 1) % CYCLING_HEADLINES.length;
            animateCycle(); // Recursive call for next text
          },
        });

        // ENTER: Characters fade in from bottom with 3D rotation
        cycleTl.fromTo(
          split.chars,
          { opacity: 0, y: 60, rotateX: -45 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.04,
            ease: "power3.out",
          }
        );

        // HOLD: Wait 2 seconds
        cycleTl.to({}, { duration: 2 });

        // EXIT: Characters fade out upward with 3D rotation
        cycleTl.to(split.chars, {
          opacity: 0,
          y: -60,
          rotateX: 45,
          duration: 0.6,
          stagger: 0.04,
          ease: "power3.in",
        });
      };

      // Start the cycling animation after entrance completes
      entranceTl.call(animateCycle, [], 0.3);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} data-node-id="122:134">
      {/* Background Image */}
      <div className={styles.heroBackground} data-node-id="122:135">
        <Image
          src={ASSETS.background}
          alt=""
          fill
          className={styles.heroBackgroundImage}
          priority
          unoptimized
        />
      </div>

      {/* Animated Clouds Layer */}
      <div className={styles.cloudsLayer}>
        <UnicornEmbed projectId="Gf7AK4z8RSeGsyIugEo7" />
      </div>

      {/* Hero 3D Asset */}
      <div ref={assetRef} className={styles.heroAsset} data-node-id="122:242">
        <Image
          src={ASSETS.heroImage}
          alt="Burj Khalifa"
          width={829}
          height={1067}
          className={styles.heroAssetImage}
          priority
          unoptimized
        />
      </div>

      {/* Headline Section */}
      <div className={styles.headline} data-node-id="122:139">
        <div className={styles.headlineWrapper} data-node-id="94:603">
          <span ref={headlinePrimaryRef} className={styles.headlinePrimary}>
            {headline.primary}
          </span>
        </div>
        <div className={styles.headlineWrapper} data-node-id="122:141">
          <span ref={headlineGradientRef} className={styles.headlineGradient}>
            {headline.gradient}
          </span>
        </div>
      </div>

      {/* Hero Details */}
      <div className={styles.heroDetails} data-node-id="122:138">
        <p ref={taglineRef} className={styles.tagline}>
          {tagline}
        </p>

        <a
          ref={ctaRef}
          href={cta.href}
          className={styles.ctaButton}
          data-node-id="122:172"
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

export default HeroDay;
