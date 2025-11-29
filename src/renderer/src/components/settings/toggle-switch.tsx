interface ToggleSwitchProps {
	enabled: boolean;
	onChange: (enabled: boolean) => void;
}

export default function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
	return (
		<button
			type="button"
			onClick={() => onChange(!enabled)}
			className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 border border-white/5 cursor-pointer ${
				enabled ? "" : "bg-red-500/30"
			}`}
			style={enabled ? { background: 'color-mix(in srgb, var(--theme-accent) 22%, transparent)' } : undefined}
		>
			<span
				className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
					enabled ? "translate-x-6" : "translate-x-0"
				}`}
				style={{ background: 'white' }}
			/>
		</button>
	);
}
