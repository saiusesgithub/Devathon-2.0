"use client"

export default function Timeline() {
  const events = [
    { title: "Registration Open", date: "Nov 07", description: "Register your team" },
    { title: "P.S Release", date: "Nov 11", description: "Select Problem Track" },
    { title: "Devthon Day", date: "Nov 14-15", description: "College Hours" },
    { title: "Results & Prizes", date: "Nov 15", description: "Winners announced" },
  ]

  return (
    <section id="timeline" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          Event <span className="text-accent">Timeline</span>
        </h2>
        <p className="text-center text-foreground/60 mb-16 max-w-2xl mx-auto">
          Follow the journey of our hackathon from registration to celebration
        </p>

        {/* Timeline */}
        <div className="grid md:grid-cols-4 gap-8">
          {events.map((event, index) => (
            <div key={index} className="relative">
              {/* Connecting line */}
              {index < events.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+2rem)] right-[calc(-100%-2rem)] h-1 bg-gradient-to-r from-accent to-transparent" />
              )}

              {/* Card */}
              <div className="glass-effect rounded-xl p-6 text-center group hover:bg-accent/5 transition-all duration-300">
                {/* Timeline dot */}
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center glow-cyan group-hover:scale-110 transition-transform">
                    <span className="text-accent-foreground font-bold">{index + 1}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                <p className="text-accent font-semibold mb-3">{event.date}</p>
                <p className="text-foreground/70 text-sm">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
