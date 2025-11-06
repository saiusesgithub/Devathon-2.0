"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = [
    { label: "About", href: "/#about" },
    { label: "Timeline", href: "/#timeline" },
    { label: "Prizes", href: "/#prizes" },
    { label: "Themes", href: "/#themes" },
    { label: "FAQ", href: "/#faq" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 glass-effect-dark backdrop-blur-md ${
        isScrolled ? "border-b border-accent/30" : "border-b border-accent/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="text-lg font-bold text-accent">DEVUP SOCIETY</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-accent transition-colors duration-300 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/register"
            className="hidden md:inline px-6 py-2 bg-gradient-to-r from-accent to-primary text-primary-foreground rounded-full font-semibold hover:glow-neon transition-all duration-300"
          >
            Register
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-accent hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-accent/20">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-foreground/80 hover:text-accent hover:bg-accent/5 transition-all duration-300 text-sm"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-[calc(100%-2rem)] mx-4 mt-2 block text-center px-6 py-2 bg-gradient-to-r from-accent to-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
