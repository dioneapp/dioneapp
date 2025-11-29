interface ToggleSwitchProps {
	enabled: boolean;
	onChange: () => void;
}

export default function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
	return (
		<button
			type="button"
			onClick={onChange}
			className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 border border-white/5 cursor-pointer ${
				enabled ? "bg-green-500/30" : "bg-red-500/30"
			}`}
		>
			<span
				className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
					enabled ? "translate-x-6" : "translate-x-0"
				}`}
			/>
		</button>
	);
}
