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

function getRoleCode(role: string) {
  if (role === 'student') return 'STUDENT';
  if (role === 'professor') return 'PROF';
  return 'USER';
}

function getDepartmentCode(departmentName: string) {
  const normalized = departmentName.trim().toLowerCase();

  const map: Record<string, string> = {
    'college of computer studies': 'CS',
    'college of business and accountancy': 'CBA',
    'college of criminology': 'CRIM',
    'college of education and liberal arts': 'COELA',
    'college of hospitality management': 'HM',
    'college of nursing': 'BSN',
    'college of physical therapy': 'PT'
  };

  return map[normalized] || 'GEN';
}

async function generateReportCode(
  departmentCode: string,
  roleCode: string
) {
  const year = new Date().getFullYear();

  const countResult = await pool.query(
    `
    SELECT COUNT(*)::int AS total
    FROM maintenance_requests
    WHERE EXTRACT(YEAR FROM created_at) = $1
    `,
    [year]
  );

  const nextSequence = countResult.rows[0].total + 1;
  const paddedSequence = String(nextSequence).padStart(2, '0');

  return `${departmentCode}-${roleCode}-${year}-${paddedSequence}`;
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

    const departmentResult = await pool.query(
      `
      SELECT name
      FROM departments
      WHERE id = $1
      LIMIT 1
      `,
      [departmentId]
    );

    if (departmentResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Department not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const departmentName = departmentResult.rows[0].name;
    const departmentCode = getDepartmentCode(departmentName);
    const roleCode = getRoleCode(user.role);
    const reportCode = await generateReportCode(departmentCode, roleCode);

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
        report_code,
        issue_description,
        status,
        latitude,
        longitude,
        address,
        landmark,
        photo_url,
        category,
        subcategory
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [
        user.id,
        reportCode,
        description,
        status,
        latitude,
        longitude,
        address,
        landmark,
        photo_url,
        category,
        subcategory
      ]
    );

    const newReport = result.rows[0];

    try {
      await broadcastUpdate({
        type: 'report_created',
        report: {
          id: newReport.id,
          report_code: newReport.report_code,
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
          ? `A maintenance request (${reportCode}) was submitted directly to admin.`
          : `A maintenance request (${reportCode}) is waiting for professor review.`;

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