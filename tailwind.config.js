/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/renderer/index.html",
		"./src/renderer/src/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				background: {
					DEFAULT: '#080808',
					light: '#ffffff',
				},
				surface: {
					DEFAULT: '#1a1a1a',
					light: '#f5f5f5',
				},
				text: {
					primary: {
						DEFAULT: '#ffffff',
						light: '#000000',
					},
					secondary: {
						DEFAULT: '#a3a3a3',
						light: '#666666',
					},
					muted: {
						DEFAULT: '#525252',
						light: '#9ca3af',
					},
				},
				border: {
					DEFAULT: 'rgba(255, 255, 255, 0.1)',
					light: 'rgba(0, 0, 0, 0.1)',
				},
				accent: {
					DEFAULT: '#BCB1E7',
					light: '#8B5CF6',
				},
			},
		},
	},
	plugins: [],
};
