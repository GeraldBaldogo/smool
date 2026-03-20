import type { RequestHandler } from './$types';
import { pool } from '$lib/server/db';
import fs from 'fs';
import path from 'path';

export const POST: RequestHandler = async ({ request, locals }) => {

  if (!locals.user) {
    return new Response(JSON.stringify({
      error: "Unauthorized"
    }), { status: 401 });
  }

  const formData = await request.formData();

  const requestId = formData.get("request_id") as string;
  const feedback = formData.get("feedback") as string;
  const photo = formData.get("photo") as File | null;

  let completion_photo: string | null = null;

  if (photo && photo.size > 0) {
    const buffer = Buffer.from(await photo.arrayBuffer());

    const uploadDir = path.join("static", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${photo.name}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    completion_photo = `/uploads/${fileName}`;
  }

  const result = await pool.query(
    `
    UPDATE maintenance_requests
    SET
      status = 'Completed',
      feedback = $1,
      completion_photo = $2,
      completed_at = NOW(),
      completed_by = $3
    WHERE id = $4
    RETURNING *
    `,
    [feedback, completion_photo, locals.user.id, requestId]
  );

  return new Response(JSON.stringify(result.rows[0]));
};