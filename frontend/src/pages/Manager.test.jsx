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

beforeEach(() => {
  vi.clearAllMocks()
  axios.get.mockImplementation((url) => {
    if (url === '/api/manager/session') {
      return Promise.reject(new Error('Not authenticated'))
    }
    return Promise.resolve({ data: [] })
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Manager authentication', () => {
  it('shows the login form when no session exists', async () => {
    render(<Manager />)

    expect(await screen.findByRole('heading', { name: 'Login' }))
      .toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Login' }))
      .toBeInTheDocument()

    expect(axios.get).toHaveBeenCalledWith('/api/manager/session')
  })

  it('authenticates valid manager credentials', async () => {
    axios.get.mockImplementation((url) =>
      url === '/api/manager/session'
        ? Promise.reject(new Error('Not authenticated'))
        : Promise.resolve({ data: [] })
    )
    axios.post.mockResolvedValue({ data: { success: true } })

    render(<Manager />)

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith('/api/manager/session')
    )
    await screen.findByRole('heading', { name: 'Login' })

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'admin' }
    })

    fireEvent.change(document.querySelector('input[type="password"]'), {
      target: { value: 'test-password' }
    })

    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/manager/login',
        { username: 'admin', password: 'test-password' }
      )
    })

    expect(await screen.findByRole('heading', { name: 'Add Doctor' }))
      .toBeInTheDocument()
  })

  it('displays an error when manager login fails', async () => {
    const alertMock = vi.fn()
    vi.stubGlobal('alert', alertMock)

    axios.post.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    })

    render(<Manager />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'wrong-user' }
    })

    fireEvent.change(document.querySelector('input[type="password"]'), {
      target: { value: 'wrong-password' }
    })

    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Invalid credentials')
    })

    expect(screen.queryByRole('heading', { name: 'Add Doctor' }))
      .not.toBeInTheDocument()
  })

  it('restores an existing authenticated session', async () => {
    axios.get.mockImplementation((url) =>
      Promise.resolve({ data: url === '/api/manager/session' ? {} : [] })
    )

    render(<Manager />)

    expect(await screen.findByRole('heading', { name: 'Add Doctor' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Add Nurse' }))
      .toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Add Equipment' }))
      .toBeInTheDocument()
  })
})
