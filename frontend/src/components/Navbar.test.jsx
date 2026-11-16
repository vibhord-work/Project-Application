import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { AppContext } from '../context/AppContext'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn()
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    useNavigate: () => mocks.navigate
  }
})

function setup(token = false) {
  const setToken = vi.fn()
  const setPatientId = vi.fn()

  render(
    <AppContext.Provider value={{
      token,
      setToken,
      patientId: token ? 123 : 0,
      setPatientId
    }}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AppContext.Provider>
  )

  return { setToken, setPatientId }
}

afterEach(() => vi.clearAllMocks())

describe('Navbar', () => {
  it('displays primary navigation links', () => {
    setup()
    expect(screen.getByText('HOME')).toBeInTheDocument()
    expect(screen.getByText('ALL DOCTORS')).toBeInTheDocument()
    expect(screen.getByText('ABOUT')).toBeInTheDocument()
    expect(screen.getByText('MANAGER')).toBeInTheDocument()
  })

  it('navigates to login when logged out', () => {
    setup(false)
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))
    expect(mocks.navigate).toHaveBeenCalledWith('/login')
  })

  it('shows patient options when logged in', () => {
    setup(true)
    expect(screen.getByText('My Profile')).toBeInTheDocument()
    expect(screen.getByText('My Appointment')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Create Account' })).not.toBeInTheDocument()
  })

  it('clears authentication state on logout', () => {
    const { setToken, setPatientId } = setup(true)
    fireEvent.click(screen.getByText('Logout'))

    expect(setToken).toHaveBeenCalledWith(false)
    expect(setPatientId).toHaveBeenCalledWith(0)
    expect(mocks.navigate).toHaveBeenCalledWith('./')
  })

  it('navigates to patient profile and appointments', () => {
    setup(true)

    fireEvent.click(screen.getByText('My Profile'))
    expect(mocks.navigate).toHaveBeenCalledWith('/my-profile')

    fireEvent.click(screen.getByText('My Appointment'))
    expect(mocks.navigate).toHaveBeenCalledWith('/my-appointments')
  })
})
