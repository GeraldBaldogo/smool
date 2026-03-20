import type { Actions, PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async ({ params }) => {
    const result = await pool.query(
        `
        SELECT
            mr.id,
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

function sanitizeFileName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

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
            const uploadsDir = path.resolve('static/uploads');
            await mkdir(uploadsDir, { recursive: true });

            const safeName = sanitizeFileName(photo.name);
            const finalFileName = `${randomUUID()}-${safeName}`;
            const filePath = path.join(uploadsDir, finalFileName);

            const arrayBuffer = await photo.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            await writeFile(filePath, buffer);

            completionPhotoUrl = `/uploads/${finalFileName}`;
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
    }
};