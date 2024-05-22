<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	let posts = writable([]);

	let title = '';
	let content = '';

	onMount(async () => {
		const res = await fetch('/posts');
		if (res.ok) {
			posts.set(await res.json());
		} else {
			console.error('Failed to load posts');
		}
	});

	async function createPost() {
		const res = await fetch('/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, content })
		});

		if (res.ok) {
			title = '';
			content = '';
			const newPost = await res.json();
			posts.update((posts) => [...posts, newPost]);
		} else {
			const { error } = await res.json();
			alert(error);
		}
	}
	async function addComment(postId) {
		const post = $posts.find((p) => p.id === postId);
		const content = post.newComment;

		const res = await fetch(`/posts/${postId}/comments`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content })
		});

		if (res.ok) {
			const newComment = await res.json();
			posts.update((posts) =>
				posts.map((p) =>
					p.id === postId ? { ...p, comments: [...p.comments, newComment], newComment: '' } : p
				)
			);
		} else {
			const { error } = await res.json();
			alert(error);
		}
	}
</script>

<form on:submit|preventDefault={createPost}>
	<input type="text" bind:value={title} placeholder="Title" required />
	<textarea bind:value={content} placeholder="Content" required></textarea>
	<button type="submit">Create Post</button>
</form>

{#each $posts as post}
	<div class="post">
		<h2>{post.title}</h2>
		<p>{post.content}</p>
		<p>By User {post.authorId}</p>
		<div class="comments">
			<h3>Comments</h3>
			{#each post.comments as comment}
				<div class="comment">
					<p>{comment.content}</p>
					<p>By User {comment.authorId}</p>
				</div>
			{/each}
			<form on:submit|preventDefault={() => addComment(post.id)}>
				<textarea bind:value={post.newComment} placeholder="Add a comment"></textarea>
				<button type="submit">Add Comment</button>
			</form>
		</div>
	</div>
{/each}

<style>
	.post {
		margin-bottom: 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	.comments {
		margin-top: 1rem;
	}

	.comment {
		margin-top: 0.5rem;
		padding: 0.5rem;
		border: 1px solid #eee;
		border-radius: 4px;
	}

	textarea {
		width: 100%;
		margin-top: 0.5rem;
	}
</style>
