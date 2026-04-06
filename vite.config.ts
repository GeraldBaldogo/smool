import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['icon-192.png', 'icon-512.png', 'robots.txt'],
			manifest: {
				name: 'Smart School Maintenance',
				short_name: 'Smool',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#1d4ed8',
				lang: 'en',
				icons: [
					{
						src: '/icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	]
});