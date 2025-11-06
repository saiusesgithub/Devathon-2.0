import { Mail, Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-accent/20 glass-effect">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <span className="font-bold text-sm text-primary-foreground">D</span>
              </div>
              <span className="text-lg font-bold text-accent">DevUp</span>
            </div>
            <p className="text-foreground/60 mb-4">Building the next generation of innovators and developers.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["About", "Timeline", "Prizes", "Registration", "FAQ"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-foreground/60 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <a
                href="mailto:devupsociety@gmail.com"
                className="flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors"
              >
                <Mail size={18} />
                <span>devupsociety@gmail.com</span>
              </a>
              <div className="flex gap-4">
                <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-accent/20 pt-8 text-center text-foreground/60">
          <p>&copy; 2025 DevUp Club. All rights reserved. | Hackathon 2025</p>
        </div>
      </div>
    </footer>
  )
}
