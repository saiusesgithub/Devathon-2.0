"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"
import type { TeamRegistration, TeamMember } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Users, Mail, Phone, Building2, RefreshCw, Search } from "lucide-react"

interface TeamWithMembers extends TeamRegistration {
  team_members: TeamMember[]
}

export default function AdminPage() {
  const [teams, setTeams] = useState<TeamWithMembers[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchTeams = async () => {
    setLoading(true)
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select(`
          *,
          team_members (*)
        `)
        .order("created_at", { ascending: false })

      if (teamsError) {
        console.error("Error fetching teams:", teamsError)
        toast.error("Failed to load teams data")
        return
      }

      setTeams(teamsData as TeamWithMembers[] || [])
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const toggleAttendance = async (teamId: string, currentStatus: boolean) => {
    setUpdating(teamId)
    try {
      const { error } = await supabase
        .from("teams")
        .update({ is_present: !currentStatus })
        .eq("id", teamId)

      if (error) {
        console.error("Error updating attendance:", error)
        toast.error("Failed to update attendance")
        return
      }

      // Update local state
      setTeams((prev) =>
        prev.map((team) =>
          team.id === teamId ? { ...team, is_present: !currentStatus } : team
        )
      )

      toast.success(`Marked as ${!currentStatus ? "Present" : "Absent"}`)
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setUpdating(null)
    }
  }

  // Filter teams based on search query
  const filteredTeams = teams.filter((team) =>
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: teams.length,
    present: teams.filter((t) => t.is_present).length,
    absent: teams.filter((t) => !t.is_present).length,
  }

  return (
    <main className="w-full overflow-x-hidden bg-gradient-to-b from-background via-background to-secondary/10">
      <Navigation />

      <section className="relative min-h-screen pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

        <div className="relative z-10 container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="text-gradient">Admin Dashboard</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Manage team registrations and attendance
                </p>
              </div>
              <Button
                onClick={fetchTeams}
                disabled={loading}
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-effect border border-border p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Teams</p>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  </div>
                </div>
              </Card>
              <Card className="glass-effect border border-green-500/30 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-3xl font-bold text-green-500">{stats.present}</p>
                  </div>
                </div>
              </Card>
              <Card className="glass-effect border border-orange-500/30 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-3xl font-bold text-orange-500">{stats.absent}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search team name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-effect border-border focus:border-accent"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-muted-foreground">
                Found {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""} matching "{searchQuery}"
              </p>
            )}
          </div>

          {/* Teams List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              <p className="mt-4 text-muted-foreground">Loading teams...</p>
            </div>
          ) : teams.length === 0 ? (
            <Card className="glass-effect border border-border p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Teams Yet</h3>
              <p className="text-muted-foreground">
                Registered teams will appear here once they sign up
              </p>
            </Card>
          ) : filteredTeams.length === 0 ? (
            <Card className="glass-effect border border-border p-12 text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Teams Found</h3>
              <p className="text-muted-foreground">
                No teams match your search "{searchQuery}"
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="mt-4 border-accent text-accent hover:bg-accent/10"
              >
                Clear Search
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredTeams.map((team) => (
                <Card
                  key={team.id}
                  className={`glass-effect border p-6 transition-all ${
                    team.is_present
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-foreground">
                          {team.team_name}
                        </h3>
                        {team.is_present && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-semibold rounded-full">
                            PRESENT
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {team.institution}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {team.total_members} members
                        </div>
                        <div className="font-semibold text-accent">
                          ₹{team.total_fee}
                        </div>
                      </div>
                    </div>

                    {/* Attendance Toggle */}
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={team.is_present || false}
                          onCheckedChange={() =>
                            toggleAttendance(team.id!, team.is_present || false)
                          }
                          disabled={updating === team.id}
                          className="w-6 h-6"
                        />
                        <span className="text-sm font-semibold text-foreground">
                          Mark Present
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Leader Details */}
                  <div className="mb-4 p-4 bg-secondary/20 rounded-lg border border-border">
                    <p className="text-sm font-semibold text-accent mb-2">Team Leader</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="text-foreground font-medium">{team.leader_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`mailto:${team.leader_email}`}
                          className="text-foreground hover:text-accent transition-colors"
                        >
                          {team.leader_email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`tel:${team.leader_phone}`}
                          className="text-foreground hover:text-accent transition-colors"
                        >
                          {team.leader_phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  {team.team_members && team.team_members.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-accent mb-2">Team Members</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {team.team_members.map((member, idx) => (
                          <div
                            key={member.id}
                            className="p-3 bg-secondary/10 rounded-lg border border-border"
                          >
                            <p className="text-xs text-muted-foreground mb-1">
                              Member {idx + 1}
                            </p>
                            <p className="text-foreground font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Details */}
                  {team.payment_id && (
                    <div className="mb-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                      <p className="text-sm font-semibold text-green-500 mb-2">Payment Details</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Payment ID</p>
                          <p className="text-foreground font-mono text-xs break-all">{team.payment_id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Order ID</p>
                          <p className="text-foreground font-mono text-xs break-all">{team.order_id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs font-semibold rounded">
                            {team.payment_status?.toUpperCase() || 'COMPLETED'}
                          </span>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Amount Paid</p>
                          <p className="text-green-500 font-bold">₹{team.total_fee}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registration Date */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Registered on:{" "}
                      {team.created_at
                        ? new Date(team.created_at).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
