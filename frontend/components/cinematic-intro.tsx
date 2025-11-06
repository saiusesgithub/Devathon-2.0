"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CinematicIntroProps {
  onComplete: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [stage, setStage] = useState(0)
  const devUpText = "DEVTHON 2025"
  const devthonText = "DevUp Society"
  

  // Generate particles
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }))
  }, [])

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500)
    const timer2 = setTimeout(() => setStage(2), 3500)
    const timer3 = setTimeout(() => onComplete(), 7000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000000 100%)",
      }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
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

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-accent"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Stage 1: DevUp Society with 3D effect */}
        <AnimatePresence mode="wait">
          {stage >= 1 && (
            <motion.div
              initial={{ opacity: 0, z: -100 }}
              animate={{ opacity: 1, z: 0 }}
              exit={{ opacity: 0, y: -100, scale: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12"
            >
              <motion.div
                animate={{
                  textShadow: [
                    "0 0 20px rgba(0, 255, 179, 0.5)",
                    "0 0 40px rgba(0, 255, 179, 0.8)",
                    "0 0 20px rgba(0, 255, 179, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl md:text-7xl font-bold text-white relative"
                style={{
                  textShadow: "0 0 30px rgba(0, 255, 179, 0.6)",
                }}
              >
                {devUpText.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: -50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                    }}
                    style={{
                      display: "inline-block",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>

              {/* Subtitle line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent mt-4 mx-auto max-w-md"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 2: DEVTHON 2025 with explosive entry */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 1,
                ease: [0.34, 1.56, 0.64, 1],
                type: "spring",
              }}
              className="relative"
            >
              {/* Glowing background circles */}
              <motion.div
                className="absolute inset-0 -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0, 255, 179, 0.3) 0%, transparent 70%)",
                    filter: "blur(40px)",
                  }}
                />
              </motion.div>

              <motion.div
                animate={{
                  filter: [
                    "hue-rotate(0deg) brightness(1)",
                    "hue-rotate(10deg) brightness(1.2)",
                    "hue-rotate(0deg) brightness(1)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl md:text-9xl font-black relative"
                style={{
                  background: "linear-gradient(135deg, #00ffb3 0%, #00c896 50%, #00ffb3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                  filter: "drop-shadow(0 0 30px rgba(0, 255, 179, 0.8))",
                }}
              >
                {/* {devthonText.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 100, rotateY: -180, scale: 0 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    style={{
                      display: "inline-block",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))} */}
              </motion.div>

              {/* Energy beams */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent -z-10"
              />

              {/* Corner accents */}
              {[
                { top: -20, left: -20 },
                { top: -20, right: -20 },
                { bottom: -20, left: -20 },
                { bottom: -20, right: -20 },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  className="absolute w-8 h-8 border-2 border-accent -z-20 hidden md:block"
                  style={pos}
                />
              ))}

              {/* Middle text: Devthon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="mt-12 mb-8 text-3xl md:text-5xl font-bold text-white"
                style={{
                  textShadow: "0 0 20px rgba(0, 255, 179, 0.4)",
                }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(0, 255, 179, 0.4)",
                      "0 0 35px rgba(0, 255, 179, 0.6)",
                      "0 0 20px rgba(0, 255, 179, 0.4)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  DevUp Society
                </motion.span>
              </motion.div>

              {/* Bottom tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="text-accent text-xl md:text-2xl font-semibold tracking-widest"
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {"<"} CODE. CREATE. CONQUER. {"/>"}
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CSS for grid animation */}
      <style jsx>{`
        @keyframes gridPulse {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
      `}</style>
    </motion.div>
  )
}
