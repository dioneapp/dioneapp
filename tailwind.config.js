/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/renderer/index.html",
		"./src/renderer/src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--theme-background)',
				accent: 'var(--theme-accent)',
				'accent-secondary': 'var(--theme-accent-secondary)',
			},
		},
	},
	plugins: [],
};
