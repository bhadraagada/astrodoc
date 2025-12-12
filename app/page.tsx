"use client";
import PageTransition from "@/components/animations/page-transition";
import Hero from "@/components/hero";
import InsightSummary from "@/components/insight-summary";
import SimulatedOutcomes from "@/components/simulated-outcomes";
import SplashScreen from "@/components/splash-screen";
import FloatingActionButton from "@/components/ui-elements/floating-action-button";
import { HeroWave } from "@/components/ui/hero-wave";
import { useUser } from "@clerk/nextjs";
import { Mic } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

export default function Home() {
  const { } = useUser();
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMainContent(true);
    }, 5100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-deep-space text-star-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-deep-space via-[#0f172a] to-deep-space pointer-events-none z-0"></div>

      {/* Global space particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-star-white rounded-full animate-twinkle opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-stellar-cyan rounded-full animate-twinkle opacity-40 delay-700"></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-cosmic-purple rounded-full animate-twinkle opacity-50 delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-star-white rounded-full animate-twinkle opacity-80 delay-300"></div>
      </div>

      <div className="relative z-10 w-full">
        <SplashScreen />
        {showMainContent && (
          <PageTransition>
            <section className="relative pt-20 pb-32 overflow-hidden min-h-screen flex items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-nebula-blue/20 to-transparent pointer-events-none" />
              <HeroWave className="absolute top-0 left-0 w-full h-auto text-stellar-cyan/10" />
              <Hero />
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-deep-space to-transparent"></div>
            </section>
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
              <main className="mt-8 space-y-16">
                <Suspense
                  fallback={
                    <div className="h-[500px] flex items-center justify-center text-stellar-cyan">
                      Loading mission outcomes...
                    </div>
                  }
                >
                  <SimulatedOutcomes />
                </Suspense>

                <Suspense
                  fallback={
                    <div className="h-[300px] flex items-center justify-center text-stellar-cyan">
                      Loading mission insights...
                    </div>
                  }
                >
                  <InsightSummary />
                </Suspense>
              </main>
              <FloatingActionButton
                icon={<Mic size={24} className="text-deep-space" />}
                tooltip="Voice Command"
                position="bottom-right"
                className="bg-stellar-cyan hover:bg-stellar-cyan/80 text-deep-space"
              />
            </div>
          </PageTransition>
        )}
      </div>
    </div>
  );
}
