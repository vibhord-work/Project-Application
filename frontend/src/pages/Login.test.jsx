import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'
import { AppContext } from '../context/AppContext'

const navigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal()
  return { ...original, useNavigate: () => navigate }
})

function setup(patientId = 0) {
  const setPatientId = vi.fn()
  const setToken = vi.fn()
  render(
    <AppContext.Provider value={{
      patientId, setPatientId, token: false, setToken
    }}>
      <MemoryRouter><Login /></MemoryRouter>
    </AppContext.Provider>
  )
  fireEvent.click(screen.getByText('Login here'))
  return { setToken }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('Patient login', () => {
  it('rejects invalid patient IDs without making API requests', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    setup(-5)
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(await screen.findByText('Invalid login credentials')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('authenticates valid credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ password: 'password123' }]
    })
    vi.stubGlobal('fetch', fetchMock)
    const { setToken } = setup(123)
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    await waitFor(() => expect(setToken).toHaveBeenCalledWith(true))
    expect(fetchMock).toHaveBeenCalledWith('/api/loginPatientDetails/123')
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('rejects incorrect passwords', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ password: 'correct-password' }]
    }))
    const { setToken } = setup(123)
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrong-password' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    expect(await screen.findByText('Invalid login credentials')).toBeInTheDocument()
    expect(setToken).not.toHaveBeenCalledWith(true)
  })
})
