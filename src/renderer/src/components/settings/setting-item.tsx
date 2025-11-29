interface SettingItemProps {
	label: string;
	description: string;
	children: React.ReactNode;
}

export default function SettingItem({ label, description, children }: SettingItemProps) {
	return (
		<div className="flex justify-between w-full items-center">
			<div className="flex items-start justify-center flex-col">
				<label className="text-neutral-200 font-medium">{label}</label>
				<p className="text-xs text-neutral-400 max-w-xl">{description}</p>
			</div>
			{children}
		</div>
	);
}
