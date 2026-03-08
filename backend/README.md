# Sophie Backend — Deployment Guide

Backend API server for the **Sophie** ElevenLabs AI appointment booking demo at Wheaton Hall Medical Practice.

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/health` | Health check |
| `POST` | `/api/calendar/availability` | Returns available appointment slots |
| `POST` | `/api/bookings/manage` | Create / reschedule / cancel appointments |

---

## Local Development

```bash
cd backend
npm install
cp .env.example .env   # edit as needed
npm run dev            # uses nodemon for auto-reload
```

Health check: <http://localhost:3000/health>

---

## Deploying to Hostinger (demo.appd.ai)

### 1. Upload files

Upload the `backend/` folder to your Hostinger server via SFTP or the File Manager.  
Recommended path: `/home/<user>/demo.appd.ai/backend/`

### 2. Install dependencies (on the server)

```bash
cd /home/<user>/demo.appd.ai/backend
npm install --omit=dev
```

### 3. Create the `.env` file

```bash
cp .env.example .env
nano .env
```

Set:
```
PORT=3000
BASE_URL=https://demo.appd.ai
NODE_ENV=production
```

### 4. Start with PM2 (recommended)

```bash
npm install -g pm2
pm2 start server.js --name sophie-backend
pm2 save
pm2 startup   # follow the printed command to enable on boot
```

### 5. Configure Hostinger reverse proxy (Node.js app)

In Hostinger control panel → **Node.js** → add a new application:

| Field | Value |
|-------|-------|
| Node.js version | 18+ |
| Application root | `/home/<user>/demo.appd.ai/backend` |
| Application startup file | `server.js` |
| Application URL | `demo.appd.ai` |

Or, if using an Apache/Nginx proxy, forward `demo.appd.ai/api/*` to `localhost:3000`.

### 6. Verify

```bash
curl https://demo.appd.ai/health
```

Expected response:
```json
{ "status": "ok", "service": "sophie-backend", "timestamp": "...", "env": "production" }
```

---

## Make.com Webhook Configuration

In your Make.com scenario, set the **HTTP module** to:

**Calendar availability**
```
POST https://demo.appd.ai/api/calendar/availability
Content-Type: application/json

{
  "date_query": "tomorrow",
  "timezone": "Europe/Dublin"
}
```

**Bookings manage**
```
POST https://demo.appd.ai/api/bookings/manage
Content-Type: application/json

{
  "action_type": "create",
  "client_name": "Mary O'Brien",
  "client_phone": "+353871234567",
  "client_email": "mary@example.com",
  "booking_time": "2026-03-10T09:00:00"
}
```

---

## API Reference

### `POST /api/calendar/availability`

**Request**

| Field | Type | Description |
|-------|------|-------------|
| `date_query` | string | `"today"`, `"tomorrow"`, `"this week"`, `"next week"`, or `"YYYY-MM-DD"` |
| `timezone` | string | Optional. Informational only (e.g. `"Europe/Dublin"`) |

**Response**

```json
{
  "success": true,
  "query": { "date_query": "tomorrow", "timezone": "Europe/Dublin" },
  "available": [
    {
      "date": "2026-03-10",
      "slots": [
        { "time": "09:00", "iso": "2026-03-10T09:00:00" },
        { "time": "09:30", "iso": "2026-03-10T09:30:00" }
      ]
    }
  ]
}
```

---

### `POST /api/bookings/manage`

**Request — create**

| Field | Required | Description |
|-------|----------|-------------|
| `action_type` | ✅ | `"create"` |
| `client_name` | ✅ | Patient full name |
| `client_phone` | ✅ | Phone with country code |
| `client_email` | ✅ | Email address |
| `booking_time` | ✅ | ISO 8601 datetime, e.g. `"2026-03-10T09:00:00"` |

**Request — reschedule**

| Field | Required | Description |
|-------|----------|-------------|
| `action_type` | ✅ | `"reschedule"` |
| `appointment_id` | ✅ | UUID from the original booking |
| `booking_time` | ✅ | New ISO 8601 datetime |
| `client_name` / `client_phone` / `client_email` | ❌ | Optional updates |

**Request — cancel**

| Field | Required | Description |
|-------|----------|-------------|
| `action_type` | ✅ | `"cancel"` |
| `appointment_id` | ✅ | UUID of the appointment to cancel |

**Response — create (201)**

```json
{
  "success": true,
  "action": "create",
  "appointment": {
    "appointmentId": "uuid",
    "clientName": "Mary O'Brien",
    "clientPhone": "+353871234567",
    "clientEmail": "mary@example.com",
    "bookingTime": "2026-03-10T09:00:00",
    "createdAt": "2026-03-08T09:00:00.000Z"
  }
}
```

**Response — cancel (200)**

```json
{
  "success": true,
  "action": "cancel",
  "appointmentId": "uuid",
  "message": "Appointment successfully cancelled."
}
```

---

## Notes

- Appointment data is stored **in memory** — it resets on every server restart.  
  For production use, replace the `bookings` map in `data/mockCalendar.js` with a database (e.g. PostgreSQL, MongoDB).
- Slot times are 9 AM – 6 PM, Monday–Friday, 30-minute intervals.
- The mock diary is pre-seeded with a handful of example bookings on the next few working days.
