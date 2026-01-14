"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { splitText } from "@/lib/gsap/splitText";
import { createParallax } from "@/lib/animations/heroAnimations";
import { LightRays } from "@/components/LightRays";
import styles from "./Hero.module.css";

// Local Assets
const ASSETS = {
  heroImage: "/assets/hero-crystal.png",
  arrowIcon: "/assets/icon-arrow-up-right.svg",
};

// Cycling headlines for primary text animation
const CYCLING_HEADLINES = [
  "See Clearly.",
  "Know More.",
  "Build Precisely.",
];

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
  const headlineContainerRef = useRef<HTMLDivElement>(null);
  const heroDetailsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Initial entrance timeline for static elements
      const entranceTl = gsap.timeline({
        defaults: { ease: "power3.out" },
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

      // Animate gradient headline with character stagger (matching headlinePrimary)
      if (headlineGradientRef.current) {
        const element = headlineGradientRef.current;

        // Split into characters
        const splitGradient = splitText(element, { type: "chars" });

        // Get total width for gradient calculation
        const totalWidth = element.offsetWidth;

        // Calculate and apply background-position for each character
        splitGradient.chars.forEach((char) => {
          const charLeft = char.offsetLeft;

          // Apply gradient with coordinated position
          char.style.background = `linear-gradient(
            120deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 60%,
            transparent 100%
          ), var(--gradient-accent)`;
          char.style.backgroundSize = `${totalWidth}px 100%, ${totalWidth}px 100%`;
          char.style.backgroundPosition = `-${charLeft}px 0, -${charLeft}px 0`;
          (char.style as CSSStyleDeclaration & { webkitBackgroundClip: string }).webkitBackgroundClip = "text";
          char.style.backgroundClip = "text";
          (char.style as CSSStyleDeclaration & { webkitTextFillColor: string }).webkitTextFillColor = "transparent";
          char.style.color = "transparent";
        });

        // Animate exactly like headlinePrimary
        entranceTl.fromTo(
          splitGradient.chars,
          { opacity: 0, y: 60, rotateX: -45 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.04,
            ease: "power3.out",
          },
          0.5
        );

        // Add continuous shine animation via GSAP (infinite loop)
        splitGradient.chars.forEach((char) => {
          const charLeft = char.offsetLeft;
          gsap.fromTo(
            char,
            { backgroundPosition: `-${totalWidth + charLeft}px 0, -${charLeft}px 0` },
            {
              backgroundPosition: `${totalWidth - charLeft}px 0, -${charLeft}px 0`,
              duration: 6,
              ease: "none",
              repeat: -1,
              delay: 1,
            }
          );
        });
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

      // Add layered parallax (desktop only)
      if (window.innerWidth > 768 && heroRef.current) {
        // Building - mid layer (25%)
        if (assetRef.current) {
          createParallax(assetRef.current, heroRef.current, 0.25);
        }
        // Headlines - front layer (40%)
        if (headlineContainerRef.current) {
          createParallax(headlineContainerRef.current, heroRef.current, 0.40);
        }
        // Details - closest layer (55%)
        if (heroDetailsContainerRef.current) {
          createParallax(heroDetailsContainerRef.current, heroRef.current, 0.55);
        }
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} data-node-id="98:50">
      {/* Light Rays Background Layer */}
      <div className={styles.lightRaysContainer}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.8}
          lightSpread={1.2}
          rayLength={2.5}
          pulsating={false}
          fadeDistance={1.0}
          saturation={1.0}
          followMouse={true}
          mouseInfluence={0.05}
          noiseAmount={0}
          distortion={0}
        />
      </div>

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
      <div ref={headlineContainerRef} className={styles.headline} data-node-id="98:53">
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
      <div ref={heroDetailsContainerRef} className={styles.heroDetails} data-node-id="98:94">
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
