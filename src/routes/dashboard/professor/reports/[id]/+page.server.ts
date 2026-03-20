import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;

    const result = await pool.query(
        `SELECT * FROM maintenance_requests WHERE id = $1`,
        [id]
    );

    const report = result.rows[0] ?? null;

    return { report };
};
