import { Theme, themes } from "@/utils/theme";
import { Check } from "lucide-react";

interface ThemePreviewProps {
	theme: Theme;
	isActive: boolean;
	isIntense?: boolean;
	onClick: () => void;
}

export default function ThemePreview({ theme, isActive, isIntense = false, onClick }: ThemePreviewProps) {
	const themeColors = themes[theme];

	return (
		<button
			type="button"
			onClick={onClick}
			className={`relative group flex flex-col gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
				isActive
					? "border-white/30 bg-white/10"
					: "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
			}`}
		>
			{/* Theme Color Preview */}
			<div className="flex gap-2 items-center">
				<div
					className="w-12 h-12 rounded-lg border border-white/20 relative overflow-hidden"
					style={{
						background: `linear-gradient(135deg, ${themeColors.gradient.from} 0%, ${themeColors.gradient.to} 100%)`,
					}}
				>
					{isActive && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/20">
							<Check className="w-6 h-6 text-white drop-shadow-lg" />
						</div>
					)}
				</div>
				<div className="flex-1 text-left">
					<p className="text-sm font-medium text-white">{themeColors.name}</p>
					<div className="flex gap-1.5 mt-1">
						<div
							className="w-3 h-3 rounded-full border border-white/20"
							style={{ backgroundColor: themeColors.accent }}
						/>
						<div
							className="w-3 h-3 rounded-full border border-white/20"
							style={{ backgroundColor: themeColors.accentSecondary }}
						/>
						<div
							className="w-3 h-3 rounded-full border border-white/20"
							style={{ backgroundColor: isIntense ? themeColors.background.intense : themeColors.background.subtle }}
						/>
					</div>
				</div>
			</div>
		</button>
	);
}
