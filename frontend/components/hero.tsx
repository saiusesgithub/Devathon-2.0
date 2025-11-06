"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Hero() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-accent animate-float pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.id * 0.15}s`,
            filter: "blur(1px)",
            opacity: 0.6,
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        <div className="inline-block mb-6 px-4 py-2 glass-effect rounded-full">
          <span className="text-accent font-semibold text-sm">Innovation Awaits</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-balance mb-6">
          <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            DEVTHON
          </span>
          <br />
          <span className="text-foreground">2025</span>
        </h1>

        <p className="text-lg sm:text-xl text-foreground/80 mb-8 text-balance max-w-2xl mx-auto">
          Build. Collaborate. Innovate. Join the most exciting hackathon for first-year students.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-gradient-to-r from-accent to-primary text-primary-foreground rounded-full font-bold text-lg hover:glow-neon transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Register Now
          </Link>
          <a
            href="#about"
            className="px-8 py-4 glass-effect text-accent rounded-full font-bold text-lg hover:bg-accent/10 transition-all duration-300 border border-accent/50 hover:border-accent"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  )
}
