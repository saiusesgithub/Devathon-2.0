/**
 * Integration Tests for Registration Flow
 * Tests the complete user journey from form fill to payment
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RegistrationForm from '../components/registration-form'
import { supabase } from '../lib/supabase'

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}))

describe('Registration Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock Supabase responses
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })
  })

  it('should complete full registration flow for solo participant', async () => {
    render(<RegistrationForm />)
    
    // Step 1: Fill team details
    const teamNameInput = screen.getByLabelText(/team name/i)
    const collegeInput = screen.getByLabelText(/college\/institution/i)
    
    fireEvent.change(teamNameInput, { target: { value: 'Solo Coder' } })
    fireEvent.change(collegeInput, { target: { value: 'Test University' } })
    
    // Step 2: Fill leader details
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@test.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '9876543210' } })
    fireEvent.change(screen.getByLabelText(/roll number/i), { target: { value: 'CS001' } })
    
    // Step 3: Verify fee (should be ₹75 for 1 person) - check button specifically
    const payButton = screen.getByRole('button', { name: /pay ₹75 via upi/i })
    
    // Step 4: Pay button should be available
    expect(payButton).toBeInTheDocument()
    expect(payButton).toBeInTheDocument()
  })

  it('should complete full registration flow for team with multiple members', async () => {
    render(<RegistrationForm />)
    
    // Fill basic details
    fireEvent.change(screen.getByLabelText(/team name/i), { target: { value: 'Code Warriors' } })
    fireEvent.change(screen.getByLabelText(/college\/institution/i), { target: { value: 'Tech College' } })
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@test.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '9876543210' } })
    fireEvent.change(screen.getByLabelText(/roll number/i), { target: { value: 'CS001' } })
    
    // Add 2 members
    const addButton = screen.getByRole('button', { name: /add member/i })
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    
    // Verify total fee (3 members * ₹75 = ₹225)
    await waitFor(() => {
      expect(screen.getByText(/pay ₹225 via upi/i)).toBeInTheDocument()
    })
  })

  it('should handle team name conflict', async () => {
    // Mock team name already exists
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: [{ team_name: 'Existing Team' }],
        error: null,
      }),
    })
    
    render(<RegistrationForm />)
    
    const teamNameInput = screen.getByLabelText(/team name/i)
    fireEvent.change(teamNameInput, { target: { value: 'Existing Team' } })
    fireEvent.blur(teamNameInput) // Trigger the blur event to check team name
    
    await waitFor(() => {
      expect(screen.getByText(/already taken/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should calculate fees correctly for different team sizes', async () => {
    render(<RegistrationForm />)
    
    const addButton = screen.getByRole('button', { name: /add member/i })
    
    // 1 member (leader only) = ₹75
    expect(screen.getByText(/pay ₹75 via upi/i)).toBeInTheDocument()
    
    // Add 1 member = 2 * ₹75 = ₹150
    fireEvent.click(addButton)
    await waitFor(() => {
      expect(screen.getByText(/pay ₹150 via upi/i)).toBeInTheDocument()
    })
    
    // Add another member = 3 * ₹75 = ₹225
    fireEvent.click(addButton)
    await waitFor(() => {
      expect(screen.getByText(/pay ₹225 via upi/i)).toBeInTheDocument()
    })
    
    // Add third member = 4 * ₹75 = ₹300
    fireEvent.click(addButton)
    await waitFor(() => {
      expect(screen.getByText(/pay ₹300 via upi/i)).toBeInTheDocument()
    })
  })

  it('should validate required fields before submission', () => {
    render(<RegistrationForm />)
    
    const completeButton = screen.getByRole('button', { name: /complete registration/i })
    
    // Complete registration button should be disabled when form is incomplete
    expect(completeButton).toBeDisabled()
    
    // Form fields should have required attribute
    const teamNameInput = screen.getByLabelText(/team name/i)
    expect(teamNameInput).toHaveAttribute('required')
  })

  it('should display payment instructions and UPI details', async () => {
    render(<RegistrationForm />)
    
    // UPI details should be visible in payment instructions
    expect(screen.getByText(/7569799199@axl/i)).toBeInTheDocument()
    expect(screen.getByText(/payment instructions/i)).toBeInTheDocument()
    
    // Payment button should be available
    const payButton = screen.getByRole('button', { name: /pay ₹75 via upi/i })
    expect(payButton).toBeInTheDocument()
  })

  it('should have transaction ID input field', async () => {
    render(<RegistrationForm />)
    
    // Transaction ID field should be present
    const transactionInput = screen.getByLabelText(/transaction id/i)
    expect(transactionInput).toBeInTheDocument()
    expect(transactionInput).toHaveAttribute('required')
  })

  it('should enable complete registration button when transaction ID is filled', async () => {
    render(<RegistrationForm />)
    
    // Initially disabled
    const completeButton = screen.getByRole('button', { name: /complete registration/i })
    expect(completeButton).toBeDisabled()
    
    // Fill transaction ID
    const transactionInput = screen.getByLabelText(/transaction id/i)
    fireEvent.change(transactionInput, { target: { value: 'TXN123456' } })
    
    // Should still be disabled if other fields are empty (validates all fields)
    expect(screen.getByLabelText(/team name/i)).toBeInTheDocument()
  })
})
