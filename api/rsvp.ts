import type { VercelRequest, VercelResponse } from '@vercel/node';

// Optional database integration client pooler
// If the user configures DATABASE_URL, this will connect to Neon database
let pool: any = null;
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  } catch (err) {
    console.error('Failed to initialize PG Pool:', err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { fullName, email, phone, attendance, guestCount, dietaryNotes } = req.body;

    // Basic Validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full Name is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    console.log('RSVP Received:', { fullName, email, phone, attendance, guestCount, dietaryNotes });

    // Database connection routing
    if (pool) {
      const queryText = `
        INSERT INTO rsvps (full_name, email, phone, attendance, guest_count, dietary_notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `;
      const values = [
        fullName.trim(),
        email ? email.trim() : null,
        phone.trim(),
        attendance,
        attendance === 'attending' ? parseInt(guestCount) || 1 : 0,
        dietaryNotes ? dietaryNotes.trim() : null
      ];

      const result = await pool.query(queryText, values);
      const insertedId = result.rows[0].id;

      return res.status(201).json({
        success: true,
        message: 'RSVP recorded successfully in database.',
        id: insertedId
      });
    } else {
      // Simulation/Demonstration fallback mode
      console.log('No DATABASE_URL configured. RSVP request processed in simulation mode.');
      return res.status(200).json({
        success: true,
        message: 'RSVP processed successfully (Simulation mode - configure DATABASE_URL for storage).',
        id: 'simulation-uuid-' + Math.random().toString(36).substr(2, 9)
      });
    }
  } catch (error: any) {
    console.error('RSVP Serverless Handler Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}
