"use client";

import { useEffect, useRef } from "react";
import styles from "./UnicornEmbed.module.css";

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init?: () => void;
    };
  }
}

interface UnicornEmbedProps {
  projectId: string;
  className?: string;
}

export function UnicornEmbed({ projectId, className }: UnicornEmbedProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasInitialized.current) return;
    hasInitialized.current = true;

    // Initialize Unicorn Studio
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.2/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init?.();
          window.UnicornStudio.isInitialized = true;
        }
      };
      document.head.appendChild(script);
    } else if (!window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init?.();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  return (
    <div
      data-us-project={projectId}
      className={`${styles.embed} ${className || ""}`}
    />
  );
}

export default UnicornEmbed;
