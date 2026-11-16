import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MyAppointments from './MyAppointments'
import { AppContext } from '../context/AppContext'

const appointments = [
  {
    appointment_id: 101,
    doctor_id: 5,
    appointment_date: '2026-12-10',
    appointment_time: '10:00',
    appointment_reason: 'Routine checkup',
    status: 'Pending'
  },
  {
    appointment_id: 102,
    doctor_id: 6,
    appointment_date: '2026-12-11',
    appointment_time: '11:00',
    appointment_reason: 'Follow-up',
    status: 'Cancelled'
  }
]

function setup(fetchMock) {
  vi.stubGlobal('fetch', fetchMock)
  render(
    <AppContext.Provider value={{ patientId: 123 }}>
      <MemoryRouter>
        <MyAppointments />
      </MemoryRouter>
    </AppContext.Provider>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('MyAppointments page', () => {
  it('loads and displays patient appointments', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => appointments
    })

    setup(fetchMock)

    expect(await screen.findByText('Appointment ID: 101')).toBeInTheDocument()
    expect(screen.getByText('Appointment ID: 102')).toBeInTheDocument()
    expect(screen.getByText('Appointment Reason: Routine checkup')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/patientAppointments/123')
  })

  it('cancels an existing appointment', async () => {
    const fetchMock = vi.fn((url) => Promise.resolve({
      json: async () => url.includes("patientAppointments")
        ? appointments
        : { success: true }
    }))

    setup(fetchMock)

    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/cancelAppointment',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ appointmentId: 101 })
        })
      )
    })
  })

  it('rebooks a cancelled appointment', async () => {
    const fetchMock = vi.fn((url) => Promise.resolve({
      json: async () => url.includes("patientAppointments")
        ? appointments
        : { success: true }
    }))

    setup(fetchMock)

    fireEvent.click(await screen.findByRole('button', { name: 'Rebook' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/rebookAppointment',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ appointmentId: 102 })
        })
      )
    })
  })
})
