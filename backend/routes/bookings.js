/**
 * routes/bookings.js
 *
 * POST /api/bookings/manage
 *
 * Called by the Make.com webhook that ElevenLabs triggers when Sophie needs
 * to create, reschedule, or cancel an appointment.
 *
 * Request body (JSON) – all actions:
 *   {
 *     "action_type"     : "create" | "reschedule" | "cancel",
 *     "client_name"     : "Mary O'Brien",
 *     "client_phone"    : "+353871234567",
 *     "client_email"    : "mary@example.com",
 *     "booking_time"    : "2026-03-10T09:00:00",   // required for create / reschedule
 *     "appointment_id"  : "uuid-string"            // required for reschedule / cancel
 *   }
 *
 * Response shapes:
 *   create    → { success, action, appointment: { appointmentId, clientName, ... } }
 *   reschedule→ { success, action, appointment: { ... updated ... } }
 *   cancel    → { success, action, appointmentId, message }
 *   error     → { success: false, error: "message" }
 */

'use strict';

const express = require('express');
const router = express.Router();
const { bookings, createBooking, getSlotsForDate } = require('../data/mockCalendar');

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const VALID_ACTIONS = new Set(['create', 'reschedule', 'cancel']);

function missingFields(body, fields) {
  return fields.filter((f) => !body[f] || String(body[f]).trim() === '');
}

/**
 * Check whether a booking_time ISO string is an available (un-booked) slot.
 * Returns true if the slot is free, false if already taken.
 */
function isSlotAvailable(bookingTime, excludeId = null) {
  return !Object.values(bookings).some(
    (b) => b.bookingTime === bookingTime && b.appointmentId !== excludeId
  );
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

router.post('/', (req, res) => {
  const body = req.body || {};
  const { action_type, client_name, client_phone, client_email, booking_time, appointment_id } = body;

  // ── Validate action_type ──────────────────────────────────────────────────
  if (!action_type || !VALID_ACTIONS.has(String(action_type).toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: `Invalid or missing action_type. Must be one of: ${[...VALID_ACTIONS].join(', ')}.`,
    });
  }

  const action = String(action_type).toLowerCase();

  // ── CREATE ─────────────────────────────────────────────────────────────────
  if (action === 'create') {
    const missing = missingFields(body, ['client_name', 'client_phone', 'client_email', 'booking_time']);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields for create: ${missing.join(', ')}.`,
      });
    }

    if (!isSlotAvailable(booking_time)) {
      return res.status(409).json({
        success: false,
        error: `The requested slot (${booking_time}) is no longer available. Please choose another time.`,
      });
    }

    const appointment = createBooking({
      clientName: client_name,
      clientPhone: client_phone,
      clientEmail: client_email,
      bookingTime: booking_time,
    });

    return res.status(201).json({
      success: true,
      action: 'create',
      appointment,
    });
  }

  // ── RESCHEDULE ─────────────────────────────────────────────────────────────
  if (action === 'reschedule') {
    const missing = missingFields(body, ['appointment_id', 'booking_time']);
    if (missing.length) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields for reschedule: ${missing.join(', ')}.`,
      });
    }

    const existing = bookings[appointment_id];
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Appointment ID '${appointment_id}' not found.`,
      });
    }

    if (!isSlotAvailable(booking_time, appointment_id)) {
      return res.status(409).json({
        success: false,
        error: `The requested slot (${booking_time}) is no longer available. Please choose another time.`,
      });
    }

    // Update the existing record in place
    existing.bookingTime = booking_time;
    existing.updatedAt = new Date().toISOString();

    // Patch optional patient details if provided
    if (client_name)  existing.clientName  = client_name;
    if (client_phone) existing.clientPhone = client_phone;
    if (client_email) existing.clientEmail = client_email;

    return res.json({
      success: true,
      action: 'reschedule',
      appointment: existing,
    });
  }

  // ── CANCEL ─────────────────────────────────────────────────────────────────
  if (action === 'cancel') {
    if (!appointment_id || String(appointment_id).trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Missing required field for cancel: appointment_id.',
      });
    }

    if (!bookings[appointment_id]) {
      return res.status(404).json({
        success: false,
        error: `Appointment ID '${appointment_id}' not found.`,
      });
    }

    delete bookings[appointment_id];

    return res.json({
      success: true,
      action: 'cancel',
      appointmentId: appointment_id,
      message: 'Appointment successfully cancelled.',
    });
  }

  // Should never reach here, but guard against unhandled actions
  return res.status(400).json({
    success: false,
    error: `Unhandled action_type: ${action}.`,
  });
});

module.exports = router;
