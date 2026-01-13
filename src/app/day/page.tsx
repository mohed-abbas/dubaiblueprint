"use client";

import { HeroDay } from "@/components/HeroDay";
import { Navbar } from "@/components/Navbar";
import { Ticker } from "@/components/Ticker";

export default function DayPage() {
  return (
    <main>
      {/* Day Hero Section */}
      <div style={{ position: "relative" }}>
        <Navbar onMenuClick={() => {}} />
        <HeroDay
          headline={{
            primary: "Know More.",
            gradient: "Decide Better.",
          }}
          tagline="Independent Insight for the City of the Future."
          cta={{
            label: "Get Clarity On Whatsapp",
            href: "#contact",
          }}
        />
        <Ticker
          items={[
            "Family buyers prioritising long-term liveability",
            "Payment plan structures influencing buyer profiles",
            "End-user demand favouring larger floorplans",
            "Rental demand shifting by micro-location",
            "Yield stability outperforming price speculation",
            "Residency-linked demand remaining resilient",
            "Branded residences gaining share of new demand",
          ]}
          speed={30}
          direction="left"
        />
      </div>

      {/* Additional sections will be added here */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <p style={{ fontSize: "1.5rem", color: "#666" }}>
          More content sections coming from Figma...
        </p>
      </section>
    </main>
  );
}
