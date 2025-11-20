"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { CheckCircle, Mail, Calendar, Users, Hash } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface PaymentSuccessData {
  transactionId: string
  amount: number
  teamName: string
  teamId: string
}

export default function SuccessPage() {
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const data = sessionStorage.getItem('paymentSuccess')
    if (data) {
      setPaymentData(JSON.parse(data))
      // Clear after retrieval
      sessionStorage.removeItem('paymentSuccess')
    } else {
      // Redirect if no payment data
      router.push('/register')
    }
  }, [router])

  if (!paymentData) {
    return (
      <main className="w-full overflow-x-hidden bg-gradient-to-b from-background via-background to-secondary/10">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </main>
    )
  }

  return (
    <main 
      className="w-full overflow-x-hidden relative"
      style={{
        background: "radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000000 100%)",
      }}
    >
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none z-0">
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

      <div className="relative z-10">
        <Navigation />

        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl w-full"
          >
            {/* Main Card */}
            <div className="glass-effect-dark rounded-3xl p-8 md:p-12 border border-accent/30 glow-neon-lg">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                Registration <span className="text-accent">Submitted!</span>
              </h1>
              <p className="text-center text-foreground/70 text-lg mb-8">
                Your registration for DEVUP HACKATHON 2025 is being verified
              </p>

              {/* Payment Details */}
              <div className="space-y-6 mb-8">
                {/* Team Info */}
                <div className="glass-effect rounded-xl p-6 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Team Name</p>
                      <p className="text-xl font-bold text-foreground">{paymentData.teamName}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="glass-effect rounded-xl p-6 border border-accent/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Hash className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">UPI Transaction ID</p>
                      <p className="text-sm font-mono text-foreground break-all">{paymentData.transactionId}</p>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="glass-effect rounded-xl p-6 border border-accent/50 bg-accent/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                      <p className="text-3xl font-bold text-accent">₹{paymentData.amount}</p>
                    </div>
                    <div className="px-4 py-2 bg-accent/20 rounded-lg">
                      <p className="text-accent font-bold text-sm">VERIFYING</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="glass-effect rounded-xl p-6 border border-border mb-8">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  What's Next?
                </h3>
                <ul className="space-y-4 text-foreground/80">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">1</span>
                    </div>
                    <span>Our team will verify your UPI payment using the Transaction ID</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">2</span>
                    </div>
                    <span>You will receive your event ticket via email once payment is verified</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">3</span>
                    </div>
                    <span>Keep your UPI payment screenshot safe for reference</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">4</span>
                    </div>
                    <span>Check your email regularly for updates and event details</span>
                  </li>
                </ul>
              </div>

              {/* WhatsApp Group CTA */}
              <div className="glass-effect-dark rounded-2xl p-6 border border-green-400/40 mb-8 text-center space-y-4">
                <p className="text-lg font-semibold text-green-400 flex items-center justify-center gap-2">
                  ✅ Stay Updated Instantly
                </p>
                <p className="text-sm text-foreground/80">
                  Join our official WhatsApp group for schedule updates, announcements, and quick support from the organizing team.
                </p>
                <a
                  href="https://chat.whatsapp.com/CwpvTof1jcnA4xoxlJp9HF?mode=wwt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-500 text-background font-semibold hover:bg-green-400 transition-colors"
                >
                  Join WhatsApp Group
                </a>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <Link href="/" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-accent to-primary text-background rounded-full font-bold hover:shadow-xl transition-all"
                  >
                    Back to Home
                  </motion.button>
                </Link>
              </div>

              {/* Support */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Need help? Contact us at
                </p>
                <a 
                  href="mailto:support@devupsociety.com" 
                  className="text-accent hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  support@devupsociety.com
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>

      <style jsx>{`
        @keyframes gridPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
      `}</style>
    </main>
  )
}
