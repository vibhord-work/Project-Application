import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyProfile from './MyProfile'
import { AppContext } from '../context/AppContext'

const patient = {
  patient_id: 123,
  first_name: 'Amit',
  last_name: 'Sharma',
  date_of_birth: '1995-01-01',
  gender: 'Male',
  address: 'Pune',
  phone_number: '9876543210',
  email: 'amit@example.com',
  blood_type: 'O+',
  emergency_contact: '9876543211',
  allergies: 'None',
  existing_conditions: 'None'
}

function setup(fetchMock) {
  vi.stubGlobal('fetch', fetchMock)
  return render(
    <AppContext.Provider value={{ patientId: 123 }}>
      <MyProfile />
    </AppContext.Provider>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

describe('MyProfile page', () => {
  it('loads patient information from the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => [patient]
    })

    setup(fetchMock)

    expect(await screen.findByText('Amit Sharma')).toBeInTheDocument()
    expect(screen.getByText('amit@example.com')).toBeInTheDocument()
    expect(screen.getByText('O+')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/patientProfile/123')
  })

  it('does not display profile details before loading', () => {
    setup(vi.fn(() => new Promise(() => {})))

    expect(screen.queryByText('USER INFORMATION')).not.toBeInTheDocument()
  })

  it('handles API failures without displaying invalid patient data', async () => {
    const errorSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    setup(vi.fn().mockRejectedValue(new Error('Network unavailable')))

    await vi.waitFor(() => expect(errorSpy).toHaveBeenCalled())
    expect(screen.queryByText('USER INFORMATION')).not.toBeInTheDocument()
  })
})
