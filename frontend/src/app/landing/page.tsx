"use client";

import LandingNav from "@/components/landing/LandingNav";
import LandingHero from "@/components/landing/LandingHero";
import SeniorFaces from "@/components/landing/SeniorFaces";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingStatsBand from "@/components/landing/LandingStatsBand";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111210]">
      <LandingNav />
      <main>
        <LandingHero />
        <SeniorFaces />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingStatsBand />
        <LandingPricing />
        <LandingTestimonials />
      </main>
      <LandingFooter />
    </div>
  );
}
