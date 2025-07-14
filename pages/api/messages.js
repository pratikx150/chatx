import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch all messages
    const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at ASC');
    res.status(200).json(rows);
  } else if (req.method === 'POST') {
    // Save a new message
    const { user, content } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO messages (user, content) VALUES ($1, $2) RETURNING *',
      [user, content]
    );
    res.status(201).json(rows[0]);
  } else {
    res.status(405).end();
  }
}
