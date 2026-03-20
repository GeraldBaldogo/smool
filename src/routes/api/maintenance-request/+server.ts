import type { RequestHandler } from './$types';
import { pool } from '$lib/server/db';
import { sendEmailToProfessor } from '$lib/server/mailer';
import fs from 'fs';
import path from 'path';
import { broadcastUpdate } from '$lib/server/report-stream';
import cloudinary from '$lib/server/cloudinary';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const user = locals.user;

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not logged in' }), {
        status: 401
      });
    }

    const formData = await request.formData();

    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string;
    const description = formData.get('description') as string;
    const lat = formData.get('lat') as string;
    const lng = formData.get('lng') as string;
    const image = formData.get('photo') as File | null;
    const address = formData.get('address') as string;
    const landmark = formData.get('landmark') as string;

    // optional lang ito, pero hindi na siya kailangan para sa professor flow
    const directToAdmin = formData.get('direct_to_admin');

    // =============================
    // VALIDATIONS
    // =============================

    if (!category || !subcategory) {
      return new Response(
        JSON.stringify({ error: 'Category and subcategory are required' }),
        { status: 400 }
      );
    }

    if (!description || !lat || !lng || !image) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400
      });
    }

    if (!image.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Only image files are allowed' }), {
        status: 400
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return new Response(JSON.stringify({ error: 'Invalid coordinates' }), {
        status: 400
      });
    }

    const departmentId = user.department_id;

    if (!departmentId) {
      return new Response(JSON.stringify({ error: 'User department not found' }), {
        status: 400
      });
    }

    // =============================
    // STATUS LOGIC
    // =============================
    // student -> professor -> Pending
    // professor -> admin -> direct agad, no pending
    // =============================

    let status = 'Pending';

    if (user.role === 'professor' || directToAdmin === 'true') {
      status = 'Submitted to Admin';
    }

    // =============================
    // NOTIFICATION TARGET
    // =============================

    let notifyEmail: string | null = null;

    if (user.role === 'student' && directToAdmin !== 'true') {
      const profResult = await pool.query(
        `
        SELECT email
        FROM users
        WHERE role = 'professor'
          AND department_id = $1
        LIMIT 1
        `,
        [departmentId]
      );

      if (profResult.rows.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No professor found for this department' }),
          { status: 404 }
        );
      }

      notifyEmail = profResult.rows[0].email;
    }

    if (user.role === 'professor' || directToAdmin === 'true') {
      const adminResult = await pool.query(
        `
        SELECT email
        FROM users
        WHERE role = 'admin'
        LIMIT 1
        `
      );

      if (adminResult.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'No admin found' }), {
          status: 404
        });
      }

      notifyEmail = adminResult.rows[0].email;
    }

    // =============================
    // FILE UPLOAD
    // =============================

    let photo_url: string | null = null;

    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadDir = path.join('static', 'uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      photo_url = `/uploads/${fileName}`;
    }

    // =============================
    // DATABASE INSERT
    // =============================

    const result = await pool.query(
      `
      INSERT INTO maintenance_requests
      (
        user_id,
        issue_description,
        category,
        subcategory,
        latitude,
        longitude,
        address,
        landmark,
        photo_url,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        user.id,
        description,
        category,
        subcategory,
        latitude,
        longitude,
        address,
        landmark,
        photo_url,
        status
      ]
    );

   const newReport = result.rows[0];

await broadcastUpdate({
  type: 'report_created',
  report: {
    id: newReport.id,
    name: user.full_name ?? user.email ?? 'Unknown User',
    issue: newReport.subcategory ?? newReport.issue_description,
    date: newReport.created_at ?? new Date().toISOString(),
    status: newReport.status,
    issue_description: newReport.issue_description,
    category: newReport.category,
    subcategory: newReport.subcategory,
    created_at: newReport.created_at ?? new Date().toISOString(),
    latitude: newReport.latitude,
    longitude: newReport.longitude,
    address: newReport.address,
    landmark: newReport.landmark,
    photo_url: newReport.photo_url
  }
});

    // =============================
    // SEND NOTIFICATION
    // =============================

    if (notifyEmail) {
      const message =
        status === 'Submitted to Admin'
          ? 'A maintenance request was submitted directly to admin.'
          : 'A maintenance request is waiting for professor review.';

      await sendEmailToProfessor(notifyEmail, message);
    }

    return new Response(JSON.stringify({ success: true, data: result.rows[0] }), {
      status: 200
    });
  } catch (error) {
    console.error('SERVER ERROR:', error);

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500
    });
  }
};