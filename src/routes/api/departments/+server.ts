import { json } from '@sveltejs/kit';
import { Pool } from 'pg';
import { DATABASE_URL } from '$env/static/private';

const pool = new Pool({
	connectionString: DATABASE_URL
});

export async function GET() {
	try {
		const result = await pool.query(
			'SELECT id, name FROM departments ORDER BY name ASC'
		);

		return json(result.rows);
	} catch (error) {
		console.error('Error fetching departments:', error);

		return json(
			{ message: 'Failed to fetch departments' },
			{ status: 500 }
		);
	}
}