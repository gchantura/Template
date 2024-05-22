import { comparePasswords } from '$lib/auth';
import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';
const prisma = new PrismaClient();

export async function POST({ request }) {
	const { email, password } = await request.json();

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user || !(await comparePasswords(password, user.password))) {
		return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
	}

	// Create a session or JWT token here. For simplicity, we're just setting a cookie
	const cookie = serialize('session', user.id, {
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7, // 1 week
		path: '/'
	});

	return new Response(JSON.stringify({ user }), {
		status: 200,
		headers: {
			'Set-Cookie': cookie
		}
	});
}
