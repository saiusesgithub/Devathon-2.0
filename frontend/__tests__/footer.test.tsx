import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from '../components/footer'

describe('Footer Component', () => {
  it('should render footer', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should display DevUp branding', () => {
    render(<Footer />)
    // Check for the DevUp logo text within the span with specific class
    const devUpElements = screen.getAllByText(/DevUp/i)
    expect(devUpElements.length).toBeGreaterThan(0)
    expect(devUpElements[0]).toHaveClass('text-lg', 'font-bold', 'text-accent')
  })

  it('should display contact email', () => {
    render(<Footer />)
    expect(screen.getByText(/devupsociety@gmail.com/i)).toBeInTheDocument()
  })

  it('should have email link with correct href', () => {
    render(<Footer />)
    const emailLink = screen.getByText(/devupsociety@gmail.com/i).closest('a')
    expect(emailLink).toHaveAttribute('href', 'mailto:devupsociety@gmail.com')
  })

  it('should display copyright information', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2025/i)).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })

  it('should have quick links section', () => {
    render(<Footer />)
    expect(screen.getByText(/quick links/i)).toBeInTheDocument()
  })

  it('should have social media icons', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    const links = footer.querySelectorAll('a')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should have get in touch section', () => {
    render(<Footer />)
    expect(screen.getByText(/get in touch/i)).toBeInTheDocument()
  })
})
