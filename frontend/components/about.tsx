export default function About() {
  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              About the <span className="text-accent">Hackathon</span>
            </h2>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              Join the DevUp First-Year Hackathon 2025, where first-year students collaborate to build innovative
              solutions. This 2-day college hour coding hackathon brings together creative minds to tackle real-world problems and
              showcase their skills.
            </p>
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              Whether you're a beginner or experienced developer, this hackathon is your opportunity to learn, network,
              and build something amazing with your peers.
            </p>
            <div className="flex gap-8 flex-wrap">
              <div>
                <div className="text-3xl font-bold text-accent">400+</div>
                <div className="text-foreground/60">Participants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">100+</div>
                <div className="text-foreground/60">Teams</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">₹25K+</div>
                <div className="text-foreground/60">Prize Pool</div>
              </div>
            </div>
          </div>

          {/* Illustration Placeholder */}
          <div className="order-1 md:order-2">
            <div className="relative w-full aspect-square glass-effect-dark rounded-2xl flex items-center justify-center overflow-hidden glow-cyan-lg">
              <svg viewBox="0 0 200 200" className="w-full h-full p-8">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-accent/30"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary/50"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-accent"
                />
                <circle cx="100" cy="100" r="20" fill="currentColor" className="text-accent animate-pulse" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
