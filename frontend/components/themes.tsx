"use client"

import { Lightbulb, Globe, Book, Hospital } from "lucide-react"
import { motion } from "framer-motion"

export default function Themes() {
  const themes = [
    {
      name: "Public Services And Smart Cities",
      icon: Globe,
      gradient: "from-green-400 to-emerald-600",
      bgGlow: "bg-green-400/20",
      description: "Build solutions for urban innovation",
    },
    {
      name: "Health And Wellness",
      icon: Hospital,
      gradient: "from-blue-400 to-cyan-600",
      bgGlow: "bg-blue-400/20",
      description: "Create tech for better healthcare",
    },
    {
      name: "Education And Learning",
      icon: Book,
      gradient: "from-purple-400 to-pink-600",
      bgGlow: "bg-purple-400/20",
      description: "Revolutionize how we learn",
    },
    {
      name: "Open Innovation",
      icon: Lightbulb,
      gradient: "from-yellow-400 to-orange-600",
      bgGlow: "bg-yellow-400/20",
      description: "Bring your wildest ideas to life",
    },
  ]

  return (
    <section id="themes" className="relative py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Hackathon <span className="text-gradient bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Themes</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Choose from these innovative themes or pitch your own idea
          </p>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {themes.map((theme, index) => {
            const Icon = theme.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group"
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 ${theme.bgGlow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Card */}
                <div className="relative glass-effect-dark rounded-2xl p-8 border border-border group-hover:border-accent/50 transition-all duration-300 h-full">
                  {/* Icon with gradient background */}
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                      {theme.name}
                    </h3>
                    <p className="text-foreground/60 text-sm leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-accent font-semibold text-lg">
            💡 Have a unique idea? Pitch it at the event!
          </p>
        </motion.div>
      </div>
    </section>
  )
}
