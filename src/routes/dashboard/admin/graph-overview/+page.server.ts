import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const load: PageServerLoad = async () => {

    // REPORTS (table)
    const result = await pool.query(`
        SELECT 
            r.id,
            u.full_name AS name,
            d.name AS department,
            r.issue,
            r.created_at AS date,
            r.status
        FROM reports r
        JOIN users u ON r.user_id = u.id
        LEFT JOIN departments d ON u.department_id = d.id
        ORDER BY r.created_at DESC
    `);

    // STATS (graph true total)
    const stats = await pool.query(`
        SELECT 
            d.name AS department,
            COUNT(mr.id) AS total
        FROM maintenance_requests mr
        JOIN users u ON mr.user_id = u.id
        JOIN departments d ON u.department_id = d.id
        GROUP BY d.name
    `);

    return {
        reports: result.rows,
        stats: stats.rows
    };
};