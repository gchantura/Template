// src/routes/login/+server.js

import { comparePasswords } from '$/lib/auth';
import { PrismaClient } from '@prisma/client';
import { serialize } from 'cookie';

const prisma = new PrismaClient();
const SECRET = 'your_secret_key'; // Replace with the same secret used in auth.js

export async function POST({ request }) {
	const { email, password } = await request.json();
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await comparePasswords(password, user.password))) {
			return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
		}
		const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1d' });
		const cookie = serialize('session', token, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
			path: '/'
		});
		return new Response(JSON.stringify({ user }), {
			status: 200,
			headers: {
				'Set-Cookie': cookie
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 401 });
	}
}
