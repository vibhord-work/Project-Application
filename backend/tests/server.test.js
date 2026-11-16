import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

vi.mock('mysql', () => ({
  default: {
    createPool: () => ({
      query: (sql, values, callback) => {
        const cb = typeof values === 'function' ? values : callback
        cb(null, [])
      }
    }),
    createConnection: () => ({})
  }
}))

let app

beforeAll(() => {
  app = require('../server.js')
})

describe('Hospital API', () => {
  it('returns a healthy status', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'healthy' })
  })

  it('supports the ALB /api prefix', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('healthy')
  })

  it('rejects unauthenticated manager requests', async () => {
    const res = await request(app).get('/manager/session')
    expect([401, 503]).toContain(res.status)
  })

  it('rejects invalid manager login input', async () => {
    const res = await request(app)
      .post('/manager/login')
      .send({ username: 123, password: null })
    expect([400, 503]).toContain(res.status)
  })
})
