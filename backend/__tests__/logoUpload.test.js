const express = require('express');
const request = require('supertest');

// Replace Cloudinary storage with an in-memory fake so no network/credentials are needed
jest.mock('../config/cloudinary', () => {
  const multer = require('multer');
  const fakeStorage = {
    _handleFile(req, file, cb) {
      file.stream.resume();
      file.stream.on('end', () => cb(null, { filename: 'shopnow/logo/test', path: 'https://res.cloudinary.com/demo/logo.png' }));
    },
    _removeFile(req, file, cb) { cb(null); },
  };
  const allowed = ['image/png', 'image/svg+xml'];
  const make = (limit) => multer({
    storage: fakeStorage,
    limits: { fileSize: limit },
    fileFilter: (req, file, cb) => (allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Logo must be a PNG, JPG, WebP, GIF or SVG image'), false)),
  });
  return { cloudinary: { uploader: { destroy: jest.fn() } }, upload: make(5 * 1024 * 1024), uploadAvatar: make(1024 * 1024), uploadLogo: make(2048) };
});

jest.mock('../middleware/auth', () => ({
  protect: (req, res, next) => { req.user = { role: 'admin' }; next(); },
  authorize: () => (req, res, next) => next(),
  optionalAuth: (req, res, next) => next(),
}));

const { uploadRouter } = require('../routes/allRoutes');

const app = express();
app.use('/api/upload', uploadRouter);

describe('POST /api/upload/logo', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env = { ...OLD_ENV, CLOUDINARY_CLOUD_NAME: 'x', CLOUDINARY_API_KEY: 'y', CLOUDINARY_API_SECRET: 'z' };
  });
  afterAll(() => { process.env = OLD_ENV; });

  it('uploads a PNG logo', async () => {
    const res = await request(app).post('/api/upload/logo').attach('logo', Buffer.from('png-bytes'), { filename: 'logo.png', contentType: 'image/png' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, logo: { public_id: 'shopnow/logo/test', url: 'https://res.cloudinary.com/demo/logo.png' } });
  });

  it('accepts SVG logos', async () => {
    const res = await request(app).post('/api/upload/logo').attach('logo', Buffer.from('<svg/>'), { filename: 'logo.svg', contentType: 'image/svg+xml' });
    expect(res.status).toBe(200);
  });

  it('rejects non-image files with a clear 400', async () => {
    const res = await request(app).post('/api/upload/logo').attach('logo', Buffer.from('hello'), { filename: 'a.txt', contentType: 'text/plain' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/PNG, JPG, WebP, GIF or SVG/);
  });

  it('rejects oversized files with a clear 400', async () => {
    const res = await request(app).post('/api/upload/logo').attach('logo', Buffer.alloc(5000), { filename: 'big.png', contentType: 'image/png' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/too large/i);
  });

  it('returns 400 when no file is sent', async () => {
    const res = await request(app).post('/api/upload/logo');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('No logo file uploaded');
  });

  it('returns 503 with a helpful message when Cloudinary is not configured', async () => {
    delete process.env.CLOUDINARY_CLOUD_NAME;
    const res = await request(app).post('/api/upload/logo').attach('logo', Buffer.from('x'), { filename: 'logo.png', contentType: 'image/png' });
    expect(res.status).toBe(503);
    expect(res.body.message).toMatch(/CLOUDINARY_CLOUD_NAME/);
  });
});
