/**
 * server.js
 *
 * Main Express server for the Sophie AI appointment booking demo.
 * Exposes two Make.com webhook endpoints:
 *   POST /api/calendar/availability
 *   POST /api/bookings/manage
 *
 * Also provides a health-check endpoint:
 *   GET /health
 */

'use strict';

require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const calendarRouter = require('./routes/calendar');
const bookingsRouter = require('./routes/bookings');

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------

const app  = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// CORS – allow Make.com webhooks and any configured BASE_URL origin
const allowedOrigins = [
  'https://hook.eu1.make.com',
  'https://hook.eu2.make.com',
  'https://hook.us1.make.com',
  'https://hook.us2.make.com',
  process.env.BASE_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server-to-server / curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some((o) => origin.startsWith(o))) {
      return callback(null, true);
    }
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'sophie-backend',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

app.use('/api/calendar/availability', calendarRouter);
app.use('/api/bookings/manage',        bookingsRouter);

// ---------------------------------------------------------------------------
// 404 fallback
// ---------------------------------------------------------------------------

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

// ---------------------------------------------------------------------------
// Error handler
// ---------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message || err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error.' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`[sophie-backend] Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  console.log(`  Health : http://localhost:${PORT}/health`);
  console.log(`  Calendar availability : POST http://localhost:${PORT}/api/calendar/availability`);
  console.log(`  Bookings manage       : POST http://localhost:${PORT}/api/bookings/manage`);
});

module.exports = app;
