interface SettingItemProps {
	label: string;
	description: string;
	children: React.ReactNode;
	layout?: "row" | "column";
}

export default function SettingItem({
	label,
	description,
	children,
	layout = "row",
}: SettingItemProps) {
	if (layout === "column") {
		return (
			<div className="flex flex-col gap-3 w-full">
				<div className="flex items-start justify-center flex-col">
					<label className="text-neutral-200 font-medium">{label}</label>
					<p className="text-xs text-neutral-400 max-w-xl">{description}</p>
				</div>
				{children}
			</div>
		);
	}

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
