import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const load: PageServerLoad = async () => {
    const result = await pool.query(`
        SELECT
            mr.id,
            u.full_name AS name,
            mr.issue_description AS issue,
            mr.created_at AS date,
            mr.status
        FROM maintenance_requests mr
        LEFT JOIN users u ON mr.user_id = u.id
        WHERE TRIM(LOWER(mr.status)) IN ('approved', 'in progress')
        ORDER BY mr.created_at DESC
    `);

    return {
        reports: result.rows
    };
};