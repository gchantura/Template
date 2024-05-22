// src/routes/login/+server.js

import { loginUser } from '$lib/auth';
import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

// Handler for the POST request to log in a user
export async function POST({ request }) {
	// Extract email and password from the request body
	const { email, password } = await request.json();

	try {
		// Log in the user using the loginUser function
		const { token, user } = await loginUser(email, password);

		// Serialize the session token into a cookie
		const cookie = serialize('session', token, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7, // 1 week
			path: '/'
		});

		// Return a successful response with the user information and the session cookie
		return new Response(JSON.stringify({ user }), {
			status: 200,
			headers: {
				'Set-Cookie': cookie
			}
		});
	} catch (error) {
		// If an error occurs during login, return an error response
		return new Response(JSON.stringify({ error: error.message }), { status: 401 });
	}
}
