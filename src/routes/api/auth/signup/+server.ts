import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { pool } from '../../../../backend/db';

export async function POST({ request }: { request: Request }) {
	try {
		const body = await request.json();

		const { full_name, email, password, role, department_id } = body;

		if (!full_name || !email || !password) {
			return json({ message: 'Missing required fields' }, { status: 400 });
		}

		const userRole = role || 'student';

		if (userRole !== 'admin' && !department_id) {
			return json({ message: 'Department is required' }, { status: 400 });
		}

		if (userRole === 'admin') {
			const existingAdmin = await pool.query(
				'SELECT id FROM users WHERE role = $1 LIMIT 1',
				['admin']
			);

			if (existingAdmin.rows.length > 0) {
				return json(
					{ message: 'Admin limit exceeded. Only one admin is allowed' },
					{ status: 400 }
				);
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await pool.query(
			`INSERT INTO users
				(full_name, email, password_hash, role, department_id)
			 VALUES ($1, $2, $3, $4, $5)
			 RETURNING id, full_name, email, role, department_id`,
			[
				full_name,
				email.toLowerCase(),
				hashedPassword,
				userRole,
				userRole === 'admin' ? null : department_id
			]
		);

		return json(
			{
				success: true,
				user: result.rows[0]
			},
			{ status: 201 }
		);
	} catch (err: any) {
		if (err.code === '23505') {
			return json({ message: 'Email already exists' }, { status: 409 });
		}

		console.error('Signup error:', err);
		return json({ message: 'Server error' }, { status: 500 });
	}
}