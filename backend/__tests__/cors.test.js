const request = require('supertest');
const app = require('../server');

describe('CORS configuration', () => {
  it('allows preflight requests from the deployed Netlify frontend', async () => {
    const response = await request(app)
      .options('/api/health')
      .set('Origin', 'https://kashaf-ecommerce.netlify.app')
      .set('Access-Control-Request-Method', 'GET')
      .set('Access-Control-Request-Headers', 'content-type');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('https://kashaf-ecommerce.netlify.app');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });
});
