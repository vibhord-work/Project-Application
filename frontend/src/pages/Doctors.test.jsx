import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Doctors from './Doctors'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  speciality: undefined
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    useNavigate: () => mocks.navigate,
    useParams: () => ({ speciality: mocks.speciality })
  }
})

const doctors = [
  {
    doctor_id: 1,
    first_name: 'Amit',
    last_name: 'Sharma',
    specialization: 'general-physician'
  },
  {
    doctor_id: 2,
    first_name: 'Priya',
    last_name: 'Patel',
    specialization: 'dermatologist'
  }
]

function setup(speciality) {
  mocks.speciality = speciality
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    json: async () => doctors
  }))
  render(<MemoryRouter><Doctors /></MemoryRouter>)
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
  mocks.speciality = undefined
})

describe('Doctors page', () => {
  it('loads and displays doctors', async () => {
    setup()
    expect(await screen.findByText('Name: Amit Sharma')).toBeInTheDocument()
    expect(screen.getByText('Name: Priya Patel')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/api/doctors')
  })

  it('filters doctors by speciality', async () => {
    setup('dermatologist')
    expect(await screen.findByText('Name: Priya Patel')).toBeInTheDocument()
    expect(screen.queryByText('Name: Amit Sharma')).not.toBeInTheDocument()
  })

  it('navigates to doctor appointment page', async () => {
    setup()
    fireEvent.click(await screen.findByText('Name: Amit Sharma'))
    expect(mocks.navigate).toHaveBeenCalledWith('/appointment/1')
  })

  it('navigates to selected speciality', () => {
    setup()
    fireEvent.click(screen.getByText('Dermatologist'))
    expect(mocks.navigate).toHaveBeenCalledWith('/doctors/dermatologist')
  })

  it('clears the selected speciality filter', () => {
    setup('dermatologist')
    fireEvent.click(screen.getByText('Dermatologist'))
    expect(mocks.navigate).toHaveBeenCalledWith('/doctors')
  })
})
