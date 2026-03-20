import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user || user.role !== 'admin') {
		throw redirect(302, '/login');
	}

	const result = await pool.query(`
		SELECT id, full_name, email, role, created_at
		FROM users
		ORDER BY created_at DESC
	`);

	return {
		users: result.rows
	};
};