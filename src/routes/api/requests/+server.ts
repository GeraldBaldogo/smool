import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const professor_id = locals.user?.id;

		if (!professor_id) {
			return json({ error: 'User not authenticated' }, { status: 401 });
		}

		const profRes = await pool.query(
			'SELECT department_id FROM users WHERE id = $1',
			[professor_id]
		);

		const department_id = profRes.rows[0]?.department_id;

		if (!department_id) {
			return json({ error: 'User department not found' }, { status: 400 });
		}

		const requestsRes = await pool.query(
			`SELECT mr.id, mr.issue_description, mr.status, u.full_name
			 FROM maintenance_requests mr
			 JOIN users u ON u.id = mr.user_id
			 WHERE u.department_id = $1`,
			[department_id]
		);

		return json(requestsRes.rows, { status: 200 });
	} catch (err) {
		console.error(err);
		return json({ message: 'Error fetching requests' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user_id = locals.user?.id;

		if (!user_id) {
			return json({ success: false, message: 'User not authenticated' }, { status: 401 });
		}

		const body = await request.json();
		const { title, description, issue_description } = body;

		const finalDescription = issue_description || description;

		if (!title || !finalDescription) {
			return json(
				{ success: false, message: 'Missing required fields' },
				{ status: 400 }
			);
		}

		const result = await pool.query(
			`INSERT INTO maintenance_requests (user_id, title, issue_description)
			 VALUES ($1, $2, $3)
			 RETURNING *`,
			[user_id, title, finalDescription]
		);

		return json(
			{ success: true, request: result.rows[0] },
			{ status: 201 }
		);
	} catch (err) {
		console.error(err);
		return json(
			{ success: false, message: 'Failed to create request' },
			{ status: 500 }
		);
	}
};