import { Clock, Calendar, Share2, Flame, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useTranslation } from "../translations/translationContext";
import { getCurrentPort } from "../utils/getPort";

const SkeletonCard = ({ className = "" }) => (
	<div className={`bg-white/5 rounded-xl p-8 animate-pulse border border-white/10 ${className}`}>
		<div className="h-7 w-3/4 bg-white/10 rounded mb-6" />
		<div className="h-4 w-1/2 bg-white/10 rounded mb-6" />
		<div className="h-10 w-1/3 bg-white/10 rounded mt-auto" />
	</div>
);

export default function Account() {
	const { t } = useTranslation();
	const { user, logout } = useAuthContext();
	const [data, setData] = useState<any>(null);
	const [hoursInApp, setHoursInApp] = useState(0);
	const [consecutiveDays, setConsecutiveDays] = useState(0);
	const [loading, setLoading] = useState(true);
	// const settings = JSON.parse(localStorage.getItem("config") || "{}");

	useEffect(() => {
		async function getData() {
			const port = await getCurrentPort();
			if (!user) return;
			const response = await fetch(`http://localhost:${port}/db/events`, {
				method: "GET",
				headers: {
					user: user.id,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setData(data);
				getHoursInApp(data);
				getConsecutiveDays(data);
				setLoading(false);
			} else {
				console.error("Failed to fetch data");
			}
		}
		getData();
	}, []);

	function getHoursInApp(data: any) {
		if (!data?.sessions?.length) {
			setHoursInApp(0);
			return;
		}

		let totalSeconds = 0;
		const now = new Date();

		for (const session of data.sessions) {
			const start = new Date(session.started_at);
			const end = session.finished_at ? new Date(session.finished_at) : now;

			const durationSeconds = (end.getTime() - start.getTime()) / 1000;
			totalSeconds += durationSeconds;
		}
		const hours = totalSeconds / 3600;
		setHoursInApp(hours);
	}

	const formatTimeSpent = (hours: number): string => {
		if (hours === 0) return "0m";

		const totalMinutes = Math.round(hours * 60);
		const h = Math.floor(totalMinutes / 60);
		const m = totalMinutes % 60;

		if (h === 0) return `${m}m`;
		if (m === 0) return `${h}h`;
		return `${h}h ${m}m`;
	};

	function getConsecutiveDays(data: any) {
		if (!data?.sessions?.length) {
			setConsecutiveDays(0);
			return;
		}

		const uniqueDays = new Set(
			data.sessions
				.map((session: any) => session.started_at.split("T")[0])
				.sort(),
		);

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date(today);
			date.setDate(today.getDate() - i);
			return date.toISOString().split("T")[0];
		}).reverse();

		let streak = 0;
		for (const day of last7Days) {
			if (uniqueDays.has(day)) {
				streak++;
			} else if (streak > 0) {
				break;
			}
		}
		setConsecutiveDays(streak);
	}

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 }
	};

	return (
		<div className="min-h-screen pt-4">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col gap-6 py-5 h-full">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-2xl sm:text-3xl font-semibold">
							{t("account.title")}
						</h1>
					</motion.div>
					
					{data && !loading ? (
						<motion.div 
							className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 h-full"
							initial="hidden"
							animate="visible"
							variants={{
								visible: {
									transition: {
										staggerChildren: 0.1
									}
								}
							}}
						>
							<motion.div 
								variants={cardVariants}
								className="col-span-2 sm:col-span-1 md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#BCB1E7]/10 to-[#080808]/20 rounded-xl p-8 h-auto flex flex-col border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
							>
								<div className="flex flex-col items-start overflow-hidden rounded-lg h-full">
									<span className="flex flex-col items-start gap-0.5 w-full mb-6">
										<div className="flex items-center justify-between w-full">
											<h3 className="z-10 text-2xl font-medium text-white w-full">
												{t("account.stats.timeSpent.title")}
											</h3>
											<div className="p-2 bg-white/10 rounded-lg">
												<Clock className="w-6 h-6 opacity-80" />
											</div>
										</div>
										<h5 className="z-10 text-xs font-medium text-neutral-400">
											{t("account.stats.timeSpent.subtitle")}
										</h5>
									</span>
									<h4 className="z-10 text-3xl font-medium text-white flex justify-end mt-auto">
										{formatTimeSpent(hoursInApp)}
									</h4>
								</div>
							</motion.div>
							
							<motion.div 
								variants={cardVariants}
								className="col-span-2 sm:col-span-1 md:col-span-2 bg-gradient-to-br from-[#BCB1E7]/10 to-[#080808]/20 rounded-xl p-8 h-auto flex flex-col border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
							>
								<div className="flex flex-col items-start overflow-hidden rounded-lg">
									<span className="flex flex-col items-start gap-0.5 w-full mb-6">
										<div className="flex items-center justify-between w-full">
											<h3 className="z-10 text-2xl font-medium text-white w-full">
												{t("account.stats.sessions.title")}
											</h3>
											<div className="p-2 bg-white/10 rounded-lg">
												<Calendar className="w-6 h-6 opacity-80" />
											</div>
										</div>
										<h5 className="z-10 text-xs font-medium text-neutral-400">
											{t("account.stats.sessions.subtitle")}
										</h5>
									</span>
									<h4 className="z-10 text-3xl font-medium text-white">
										{data.sessions.length}
									</h4>
								</div>
							</motion.div>
							
							<motion.div 
								variants={cardVariants}
								className="col-span-2 sm:col-span-1 md:col-span-2 bg-gradient-to-br from-[#BCB1E7]/10 to-[#080808]/20 rounded-xl p-8 h-auto flex flex-col border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
							>
								<div className="flex flex-col items-start overflow-hidden rounded-lg">
									<span className="flex flex-col items-start gap-0.5 w-full mb-6">
										<div className="flex items-center justify-between w-full">
											<h3 className="z-10 text-2xl font-medium text-white w-full">
												{t("account.stats.shared.title")}
											</h3>
											<div className="p-2 bg-white/10 rounded-lg">
												<Share2 className="w-6 h-6 opacity-80" />
											</div>
										</div>
										<h5 className="z-10 text-xs font-medium text-neutral-400">
											{t("account.stats.shared.subtitle")}
										</h5>
									</span>
									<h4 className="z-10 text-3xl font-medium text-white">
										{data.shared.length}
									</h4>
								</div>
							</motion.div>
							
							<motion.div 
								variants={cardVariants}
								className="group relative col-span-2 sm:col-span-1 md:col-span-full bg-gradient-to-br from-[#BCB1E7]/15 to-[#080808]/30 rounded-xl p-8 h-auto flex flex-col border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
							>
								<div className="absolute inset-0 bg-gradient-to-br from-[#BCB1E7]/5 to-transparent opacity-100 rounded-xl" />
								<div className="relative flex flex-col items-start overflow-hidden">
									<span className="flex flex-col items-start gap-0.5 w-full mb-6">
										<div className="flex items-center justify-between w-full">
											<h3 className="z-10 text-2xl font-medium text-white w-full">
												{t("account.stats.streak.title")}
											</h3>
											<div className="p-2 bg-white/10 rounded-lg">
												<Flame className="w-6 h-6 opacity-80" />
											</div>
										</div>
										<h5 className="z-10 text-xs font-medium text-neutral-400">
											{t("account.stats.streak.subtitle")}
										</h5>
									</span>
									<span className="flex items-end gap-1 mb-3">
										<h4 className="z-10 text-3xl font-medium text-white">
											{consecutiveDays}
										</h4>
										<h5 className="z-10 text-xs font-medium text-neutral-400 pb-1">
											{t("account.stats.streak.days")}
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
													day <= consecutiveDays 
														? "bg-gradient-to-r from-[#BCB1E7] to-white" 
														: "bg-neutral-700"
												}`}
											/>
										))}
									</div>
								</div>
							</motion.div>
						</motion.div>
					) : (
						<motion.div 
							className="grid grid-cols-2 grid-rows-1 gap-4 h-fit"
							initial="hidden"
							animate="visible"
							variants={{
								visible: {
									transition: {
										staggerChildren: 0.1
									}
								}
							}}
						>
							<SkeletonCard className="h-full"/>
							<div className="flex flex-col gap-4">
							<SkeletonCard />
							<SkeletonCard />
							</div>
							<SkeletonCard className="col-span-2 h-fit"/>
						</motion.div>
					)}
					
					{/* Logout button aligned with cards */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.3 }}
						className="flex justify-end mb-auto"
					>
						<motion.button
							onClick={logout}
							className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-300 text-red-400 hover:text-red-300 backdrop-blur-sm cursor-pointer"
						>
							<LogOut className="w-4 h-4" />
							<span className="text-sm font-medium">{t("account.logout")}</span>
						</motion.button>
					</motion.div>
				</main>
			</div>
		</div>
	);
}
