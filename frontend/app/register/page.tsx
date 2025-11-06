"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import RegistrationForm from "@/components/registration-form"
import Link from "next/link"

export default function RegisterPage() {
  const [showSuccess, setShowSuccess] = useState(false)

  return (
    <main className="w-full overflow-x-hidden bg-gradient-to-b from-background via-background to-secondary/10">
      <Navigation />

      {/* Hero section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

        {/* Decorative elements */}
        <div className="absolute top-40 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main content - 2 column layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Illustration/branding */}
            <div className="flex flex-col justify-center items-center lg:items-start">
              <div className="w-full h-96 relative">
                {/* Decorative coding-themed SVG background */}
                <div className="absolute inset-0 glass-effect-light rounded-2xl p-8 flex flex-col justify-center items-center gap-4">
                  <div className="text-6xl">{"< />"}</div>
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-accent mb-2">Build Something</h2>
                    <h2 className="text-4xl font-bold text-primary">Amazing</h2>
                  </div>
                  <p className="text-foreground/70 text-center max-w-xs">
                    Join DevUp First-Year Hackathon and showcase your coding skills with fellow first-year students.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 w-full">
                <div className="glass-effect rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-accent">400+</div>
                  <p className="text-foreground/70 text-sm mt-1">Participants</p>
                </div>
                <div className="glass-effect rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-accent">₹10K</div>
                  <p className="text-foreground/70 text-sm mt-1">In Prizes</p>
                </div>
                <div className="glass-effect rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-accent">2 Day</div>
                  <p className="text-foreground/70 text-sm mt-1">Duration</p>
                </div>
              </div>
            </div>

            {/* Right column - Registration form */}
            <div className="flex flex-col">
              <div className="glass-effect-dark rounded-2xl p-8 md:p-12 border border-accent/20 glow-neon-lg">
                <h1 className="text-4xl md:text-5xl font-bold text-balance mb-2">
                  Join the <span className="text-accent">Adventure</span>
                </h1>
                <p className="text-foreground/60 mb-8">Register now and be part of something amazing</p>

                <RegistrationForm onSuccess={() => setShowSuccess(true)} />
              </div>

              {/* Back to home link */}
              <Link
                href="/"
                className="text-accent hover:text-primary transition-colors text-sm font-medium mt-6 flex items-center gap-2"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="glass-effect-dark rounded-lg px-8 py-6 text-center animate-fade-in pointer-events-auto glow-neon">
            <div className="text-accent font-bold text-lg mb-2">🎉 Success!</div>
            <p className="text-foreground mb-4">Your registration has been submitted!</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-4 py-2 bg-accent text-primary-foreground rounded-lg font-semibold hover:glow-neon transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
