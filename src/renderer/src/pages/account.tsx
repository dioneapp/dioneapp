import Icon from "@renderer/components/icons/icon";
import { useEffect, useState } from "react";
import { getCurrentPort } from "../utils/getPort";

const SkeletonCard = ({ className = "" }) => (
	<div className={`bg-white/5 rounded-xl p-8 animate-pulse ${className}`}>
		<div className="h-7 w-3/4 bg-white/10 rounded mb-6" />
		<div className="h-4 w-1/2 bg-white/10 rounded mb-6" />
		<div className="h-10 w-1/3 bg-white/10 rounded mt-auto" />
	</div>
);

export default function Account() {
	const [data, setData] = useState<any>(null);
	const [hoursInApp, setHoursInApp] = useState(0);
	const [consecutiveDays, setConsecutiveDays] = useState(0);
	const [loading, setLoading] = useState(true);
	// const settings = JSON.parse(localStorage.getItem("config") || "{}");

	useEffect(() => {
		async function getData() {
			const port = await getCurrentPort();
			const user = JSON.parse(localStorage.getItem("user") || "{}");
			if (!user) return;
			const response = await fetch(`http://localhost:${port}/db/events`, {
				method: "GET",
				headers: {
					user: user.id,
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data);
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

	return (
		<div className="min-h-screen bg-background pt-4">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col gap-6 py-5">
					<h1 className="text-2xl sm:text-3xl font-semibold mb-4">Account</h1>
					<p className="text-xs text-neutral-400">WIP</p>
					{data && !loading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 h-full">
								<div className="col-span-2 sm:col-span-1 md:col-span-2 md:row-span-2 bg-white/10 rounded-xl p-8 h-auto flex flex-col">
									<div className="flex flex-col items-start overflow-hidden rounded-lg h-full">
										<span className="flex flex-col items-start gap-0.5 w-full mb-6">
											<div className="flex items-center justify-between w-full">
												<h3 className="z-10 text-2xl font-medium text-white w-full">
													Time spent
												</h3>
												<Icon name="Time" className="w-6 h-6 opacity-80" />
											</div>
											<h5 className="z-10 text-xs font-medium text-neutral-400">
												in last 7 days
											</h5>
										</span>
										<h4 className="z-10 text-3xl font-medium text-white flex justify-end mt-auto">
											{formatTimeSpent(hoursInApp)}
										</h4>
									</div>
								</div>
								<div className="col-span-2 sm:col-span-1 md:col-span-2 bg-white/10 rounded-xl p-8 h-auto flex flex-col">
									<div className="group relative flex flex-col items-start overflow-hidden rounded-lg ">
										<span className="flex flex-col items-start gap-0.5 w-full mb-6">
											<div className="flex items-center justify-between w-full">
												<h3 className="z-10 text-2xl font-medium text-white w-full">
													Sessions
												</h3>
												<Icon name="Sessions" className="w-6 h-6 opacity-80" />
											</div>
											<h5 className="z-10 text-xs font-medium text-neutral-400">
												in last 7 days
											</h5>
										</span>
										<h4 className="z-10 text-3xl font-medium text-white">
											{data.sessions.length}
										</h4>
									</div>
								</div>
								<div className="col-span-2 sm:col-span-1 md:col-span-2 bg-white/10 rounded-xl p-8 h-auto flex flex-col">
									<div className="group relative flex flex-col items-start overflow-hidden rounded-lg ">
										<span className="flex flex-col items-start gap-0.5 w-full mb-6">
											<div className="flex items-center justify-between w-full">
												<h3 className="z-10 text-2xl font-medium text-white w-full">
													Events
												</h3>
												<Icon name="Events" className="w-6 h-6 opacity-80" />
											</div>
											<h5 className="z-10 text-xs font-medium text-neutral-400">
												in last 7 days
											</h5>
										</span>
										<h4 className="z-10 text-3xl font-medium text-white">
											{data.total}
										</h4>
									</div>
								</div>
								<div className="group relative col-span-2 sm:col-span-1 md:col-span-full bg-white/10 rounded-xl p-8 h-auto flex flex-col">
									<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-100 rounded-xl" />
									<div className="group relative flex flex-col items-start overflow-hidden">
										<span className="flex flex-col items-start gap-0.5 w-full mb-6">
											<div className="flex items-center justify-between w-full">
												<h3 className="z-10 text-2xl font-medium text-white w-full">
													Streak
												</h3>
												<Icon name="Streak" className="w-6 h-6 opacity-80" />
											</div>
											<h5 className="z-10 text-xs font-medium text-neutral-400">
												consecutive days
											</h5>
										</span>
										<span className="flex items-end gap-1 mb-3">
											<h4 className="z-10 text-3xl font-medium text-white">
												{consecutiveDays}
											</h4>
											<h5 className="z-10 text-xs font-medium text-neutral-400 pb-1">
												days
											</h5>
										</span>
										<div className="flex gap-1 w-full">
											{[1, 2, 3, 4, 5, 6, 7].map((day) => (
												<div
													key={day}
													className={`h-1.5 flex-1 rounded-full ${day <= consecutiveDays ? "bg-white" : "bg-neutral-700"}`}
												/>
											))}
										</div>
									</div>
								</div>
							</div>
						): (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 h-full">
								<SkeletonCard className="col-span-2 sm:col-span-1 md:col-span-2 md:row-span-2" />
								<SkeletonCard className="col-span-2 sm:col-span-1 md:col-span-2" />
								<SkeletonCard className="col-span-2 sm:col-span-1 md:col-span-2" />
								<div className="group relative col-span-2 sm:col-span-1 md:col-span-full bg-white/5 rounded-xl p-8 h-auto flex flex-col">
									<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-100 rounded-xl" />
									<div className="group relative flex flex-col items-start overflow-hidden">
										<div className="h-7 w-3/4 bg-white/10 rounded mb-6" />
										<div className="flex items-end gap-1 mb-3">
											<div className="h-10 w-16 bg-white/10 rounded" />
										</div>
										<div className="flex gap-1 w-full">
											{[1, 2, 3, 4, 5, 6, 7].map((day) => (
												<div
													key={day}
													className="h-1.5 flex-1 rounded-full bg-white/10"
												/>
											))}
										</div>
									</div>
								</div>
							</div>
						)}
					</main>
			</div>
		</div>
	);
}
