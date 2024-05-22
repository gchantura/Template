<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';

	async function register() {
		const res = await fetch('/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		if (res.ok) {
			goto('/login');
		} else {
			const { error } = await res.json();
			alert(error);
		}
	}
</script>

<form on:submit|preventDefault={register}>
	<input type="email" bind:value={email} placeholder="Email" required />
	<input type="password" bind:value={password} placeholder="Password" required />
	<button type="submit">Register</button>
</form>
