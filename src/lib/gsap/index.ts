"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// GSAP default configuration
gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
});

// ScrollTrigger default configuration
ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
  start: "top 80%",
  end: "bottom 20%",
});

export { gsap, ScrollTrigger };
