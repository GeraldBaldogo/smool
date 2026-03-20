import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const currentUser = locals.user;

	if (!currentUser || currentUser.role !== 'admin') {
		throw redirect(302, '/login');
	}

	const result = await pool.query(
		`
		SELECT id, full_name, email, role, created_at
		FROM users
		WHERE id = $1
		LIMIT 1
		`,
		[params.id]
	);

	const user = result.rows[0];

	if (!user) {
		throw error(404, 'User not found');
	}

	return {
		user
	};
};