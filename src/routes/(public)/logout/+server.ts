import type { RequestHandler, Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }: { cookies: Cookies }) => {
  // delete the user cookie
  cookies.delete('user', { path: '/' });

  // redirect to login page
  throw redirect(303, '/login');
};
