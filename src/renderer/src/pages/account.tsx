import { StatCard } from "@/components/account/stat-card";
import { useAuthContext } from "@/components/contexts/auth-context";
import { useTranslation } from "@/translations/translation-context";
import { apiFetch } from "@/utils/api";
import { motion } from "framer-motion";
import { Calendar, Clock, Flame, LogOut, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

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
			if (!user) return;
			const response = await apiFetch("/db/events", {
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
	}, [user]);

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

	return (
		<div className="min-h-screen pt-4">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col min-h-[60vh] gap-6 py-5">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-2xl sm:text-3xl font-semibold">
							{t("account.title")}
						</h1>
					</motion.div>

					<div className="w-full max-w-full">
						<div className="relative min-h-[220px] w-full">
							<motion.div
								className="flex flex-col w-full h-full justify-between"
								initial={{ opacity: 0 }}
								animate={{ opacity: data && !loading ? 1 : 0 }}
								transition={{ duration: 0.4 }}
							>
								{data && !loading && (
									<div className="flex flex-col w-full h-full justify-between">
										<div className="flex-1">
											<motion.div
												className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 h-full"
												initial="hidden"
												animate="visible"
												variants={{
													visible: {
														transition: {
															staggerChildren: 0.1,
														},
													},
												}}
											>
												{/* Time spent */}
												<StatCard
													title={t("account.stats.timeSpent.title")}
													subtitle={t("account.stats.timeSpent.subtitle")}
													value={formatTimeSpent(hoursInApp)}
													icon={Clock}
													className="col-span-2 sm:col-span-1 md:col-span-2 "
												/>
												{/* Sessions and apps shared */}
												<div className="col-span-2 gap-4 flex flex-col">
													<StatCard
														title={t("account.stats.sessions.title")}
														subtitle={t("account.stats.sessions.subtitle")}
														value={data.sessions.length}
														icon={Calendar}
													/>
													<StatCard
														title={t("account.stats.shared.title")}
														subtitle={t("account.stats.shared.subtitle")}
														value={data.shared.length}
														icon={Share2}
													/>
												</div>
												{/* Consecutive days */}
												<StatCard
													title={t("account.stats.streak.title")}
													subtitle={t("account.stats.streak.subtitle")}
													value={consecutiveDays}
													icon={Flame}
													className="col-span-2 sm:col-span-1 md:col-span-full"
													isStreak
													streakDays={consecutiveDays}
												>
													{t("account.stats.streak.days")}
												</StatCard>
											</motion.div>
										</div>
										<div className="flex justify-end mt-4">
											<LogoutButton logout={logout} />
										</div>
									</div>
								)}
							</motion.div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

const LogoutButton = ({ logout }: { logout: () => void }) => {
	const { t } = useTranslation();
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6, duration: 0.3 }}
			className="flex justify-end mb-auto"
		>
			<motion.button
				onClick={logout}
				className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-300 text-red-400 hover:text-red-300 backdrop-blur-sm cursor-pointer"
			>
				<LogOut className="w-4 h-4" />
				<span className="text-sm font-medium">{t("account.logout")}</span>
			</motion.button>
		</motion.div>
	);
};
