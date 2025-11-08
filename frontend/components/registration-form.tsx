"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, UserPlus, QrCode, Smartphone, X } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface RegistrationFormProps {
  onSuccess?: () => void
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [teamName, setTeamName] = useState("")
  const [collegeName, setCollegeName] = useState("")
  const [leaderName, setLeaderName] = useState("")
  const [leaderEmail, setLeaderEmail] = useState("")
  const [leaderPhone, setLeaderPhone] = useState("")
  const [leaderRollNo, setLeaderRollNo] = useState("")
  const [members, setMembers] = useState<{ name: string; email: string; roll_no: string }[]>([])
  const [transactionId, setTransactionId] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addMember = () => {
    if (members.length < 3) {
      setMembers([...members, { name: "", email: "", roll_no: "" }])
    } else {
      toast.error("Maximum 4 members per team (including leader)")
    }
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const updateMember = (index: number, field: "name" | "email" | "roll_no", value: string) => {
    const updated = [...members]
    updated[index][field] = value
    setMembers(updated)
  }

  const totalMembers = members.length + 1 // +1 for leader
  const totalFee = totalMembers * 75 // ₹75 per person
  const upiId = "7569799199@axl"
  const upiName = "DevUp Society"

  useEffect(() => {
    if (showPaymentModal && typeof window !== 'undefined') {
      // Generate QR code for desktop users
      const QRCode = (window as any).QRCode
      if (QRCode) {
        const qrContainer = document.getElementById("qr-code-container")
        if (qrContainer) {
          qrContainer.innerHTML = ""
          const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${totalFee}&cu=INR&tn=${encodeURIComponent("Devthon Registration")}`
          new QRCode(qrContainer, {
            text: upiLink,
            width: 256,
            height: 256,
          })
        }
      }
    }
  }, [showPaymentModal, totalFee])

  const handlePaymentClick = () => {
    // Validate form before showing payment
    if (!teamName || !collegeName || !leaderName || !leaderEmail || !leaderPhone || !leaderRollNo) {
      toast.error("Please fill all required fields")
      return
    }

    if (totalMembers < 2) {
      toast.error("Minimum 2 members required (including team leader)")
      return
    }

    for (let member of members) {
      if (!member.name || !member.email || !member.roll_no) {
        toast.error("Please fill all member details including roll numbers")
        return
      }
    }

    // Check if mobile device
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${totalFee}&cu=INR&tn=${encodeURIComponent("Devthon Registration")}`
    
    if (isMobile) {
      // Open UPI app directly on mobile
      window.location.href = upiLink
      toast.success("Opening UPI app... Complete payment and return to enter transaction ID")
      // Show modal after delay to allow user to complete payment
      setTimeout(() => setShowPaymentModal(true), 3000)
    } else {
      // Show QR code modal on desktop/laptop
      setShowPaymentModal(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionId.trim()) {
      toast.error("Please enter transaction ID after completing payment")
      return
    }

    setIsSubmitting(true)

    try {
      // Save to Supabase - single table with all data
      const { data: teamData, error: teamError} = await supabase
        .from("teams")
        .insert({
          team_name: teamName,
          college_name: collegeName,
          leader_name: leaderName,
          leader_email: leaderEmail,
          leader_phone: leaderPhone,
          leader_roll_no: leaderRollNo,
          team_members: members, // Store as JSON array
          total_members: totalMembers,
          total_fee: totalFee,
          upi_transaction_id: transactionId,
          payment_status: 'pending',
        })
        .select()
        .single()

      if (teamError) {
        console.error("Team insert error:", teamError)
        toast.error(`Registration failed: ${teamError.message}`)
        setIsSubmitting(false)
        return
      }

      // Store success data
      const successData = {
        transactionId: transactionId,
        amount: totalFee,
        teamName: teamName,
        teamId: teamData.id,
      }
      
      sessionStorage.setItem('paymentSuccess', JSON.stringify(successData))
      
      // Redirect to success page
      window.location.href = '/register/success'
      
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Team Details */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-accent" />
          Team Details
        </h3>

        <div>
          <Label htmlFor="teamName" className="text-foreground mb-2 block">Team Name *</Label>
          <Input
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter your team name"
            className="w-full bg-input border border-border"
            required
          />
        </div>

        <div>
          <Label htmlFor="collegeName" className="text-foreground mb-2 block">College/Institution *</Label>
          <Input
            id="collegeName"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            placeholder="Enter your college name"
            className="w-full bg-input border border-border"
            required
          />
        </div>
      </div>

      {/* Team Leader */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-xl font-bold text-foreground">Team Leader Details *</h3>

        <div>
          <Label htmlFor="leaderName" className="text-foreground mb-2 block">Full Name *</Label>
          <Input
            id="leaderName"
            value={leaderName}
            onChange={(e) => setLeaderName(e.target.value)}
            placeholder="Enter leader's name"
            className="w-full bg-input border border-border"
            required
          />
        </div>

        <div>
          <Label htmlFor="leaderRollNo" className="text-foreground mb-2 block">Roll Number *</Label>
          <Input
            id="leaderRollNo"
            value={leaderRollNo}
            onChange={(e) => setLeaderRollNo(e.target.value)}
            placeholder="e.g., 21R11A0501"
            className="w-full bg-input border border-border"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leaderEmail" className="text-foreground mb-2 block">Email *</Label>
            <Input
              id="leaderEmail"
              type="email"
              value={leaderEmail}
              onChange={(e) => setLeaderEmail(e.target.value)}
              placeholder="leader@example.com"
              className="w-full bg-input border border-border"
              required
            />
          </div>
          <div>
            <Label htmlFor="leaderPhone" className="text-foreground mb-2 block">Phone *</Label>
            <Input
              id="leaderPhone"
              type="tel"
              value={leaderPhone}
              onChange={(e) => setLeaderPhone(e.target.value)}
              placeholder="+91 XXXXXXXXXX"
              className="w-full bg-input border border-border"
              required
            />
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">Team Members</h3>
          <Button
            type="button"
            onClick={addMember}
            variant="outline"
            size="sm"
            disabled={members.length >= 3}
            className="border-accent text-accent hover:bg-accent/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {members.map((member, index) => (
          <div key={index} className="bg-secondary/20 border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-muted-foreground">Member {index + 1}</p>
              <Button
                type="button"
                onClick={() => removeMember(index)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground mb-2 block">Name *</Label>
                <Input
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                  placeholder="Member name"
                  className="w-full bg-input border border-border"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground mb-2 block">Roll Number *</Label>
                  <Input
                    value={member.roll_no}
                    onChange={(e) => updateMember(index, "roll_no", e.target.value)}
                    placeholder="e.g., 21R11A0502"
                    className="w-full bg-input border border-border"
                    required
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block">Email *</Label>
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) => updateMember(index, "email", e.target.value)}
                    placeholder="member@example.com"
                    className="w-full bg-input border border-border"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <p className="text-sm text-muted-foreground">
          Minimum 2 members, Maximum 4 members (including team leader)
        </p>
      </div>

      {/* Fee Summary */}
      <div className="bg-accent/10 border-2 border-accent cyber-notch-tr p-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-foreground">Team Members:</span>
          <span className="text-foreground font-semibold">{totalMembers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-foreground">Fee per Member:</span>
          <span className="text-foreground font-semibold">₹75</span>
        </div>
        <div className="border-t border-accent pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-foreground">Total Amount:</span>
            <span className="text-2xl font-bold text-accent text-glow">₹{totalFee}</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="glass-effect-dark border-2 border-accent/30 cyber-notch-tl p-6 space-y-4">
        <h3 className="text-xl font-bold text-accent flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Payment Instructions
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-foreground/80 text-sm">
          <li>Click "Pay via UPI" button below</li>
          <li>Complete payment of ₹{totalFee} to UPI ID: <span className="text-accent font-mono">{upiId}</span></li>
          <li className="text-accent font-semibold">Take a screenshot of the payment confirmation</li>
          <li>Keep the screenshot safe for verification</li>
          <li>Enter your Transaction ID below</li>
          <li>Click "Complete Registration"</li>
        </ol>
        <div className="bg-accent/10 border border-accent/50 rounded p-3 mt-4">
          <p className="text-sm text-foreground/90">
            ℹ️ We will verify your payment using the UPI Transaction ID and send your event ticket to your registered email once verified.
          </p>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        type="button"
        onClick={handlePaymentClick}
        size="lg"
        className="w-full bg-gradient-to-r from-accent to-primary text-primary-foreground text-lg py-6 glow-neon-lg"
      >
        <QrCode className="w-5 h-5 mr-2" />
        Pay ₹{totalFee} via UPI
      </Button>

      {/* Transaction ID Field */}
      <div className="space-y-2">
        <Label htmlFor="transactionId" className="text-foreground flex items-center gap-2">
          Transaction ID / UPI Reference Number *
        </Label>
        <Input
          id="transactionId"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Enter transaction ID after payment"
          className="w-full font-mono"
          required
        />
        <p className="text-xs text-accent/80 font-medium">
          📸 Make sure you have saved the payment screenshot before submitting
        </p>
        <p className="text-xs text-muted-foreground">
          Enter your UPI Transaction ID (UTR) from payment confirmation:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1 ml-4">
          <li>• <span className="text-accent">Google Pay</span>: 12-digit Transaction ID</li>
          <li>• <span className="text-accent">PhonePe</span>: 16-digit Transaction ID</li>
          <li>• <span className="text-accent">Paytm</span>: 12-digit Transaction ID</li>
          <li>• Other UPI apps: Check payment details for Transaction ID/UTR</li>
        </ul>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
        disabled={isSubmitting || !transactionId}
      >
        {isSubmitting ? "Submitting..." : "Complete Registration"}
      </Button>

      <div className="glass-effect border border-accent/30 rounded p-4 text-center space-y-2">
        <p className="text-sm text-foreground/90 font-medium">
          🔐 Payment will be verified by DevUp Society team
        </p>
        <p className="text-xs text-muted-foreground">
          Your event ticket will be sent to <span className="text-accent">{leaderEmail || "your email"}</span> after verification
        </p>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-lg p-4">
          <div className="relative w-full max-w-md glass-effect-dark border-2 border-accent cyber-notch-tr p-8 space-y-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setShowPaymentModal(false)}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-accent text-glow">Scan QR to Pay</h3>
              <p className="text-foreground/80">Pay ₹{totalFee} via any UPI app</p>
              
              <div className="flex justify-center">
                <div id="qr-code-container" className="bg-white p-4 rounded-lg"></div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-foreground/60">Or pay manually to:</p>
                <div className="bg-background/50 border border-accent/30 rounded p-3">
                  <p className="text-accent font-mono font-bold">{upiId}</p>
                  <p className="text-xs text-foreground/60">DevUp Society</p>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/50 rounded p-4 space-y-2">
                <p className="text-sm font-semibold text-accent">📸 Important:</p>
                <p className="text-xs text-foreground/80">
                  Take a screenshot of the payment confirmation and keep it safe. We will verify your payment and send your ticket via email.
                </p>
              </div>

              <Button
                onClick={() => setShowPaymentModal(false)}
                className="w-full"
              >
                I've Completed Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
