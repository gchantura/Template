// src/lib/auth.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = 'your_secret_key'; // Replace with a strong secret

// Function to register a new user
export async function registerUser(email, password, name) {
	// Hash the password using bcrypt
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create a new user in the database using Prisma
	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name
		}
	});

	return user;
}

// Function to log in an existing user
export async function loginUser(email, password) {
	// Find the user in the database based on the provided email
	const user = await prisma.user.findUnique({
		where: { email }
	});

	// If no user found, throw an error
	if (!user) {
		throw new Error('User not found');
	}

	// Compare the provided password with the hashed password stored in the database
	const validPassword = await bcrypt.compare(password, user.password);

	// If the password is invalid, throw an error
	if (!validPassword) {
		throw new Error('Invalid password');
	}

	// If the password is valid, generate a JWT token
	const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1d' });

	// Return the token and the user information
	return { token, user };
}

// Function to compare passwords using bcrypt
export async function comparePasswords(password, hashedPassword) {
	// Compare the provided password with the hashed password using bcrypt
	return await bcrypt.compare(password, hashedPassword);
}
