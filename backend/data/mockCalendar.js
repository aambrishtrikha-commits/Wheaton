/**
 * mockCalendar.js
 *
 * In-memory mock data store for the Sophie demo.
 * Provides realistic appointment slots (9 AM – 6 PM, Mon–Fri) and
 * a simple bookings map that persists for the lifetime of the process.
 */

'use strict';

const { v4: uuidv4 } = require('uuid');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return a YYYY-MM-DD string offset by `daysFromNow` calendar days from today.
 * Uses the server's local clock; in production the TZ env var should be set to
 * Europe/Dublin if you want dates to match the clinic timezone.
 */
function dateString(daysFromNow = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

/**
 * Return the ISO weekday (1 = Mon … 7 = Sun) for a YYYY-MM-DD string.
 */
function isoWeekday(dateStr) {
  const [y, m, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1, day));
  const dow = d.getUTCDay(); // 0 = Sun
  return dow === 0 ? 7 : dow;
}

/**
 * Build ISO 8601 datetime string for a given date + "HH:MM" slot.
 * Times are treated as Europe/Dublin local times for display purposes.
 */
function toISO(dateStr, timeStr) {
  return `${dateStr}T${timeStr}:00`;
}

// ---------------------------------------------------------------------------
// Slot template (9 AM – 6 PM, 30-minute intervals)
// ---------------------------------------------------------------------------
const SLOT_TIMES = [
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
];

// ---------------------------------------------------------------------------
// Pre-seeded bookings (simulate an existing diary)
// ---------------------------------------------------------------------------

/**
 * In-memory bookings store.
 * Key  : appointmentId (UUID string)
 * Value: booking object – see createBooking() for the shape.
 */
const bookings = {};

/**
 * Create a new booking record and persist it in `bookings`.
 *
 * @param {object} params
 * @param {string} params.clientName
 * @param {string} params.clientPhone
 * @param {string} params.clientEmail
 * @param {string} params.bookingTime  ISO 8601 datetime string
 * @param {string} [params.appointmentId]  Provide to reuse an existing ID (used when reseeding)
 * @returns {object} The created booking record
 */
function createBooking({ clientName, clientPhone, clientEmail, bookingTime, appointmentId }) {
  const id = appointmentId || uuidv4();
  const booking = {
    appointmentId: id,
    clientName,
    clientPhone,
    clientEmail,
    bookingTime,
    createdAt: new Date().toISOString(),
  };
  bookings[id] = booking;
  return booking;
}

// Seed a handful of pre-existing appointments so the mock diary looks realistic
(function seedDiary() {
  const seeds = [
    { clientName: 'Aoife Murphy',      clientPhone: '+353871234567', clientEmail: 'aoife.murphy@gmail.com',   bookingTime: toISO(dateString(1), '09:00') },
    { clientName: 'Ciarán Kelly',      clientPhone: '+353851234567', clientEmail: 'ciaran.kelly@gmail.com',   bookingTime: toISO(dateString(1), '10:30') },
    { clientName: 'Sinéad O\'Brien',   clientPhone: '+353861234567', clientEmail: 'sinead.obrien@gmail.com',  bookingTime: toISO(dateString(1), '14:00') },
    { clientName: 'Pádraig Walsh',     clientPhone: '+353891234567', clientEmail: 'padraig.walsh@gmail.com',  bookingTime: toISO(dateString(2), '09:30') },
    { clientName: 'Niamh Brennan',     clientPhone: '+353871112233', clientEmail: 'niamh.brennan@gmail.com',  bookingTime: toISO(dateString(2), '11:00') },
    { clientName: 'Declan Fitzpatrick',clientPhone: '+353852223344', clientEmail: 'declan.fitz@gmail.com',    bookingTime: toISO(dateString(3), '15:30') },
  ];

  seeds.forEach((s) => createBooking(s));
}());

// ---------------------------------------------------------------------------
// Availability helpers
// ---------------------------------------------------------------------------

/**
 * Return the set of already-booked ISO datetime strings (active bookings only).
 */
function bookedSlots() {
  return new Set(Object.values(bookings).map((b) => b.bookingTime));
}

/**
 * Build a list of available slot objects for a given date string.
 * Skips weekends and already-booked slots.
 *
 * @param {string} dateStr  YYYY-MM-DD
 * @returns {Array<{time: string, iso: string}>}
 */
function getSlotsForDate(dateStr) {
  if (isoWeekday(dateStr) >= 6) return []; // Saturday or Sunday

  const booked = bookedSlots();
  return SLOT_TIMES
    .map((t) => ({ time: t, iso: toISO(dateStr, t) }))
    .filter((slot) => !booked.has(slot.iso));
}

/**
 * Return up to `maxDays` worth of available slots starting from today + 1.
 * Skips days with no availability (weekends, fully booked days).
 *
 * @param {number} [maxDays=7]
 * @returns {Array<{date: string, slots: Array<{time: string, iso: string}>}>}
 */
function getAvailability(maxDays = 7) {
  const results = [];
  for (let i = 1; i <= maxDays + 7; i++) {
    if (results.length >= maxDays) break;
    const dateStr = dateString(i);
    const slots = getSlotsForDate(dateStr);
    if (slots.length > 0) {
      results.push({ date: dateStr, slots });
    }
  }
  return results;
}

module.exports = {
  bookings,
  createBooking,
  getSlotsForDate,
  getAvailability,
  dateString,
  isoWeekday,
  toISO,
  SLOT_TIMES,
};
