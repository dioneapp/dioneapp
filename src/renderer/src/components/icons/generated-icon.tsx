type GeneratedIconProps = {
	name?: string | null;
	className?: string;
	roundedClassName?: string;
	isSidebarIcon?: boolean;
};

function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

function getInitials(name?: string | null): string {
	if (!name) return "?";
	const trimmed = name.trim();
	if (!trimmed) return "?";

	// split on common separators first
	const sepParts = trimmed.split(/[\s._-]+/).filter(Boolean);
	if (sepParts.length >= 2) {
		return (sepParts[0][0] + sepParts[1][0]).toUpperCase();
	}

	const token = sepParts[0];
	// split CamelCase or PascalCase into segments, also capture numbers and lowercase-only segments
	const segments = token.match(/[A-Z]+[a-z]*|[0-9]+|[a-z]+/g) || [];
	if (segments.length >= 2) {
		const a = segments[0]?.[0] ?? "";
		const b = segments[1]?.[0] ?? "";
		const combo = (a + b).trim();
		if (combo) return combo.toUpperCase();
	}

	const clean = token.replace(/[^A-Za-z0-9]/g, "");
	return clean[0]?.toUpperCase() || "?";
}

function colorsFromName(name: string) {
	const seed = hashString(name);
	const hue1 = seed % 360;
	const hue2 = (hue1 + 35 + (seed % 50)) % 360;
	const sat = 70;
	const light1 = 52;
	const light2 = 42;
	const angle = seed % 360;
	return {
		angle,
		c1: `hsl(${hue1} ${sat}% ${light1}%)`,
		c2: `hsl(${hue2} ${sat}% ${light2}%)`,
	};
}

export default function GeneratedIcon({
	name,
	className = "",
	roundedClassName = "rounded-lg",
	isSidebarIcon = false,
}: GeneratedIconProps) {
	const safeName = name ?? "?";
	const initials = getInitials(safeName);
	const { angle, c1, c2 } = colorsFromName(safeName);

	return (
		<div
			className={`${roundedClassName} ${className} relative overflow-hidden flex items-center justify-center select-none`}
			aria-label={`${safeName} placeholder icon`}
			style={{
				backgroundImage: `linear-gradient(${angle}deg, ${c1}, ${c2})`,
			}}
		>
			<span
				className={`text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] font-semibold ${isSidebarIcon ? "text-[10px]" : ""}`}
				style={{
					letterSpacing: "0.5px",
				}}
			>
				{initials}
			</span>
			<div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%),radial-gradient(circle_at_70%_80%,white,transparent_45%)]" />
		</div>
	);
}
