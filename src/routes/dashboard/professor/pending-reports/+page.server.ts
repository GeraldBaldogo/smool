import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) throw redirect(302, '/login');

	const professorResult = await pool.query(
		`
		SELECT id, role, department_id
		FROM users
		WHERE id = $1
		LIMIT 1
		`,
		[user.id]
	);

	const professor = professorResult.rows[0];

	if (!professor) throw redirect(302, '/login');

	if (professor.role !== 'professor') {
		throw redirect(302, '/dashboard');
	}

	const result = await pool.query(
		`
		SELECT 
			mr.id,
			mr.report_code,
			u.full_name AS name,
			mr.issue_description AS issue,
			mr.created_at AS date,
			mr.status
		FROM maintenance_requests mr
		JOIN users u ON mr.user_id = u.id
		WHERE LOWER(mr.status) = 'pending'
		  AND LOWER(u.role) = 'student'
		  AND u.department_id = $1
		ORDER BY mr.created_at DESC
		`,
		[professor.department_id]
	);

	return { reports: result.rows };
};