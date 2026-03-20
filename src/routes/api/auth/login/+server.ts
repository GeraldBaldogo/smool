import { pool } from '$lib/server/db';
import type { RequestHandler } from './$types';
import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { sendOTP } from '$lib/server/mailer';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json();

		const res = await pool.query(
			`SELECT id, email, full_name, role, department_id, password_hash
			 FROM users
			 WHERE email = $1`,
			[email]
		);

		if (res.rows.length === 0) {
			return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
		}

		const user = res.rows[0];

		const match = await bcrypt.compare(password, user.password_hash);
		if (!match) {
			return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
		}

		const otp = randomInt(100000, 999999).toString();

		cookies.set('otp_code', otp, {
			path: '/',
			maxAge: 300,
			httpOnly: true,
			sameSite: 'lax'
		});

		cookies.set(
			'otp_user',
			JSON.stringify({
				id: user.id,
				email: user.email,
				full_name: user.full_name,
				role: user.role,
				department_id: user.department_id
			}),
			{
				path: '/',
				maxAge: 300,
				httpOnly: true,
				sameSite: 'lax'
			}
		);

		await sendOTP(user.email, otp);

		return new Response(
			JSON.stringify({
				success: true,
				requiresOTP: true
			}),
			{ status: 200 }
		);
	} catch (err) {
		console.error('Login error:', err);
		return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
	}
};