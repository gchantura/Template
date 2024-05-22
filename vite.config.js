// vite.config.js

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	kit: {
		// Add any SvelteKit configuration here
	},
	build: {
		rollupOptions: {
			// Add 'jsonwebtoken' to the list of external modules
			external: ['jsonwebtoken']
		}
	}
});
