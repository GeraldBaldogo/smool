import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user || user.role !== 'admin') {
		throw redirect(302, '/login');
	}

	const feedbacks = await pool.query(`
		SELECT
			sf.id,
			sf.rating,
			sf.feedback,
			sf.created_at,
			u.full_name,
			u.email,
			u.role
		FROM system_feedback sf
		JOIN users u ON u.id = sf.user_id
		ORDER BY sf.created_at DESC
	`);

	const summary = await pool.query(`
		SELECT
			COUNT(*) AS total_feedback,
			ROUND(COALESCE(AVG(rating), 0)::numeric, 2) AS average_rating,
			COUNT(*) FILTER (WHERE rating = 5) AS five_star,
			COUNT(*) FILTER (WHERE rating = 4) AS four_star,
			COUNT(*) FILTER (WHERE rating = 3) AS three_star,
			COUNT(*) FILTER (WHERE rating = 2) AS two_star,
			COUNT(*) FILTER (WHERE rating = 1) AS one_star
		FROM system_feedback
	`);

	return {
		feedbacks: feedbacks.rows,
		summary: summary.rows[0]
	};
};