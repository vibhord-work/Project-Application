import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const { queryMock } = vi.hoisted(() => ({
  queryMock: vi.fn()
}))

vi.mock('mysql', () => ({
  default: {
    createPool: () => ({
      query: queryMock
    }),
    createConnection: () => ({})
  }
}))

let app

beforeAll(() => {
  app = require('../server.js')
  app.setDatabase({ query: queryMock })
})

beforeEach(() => {
  queryMock.mockReset()
  queryMock.mockImplementation((sql, values, callback) => {
    const cb = typeof values === 'function' ? values : callback
    cb(null, [])
  })
})

describe('Health and routing', () => {
  it.each(['/health', '/api/health'])(
    'returns healthy status for %s',
    async (path) => {
      const res = await request(app).get(path)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ status: 'healthy' })
    }
  )

  it('returns patient ID assignment information', async () => {
    const res = await request(app).get('/newPatientId')
    expect(res.status).toBe(200)
    expect(res.body.message).toContain('assigned after registration')
  })
})

describe('Database read endpoints', () => {
  const endpoints = [
    ['/doctors', 'Doctor'],
    ['/nurses', 'Nurse'],
    ['/equipments', 'Equipment'],
    ['/staffs', 'Staff'],
    ['/wards', 'Ward']
  ]

  it.each(endpoints)(
    'returns records from %s',
    async (path, table) => {
      const records = [{ id: 1, name: 'Test record' }]
      queryMock.mockImplementationOnce((sql, cb) => cb(null, records))

      const res = await request(app).get(path)

      expect(res.status).toBe(200)
      expect(res.body).toEqual(records)
      expect(queryMock.mock.calls[0][0]).toContain(table)
    }
  )

  it.each(['/doctors', '/doctors/10'])(
    'returns 503 when doctor query fails: %s',
    async (path) => {
      queryMock.mockImplementationOnce((sql, values, callback) => {
        const cb = typeof values === 'function' ? values : callback
        cb({ code: 'ECONNREFUSED' })
      })

      const res = await request(app).get(path)
      expect(res.status).toBe(503)
      expect(res.body.error).toBe('Database temporarily unavailable')
    }
  )

  it('uses a parameterized doctor ID query', async () => {
    const res = await request(app).get('/doctors/10')
    expect(res.status).toBe(200)
    expect(queryMock.mock.calls[0][1]).toEqual(['10'])
  })

  it.each([
    ['/patientProfile/12', 'Patient'],
    ['/patientAppointments/12', 'Appointment'],
    ['/loginPatientDetails/12', 'Login']
  ])('queries %s using a patient ID parameter', async (path, table) => {
    const res = await request(app).get(path)
    expect(res.status).toBe(200)
    expect(queryMock.mock.calls[0][0]).toContain(table)
    expect(queryMock.mock.calls[0][1]).toEqual(['12'])
  })
})

describe('Appointment operations', () => {
  it.each([
    ['/cancelAppointment', 'cancelled'],
    ['/rebookAppointment', 'pending']
  ])('updates appointment status using %s', async (path, status) => {
    const res = await request(app)
      .post(path)
      .send({ appointmentId: 25 })

    expect(res.status).toBe(200)
    expect(res.body).toBe('success')
    expect(queryMock.mock.calls[0][0]).toContain(status)
    expect(queryMock.mock.calls[0][1]).toEqual([25])
  })
})

describe('Manager authorization', () => {
  it('rejects access without manager authentication', async () => {
    const res = await request(app).get('/manager/session')
    expect([401, 503]).toContain(res.status)
  })

  it.each([
    ['/deleteDoctor/1', 'delete'],
    ['/deleteNurse/1', 'delete'],
    ['/deleteEquipment/1', 'delete'],
    ['/deleteStaff/1', 'delete'],
    ['/deleteWard/1', 'delete'],
    ['/addDoctor', 'post'],
    ['/addNurse', 'post'],
    ['/addEquipment', 'post'],
    ['/addStaff', 'post'],
    ['/addWard', 'post']
  ])('protects manager operation %s', async (path, method) => {
    const res = await request(app)[method](path)
    expect([401, 503]).toContain(res.status)
    expect(queryMock).not.toHaveBeenCalled()
  })

  it('rejects invalid manager login input', async () => {
    const res = await request(app)
      .post('/manager/login')
      .send({ username: 123, password: null })

    expect([400, 503]).toContain(res.status)
  })

  it('logs out a manager session', async () => {
    const res = await request(app).post('/manager/logout')
    expect(res.status).toBe(200)
    expect(res.body.authenticated).toBe(false)
  })
})

describe('Patient registration', () => {
  it('rejects incomplete registration data', async () => {
    const res = await request(app)
      .post('/newPatientDetails')
      .send({ firstName: 'Test' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Required fields missing')
  })
})
