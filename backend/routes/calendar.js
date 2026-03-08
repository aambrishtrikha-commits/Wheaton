/**
 * routes/calendar.js
 *
 * POST /api/calendar/availability
 *
 * Called by the Make.com webhook that ElevenLabs triggers when Sophie needs
 * to check available appointment slots.
 *
 * Request body (JSON):
 *   {
 *     "date_query" : "today" | "tomorrow" | "this week" | "next week" | "YYYY-MM-DD",
 *     "timezone"   : "Europe/Dublin"   (optional, informational only)
 *   }
 *
 * Response (JSON):
 *   {
 *     "success"  : true,
 *     "query"    : { ... },
 *     "available": [
 *       {
 *         "date" : "2026-03-10",
 *         "slots": [
 *           { "time": "09:00", "iso": "2026-03-10T09:00:00" },
 *           ...
 *         ]
 *       },
 *       ...
 *     ]
 *   }
 */

'use strict';

const express = require('express');
const router = express.Router();
const { getAvailability, getSlotsForDate, dateString, isoWeekday } = require('../data/mockCalendar');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a natural-language or ISO date query into an array of YYYY-MM-DD dates
 * to check (up to 7 days).
 *
 * Supported values for date_query:
 *   "today"     – the current calendar day (unlikely to be useful but supported)
 *   "tomorrow"  – next calendar day
 *   "this week" – remaining weekdays in the current Mon–Fri week (from tomorrow)
 *   "next week" – full Mon–Fri of next calendar week
 *   "YYYY-MM-DD"– specific date
 *   (anything else) – falls back to "next 5 available working days"
 */
function parseDateQuery(dateQuery) {
  if (!dateQuery) return null;

  const q = String(dateQuery).trim().toLowerCase();

  if (q === 'today') {
    return [dateString(0)];
  }

  if (q === 'tomorrow') {
    return [dateString(1)];
  }

  if (q === 'this week') {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = dateString(i);
      const dow = isoWeekday(d);
      if (dow >= 6) continue; // skip weekends
      // stop once we cross into next week (dow goes Mon=1..Fri=5 then Mon again)
      if (dates.length > 0 && dow < isoWeekday(dates[dates.length - 1])) break;
      dates.push(d);
      if (dates.length === 5) break;
    }
    return dates;
  }

  if (q === 'next week') {
    // Find the Monday of next calendar week
    const today = new Date();
    const todayDow = today.getUTCDay(); // 0 = Sun
    const daysUntilNextMon = todayDow === 0 ? 1 : 8 - todayDow;
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() + daysUntilNextMon + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }

  // Try ISO date YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(q)) {
    return [q];
  }

  return null; // caller should fall back to general availability
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

router.post('/', (req, res) => {
  const { date_query, timezone } = req.body || {};

  let availableDays;

  const specificDates = parseDateQuery(date_query);

  if (specificDates && specificDates.length > 0) {
    // Build availability for each requested date
    availableDays = specificDates
      .map((dateStr) => {
        const slots = getSlotsForDate(dateStr);
        return { date: dateStr, slots };
      })
      .filter((d) => d.slots.length > 0);
  } else {
    // Fall back: next 5 available working days
    availableDays = getAvailability(5);
  }

  return res.json({
    success: true,
    query: {
      date_query: date_query || null,
      timezone: timezone || 'Europe/Dublin',
    },
    available: availableDays,
  });
});

module.exports = router;
