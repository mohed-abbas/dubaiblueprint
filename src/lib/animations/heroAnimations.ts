"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Animation presets for Hero sections
 * Use these functions to create consistent animations across components
 */

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

const defaultConfig: AnimationConfig = {
  duration: 0.8,
  delay: 0,
  ease: "power3.out",
  stagger: 0.1,
};

/**
 * Fade up animation - elements fade in while moving up
 */
export function fadeUp(
  elements: gsap.TweenTarget,
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = { ...defaultConfig, ...config };

  return gsap.fromTo(
    elements,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration, delay, ease, stagger }
  );
}

/**
 * Fade in animation - simple opacity fade
 */
export function fadeIn(
  elements: gsap.TweenTarget,
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = { ...defaultConfig, ...config };

  return gsap.fromTo(
    elements,
    { opacity: 0 },
    { opacity: 1, duration, delay, ease, stagger }
  );
}

/**
 * Scale up animation - elements scale from small to normal
 */
export function scaleUp(
  elements: gsap.TweenTarget,
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = { ...defaultConfig, ...config };

  return gsap.fromTo(
    elements,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration, delay, ease, stagger }
  );
}

/**
 * Slide in from left
 */
export function slideInLeft(
  elements: gsap.TweenTarget,
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = { ...defaultConfig, ...config };

  return gsap.fromTo(
    elements,
    { opacity: 0, x: -100 },
    { opacity: 1, x: 0, duration, delay, ease, stagger }
  );
}

/**
 * Slide in from right
 */
export function slideInRight(
  elements: gsap.TweenTarget,
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = { ...defaultConfig, ...config };

  return gsap.fromTo(
    elements,
    { opacity: 0, x: 100 },
    { opacity: 1, x: 0, duration, delay, ease, stagger }
  );
}

/**
 * Reveal animation - clips content and reveals from bottom
 */
export function reveal(
  elements: gsap.TweenTarget,
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = { ...defaultConfig, ...config };

  return gsap.fromTo(
    elements,
    { clipPath: "inset(100% 0% 0% 0%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration, delay, ease, stagger }
  );
}

/**
 * Character stagger animation - for text characters
 */
export function charStagger(
  chars: HTMLElement[],
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = {
    ...defaultConfig,
    duration: 0.6,
    stagger: 0.03,
    ...config,
  };

  return gsap.fromTo(
    chars,
    { opacity: 0, y: 50, rotateX: -90 },
    { opacity: 1, y: 0, rotateX: 0, duration, delay, ease, stagger }
  );
}

/**
 * Word stagger animation - for text words
 */
export function wordStagger(
  words: HTMLElement[],
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = {
    ...defaultConfig,
    duration: 0.8,
    stagger: 0.08,
    ...config,
  };

  return gsap.fromTo(
    words,
    { opacity: 0, y: 60, rotateX: -45 },
    { opacity: 1, y: 0, rotateX: 0, duration, delay, ease, stagger }
  );
}

/**
 * Line reveal animation - for text lines
 */
export function lineReveal(
  lines: HTMLElement[],
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = {
    ...defaultConfig,
    duration: 1,
    stagger: 0.15,
    ...config,
  };

  return gsap.fromTo(
    lines,
    { y: "100%" },
    { y: "0%", duration, delay, ease, stagger }
  );
}

/**
 * Parallax scroll effect
 */
export function createParallax(
  element: gsap.TweenTarget,
  trigger: Element,
  speed: number = 0.3
) {
  return gsap.to(element, {
    yPercent: speed * 100,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

/**
 * Scroll-triggered fade up
 */
export function scrollFadeUp(
  elements: gsap.TweenTarget,
  trigger: Element,
  config: AnimationConfig = {}
) {
  const { duration, delay, ease, stagger } = { ...defaultConfig, ...config };

  return gsap.fromTo(
    elements,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      stagger,
      scrollTrigger: {
        trigger,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    }
  );
}

/**
 * Magnetic button effect - follows cursor within element
 */
export function createMagneticEffect(
  element: HTMLElement,
  strength: number = 0.3
) {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
}
