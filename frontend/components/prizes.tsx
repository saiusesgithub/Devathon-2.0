"use client"

import { motion } from "framer-motion"

export default function Prizes() {
  const prizes = [
    {
      rank: "Gold",
      amount: "₹5000",
      perks: ["Certificates", "Internship Opportunities", "Goody Bag"],
      icon: "🥇",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      rank: "Silver",
      amount: "₹3000",
      perks: ["Certificates", "Goody Bag", "Tech Merchandise"],
      icon: "🥈",
      color: "from-gray-400 to-gray-500",
      featured: true,
    },
    {
      rank: "Bronze",
      amount: "₹2000",
      perks: ["Certificates", "Goody Bag", "Discount Coupons"],
      icon: "🥉",
      color: "from-orange-600 to-orange-700",
    },
  ]

  return (
    <section id="prizes" className="relative py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
            Amazing <span className="text-accent">Prizes</span>
          </h2>
          <p className="text-center text-foreground/60 mb-16 max-w-2xl mx-auto">
            Compete for incredible rewards and recognition
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {prizes.map((prize, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group ${prize.featured ? "md:scale-105" : ""}`}
            >
              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${prize.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500`}
              />

              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative glass-effect-dark rounded-2xl p-8 h-full flex flex-col border ${
                  prize.featured ? "border-accent" : "border-border"
                } group-hover:border-accent/50 transition-all duration-300`}
              >
                {/* Medal Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  {prize.icon}
                </motion.div>

                <h3 className="text-3xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                  {prize.rank}
                </h3>
                <div className="text-4xl font-black bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-6">
                  {prize.amount}
                </div>

                {/* Perks */}
                <div className="flex-grow mb-6">
                  <ul className="space-y-3">
                    {prize.perks.map((perk, perkIndex) => (
                      <motion.li
                        key={perkIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: perkIndex * 0.1 }}
                        className="flex items-start gap-3 group/item"
                      >
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 group-hover/item:bg-accent/30 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        </div>
                        <span className="text-foreground/80 text-sm group-hover/item:text-foreground transition-colors">
                          {perk}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-semibold transition-all duration-300 glass-effect text-accent hover:bg-accent/10 border border-accent/50 hover:border-accent"
                >
                  Aim for {prize.rank}
                </motion.button>

                {/* Decorative corner accent */}
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
