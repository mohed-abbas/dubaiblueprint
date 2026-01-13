"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Custom hook for GSAP animations with automatic cleanup
 */
export function useGsapAnimation<T extends HTMLElement = HTMLElement>() {
  const elementRef = useRef<T>(null);
  const contextRef = useRef<gsap.Context | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /**
   * Initialize GSAP context for the element
   */
  const initContext = useCallback(() => {
    if (!elementRef.current) return null;

    // Clean up previous context
    contextRef.current?.revert();

    contextRef.current = gsap.context(() => {}, elementRef);
    return contextRef.current;
  }, []);

  /**
   * Create a timeline within the context
   */
  const createTimeline = useCallback(
    (config?: gsap.TimelineVars) => {
      const ctx = initContext();
      if (!ctx) return null;

      ctx.add(() => {
        timelineRef.current = gsap.timeline(config);
      });

      return timelineRef.current;
    },
    [initContext]
  );

  /**
   * Add animation to context
   */
  const addAnimation = useCallback(
    (animation: () => void) => {
      if (!contextRef.current) {
        initContext();
      }
      contextRef.current?.add(animation);
    },
    [initContext]
  );

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      contextRef.current?.revert();
    };
  }, []);

  return {
    ref: elementRef,
    context: contextRef,
    timeline: timelineRef,
    initContext,
    createTimeline,
    addAnimation,
  };
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  options: ScrollTrigger.Vars = {}
) {
  const elementRef = useRef<T>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: elementRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        ...options,
      });
    }, elementRef);

    return () => ctx.revert();
  }, [options]);

  return {
    ref: elementRef,
    scrollTrigger: scrollTriggerRef,
  };
}

/**
 * Hook for entrance animations on component mount
 */
export function useEntranceAnimation<T extends HTMLElement = HTMLElement>(
  animation: "fadeUp" | "fadeIn" | "scaleUp" | "slideLeft" | "slideRight" = "fadeUp",
  config: { duration?: number; delay?: number; ease?: string } = {}
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const { duration = 0.8, delay = 0, ease = "power3.out" } = config;

    const animations: Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
      fadeUp: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0 },
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      scaleUp: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
      },
      slideLeft: {
        from: { opacity: 0, x: -100 },
        to: { opacity: 1, x: 0 },
      },
      slideRight: {
        from: { opacity: 0, x: 100 },
        to: { opacity: 1, x: 0 },
      },
    };

    const anim = animations[animation];

    const ctx = gsap.context(() => {
      gsap.fromTo(elementRef.current, anim.from, {
        ...anim.to,
        duration,
        delay,
        ease,
      });
    }, elementRef);

    return () => ctx.revert();
  }, [animation, config]);

  return elementRef;
}

export default useGsapAnimation;
