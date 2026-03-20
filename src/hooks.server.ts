import type { Handle } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
  const userCookie = event.cookies.get('user');
  
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      event.locals.user = user;
    } catch (err) {
      console.error('Invalid user cookie', err);
    }
  }

    if (event.url.pathname.startsWith('/.well-known/')) {
        return new Response(null, { status: 404 });
    }

  return resolve(event);
};
