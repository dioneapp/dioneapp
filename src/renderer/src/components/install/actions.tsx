import { openLink } from "@renderer/utils/openLink";
import { motion } from "framer-motion";
import { BadgeCheck, Download, User, ChevronDown } from "lucide-react";
import { useTranslation } from "../../translations/translationContext";
import Loading from "./loading-skeleton";
import React, { useState, useRef, useEffect } from "react";

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
	startOptions?: any;
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
	startOptions,
	isLocal,
}: ActionsProps) {
	const { t } = useTranslation();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		}
		if (dropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [dropdownOpen]);

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
				className="flex flex-col gap-6 w-full max-w-xl rounded-xl"
			>
				{data ? (
					<motion.div
						key="content"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{
							type: "spring",
							stiffness: 100,
							damping: 20,
						}}
						className="rounded-xl border border-white/10 shadow-lg relative max-w-xl w-full bg-[#080808]/60 backdrop-filter backdrop-blur-sm"
					>
						{/* background effects */}
						<div className="absolute w-full h-full backdrop-filter backdrop-blur-sm overflow-hidden">
							<div className="absolute top-0 left-1/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl z-50" />
						</div>
						<div className="relative z-10 p-6">
							<div className="flex gap-4 items-start justify-start">
								<div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
									{/* biome-ignore lint/complexity/useOptionalChain: if you change && to || it will break */}
									{data?.logo_url && data?.logo_url?.startsWith("http") ? (
										<img
											onLoad={() => setImgLoading(false)}
											onError={() => setImgLoading(false)}
											src={data?.logo_url}
											alt={`${data?.name} icon`}
											className="h-16 w-16 object-cover object-center transition-all duration-200"
										/>
									) : (
										!isLocal && (
											<div
												style={{
													backgroundImage:
														data?.logo_url ||
														"linear-gradient(to right, #BCB1E7, #9A8FD1)",
													backgroundSize: "100%",
													backgroundRepeat: "no-repeat",
													backgroundPosition: "center",
													filter: "blur(15px)",
													width: `${Math.floor(Math.random() * (96 - 48 + 1) + 48)}px`,
													height: `${Math.floor(Math.random() * (96 - 48 + 1) + 48)}px`,
												}}
												className="h-16 w-16 bg-cover bg-center group-hover:border-white/20 transition-all duration-200"
											/>
										)
									)}
									{isLocal && (
										<div className="h-16 w-16 bg-cover bg-center group-hover:border-white/20 transition-all duration-200 flex items-center justify-center bg-neutral-900">
											<span className="text-white/70 font-semibold text-xl">
												{data?.name?.charAt(0)?.toUpperCase() || "?"}
											</span>
										</div>
									)}
								</div>
								<div className="flex flex-col items-start w-full">
									<div className="flex w-full items-start justify-between gap-2">
										<div className="flex items-start justify-start -mt-1">
											<h1 className="text-2xl font-medium mb-1 truncate text-white">
												{data?.name}
											</h1>
										</div>
										{!isLocal && (
											<div className="flex items-start mb-auto gap-2 justify-center">
												<button
													type="button"
													className={
														"flex items-center justify-center gap-2 text-xs w-full transition-colors duration-400 rounded-full text-neutral-400 text-center"
													}
												>
													<Download className="h-3 w-3" />
													<span className="font-semibold">
														{data.downloads || 0}
													</span>
												</button>
											</div>
										)}
									</div>
									{!isLocal && (
										<>
											<p
												className="text-xs text-[#BCB1E7] mb-1 flex gap-1 hover:underline w-fit cursor-pointer text-justify max-w-md"
												onClick={() => openLink(data?.script_url)}
											>
												<span className="w-fit h-full flex items-center justify-center">
													<BadgeCheck size={16} />
												</span>
												{!isLocal &&
													data?.script_url &&
													data?.script_url
														.replace(
															/^https?:\/\/(raw\.githubusercontent\.com|github\.com)\//,
															"",
														)
														.split("/")
														.slice(0, 2)
														.join("/")}
											</p>
											<p className="text-xs text-[#BCB1E7] flex gap-1">
												<span className="w-fit h-full flex items-center">
													<User size={16} />
												</span>
												{t("actions.publishedBy")}{" "}
												<span
													className="hover:underline cursor-pointer"
													onClick={() => openLink(`${data?.author_url}`)}
												>
													{data?.author}
												</span>
											</p>
										</>
									)}
									<p className="text-xs text-neutral-400 mb-4 mt-2 line-clamp-3">
										{data?.description}
									</p>
								</div>
							</div>

							<div className="flex justify-center gap-2 w-full">
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
											{startOptions && startOptions.starts.length > 1 ? (
											<div className="relative" ref={dropdownRef}>
												<button
													type="button"
													onClick={() => setDropdownOpen((v) => !v)}
													className={`bg-white hover:bg-white/80 text-black font-semibold py-1 px-4 text-sm ${dropdownOpen ? "rounded-full rounded-bl-none" : "rounded-full"} focus:outline-none transition-all duration-150 cursor-pointer flex items-center gap-2`}
												>
													{t("actions.start")}
													<ChevronDown size={16} />
												</button>
											{dropdownOpen && startOptions && (
												<motion.div 
												initial={{ opacity: 0, scale: 0.93, y: -10, filter: "blur(10px)" }}
												animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.2 } }}
												exit={{ opacity: 0, scale: 0.93, y: -10, filter: "blur(10px)" }}
												className="absolute left-0 mt-2 p-2 w-44 bg-white border border-white/10 rounded rounded-tl-none shadow-lg z-50 overflow-hidden">
													{startOptions.starts.map((start, index) => (
													<div
														onClick={() => handleStart(start.name)}
														key={index}
														className="px-2 text-white-300 hover:bg-neutral-300 rounded cursor-pointer transition-colors"
													>
														<span className="text-xs text-black font-semibold">{start.name}</span>
													</div>
													))}
												</motion.div>
											)}
											</div>
											): (
												<div className="relative" ref={dropdownRef}>
												<button
													type="button"
													onClick={() => handleStart()}
													className={`bg-white hover:bg-white/80 text-black font-semibold py-1 px-4 text-sm ${dropdownOpen ? "rounded-b-none rounded-lg" : "rounded-full"} focus:outline-none transition-all duration-200 cursor-pointer flex items-center gap-2`}
												>
													{t("actions.start")}
												</button>
											</div>
											)}
											
											<button
												type="button"
												onClick={handleDeleteDeps}
												className="bg-red-500/50 hover:bg-red-500/60 font-medium py-1 px-4 text-sm rounded-full focus:outline-none transition-colors duration-200 cursor-pointer"
											>
												{t("actions.uninstall")}
											</button>
										</div>
									) : (
										<button
											type="button"
											onClick={handleDownload}
											className="bg-white hover:bg-white/80 text-black font-semibold py-1 px-4 text-sm rounded-full focus:outline-none transition-colors duration-200 cursor-pointer"
										>
											{t("actions.install")}
										</button>
									))}
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
