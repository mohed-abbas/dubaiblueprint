"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import styles from "./Navbar.module.css";

// Local Assets
const ASSETS = {
  menuIcon: "/assets/menustars.svg",
  starLogo: "/assets/icon-star-logo.svg",
};

export interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Animate menu button
      if (menuRef.current) {
        tl.fromTo(
          menuRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6 },
          0
        );
      }

      // Animate logo
      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.1
        );
      }
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className={styles.navbar} data-node-id="98:91">
      {/* Menu Button */}
      <button
        ref={menuRef}
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Open menu"
        data-node-id="98:76"
      >
        <span className={styles.menuText}>Menu</span>
        <Image
          src={ASSETS.menuIcon}
          alt=""
          width={16}
          height={16}
          className={styles.menuIcon}
          unoptimized
        />
        <span className={styles.glassOverlay} aria-hidden="true" />
      </button>

      {/* Logo */}
      <div ref={logoRef} className={styles.logo} data-node-id="98:83">
        <Image
          src={ASSETS.starLogo}
          alt=""
          width={30}
          height={30}
          className={styles.logoIcon}
          unoptimized
        />
        <span className={styles.logoText}>Dubai Blueprint</span>
      </div>
    </nav>
  );
}

export default Navbar;
