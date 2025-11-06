"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import About from "@/components/about"
import Timeline from "@/components/timeline"
import Prizes from "@/components/prizes"
import Themes from "@/components/themes"
import FAQ from "@/components/faq"
import Organizers from "@/components/organisers"
import Footer from "@/components/footer"
import CinematicIntro from "@/components/cinematic-intro"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0)
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    // Ensure we're at the top after intro completes
    window.scrollTo(0, 0)
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <main 
        className="w-full overflow-x-hidden relative"
        style={{
          background: "radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000000 100%)",
        }}
      >
        {/* Animated Grid Background - Fixed to viewport */}
        <div className="fixed inset-0 opacity-30 pointer-events-none z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #00ffb3 1px, transparent 1px),
                linear-gradient(to bottom, #00ffb3 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              animation: "gridPulse 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Navigation />
          <Hero />
          <About />
          <Timeline />
          <Prizes />
          <Themes />
          <FAQ />
          <Organizers />
          <Footer />
        </div>

        {/* CSS for grid animation */}
        <style jsx>{`
          @keyframes gridPulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.02);
            }
          }
        `}</style>
      </main>
    </>
  )
}
