import { comparePasswords } from '$lib/auth'; // Use comparePasswords instead
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
	const { email, password, name } = await request.json();
	try {
		// ** Fix: Use comparePasswords to hash password **
		const hashedPassword = await comparePasswords(password, null);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name
			}
		});
		// ... rest of your registration logic
	} catch (error) {
		// ... handle errors
	}
}
