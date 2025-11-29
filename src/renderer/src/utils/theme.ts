export type Theme =
	| "default"
	| "midnight"
	| "ocean"
	| "forest"
	| "sunset"
	| "royal";
export type BackgroundIntensity = "subtle" | "intense";

export interface ThemeColors {
	name: string;
	background: {
		subtle: string;
		intense: string;
	};
	accent: string;
	accentSecondary: string;
	gradient: {
		from: string;
		to: string;
	};
	blur: string;
}

export const themes: Record<Theme, ThemeColors> = {
	default: {
		name: "Purple Dream",
		background: {
			subtle: "#080808",
			intense: "#1a0f2e",
		},
		accent: "#BCB1E7",
		accentSecondary: "#9A8FD1",
		gradient: {
			from: "#BCB1E7",
			to: "#9A8FD1",
		},
		blur: "#BCB1E7",
	},
	midnight: {
		name: "Midnight Blue",
		background: {
			subtle: "#080a10",
			intense: "#0a0e27",
		},
		accent: "#6B8DD6",
		accentSecondary: "#4A5F9D",
		gradient: {
			from: "#6B8DD6",
			to: "#4A5F9D",
		},
		blur: "#6B8DD6",
	},
	ocean: {
		name: "Ocean Depths",
		background: {
			subtle: "#08090c",
			intense: "#061621",
		},
		accent: "#4DD0E1",
		accentSecondary: "#26A69A",
		gradient: {
			from: "#4DD0E1",
			to: "#26A69A",
		},
		blur: "#4DD0E1",
	},
	forest: {
		name: "Forest Night",
		background: {
			subtle: "#080a08",
			intense: "#0d1b0d",
		},
		accent: "#66BB6A",
		accentSecondary: "#43A047",
		gradient: {
			from: "#66BB6A",
			to: "#43A047",
		},
		blur: "#66BB6A",
	},
	sunset: {
		name: "Sunset Glow",
		background: {
			subtle: "#0a0808",
			intense: "#1a0a0a",
		},
		accent: "#FF7043",
		accentSecondary: "#F4511E",
		gradient: {
			from: "#FF7043",
			to: "#F4511E",
		},
		blur: "#FF7043",
	},
	royal: {
		name: "Royal Purple",
		background: {
			subtle: "#09080b",
			intense: "#120a1f",
		},
		accent: "#9C27B0",
		accentSecondary: "#7B1FA2",
		gradient: {
			from: "#9C27B0",
			to: "#7B1FA2",
		},
		blur: "#9C27B0",
	},
};

export function applyTheme(
	theme: Theme,
	intensity?: BackgroundIntensity,
): void {
	const themeColors = themes[theme];
	const root = document.documentElement;
	const backgroundIntensity = intensity || getStoredBackgroundIntensity();

	root.style.setProperty(
		"--theme-background",
		themeColors.background[backgroundIntensity],
	);
	root.style.setProperty("--theme-accent", themeColors.accent);
	root.style.setProperty(
		"--theme-accent-secondary",
		themeColors.accentSecondary,
	);
	root.style.setProperty("--theme-gradient-from", themeColors.gradient.from);
	root.style.setProperty("--theme-gradient-to", themeColors.gradient.to);
	root.style.setProperty("--theme-blur", themeColors.blur);

	// Store theme preference
	localStorage.setItem("theme", theme);
	if (intensity) {
		localStorage.setItem("backgroundIntensity", intensity);
	}
}

export function getStoredTheme(): Theme {
	const stored = localStorage.getItem("theme");
	return (stored as Theme) || "default";
}

export function getStoredBackgroundIntensity(): BackgroundIntensity {
	const stored = localStorage.getItem("backgroundIntensity");
	return (stored as BackgroundIntensity) || "subtle";
}

export function setBackgroundIntensity(intensity: BackgroundIntensity): void {
	const theme = getStoredTheme();
	applyTheme(theme, intensity);
}

export function initializeTheme(): void {
	const theme = getStoredTheme();
	const intensity = getStoredBackgroundIntensity();
	applyTheme(theme, intensity);
}
