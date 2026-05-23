# Sahakar Celebration Portal - Backend Schema Document

## 1. Database Architecture
The backend uses **Neon Serverless PostgreSQL**. The schema manages RSVP confirmations, dietary choices, and guest counts.

### 1.1 SQL DDL Schema Definition
The database table `rsvps` holds guest responses. Use the following SQL command to provision the database:

```sql
-- Create Enum for attendance status if preferred, or use text mapping
CREATE TABLE IF NOT EXISTS rsvps (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    attendance VARCHAR(50) NOT NULL CHECK (attendance IN ('attending', 'declined')),
    guest_count INTEGER DEFAULT 1,
    wishes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance queries (e.g. tracking registrations by attendance status)
CREATE INDEX IF NOT EXISTS idx_rsvps_attendance ON rsvps (attendance);
```

---

## 2. Drizzle ORM Schema Representation
For TypeScript integrations, the Drizzle schema is modeled as follows:

```typescript
import { pgTable, serial, varchar, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const rsvps = pgTable('rsvps', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  attendance: varchar('attendance', { length: 50 }).notNull(), // 'attending' | 'declined'
  guestCount: integer('guest_count').default(1),
  wishes: text('wishes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
```

---

## 3. Serverless API REST Specification

### POST `/api/rsvp`
Submits a guest registration.

* **Headers**: `Content-Type: application/json`
* **Request Body Payload**:
  ```json
  {
    "fullName": "Name string (required)",
    "attendance": "attending | declined",
    "guestCount": 2, // integer (conditional, defaults to 0 if declined)
    "wishes": "Special blessings or wishes (optional)"
  }
  ```
* **Response (Success - Database configured)**:
  * Status: `201 Created`
  ```json
  {
    "success": true,
    "message": "RSVP recorded successfully in database.",
    "id": 12
  }
  ```
* **Response (Success - Simulation fallback mode)**:
  * Status: `200 OK`
  ```json
  {
    "success": true,
    "message": "RSVP processed successfully (Simulation mode - configure DATABASE_URL for storage).",
    "id": "simulation-uuid-ab12cd34"
  }
  ```
* **Response (Failure - Validation / Missing Fields)**:
  * Status: `400 Bad Request`
  ```json
  {
    "success": false,
    "message": "Full Name is required."
  }
  ```
