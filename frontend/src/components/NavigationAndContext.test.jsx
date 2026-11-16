import React, { useContext } from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Banner from './Banner'
import SpecialityMenu from './SpecialityMenu'
import AppContextProvider, { AppContext } from '../context/AppContext'

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

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('Banner', () => {
  it('displays the appointment banner', () => {
    render(<MemoryRouter><Banner /></MemoryRouter>)

    expect(screen.getByText('Book Appointment')).toBeInTheDocument()
    expect(screen.getByText('With 100+ Trusted Doctors')).toBeInTheDocument()
  })

  it('navigates to login when Create Account is clicked', () => {
    const scrollMock = vi.fn()
    vi.stubGlobal('scrollTo', scrollMock)

    render(<MemoryRouter><Banner /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(mocks.navigate).toHaveBeenCalledWith('/login')
    expect(scrollMock).toHaveBeenCalledWith(0, 0)
  })
})

describe('SpecialityMenu', () => {
  it('displays all six doctor specialities', () => {
    render(<MemoryRouter><SpecialityMenu /></MemoryRouter>)

    const specialities = [
      'General Physician',
      'Gynecologist',
      'Dermatologist',
      'Neurologist',
      'Gastroenterologist',
      'Pediatrician'
    ]

    for (const speciality of specialities) {
      expect(screen.getByText(speciality)).toBeInTheDocument()
    }
  })

  it('links General Physician to the correct route', () => {
    render(<MemoryRouter><SpecialityMenu /></MemoryRouter>)

    expect(
      screen.getByRole('link', { name: 'General Physician' })
    ).toHaveAttribute('href', '/doctors/general-physician')
  })

  it('navigates to all doctors', () => {
    const scrollMock = vi.fn()
    vi.stubGlobal('scrollTo', scrollMock)

    render(<MemoryRouter><SpecialityMenu /></MemoryRouter>)
    fireEvent.click(
      screen.getByRole('button', { name: /check all doctors/i })
    )

    expect(mocks.navigate).toHaveBeenCalledWith('/doctors')
    expect(scrollMock).toHaveBeenCalledWith(0, 0)
  })
})

function ContextConsumer() {
  const { patientId, setPatientId, token, setToken } = useContext(AppContext)

  return (
    <div>
      <span data-testid="patient-id">{patientId}</span>
      <span data-testid="token">{String(token)}</span>
      <button onClick={() => setPatientId(123)}>Set Patient</button>
      <button onClick={() => setToken(true)}>Set Token</button>
    </div>
  )
}

describe('AppContext', () => {
  it('provides default patient and authentication state', () => {
    render(
      <AppContextProvider>
        <ContextConsumer />
      </AppContextProvider>
    )

    expect(screen.getByTestId('patient-id')).toHaveTextContent('0')
    expect(screen.getByTestId('token')).toHaveTextContent('false')
  })

  it('updates patient and authentication state', () => {
    render(
      <AppContextProvider>
        <ContextConsumer />
      </AppContextProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Set Patient' }))
    fireEvent.click(screen.getByRole('button', { name: 'Set Token' }))

    expect(screen.getByTestId('patient-id')).toHaveTextContent('123')
    expect(screen.getByTestId('token')).toHaveTextContent('true')
  })
})
