import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	title: string;
	subtitle: string;
	value: string | number;
	icon: LucideIcon;
	className?: string;
	isStreak?: boolean;
	streakDays?: number;
	children?: React.ReactNode;
}

export const StatCard = ({
	title,
	subtitle,
	value,
	icon: Icon,
	className = "",
	isStreak = false,
	streakDays = 0,
	children,
}: StatCardProps) => {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0 },
			}}
			className={`group relative bg-gradient-to-br from-[#BCB1E7]/10 to-[#080808]/20 rounded-xl p-8 h-auto flex flex-col border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 ${className}`}
		>
			{isStreak && (
				<div className="absolute inset-0 bg-gradient-to-br from-[#BCB1E7]/5 to-transparent opacity-100 rounded-xl" />
			)}
			<div className="relative flex flex-col items-start overflow-hidden h-full">
				<span className="flex flex-col items-start gap-0.5 w-full mb-6">
					<div className="flex items-center justify-between w-full">
						<h3 className="z-10 text-2xl font-medium text-white w-full">
							{title}
						</h3>
						<div className="p-2 bg-white/10 rounded-lg">
							<Icon className="w-6 h-6 opacity-80" />
						</div>
					</div>
					<h5 className="z-10 text-xs font-medium text-neutral-400">
						{subtitle}
					</h5>
				</span>

				{isStreak ? (
					<>
						<span className="flex items-end gap-1 mb-3">
							<h4 className="z-10 text-3xl font-medium text-white">{value}</h4>
							<h5 className="z-10 text-xs font-medium text-neutral-400 pb-1">
								{children}
							</h5>
						</span>
						<div className="flex gap-1 w-full">
							{[1, 2, 3, 4, 5, 6, 7].map((day) => (
								<motion.div
									key={day}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: day * 0.1 }}
									className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
										day <= (streakDays || 0)
											? "bg-gradient-to-r from-[#BCB1E7] to-white"
											: "bg-neutral-700"
									}`}
								/>
							))}
						</div>
					</>
				) : (
					<h4 className="z-10 text-3xl font-medium text-white">{value}</h4>
				)}
			</div>
		</motion.div>
	);
};
