import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import Manager from './Manager'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}))

const records = {
  '/api/doctors': [{ doctor_id: 11, first_name: 'Amit', last_name: 'Sharma' }],
  '/api/nurses': [{ nurse_id: 12, first_name: 'Priya', last_name: 'Patel' }],
  '/api/equipments': [{ equipment_id: 13, equipment_name: 'MRI Scanner' }],
  '/api/staffs': [{ staff_id: 14, first_name: 'Ravi', last_name: 'Kumar' }],
  '/api/wards': [{ ward_id: 15, ward_type: 'Public', total_beds: 20, available_beds: 10 }]
}

beforeEach(() => {
  vi.clearAllMocks()
  axios.get.mockImplementation((url) =>
    Promise.resolve({ data: records[url] || {} })
  )
  axios.delete.mockResolvedValue({ data: { success: true } })
})

afterEach(() => vi.restoreAllMocks())

describe('Manager record deletion', () => {
  const cases = [
    ['Amit Sharma', '/api/deleteDoctor/11'],
    ['Priya Patel', '/api/deleteNurse/12'],
    ['MRI Scanner', '/api/deleteEquipment/13'],
    ['Ravi Kumar', '/api/deleteStaff/14'],
    ['Public (Total Beds: 20, Available Beds: 10)', '/api/deleteWard/15']
  ]

  it.each(cases)('deletes %s using the correct endpoint', async (name, endpoint) => {
    render(<Manager />)

    const record = await screen.findByText(name)
    const container = record.parentElement
    const deleteButton = container.querySelector('button')

    expect(deleteButton).toHaveTextContent('Delete')

    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(endpoint)
    })
  })
})

describe('Manager record creation', () => {
  const cases = [
    ['Add Doctor', '/api/addDoctor', 'doctor'],
    ['Add Nurse', '/api/addNurse', 'nurse'],
    ['Add Equipment', '/api/addEquipment', 'equipment'],
    ['Add Staff', '/api/addStaff', 'staff'],
    ['Add Ward', '/api/addWard', 'ward']
  ]

  it.each(cases)('submits %s to the correct API', async (button, endpoint) => {
    axios.get.mockImplementation((url) =>
      Promise.resolve({ data: records[url] || {} })
    )
    axios.post.mockResolvedValue({ data: { success: true } })

    const { container } = render(<Manager />)

    await screen.findByRole('heading', { name: 'Add Doctor' })

    const submitButton = screen.getByRole('button', { name: button })
    const form = submitButton.closest('form')

    // Populate required fields with valid test values.
    for (const input of form.querySelectorAll('input[required]')) {
      let value = 'Test'
      if (input.type === 'email') value = 'test@example.com'
      if (input.type === 'number') value = '10'
      if (input.type === 'time') value = '10:00'

      fireEvent.change(input, { target: { value } })
    }

    fireEvent.submit(form)

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        endpoint,
        expect.any(Object)
      )
    })
  })
})
