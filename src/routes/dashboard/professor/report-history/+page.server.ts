import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;

    if (!user) {
        return { reports: [] };
    }

    const result = await pool.query(
        `
	SELECT 
		mr.id,
		u.full_name AS name,
		mr.issue_description AS issue,
		mr.created_at AS date,
		mr.status
	FROM maintenance_requests mr
	JOIN users u ON mr.user_id = u.id
	WHERE u.department_id = $1
	ORDER BY mr.created_at DESC
	`,
        [user.department_id]
    );

    return {
        reports: result.rows
    };
};