import type { RequestHandler } from './$types';
import { pool } from '$lib/server/db';
import { sendEmailToProfessor } from '$lib/server/mailer';
import { broadcastUpdate } from '$lib/server/report-stream';
import cloudinary from '$lib/server/cloudinary';

function uploadToCloudinary(buffer: Buffer, folder = 'maintenance-requests') {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const user = locals.user;

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not logged in' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();

    const category = formData.get('category')?.toString().trim() || '';
    const subcategory = formData.get('subcategory')?.toString().trim() || '';
    const description = formData.get('description')?.toString().trim() || '';
    const lat = formData.get('lat')?.toString() || '';
    const lng = formData.get('lng')?.toString() || '';
    const address = formData.get('address')?.toString().trim() || '';
    const landmark = formData.get('landmark')?.toString().trim() || '';
    const directToAdmin = formData.get('direct_to_admin')?.toString();
    const image = formData.get('photo');

    if (!category || !subcategory) {
      return new Response(
        JSON.stringify({ error: 'Category and subcategory are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!description || !lat || !lng || !image) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!(image instanceof File)) {
      return new Response(JSON.stringify({ error: 'Invalid image upload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!image.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Only image files are allowed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return new Response(JSON.stringify({ error: 'Invalid coordinates' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const departmentId = user.department_id;

    if (!departmentId) {
      return new Response(JSON.stringify({ error: 'User department not found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let status = 'Pending';

    if (user.role === 'professor' || directToAdmin === 'true') {
      status = 'Submitted to Admin';
    }

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
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
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
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      notifyEmail = adminResult.rows[0].email;
    }

    let photo_url: string | null = null;

    if (image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await uploadToCloudinary(buffer);
      photo_url = uploadResult.secure_url;
    }

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

    try {
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
    } catch (broadcastError) {
      console.error('Broadcast error:', broadcastError);
    }

    if (notifyEmail) {
      const message =
        status === 'Submitted to Admin'
          ? 'A maintenance request was submitted directly to admin.'
          : 'A maintenance request is waiting for professor review.';

      try {
        await sendEmailToProfessor(notifyEmail, message);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Maintenance request submitted successfully.',
        data: newReport
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('SERVER ERROR:', error);

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};