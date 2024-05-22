import { hashPassword } from '$lib/auth';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST({ request }) {
	const { email, password } = await request.json();
	const hashedPassword = await hashPassword(password);

	try {
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword
			}
		});
		return new Response(JSON.stringify({ user }), { status: 201 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
	}
}
