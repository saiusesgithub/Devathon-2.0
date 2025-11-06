"use client"

import { useScrollAnimation } from '../components/hooks/useScrollAnimation';
import { organizers } from '../components/data/eventData';
import { Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

function Organizers() {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Meet the <span className="text-gradient bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Organizers</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
            The passionate team behind DevUp Society, dedicated to building a thriving tech community
          </p>
        </motion.div>

        {/* Lead Organizer - Centered */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group max-w-sm w-full"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Card */}
            <div className="relative glass-effect-dark rounded-2xl overflow-hidden border border-border group-hover:border-accent/50 transition-all duration-300">
              {/* Lead Badge */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <span className="px-4 py-2 bg-gradient-to-r from-accent to-primary rounded-full text-xs font-bold text-background shadow-lg">
                  ⭐ LEAD ORGANIZER
                </span>
              </div>

              {/* Image */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={organizers[0].image}
                  alt={organizers[0].name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Name & role below image */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                  {organizers[0].name}
                </h3>
                <p className="text-accent text-base font-semibold mb-4">{organizers[0].role}</p>
                
                <div className="flex gap-3 justify-center">
                  <button className="p-2 glass-effect rounded-full hover:bg-accent/20 transition-colors border border-accent/20 hover:border-accent/50">
                    <Linkedin className="w-5 h-5 text-accent" />
                  </button>
                  <button className="p-2 glass-effect rounded-full hover:bg-accent/20 transition-colors border border-accent/20 hover:border-accent/50">
                    <Mail className="w-5 h-5 text-accent" />
                  </button>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        </div>

        {/* Other Team Members - 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {organizers.slice(1).map((organizer, index) => (
            <motion.div
              key={organizer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative group"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card */}
              <div className="relative glass-effect-dark rounded-2xl overflow-hidden border border-border group-hover:border-accent/50 transition-all duration-300 h-full">
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={organizer.image}
                    alt={organizer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Name & role below image */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                    {organizer.name}
                  </h3>
                  <p className="text-accent/80 text-sm font-semibold mb-4">{organizer.role}</p>

                  {/* Social links */}
                  <div className="flex gap-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 glass-effect rounded-full hover:bg-accent/20 transition-colors border border-accent/20 hover:border-accent/50">
                      <Linkedin className="w-4 h-4 text-accent" />
                    </button>
                    <button className="p-2 glass-effect rounded-full hover:bg-accent/20 transition-colors border border-accent/20 hover:border-accent/50">
                      <Mail className="w-4 h-4 text-accent" />
                    </button>
                  </div>

                  {/* Accent line */}
                  <div className="mt-4 h-1 w-0 group-hover:w-24 bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500 mx-auto" />
                </div>

                {/* Decorative corner accent */}
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Organizers;