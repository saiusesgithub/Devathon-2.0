"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { CheckCircle, Download, Mail, Calendar, Users, CreditCard, Hash } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import jsPDF from "jspdf"

interface PaymentSuccessData {
  paymentId: string
  orderId: string
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

  const handleDownload = () => {
    const doc = new jsPDF()
    
    // Set document properties
    doc.setProperties({
      title: 'DEVUP HACKATHON 2025 - Payment Receipt',
      subject: 'Registration Confirmation',
      author: 'DEVUP SOCIETY',
    })

    // Add accent color (#00ffb3)
    const accentColor: [number, number, number] = [0, 255, 179]
    const darkColor: [number, number, number] = [20, 20, 20]
    const grayColor: [number, number, number] = [120, 120, 120]

    // Header with background
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2])
    doc.rect(0, 0, 210, 45, 'F')
    
    // Logo/Title
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('DEVUP SOCIETY', 105, 20, { align: 'center' })
    
    doc.setFontSize(16)
    doc.setTextColor(255, 255, 255)
    doc.text('HACKATHON 2025', 105, 30, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('PAYMENT CONFIRMATION', 105, 38, { align: 'center' })

    // Accent line
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(1)
    doc.line(20, 48, 190, 48)

    // Reset to black text for content
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    let yPos = 60

    // Registration Details Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.text('Registration Details', 20, yPos)
    yPos += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    
    // Team Name
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('Team Name:', 20, yPos)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text(paymentData.teamName, 60, yPos)
    yPos += 8

    // Team ID
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('Team ID:', 20, yPos)
    doc.setTextColor(0, 0, 0)
    doc.setFont('courier', 'normal')
    doc.text(paymentData.teamId, 60, yPos)
    yPos += 15

    // Payment Details Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.text('Payment Details', 20, yPos)
    yPos += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    
    // Payment ID
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('Payment ID:', 20, yPos)
    doc.setTextColor(0, 0, 0)
    doc.setFont('courier', 'normal')
    doc.setFontSize(9)
    doc.text(paymentData.paymentId, 60, yPos)
    yPos += 8

    // Order ID
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('Order ID:', 20, yPos)
    doc.setTextColor(0, 0, 0)
    doc.setFont('courier', 'normal')
    doc.setFontSize(9)
    doc.text(paymentData.orderId, 60, yPos)
    yPos += 8

    // Amount - highlighted
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.roundedRect(18, yPos - 5, 174, 12, 2, 2, 'S')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('Amount Paid:', 20, yPos + 2)
    doc.setFontSize(16)
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
    doc.text(`₹${paymentData.amount}`, 190, yPos + 2, { align: 'right' })
    yPos += 15

    // Payment Status
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('Payment Status:', 20, yPos)
    doc.setFillColor(34, 197, 94) // Green
    doc.roundedRect(58, yPos - 4, 28, 7, 1, 1, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('COMPLETED', 72, yPos + 1, { align: 'center' })
    yPos += 8

    // Date
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('Date & Time:', 20, yPos)
    doc.setTextColor(0, 0, 0)
    doc.text(new Date().toLocaleString(), 60, yPos)
    yPos += 20

    // Divider line
    doc.setDrawColor(grayColor[0], grayColor[1], grayColor[2])
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)
    yPos += 10

    // Important Notes
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2])
    doc.text('Important Information', 20, yPos)
    yPos += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    
    const notes = [
      '• Please keep this receipt for verification on event day',
      '• Check your email for additional event details and updates',
      '• Join our community channels for announcements',
      '• Bring a valid ID and this receipt to the venue'
    ]
    
    notes.forEach(note => {
      doc.text(note, 25, yPos)
      yPos += 6
    })

    yPos += 10

    // Footer
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)
    yPos += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2])
    doc.text('Thank you for registering! See you at the hackathon!', 105, yPos, { align: 'center' })
    yPos += 5
    doc.text('For support, contact: support@devupsociety.com', 105, yPos, { align: 'center' })
    
    // Add watermark
    doc.setTextColor(220, 220, 220)
    doc.setFontSize(40)
    doc.setFont('helvetica', 'bold')
    doc.text('DEVUP', 105, 200, { 
      align: 'center',
      angle: 45
    })

    // Save the PDF
    doc.save(`DEVUP_HACKATHON_${paymentData.teamId.substring(0, 8)}.pdf`)
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
            {/* Success Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                <CheckCircle className="w-24 h-24 text-green-500 relative z-10" strokeWidth={1.5} />
              </div>
            </motion.div>

            {/* Main Card */}
            <div className="glass-effect-dark rounded-3xl p-8 md:p-12 border border-accent/30 glow-neon-lg">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                Payment <span className="text-accent">Successful!</span>
              </h1>
              <p className="text-center text-foreground/70 text-lg mb-8">
                Your registration for DEVUP HACKATHON 2025 is confirmed
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

                {/* Payment ID */}
                <div className="glass-effect rounded-xl p-6 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Payment ID</p>
                      <p className="text-sm font-mono text-foreground break-all">{paymentData.paymentId}</p>
                    </div>
                  </div>
                </div>

                {/* Order ID */}
                <div className="glass-effect rounded-xl p-6 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Hash className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                      <p className="text-sm font-mono text-foreground break-all">{paymentData.orderId}</p>
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
                    <div className="px-4 py-2 bg-green-500/20 rounded-lg">
                      <p className="text-green-500 font-bold text-sm">PAID</p>
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
                <ul className="space-y-3 text-foreground/80">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">1</span>
                    </div>
                    <span>You will receive a confirmation email at your registered email address</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">2</span>
                    </div>
                    <span>Download and keep your payment receipt for event day verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">3</span>
                    </div>
                    <span>Join our community channels for updates and announcements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">4</span>
                    </div>
                    <span>Get ready for an amazing hackathon experience!</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-accent to-primary text-background rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download Receipt
                </motion.button>
                <Link href="/" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 glass-effect border border-accent/50 text-accent rounded-full font-bold hover:bg-accent/10 transition-all"
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
