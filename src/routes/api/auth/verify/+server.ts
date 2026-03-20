import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, cookies }: RequestEvent) {
	const { code } = await request.json();

	const savedOTP = cookies.get('otp_code');
	const userData = cookies.get('otp_user');

	if (!savedOTP || !userData) {
		return new Response(JSON.stringify({ message: 'Session expired' }), { status: 400 });
	}

	if (code !== savedOTP) {
		return new Response(JSON.stringify({ message: 'Invalid code' }), { status: 400 });
	}

	const user = JSON.parse(userData);

	cookies.set('user', JSON.stringify(user), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	});

	cookies.delete('otp_code', { path: '/' });
	cookies.delete('otp_user', { path: '/' });

	return new Response(JSON.stringify({
		success: true,
		role: user.role
	}));
}