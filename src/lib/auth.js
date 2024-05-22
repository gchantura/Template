import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = 'your_secret_key'; // Replace with a strong secret

export async function registerUser(email, password, name) {
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name
		}
	});
	return user;
}

export async function loginUser(email, password) {
	const user = await prisma.user.findUnique({
		where: { email }
	});
	if (!user) {
		throw new Error('User not found');
	}
	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword) {
		throw new Error('Invalid password');
	}
	const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1d' });
	return { token, user };
}

export async function comparePasswords(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
}

// ** Fix: Export the hashPassword function **
export async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}
