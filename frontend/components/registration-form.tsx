"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface RegistrationFormProps {
  onSuccess?: () => void
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [teamName, setTeamName] = useState("")
  const [institution, setInstitution] = useState("")
  const [leaderName, setLeaderName] = useState("")
  const [leaderEmail, setLeaderEmail] = useState("")
  const [leaderPhone, setLeaderPhone] = useState("")
  const [members, setMembers] = useState<{ name: string; email: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addMember = () => {
    if (members.length < 3) {
      setMembers([...members, { name: "", email: "" }])
    } else {
      toast.error("Maximum 4 members per team (including leader)")
    }
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const updateMember = (index: number, field: "name" | "email", value: string) => {
    const updated = [...members]
    updated[index][field] = value
    setMembers(updated)
  }

  const totalMembers = members.length + 1 // +1 for leader
  const totalFee = totalMembers * 49

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validation
    if (!teamName || !institution || !leaderName || !leaderEmail || !leaderPhone) {
      toast.error("Please fill all required fields")
      return
    }

    if (totalMembers < 2) {
      toast.error("Minimum 2 members required (including team leader)")
      return
    }

    for (let member of members) {
      if (!member.name || !member.email) {
        toast.error("Please fill all member details")
        return
      }
    }

    setIsSubmitting(true)

    try {
      // 1. Create Razorpay order
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      const orderResponse = await fetch(`${backendUrl}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalFee }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await orderResponse.json()

      // Store form data for use in payment handler
      const formData = {
        teamName,
        institution,
        leaderName,
        leaderEmail,
        leaderPhone,
        members: [...members],
        totalMembers,
        totalFee,
      }

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Rc6729blYXJNt1",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DevUp Society",
        description: "Hackathon Registration Fee",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment
            const verifyResponse = await fetch(`${backendUrl}/api/payments/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.status === "ok") {
              // 4. Save to Supabase after successful payment WITH payment details
              const { data: teamData, error: teamError } = await supabase
                .from("teams")
                .insert({
                  team_name: formData.teamName,
                  institution: formData.institution,
                  leader_name: formData.leaderName,
                  leader_email: formData.leaderEmail,
                  leader_phone: formData.leaderPhone,
                  total_members: formData.totalMembers,
                  total_fee: formData.totalFee,
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  payment_status: 'completed',
                })
                .select()
                .single()

              if (teamError) {
                console.error("Team insert error:", teamError)
                console.error("Error code:", teamError.code)
                console.error("Error message:", teamError.message)
                console.error("Error details:", teamError.details)
                console.error("Error hint:", teamError.hint)
                alert(`Database Error: ${teamError.message || 'Unknown error'}. Payment ID: ${response.razorpay_payment_id}`)
                toast.error(`Payment successful but database error. Payment ID: ${response.razorpay_payment_id}`)
                setIsSubmitting(false)
                return
              }

              // 5. Insert team members if any
              if (formData.members.length > 0 && teamData) {
                const membersToInsert = formData.members.map((member) => ({
                  team_id: teamData.id,
                  name: member.name,
                  email: member.email,
                }))

                const { error: membersError } = await supabase
                  .from("team_members")
                  .insert(membersToInsert)

                if (membersError) {
                  console.error("Members insert error:", membersError)
                  toast.error(`Registration saved but failed to add members: ${membersError.message}`)
                }
              }

              // Redirect to success page with payment details
              const successData = {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: formData.totalFee,
                teamName: formData.teamName,
                teamId: teamData.id,
              }
              
              // Store in sessionStorage for success page
              sessionStorage.setItem('paymentSuccess', JSON.stringify(successData))
              
              // Redirect to success page
              window.location.href = '/register/success'
            } else {
              toast.error("Payment verification failed")
              setIsSubmitting(false)
            }
          } catch (error) {
            console.error("Payment handler error:", error)
            toast.error("Error processing payment. Please contact support.")
          } finally {
            setIsSubmitting(false)
          }
        },
        prefill: {
          name: leaderName,
          email: leaderEmail,
          contact: leaderPhone,
        },
        theme: {
          color: "#00ffb3",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled")
            setIsSubmitting(false)
          },
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Unexpected error:", error)
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
          <Label htmlFor="institution" className="text-foreground mb-2 block">College/Institution *</Label>
          <Input
            id="institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        ))}

        <p className="text-sm text-muted-foreground">
          Minimum 2 members, Maximum 4 members (including team leader)
        </p>
      </div>

      {/* Fee Summary */}
      <div className="bg-accent/10 border border-accent rounded-lg p-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-foreground">Team Members:</span>
          <span className="text-foreground font-semibold">{totalMembers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-foreground">Fee per Member:</span>
          <span className="text-foreground font-semibold">₹49</span>
        </div>
        <div className="border-t border-accent pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-foreground">Total Amount:</span>
            <span className="text-2xl font-bold text-accent">₹{totalFee}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : `Pay ₹${totalFee}`}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Secure payment powered by Razorpay
      </p>
    </form>
  )
}
