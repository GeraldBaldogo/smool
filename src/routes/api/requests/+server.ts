import type { RequestHandler } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        const professor_id = locals.user?.id;

        if (!professor_id) {
            return new Response(
                JSON.stringify({ error: 'User not authenticated' }),
                { status: 401 }
            );
        }

        const profRes = await pool.query(
            'SELECT department_id FROM users WHERE id=$1',
            [professor_id]
        );

        const department_id = profRes.rows[0]?.department_id;

        if (!department_id) {
            return new Response(
                JSON.stringify({ error: 'User department not found' }),
                { status: 400 }
            );
        }

        const requestsRes = await pool.query(
            `SELECT mr.id, mr.issue_description, mr.status, u.full_name
             FROM maintenance_requests mr
             JOIN users u ON u.id = mr.user_id
             WHERE u.department_id = $1`,
            [department_id]
        );

        return new Response(JSON.stringify(requestsRes.rows), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ message: 'Error fetching requests' }),
            { status: 500 }
        );
    }
};
