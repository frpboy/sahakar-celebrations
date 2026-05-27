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
  // GET: Fetch all wishes/RSVPs
  if (req.method === 'GET') {
    try {
      if (pool) {
        const queryText = `
          SELECT full_name as name, wishes as message, attendance 
          FROM rsvps 
          WHERE wishes IS NOT NULL AND wishes != ''
          ORDER BY created_at DESC;
        `;
        const result = await pool.query(queryText);
        return res.status(200).json({ success: true, data: result.rows });
      } else {
        // No database configured: return empty wishes list instead of dummy content
        return res.status(200).json({ success: true, data: [] });
      }
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST: Save new RSVP
  if (req.method === 'POST') {
    try {
      const { fullName, attendance, guestCount, wishes } = req.body;

      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ success: false, message: 'Full Name is required.' });
      }

      if (pool) {
        const queryText = `
          INSERT INTO rsvps (full_name, attendance, guest_count, wishes)
          VALUES ($1, $2, $3, $4)
          RETURNING id;
        `;
        const values = [
          fullName.trim(),
          attendance,
          attendance === 'attending' ? parseInt(guestCount) || 1 : 0,
          wishes ? wishes.trim() : null
        ];

        const result = await pool.query(queryText, values);
        return res.status(201).json({ success: true, id: result.rows[0].id });
      } else {
        return res.status(200).json({ success: true, message: 'Simulation mode' });
      }
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
