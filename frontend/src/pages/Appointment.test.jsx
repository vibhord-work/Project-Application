import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Appointment from './Appointment'
import { AppContext } from '../context/AppContext'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  docId: '10'
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    useNavigate: () => mocks.navigate,
    useParams: () => ({ docId: mocks.docId })
  }
})

const doctor = {
  doctor_id: 10,
  first_name: 'Amit',
  last_name: 'Sharma',
  specialization: 'Cardiology',
  years_of_experience: 10,
  available_days: 'Monday-Friday',
  available_from: '10:00',
  available_to: '18:00'
}

function setup(patientId = 123) {
  return render(
    <AppContext.Provider value={{
      patientId,
      setPatientId: vi.fn(),
      token: patientId !== 0,
      setToken: vi.fn()
    }}>
      <MemoryRouter>
        <Appointment />
      </MemoryRouter>
    </AppContext.Provider>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

describe('Appointment page', () => {
  it('asks unauthenticated patients to log in', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: async () => [doctor]
    }))

    setup(0)

    expect(screen.getByText('Please login to continue')).toBeInTheDocument()
  })

  it('displays doctor details', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => [doctor]
    })
    vi.stubGlobal('fetch', fetchMock)

    setup()

    expect(await screen.findByText('Amit Sharma')).toBeInTheDocument()
    expect(screen.getByText(/Degree: MBBS Cardiology/)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/doctors/10')
  })

  it('submits appointment details and navigates', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ json: async () => [doctor] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })

    vi.stubGlobal('fetch', fetchMock)
    setup()

    await screen.findByText('Amit Sharma')

    const dateInput = document.querySelector('input[type="date"]')
    const timeSelect = document.querySelector('select')

    fireEvent.change(dateInput, { target: { value: '2026-12-15' } })
    fireEvent.change(timeSelect, { target: { value: '10:00' } })
    fireEvent.change(
      screen.getByPlaceholderText('Enter the reason for your appointment'),
      { target: { value: 'Routine checkup' } }
    )

    fireEvent.click(screen.getByRole('button', { name: 'Book Appointment' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      '/api/bookAppointment',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          patient_id: 123,
          doctor_id: '10',
          appointment_date: '2026-12-15',
          appointment_time: '10:00',
          appointment_reason: 'Routine checkup'
        })
      })
    ))

    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith('/my-appointments')
    )
  })

  it('handles booking network failures', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ json: async () => [doctor] })
      .mockRejectedValueOnce(new Error('Network unavailable'))

    vi.stubGlobal('fetch', fetchMock)
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    setup()
    await screen.findByText('Amit Sharma')

    fireEvent.click(screen.getByRole('button', { name: 'Book Appointment' }))

    await waitFor(() => expect(errorSpy).toHaveBeenCalled())
    expect(mocks.navigate).toHaveBeenCalledWith('/my-appointments')
  })
})
