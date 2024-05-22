import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST({ request, params, cookies }) {
	const { content } = await request.json();
	const postId = Number(params.id);
	const authorId = cookies.get('session');

	if (!authorId) {
		return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
	}

	const comment = await prisma.comment.create({
		data: {
			content,
			postId,
			authorId: Number(authorId)
		}
	});

	return new Response(JSON.stringify({ comment }), { status: 201 });
}
