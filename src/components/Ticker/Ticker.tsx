"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import styles from "./Ticker.module.css";

// Local Assets
const ASSETS = {
  dotSeparator: "/assets/icon-dot-separator.svg",
};

// Default ticker items from Figma design
const DEFAULT_ITEMS = [
  "Family buyers prioritising long-term liveability",
  "Payment plan structures influencing buyer profiles",
  "End-user demand favouring larger floorplans",
  "Rental demand shifting by micro-location",
  "Yield stability outperforming price speculation",
  "Residency-linked demand remaining resilient",
  "Branded residences gaining share of new demand",
];

export interface TickerProps {
  items?: string[];
  speed?: number; // Duration in seconds for one complete scroll
  direction?: "left" | "right";
}

export function Ticker({
  items = DEFAULT_ITEMS,
  speed = 30,
  direction = "left",
}: TickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !trackRef.current) return;

    const track = trackRef.current;
    const trackWidth = track.scrollWidth / 2; // Divided by 2 because we duplicate content

    const ctx = gsap.context(() => {
      // Create infinite scroll animation
      gsap.to(track, {
        x: direction === "left" ? -trackWidth : trackWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            const val = parseFloat(x);
            if (direction === "left") {
              return val % trackWidth;
            } else {
              return (val % trackWidth) - trackWidth;
            }
          }),
        },
      });
    }, tickerRef);

    return () => ctx.revert();
  }, [speed, direction]);

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div ref={tickerRef} className={styles.ticker} data-node-id="98:57">
      <div ref={trackRef} className={styles.tickerTrack} data-node-id="98:58">
        {duplicatedItems.map((item, index) => (
          <div key={index} className={styles.tickerItem} data-node-id="98:60">
            <span className={styles.tickerText}>{item}</span>
            <Image
              src={ASSETS.dotSeparator}
              alt=""
              width={5}
              height={5}
              className={styles.tickerDot}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ticker;
