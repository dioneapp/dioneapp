import { openLink } from "@renderer/utils/openLink";
import { motion } from "framer-motion";
import { BadgeCheck, Download, User, CheckCircle, Circle, HelpCircle, Star, GitFork, BadgeInfo, Clock } from "lucide-react";
import { useTranslation } from "../../translations/translationContext";
import Loading from "./loading-skeleton";
import React, { useState } from "react";

interface ActionsProps {
	data: any;
	setImgLoading: React.Dispatch<React.SetStateAction<boolean>>;
	installed: boolean;
	handleStart: any;
	handleUninstall: any;
	handleDownload: any;
	isServerRunning: Record<string, boolean>;
	handleReconnect: any;
	handleDeleteDeps: any;
	isLocal?: boolean;
	user?: boolean;
}

export default function ActionsComponent({
	data,
	setImgLoading,
	installed,
	handleStart,
	// handleUninstall,
	handleDownload,
	isServerRunning,
	handleReconnect,
	handleDeleteDeps,
	isLocal,
}: ActionsProps) {
	const { t } = useTranslation();

		// fake version data
		const versions = [
			{ version: "v1.2.3", commit: "z9y8x7w", verified: true, date: "2024-06-01" },
			{ version: "v1.2.2", commit: "a1b2c3d", verified: true, date: "2024-05-20" },
			{ version: "v1.2.1", commit: "d4e5f6g", verified: false, date: "2024-05-10" },
			{ version: "v1.2.0", commit: "h7g6f5e", verified: false, date: "2024-05-01" },
			{ version: "v1.1.9", commit: "j4k3h2g", verified: false, date: "2024-04-20" },
			{ version: "v1.1.8", commit: "m1n0l2k", verified: false, date: "2024-04-10" },
			{ version: "v1.1.7", commit: "p9o8n7m", verified: false, date: "2024-04-01" },
			{ version: "v1.1.6", commit: "r5q4p3o", verified: false, date: "2024-03-20" },
			{ version: "v1.1.5", commit: "t7u6v5w", verified: false, date: "2024-03-10" },
			{ version: "v1.1.4", commit: "x3y2z1a", verified: false, date: "2024-03-01" },
		];
	const [selectedVersion, setSelectedVersion] = useState(versions[0].version);
	const displayedVersions = versions.slice(0, 5);
	const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

	// add mock fields to data if not present
	data = {
		...data,
		lastUpdated: data.lastUpdated ?? "2024-06-01",
	};

	return (
		<>
			<motion.div
				key="actions"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{
					type: "spring",
					stiffness: 100,
					damping: 20,
				}}
				className="flex flex-col gap-6 w-full max-w-xl overflow-auto rounded-xl"
			>
				{data ? (
					<motion.div
						key="content"
						initial={{ opacity: 0, scale: 0.97 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.97 }}
						transition={{
							type: "spring",
							stiffness: 100,
							damping: 20,
						}}
						className="p-6 rounded-xl border border-white/10 relative overflow-auto max-w-xl w-full bg-transparent"
					>
						<div className="absolute top-0 left-1/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl z-50" />
						<div className="relative z-10">
							<div className="flex gap-4 items-start justify-start">
								<div className="relative h-16 w-16 flex-shrink-0 bg-[#18122B] rounded-xl flex items-center justify-center border border-white/10">
									{data?.logo_url && data?.logo_url?.startsWith("http") ? (
										<img
											onLoad={() => setImgLoading(false)}
											onError={() => setImgLoading(false)}
											src={data?.logo_url}
											alt={`${data?.name} icon`}
											className="h-16 w-16 rounded-xl object-cover object-center"
										/>
									) : (
										!isLocal && (
											<div
												style={{
													backgroundImage: data?.logo_url,
													backgroundSize: "100%",
													backgroundRepeat: "no-repeat",
													backgroundPosition: "center",
												}}
												className="h-16 w-16 rounded-xl bg-cover bg-center"
											/>
										)
									)}
									{isLocal && (
										<div className="h-16 w-16 rounded-xl flex items-center justify-center bg-neutral-900">
											<span className="text-white/70 font-semibold text-xl">
												{data?.name?.charAt(0)?.toUpperCase() || "?"}
											</span>
										</div>
									)}
								</div>
								<div className="flex flex-col items-start w-full">
									<div className="flex w-full items-start justify-between gap-2">
										<div className="flex items-start justify-start -mt-1">
											<h1 className="text-xl font-semibold mb-1 truncate text-white flex items-center gap-2">
												{data?.name}
											</h1>
										</div>
									</div>
									{!isLocal && (
										<>
											<p className="text-xs text-[#BCB1E7] mb-1 flex gap-1 hover:underline w-fit cursor-pointer max-w-md" onClick={() => openLink(data?.script_url)}>
												<span className="w-fit h-full flex items-center justify-center">
													<BadgeCheck size={16} />
												</span>
												{!isLocal && data?.script_url && data?.script_url.replace(/^https?:\/\/(raw\.githubusercontent\.com|github\.com)\//, "").split("/").slice(0, 2).join("/")}
											</p>
											<p className="text-xs text-[#BCB1E7] flex gap-1">
												<span className="w-fit h-full flex items-center">
													<User size={16} />
												</span>
												{t("actions.publishedBy")} <span className="hover:underline cursor-pointer" onClick={() => openLink(`${data?.author_url}`)}>{data?.author}</span>
											</p>
											<span className="flex items-center gap-2 flex-wrap mt-2">
												<span className="flex items-center gap-1 bg-white/5 text-neutral-300 rounded px-1.5 py-0.5 text-xs font-mono">
													<Download className="h-3 w-3 mr-0.5 opacity-60" />
													{data.downloads || 0}
												</span>
												<span className="flex items-center gap-1 bg-white/5 text-neutral-300 rounded px-1.5 py-0.5 text-xs font-mono">
													<Clock className="h-3 w-3 mr-0.5 opacity-60" />
													{data.lastUpdated}
												</span>
											</span>
										</>
									)}
									<p className="text-xs text-neutral-400 mb-3 mt-2 line-clamp-3">
										{data?.description}
									</p>

									<div className="w-full mt-2 mb-3 p-3 rounded-lg border border-white/10 flex flex-col gap-1">
										<p className="text-xs text-[#BCB1E7] font-medium mb-2">Select version</p>
										<ul className="flex flex-col gap-1">
											{displayedVersions.map((v, idx) => (
												<li
													key={v.version}
													className={`flex items-center gap-2 text-xs px-2 py-1 rounded cursor-pointer transition-colors ${selectedVersion === v.version ? "bg-[#232136]" : "hover:bg-white/5"}`}
													onClick={() => setSelectedVersion(v.version)}
												>
													<input
														type="radio"
														checked={selectedVersion === v.version}
														onChange={() => setSelectedVersion(v.version)}
														className="accent-[#BCB1E7] h-3 w-3"
														style={{ minWidth: 12 }}
													/>
													{v.verified ? (
														<CheckCircle className="h-4 w-4 text-green-500" />
													) : (
														<HelpCircle className="h-4 w-4 text-yellow-400" />
													)}
													<span className="font-mono text-white">{v.version}</span>
													<span
														className="relative bg-[#393053] text-white/80 rounded-full px-2 py-0.5 text-[10px] font-mono ml-1"
														onMouseEnter={() => setTooltipIndex(idx)}
														onMouseLeave={() => setTooltipIndex(null)}
													>
														#{v.commit}
														{tooltipIndex === idx && (
															<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-[10px] rounded shadow z-50 whitespace-nowrap">
																{v.date}
															</span>
														)}
													</span>
												</li>
											))}
										</ul>
									</div>

									<div className="flex justify-center gap-2 w-full mt-2">
										{isServerRunning[data?.id] && (
											<button
												type="button"
												onClick={handleReconnect}
												className="bg-neutral-500/80 hover:bg-neutral-500/60 font-medium py-1 px-4 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 cursor-pointer"
											>
												{t("actions.reconnect")}
											</button>
										)}
										{!isServerRunning[data?.id] &&
											(installed ? (
												<div className="flex gap-2 justify-end w-full">
													<button
														type="button"
														onClick={handleStart}
														className="bg-white hover:bg-white/80 text-black font-semibold py-1 px-4 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 cursor-pointer"
													>
														{t("actions.start")}
													</button>
													<button
														type="button"
														onClick={handleDeleteDeps}
														className="bg-red-500/50 hover:bg-red-500/60 font-medium py-1 px-4 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 cursor-pointer"
													>
														{t("actions.uninstall")}
													</button>
												</div>
											) : (
												<button
													type="button"
													onClick={handleDownload}
													className="bg-white hover:bg-white/80 text-black font-semibold py-1 px-4 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 cursor-pointer"
												>
													{t("actions.install")}
												</button>
											))}
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				) : (
					<Loading />
				)}
			</motion.div>
		</>
	);
}
