import type { Actions, PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

export const load: PageServerLoad = async ({ params }) => {
	const result = await pool.query(
		`
        SELECT
            mr.id,
			mr.report_code,
            u.full_name AS name,
            mr.issue_description AS issue,
            mr.created_at AS date,
            mr.status,
            mr.address,
            mr.landmark,
            mr.category,
            mr.admin_feedback,
            mr.completed_at,
            mr.completion_photo_url
        FROM maintenance_requests mr
        LEFT JOIN users u ON mr.user_id = u.id
        WHERE mr.id = $1
        LIMIT 1
        `,
		[params.id]
	);

	const report = result.rows[0];

	if (!report) {
		throw error(404, 'Report not found');
	}

	return {
		report
	};
};

export const actions: Actions = {
	markInProgress: async ({ params }) => {
		const check = await pool.query(
			`
			SELECT id, status
			FROM maintenance_requests
			WHERE id = $1
			LIMIT 1
			`,
			[params.id]
		);

		const report = check.rows[0];

		if (!report) {
			return fail(404, { success: false, message: 'Report not found.' });
		}

		const currentStatus = String(report.status).trim().toLowerCase();

		if (currentStatus !== 'approved' && currentStatus !== 'submitted to admin') {
			return fail(400, {
				success: false,
				message: 'Only approved reports and professor reports can be marked as In Progress.'
			});
		}

		await pool.query(
			`
			UPDATE maintenance_requests
			SET status = 'In Progress'
			WHERE id = $1
			`,
			[params.id]
		);

		return {
			success: true,
			message: 'Report marked as In Progress.'
		};
	},

	markCompleted: async ({ request, params }) => {
		try {
			const formData = await request.formData();
			const feedback = String(formData.get('feedback') ?? '').trim();
			const completedAt = String(formData.get('completed_at') ?? '').trim();
			const photo = formData.get('photo');

			const check = await pool.query(
				`
				SELECT id, status
				FROM maintenance_requests
				WHERE id = $1
				LIMIT 1
				`,
				[params.id]
			);

			const report = check.rows[0];

			if (!report) {
				return fail(404, {
					success: false,
					message: 'Report not found.'
				});
			}

			const currentStatus = String(report.status).trim().toLowerCase();

			if (currentStatus !== 'in progress') {
				return fail(400, {
					success: false,
					message: 'Only In Progress reports can be marked as Completed.'
				});
			}

			let completionPhotoUrl: string | null = null;

			if (photo instanceof File && photo.size > 0) {
				const arrayBuffer = await photo.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				const uploadResult = await new Promise<any>((resolve, reject) => {
					cloudinary.uploader
						.upload_stream(
							{
								folder: 'maintenance_reports'
							},
							(error, result) => {
								if (error) reject(error);
								else resolve(result);
							}
						)
						.end(buffer);
				});

				completionPhotoUrl = uploadResult.secure_url;
			}

			await pool.query(
				`
				UPDATE maintenance_requests
				SET
					status = 'Completed',
					admin_feedback = $2,
					completed_at = CASE
						WHEN $3 = '' THEN NOW()
						ELSE $3::timestamp
					END,
					completion_photo_url = $4
				WHERE id = $1
				`,
				[params.id, feedback || null, completedAt, completionPhotoUrl]
			);

			return {
				success: true,
				message: 'Report marked as Completed.'
			};
		} catch (err) {
			console.error('markCompleted error:', err);
			return fail(500, {
				success: false,
				message: 'Something went wrong while marking the report as completed.'
			});
		}
	}
};