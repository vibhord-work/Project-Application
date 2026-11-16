import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './Header'
import Footer from './Footer'
import About from '../pages/About'

describe('Static UI components', () => {
  it('displays the header appointment link', () => {
    render(<Header />)

    const link = screen.getByRole('link', { name: /Book Appointment/i })
    expect(link).toHaveAttribute('href', '#speciality')
  })

  it('displays the hospital footer', () => {
    render(<Footer />)

    expect(
      screen.getByText(/Copyright 2024@ UnityCare/)
    ).toBeInTheDocument()
  })

  it('displays the hospital vision', () => {
    render(<About />)

    expect(screen.getByText('Our Vision')).toBeInTheDocument()
    expect(
      screen.getByText(/Unity Care is dedicated to providing exceptional healthcare services/)
    ).toBeInTheDocument()
  })
})
