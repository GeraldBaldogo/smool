import { pool } from '$lib/server/db';
import type { RequestHandler } from './$types';
import { broadcastUpdate } from '$lib/server/report-stream';

export const POST: RequestHandler = async ({ request }) => {
    const { id, status } = await request.json();

    if (!id || !status) {
        return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
    }

    try {
        const result = await pool.query(
            `UPDATE maintenance_requests
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        const updatedReport = result.rows[0];

        // ✅ Safe broadcast
        try {
            broadcastUpdate(updatedReport);
        } catch (broadcastErr) {
            console.error('Broadcast error:', broadcastErr);
        }

        return new Response(
            JSON.stringify({ success: true, updatedReport }),
            { status: 200 }
        );

    } catch (err) {
        console.error('Update report status error:', err);

        return new Response(
            JSON.stringify({ error: 'Database error' }),
            { status: 500 }
        );
    }
};
