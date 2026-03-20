import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    if (!user) throw redirect(302, '/login');

    const result = await pool.query(`
        SELECT 
            mr.id,
            u.full_name AS name,
            mr.issue_description AS issue,
            mr.created_at AS date,
            mr.status
        FROM maintenance_requests mr
        JOIN users u ON mr.user_id = u.id
        WHERE LOWER(mr.status) = 'pending'
        ORDER BY mr.created_at DESC
    `);

    return { reports: result.rows };
};