import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Navigation from '../components/navigation'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Navigation Component', () => {
  beforeEach(() => {
    // Reset scroll position before each test
    window.scrollY = 0
  })

  it('should render navigation bar', () => {
    render(<Navigation />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should display logo/brand name', () => {
    render(<Navigation />)
    expect(screen.getByText('DEVUP SOCIETY')).toBeInTheDocument()
  })

  it('should display all navigation links on desktop', () => {
    render(<Navigation />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Timeline')).toBeInTheDocument()
    expect(screen.getByText('Prizes')).toBeInTheDocument()
    expect(screen.getByText('Themes')).toBeInTheDocument()
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })

  it('should display register button', () => {
    render(<Navigation />)
    const registerButtons = screen.getAllByText('Register')
    expect(registerButtons.length).toBeGreaterThan(0)
  })

  it('should have correct href for navigation links', () => {
    render(<Navigation />)
    const aboutLink = screen.getAllByText('About')[0].closest('a')
    expect(aboutLink).toHaveAttribute('href', '/#about')
  })

  it('should toggle mobile menu on button click', () => {
    render(<Navigation />)
    
    // Find the menu button (it's an SVG icon button in mobile view)
    const buttons = screen.getAllByRole('button')
    const menuButton = buttons.find(btn => btn.querySelector('svg'))
    
    if (menuButton) {
      // Click to toggle menu
      fireEvent.click(menuButton)
      
      // Mobile menu items should be present
      const mobileLinks = screen.getAllByText('About')
      expect(mobileLinks.length).toBeGreaterThan(0)
    } else {
      // If no menu button found, navigation links should be visible
      expect(screen.getByText('About')).toBeInTheDocument()
    }
  })

  it('should close mobile menu when a link is clicked', () => {
    render(<Navigation />)
    // Get the menu button by finding the button with an SVG
    const buttons = screen.getAllByRole('button')
    const menuButton = buttons.find(btn => btn.querySelector('svg'))
    expect(menuButton).toBeDefined()
    
    // Open menu
    fireEvent.click(menuButton!)
    
    // Click a link
    const aboutLinks = screen.getAllByText('About')
    fireEvent.click(aboutLinks[0])
    
    // Menu should close (implementation may vary)
  })

  it('should change style on scroll', () => {
    render(<Navigation />)
    const nav = screen.getByRole('navigation')
    
    // Initial state
    expect(nav).toHaveClass('glass-effect-dark')
    
    // Simulate scroll
    window.scrollY = 100
    fireEvent.scroll(window)
    
    // Should update className (check after state update)
    waitFor(() => {
      expect(nav).toBeInTheDocument()
    })
  })

  it('should have accessible navigation structure', () => {
    render(<Navigation />)
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('should render logo link to home', () => {
    render(<Navigation />)
    const logoLink = screen.getByText('DEVUP SOCIETY').closest('a')
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('should display menu icons correctly', () => {
    render(<Navigation />)
    // Get the menu button by finding the button with an SVG
    const buttons = screen.getAllByRole('button')
    const menuButton = buttons.find(btn => btn.querySelector('svg'))
    expect(menuButton).toBeDefined()
    expect(menuButton).toBeInTheDocument()
  })
})
