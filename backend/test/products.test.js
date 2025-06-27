const request = require('supertest');
const app = require('../server');

describe('GET /api/products', () => {
  it('debería responder con un array de productos y status 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
