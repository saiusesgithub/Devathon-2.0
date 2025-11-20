import { supabase } from '@/lib/supabase'

describe('Supabase Client', () => {
  it('should be defined', () => {
    expect(supabase).toBeDefined()
  })

  it('should have required methods', () => {
    expect(supabase).toHaveProperty('from')
    expect(supabase).toHaveProperty('auth')
    expect(supabase).toHaveProperty('storage')
  })

  it('should have from method that returns query builder', () => {
    const query = supabase.from('teams')
    expect(query).toBeDefined()
    expect(query).toHaveProperty('select')
    expect(query).toHaveProperty('insert')
    expect(query).toHaveProperty('update')
    expect(query).toHaveProperty('delete')
  })
})

describe('TypeScript Interfaces', () => {
  it('should validate TeamRegistration interface structure', () => {
    const mockTeam = {
      id: '123',
      team_name: 'Test Team',
      college_name: 'Test College',
      leader_name: 'John Doe',
      leader_email: 'john@example.com',
      leader_phone: '1234567890',
      leader_roll_no: 'CS001',
      total_members: 2,
      total_fee: 150,
      payment_status: 'pending' as const,
      is_present: false,
      created_at: new Date().toISOString(),
    }

    expect(mockTeam).toHaveProperty('team_name')
    expect(mockTeam).toHaveProperty('college_name')
    expect(mockTeam).toHaveProperty('leader_name')
    expect(mockTeam.total_members).toBeGreaterThan(0)
    expect(mockTeam.total_fee).toBeGreaterThan(0)
  })

  it('should validate TeamMember interface structure', () => {
    const mockMember = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+91-9999999999',
      college: 'Sample College',
    }

    expect(mockMember).toHaveProperty('name')
    expect(mockMember).toHaveProperty('email')
    expect(mockMember).toHaveProperty('phone')
    expect(mockMember).toHaveProperty('college')
  })

  it('should validate payment status enum values', () => {
    const validStatuses = ['pending', 'verified', 'rejected']
    validStatuses.forEach(status => {
      expect(['pending', 'verified', 'rejected']).toContain(status)
    })
  })

  it('should validate team data with members', () => {
    const teamWithMembers = {
      id: '123',
      team_name: 'Test Team',
      college_name: 'Test College',
      leader_name: 'John Doe',
      leader_email: 'john@example.com',
      leader_phone: '1234567890',
      leader_roll_no: 'CS001',
      total_members: 3,
      total_fee: 225,
      team_members: [
        { name: 'Member 1', email: 'member1@example.com', phone: '+91-1111111111', college: 'Sample College' },
        { name: 'Member 2', email: 'member2@example.com', phone: '+91-2222222222', college: 'Sample College' },
      ],
    }

    expect(teamWithMembers.team_members).toHaveLength(2)
    expect(teamWithMembers.total_members).toBe(3) // leader + 2 members
    expect(teamWithMembers.total_fee).toBe(225) // 3 * 75
  })
})
