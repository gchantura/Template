import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
	const posts = await prisma.post.findMany({
		include: {
			comments: true,
			author: true
		}
	});

	return new Response(JSON.stringify(posts), {
		status: 200
	});
}
