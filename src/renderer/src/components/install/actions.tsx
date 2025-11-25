import GeneratedIcon from "@/components/icons/generated-icon";
import Loading from "@/components/install/loading-skeleton";
import { useTranslation } from "@/translations/translation-context";
import { openLink } from "@/utils/open-link";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	BadgeCheck,
	Bookmark,
	ChevronDown,
	CodeXml,
	Download,
	MoreHorizontal,
	Play,
	Share2,
	Trash2,
	User
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
	user?: any;
	setShow: any;
	handleShare?: () => void;
	handleSave?: () => void;
	saved?: boolean;
}

export default function ActionsComponent({
	data,
	setImgLoading,
	installed,
	handleStart,
	handleDownload,
	isServerRunning,
	handleReconnect,
	handleDeleteDeps,
	startOptions,
	isLocal,
	setShow,
	user,
	handleShare,
	handleSave,
	saved,
}: ActionsProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [moreMenuOpen, setMoreMenuOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const moreMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
			if (
				moreMenuRef.current &&
				!moreMenuRef.current.contains(event.target as Node)
			) {
				setMoreMenuOpen(false);
			}
		}
		if (dropdownOpen || moreMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [dropdownOpen, moreMenuOpen]);

	const handleOpenEditor = () => {
		if (!data?.id) return;
		setShow({ [data.id]: "editor" });
	};

	return (
		<AnimatePresence mode="wait">
			{data ? (
				<motion.div
					key="actions-content"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{
						type: "spring",
						stiffness: 100,
						damping: 20,
					}}
					className="flex flex-col w-full max-w-xl px-4 sm:px-6"
				>
					{/* Hero Card */}
					<div className="rounded-xl border border-white/10 relative w-full overflow-hidden">
						{/* Background with gradient */}
						<div className="absolute inset-0 bg-linear-to-br from-[#BCB1E7]/10 via-[#080808]/50 to-[#080808]/80" />
						<div className="absolute inset-0 overflow-hidden pointer-events-none">
							<div className="absolute -top-16 -right-16 w-32 sm:w-48 h-32 sm:h-48 bg-[#BCB1E7]/20 rounded-full blur-3xl" />
							<div className="absolute -bottom-8 -left-8 w-24 sm:w-32 h-24 sm:h-32 bg-[#BCB1E7]/10 rounded-full blur-2xl" />
						</div>

						{/* Top Bar */}
						<div className="relative z-10 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/5">
							<button
								type="button"
								onClick={() => navigate(-1)}
								className="flex items-center gap-1 sm:gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								<span className="text-xs hidden sm:inline">{t("common.back")}</span>
							</button>

							<div className="flex items-center gap-0.5 sm:gap-1">
								{user && !isLocal && (
									<>
										<button
											type="button"
											onClick={handleShare}
											className="p-1.5 hover:bg-white/10 transition-colors rounded-lg text-neutral-400 hover:text-white cursor-pointer"
										>
											<Share2 className="h-3.5 w-3.5" />
										</button>
										<button
											type="button"
											onClick={handleSave}
											className={`p-1.5 transition-colors rounded-lg cursor-pointer ${
												saved
													? "text-[#BCB1E7]"
													: "text-neutral-400 hover:text-white hover:bg-white/10"
											}`}
										>
											<Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-[#BCB1E7]" : ""}`} />
										</button>
									</>
								)}
							</div>
						</div>

						{/* Main Content */}
						<div className="relative z-10 p-3 sm:p-5">
							{/* App Header */}
							<div className="flex items-start gap-3 sm:gap-4">
								{/* App Icon */}
								<div className="relative h-12 w-12 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-white/10 shadow-lg">
									{/* biome-ignore lint/complexity/useOptionalChain: if you change && to || it will break */}
									{data?.logo_url && data?.logo_url?.startsWith("http") ? (
										<img
											onLoad={() => setImgLoading(false)}
											onError={() => setImgLoading(false)}
											src={data?.logo_url}
											alt={`${data?.name} icon`}
											className="h-12 w-12 sm:h-16 sm:w-16 object-cover object-center"
										/>
									) : (
										<GeneratedIcon name={data?.name} className="h-12 w-12 sm:h-16 sm:w-16" />
									)}
								</div>

								{/* App Info */}
								<div className="flex flex-col flex-1 min-w-0 gap-0.5 sm:gap-1">
									<div className="flex items-start justify-between gap-2">
										<div className="min-w-0 flex-1">
											<h1 className="text-base sm:text-xl font-semibold text-white tracking-tight truncate">
												{data?.name}
											</h1>
											{!isLocal && (
												<p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5 flex-wrap">
													<User size={11} />
													{data?.og_author && (
														<span className="truncate">{data?.og_author}</span>
													)}
													{data?.og_author && data?.author && (
														<span className="mx-0.5">•</span>
													)}
													<span
														className="text-[#BCB1E7] hover:underline cursor-pointer truncate"
														onClick={() => openLink(`${data?.author_url}`)}
													>
														{data?.author}
													</span>
												</p>
											)}
										</div>
										
										{/* Status Badge */}
										<div
											className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium whitespace-nowrap ${
												installed
													? "bg-green-500/20 text-green-400 border border-green-500/30"
													: "bg-neutral-500/20 text-neutral-400 border border-neutral-500/30"
											}`}
										>
											<div
												className={`w-1 h-1 rounded-full ${
													installed ? "bg-green-400" : "bg-neutral-400"
												}`}
											/>
											<span className="hidden sm:inline">
												{installed ? t("actions.installed") : t("actions.notInstalled")}
											</span>
											<span className="sm:hidden">
												{installed ? "✓" : "—"}
											</span>
										</div>
									</div>

									{/* Stats Row */}
									{!isLocal && (
										<div className="flex items-center gap-2 mt-1 flex-wrap">
											<div className="flex items-center gap-1 text-[10px]">
												<Download className="h-3 w-3 text-neutral-400" />
												<span className="font-medium text-[#BCB1E7]">{data.downloads?.toLocaleString() || 0}</span>
											</div>
											{data?.script_url && (
												<button
													type="button"
													onClick={() => openLink(data?.script_url)}
													className="flex items-center gap-1 text-[10px] text-[#BCB1E7] hover:underline cursor-pointer"
												>
													<BadgeCheck size={12} className="shrink-0 text-neutral-400" />
													<span>
														{data?.script_url
															.replace(
																/^https?:\/\/(raw\.githubusercontent\.com|github\.com)\//,
																"",
															)
															.split("/")
															.slice(0, 2)
															.join("/")}
													</span>
												</button>
											)}
										</div>
									)}
								</div>
							</div>

							{/* Description */}
							<p className="text-xs text-neutral-300 mt-3 sm:mt-4 leading-relaxed line-clamp-2">
								{data?.description}
							</p>

							{/* Action Buttons */}
							<div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-5">
								{isServerRunning[data?.id] ? (
									<button
										type="button"
										onClick={handleReconnect}
										className="flex-1 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-neutral-500/30 hover:bg-neutral-500/40 transition-colors duration-200 rounded-full text-white font-medium cursor-pointer border border-white/10"
									>
										{t("actions.reconnect")}
									</button>
								) : installed ? (
									<>
										{/* Start Button */}
										<div className="flex-1" ref={dropdownRef}>
											{startOptions && startOptions.starts?.length > 1 ? (
												<div className="relative">
													<button
														type="button"
														onClick={() => setDropdownOpen((v) => !v)}
														className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-white hover:bg-white/90 transition-colors duration-200 rounded-full text-black font-semibold cursor-pointer"
													>
														<Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-black" />
														<span className="hidden sm:inline">{t("actions.start")}</span>
														<span className="sm:hidden">Start</span>
														<motion.div
															animate={{ rotate: dropdownOpen ? 180 : 0 }}
															transition={{ duration: 0.2 }}
														>
															<ChevronDown size={14} />
														</motion.div>
													</button>

													{dropdownOpen && (
														<motion.div
															initial={{ opacity: 0, scale: 0.95, y: -5 }}
															animate={{ opacity: 1, scale: 1, y: 0 }}
															exit={{ opacity: 0, scale: 0.95, y: -5 }}
															transition={{ duration: 0.15 }}
															className="absolute left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
														>
															<div className="p-1">
																{startOptions.starts.map(
																	(start: any, index: number) => (
																		<button
																			type="button"
																			key={index}
																			onClick={() => {
																				handleStart(start);
																				setDropdownOpen(false);
																			}}
																			className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-150 flex flex-col gap-0.5"
																		>
																			<span className="text-xs sm:text-sm font-semibold">
																				{start.name}
																			</span>
																			{start.description && (
																				<span className="text-[10px] sm:text-xs text-neutral-400 line-clamp-1">
																					{start.description}
																				</span>
																			)}
																		</button>
																	),
																)}
															</div>
														</motion.div>
													)}
												</div>
											) : (
												<button
													type="button"
													onClick={() => handleStart()}
													className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-white hover:bg-white/90 transition-colors duration-200 rounded-full text-black font-semibold cursor-pointer"
												>
													<Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-black" />
													<span className="hidden sm:inline">{t("actions.start")}</span>
													<span className="sm:hidden">Start</span>
												</button>
											)}
										</div>

										{/* More Options */}
										<div className="relative" ref={moreMenuRef}>
											<button
												type="button"
												onClick={() => setMoreMenuOpen((v) => !v)}
												className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-full text-neutral-300 cursor-pointer border border-white/10"
											>
												<MoreHorizontal size={14} className="sm:w-4 sm:h-4" />
											</button>

											{moreMenuOpen && (
												<motion.div
													initial={{ opacity: 0, scale: 0.95, y: 5 }}
													animate={{ opacity: 1, scale: 1, y: 0 }}
													exit={{ opacity: 0, scale: 0.95, y: 5 }}
													transition={{ duration: 0.15 }}
													className="absolute right-0 bottom-full mb-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden min-w-32 sm:min-w-36"
												>
													<div className="p-1">
														<button
															type="button"
															onClick={() => {
																handleOpenEditor();
																setMoreMenuOpen(false);
															}}
															className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-150 flex items-center gap-2"
														>
															<CodeXml size={13} className="sm:w-3.5 sm:h-3.5" />
															<span className="text-xs sm:text-sm">Code</span>
														</button>
														<button
															type="button"
															onClick={() => {
																handleDeleteDeps();
																setMoreMenuOpen(false);
															}}
															className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors duration-150 flex items-center gap-2"
														>
															<Trash2 size={13} className="sm:w-3.5 sm:h-3.5" />
															<span className="text-xs sm:text-sm">{t("actions.uninstall")}</span>
														</button>
													</div>
												</motion.div>
											)}
										</div>
									</>
								) : (
									<button
										type="button"
										onClick={handleDownload}
										className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-white hover:bg-white/90 transition-colors duration-200 rounded-full text-black font-semibold cursor-pointer"
									>
										<Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
										<span className="hidden sm:inline">{t("actions.install")}</span>
										<span className="sm:hidden">Install</span>
									</button>
								)}
							</div>
						</div>
					</div>
				</motion.div>
			) : (
				<Loading />
			)}
		</AnimatePresence>
	);
}
