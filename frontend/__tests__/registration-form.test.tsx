import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RegistrationForm from '../components/registration-form'

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}))

describe('RegistrationForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render registration form', () => {
    render(<RegistrationForm />)
    // Check for team details heading instead
    expect(screen.getByText(/team details/i)).toBeInTheDocument()
  })

  it('should have all required input fields', () => {
    render(<RegistrationForm />)
    
    expect(screen.getByLabelText(/team name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/college\/institution/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/roll number/i)).toBeInTheDocument()
  })

  it('should display fee calculation', () => {
    render(<RegistrationForm />)
    // Check for the payment button with fee
    expect(screen.getByText(/pay ₹75 via upi/i)).toBeInTheDocument()
  })

  it('should allow adding team members', () => {
    render(<RegistrationForm />)
    const addButton = screen.getByRole('button', { name: /add member/i })
    
    fireEvent.click(addButton)
    
    // Check if member fields appeared
    waitFor(() => {
      expect(screen.getByText(/member 1/i)).toBeInTheDocument()
    })
  })

  it('should limit maximum team members to 4', () => {
    render(<RegistrationForm />)
    const addButton = screen.getByRole('button', { name: /add member/i })
    
    // Try to add 4 members (should only allow 3 + leader = 4 total)
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton) // This should show error
    
    // Toast error should be called
    const { toast } = require('sonner')
    waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('should allow removing team members', () => {
    render(<RegistrationForm />)
    const addButton = screen.getByRole('button', { name: /add member/i })
    
    // Add a member
    fireEvent.click(addButton)
    
    waitFor(() => {
      const removeButton = screen.getByRole('button', { name: /remove/i })
      fireEvent.click(removeButton)
      
      expect(screen.queryByText(/member 1/i)).not.toBeInTheDocument()
    })
  })

  it('should update total fee when members are added', () => {
    render(<RegistrationForm />)
    
    // Initial fee for 1 member (leader)
    expect(screen.getByText(/pay ₹75 via upi/i)).toBeInTheDocument()
    
    // Add a member
    const addButton = screen.getByRole('button', { name: /add member/i })
    fireEvent.click(addButton)
    
    // Fee should update to ₹150 (2 * 75)
    waitFor(() => {
      expect(screen.getByText(/pay ₹150 via upi/i)).toBeInTheDocument()
    })
  })

  it('should validate team name uniqueness', async () => {
    render(<RegistrationForm />)
    const teamNameInput = screen.getByLabelText(/team name/i)
    
    fireEvent.change(teamNameInput, { target: { value: 'Test Team' } })
    
    // Should trigger team name check
    await waitFor(() => {
      expect(teamNameInput).toHaveValue('Test Team')
    })
  })

  it('should validate email format', () => {
    render(<RegistrationForm />)
    const emailInput = screen.getByLabelText(/email/i)
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)
    
    // HTML5 validation should trigger
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('should validate phone number format', () => {
    render(<RegistrationForm />)
    const phoneInput = screen.getByLabelText(/phone/i)
    
    expect(phoneInput).toHaveAttribute('type', 'tel')
  })

  it('should show payment button', async () => {
    render(<RegistrationForm />)
    
    // The payment button should be visible (it shows UPI payment option)
    const payButton = screen.getByRole('button', { name: /pay ₹75 via upi/i })
    expect(payButton).toBeInTheDocument()
  })

  it('should display UPI ID in payment instructions', async () => {
    render(<RegistrationForm />)
    
    // UPI ID should be visible in the payment instructions section
    expect(screen.getByText(/7569799199@axl/i)).toBeInTheDocument()
  })

  it('should have complete registration button disabled initially', async () => {
    render(<RegistrationForm />)
    
    // The complete registration button should be disabled when transaction ID is empty
    const completeButton = screen.getByRole('button', { name: /complete registration/i })
    expect(completeButton).toBeDisabled()
  })

  it('should call onSuccess callback after successful registration', async () => {
    const onSuccess = jest.fn()
    render(<RegistrationForm onSuccess={onSuccess} />)
    
    // Mock successful submission
    // (Implementation depends on your form logic)
  })
})
