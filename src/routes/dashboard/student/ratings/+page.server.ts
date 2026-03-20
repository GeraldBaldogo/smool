import type { Actions, PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user || user.role !== 'student') {
		throw redirect(302, '/login');
	}

	const myFeedbacks = await pool.query(
		`
		SELECT id, rating, feedback, created_at
		FROM system_feedback
		WHERE user_id = $1
		ORDER BY created_at DESC
		`,
		[user.id]
	);

	return {
		myFeedbacks: myFeedbacks.rows
	};
};

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		const user = locals.user;

		if (!user || user.role !== 'student') {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const rating = Number(formData.get('rating'));
		const feedback = String(formData.get('feedback') ?? '').trim();

		if (!rating || rating < 1 || rating > 5) {
			return fail(400, {
				success: false,
				message: 'Please select a valid rating from 1 to 5.'
			});
		}

		if (!feedback) {
			return fail(400, {
				success: false,
				message: 'Please enter your feedback.'
			});
		}

		await pool.query(
			`
			INSERT INTO system_feedback (user_id, rating, feedback)
			VALUES ($1, $2, $3)
			`,
			[user.id, rating, feedback]
		);

		return {
			success: true,
			message: 'Thank you! Your rating and feedback have been submitted.'
		};
	}
};