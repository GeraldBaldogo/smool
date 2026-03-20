import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {

    const user = locals.user;

    if (!user) {
        return {
            reports: [],
            stats: [],
            department: null
        };
    }

    // GET PROFESSOR DEPARTMENT
    const deptResult = await pool.query(`
        SELECT name 
        FROM departments
        WHERE id = $1
    `, [user.department_id]);

    const departmentName = deptResult.rows[0]?.name;

    // REPORTS (FILTERED BY DEPARTMENT)
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
        WHERE d.id = $1
        ORDER BY r.created_at DESC
    `, [user.department_id]);

    // STATS (FILTERED BY DEPARTMENT)
    const stats = await pool.query(`
        SELECT 
            d.name AS department,
            COUNT(mr.id) AS total
        FROM maintenance_requests mr
        JOIN users u ON mr.user_id = u.id
        JOIN departments d ON u.department_id = d.id
        WHERE d.id = $1
        GROUP BY d.name
    `, [user.department_id]);

    return {
        reports: result.rows,
        stats: stats.rows,
        department: departmentName
    };
};