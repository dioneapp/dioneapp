import Loading from "@/components/features/install/loading-skeleton";
import GeneratedIcon from "@/components/icons/generated-icon";
import { Textarea } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { openLink } from "@/utils/open-link";
import { reportBadContent } from "@/utils/report-bad-content";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	BadgeCheck,
	Bookmark,
	ChevronDown,
	CodeXml,
	Download,
	Flag,
	Folder,
	MoreHorizontal,
	Play,
	RefreshCcw,
	Share2,
	Trash2,
	User,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../utils/api";

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
	handleUpdate: () => void;
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
	handleUpdate,
}: ActionsProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [moreMenuOpen, setMoreMenuOpen] = useState(false);
	const [showReportMenu, setShowReportMenu] = useState(false);
	const [reportStatus, setReportStatus] = useState("");
	const [reportDetails, setReportDetails] = useState("");
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

	const handleOpenFolder = async () => {
		const settings = await apiFetch("config").then((res) => res.json());
		const sanitizedName = data.name.replace(/\s+/g, "-");
		window.electron.ipcRenderer.invoke(
			"open-dir",
			`${settings.defaultInstallFolder}/apps/${sanitizedName}`,
		);
	};

	return (
		<AnimatePresence mode="wait">
			{showReportMenu && (
				<div className="absolute bg-black/90 backdrop-blur-xs w-full h-full z-50">
					<div className="flex items-center justify-center w-full h-full">
						<div className="bg-white/10 backdrop-blur-xs w-full max-w-xl p-6 rounded-xl">
							<h2 className="text-xl font-semibold mb-4">
								{t("error.report.badContent")}
							</h2>
							<p className="mb-4 text-sm mt-6">
								{t("error.report.badContentDescription")}{" "}
								<span className="font-semibold">
									{data.name || "this project"}
								</span>
								:
							</p>
							<Textarea
								autoFocus
								disabled={
									reportStatus === "loading" || reportStatus === "reported"
								}
								value={reportDetails}
								onChange={(e) => setReportDetails(e.target.value)}
								placeholder="Add details here..."
								rows={4}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										setShowReportMenu(false);
									}
								}}
							/>
							<div className="flex items-center justify-between mt-4">
								<div className="flex gap-2 items-center text-xs rounded-xl">
									{reportStatus === "reported" && (
										<p className="text-green-500">
											{t("error.report.success")}
										</p>
									)}
									{reportStatus === "error" && (
										<p className="text-red-500">{t("error.report.failed")}</p>
									)}
									{reportStatus === "loading" && (
										<p className="text-neutral-400">
											{t("error.report.sending")}
										</p>
									)}
								</div>
								<div className="flex gap-2 items-center">
									{reportStatus !== "loading" &&
										reportStatus !== "reported" && (
											<>
												<button
													className="px-4 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-neutral-300 text-sm cursor-pointer"
													onClick={() => setShowReportMenu(false)}
												>
													{t("common.cancel")}
												</button>
												<button
													className="px-4 py-1 bg-white/30 hover:bg-white/40 transition-colors text-sm rounded-xl text-white cursor-pointer"
													onClick={async () => {
														setReportStatus("loading");
														const result = await reportBadContent("script", {
															appid: data?.id,
															details: reportDetails,
														});
														setReportStatus(result);
													}}
												>
													{t("error.report.submit")}
												</button>
											</>
										)}
									{reportStatus === "reported" && (
										<button
											className="px-4 py-1 bg-white text-black hover:bg-white/80 font-semibold transition-opacity rounded-xl text-sm cursor-pointer"
											onClick={() => {
												setShowReportMenu(false);
												setReportDetails("");
												setReportStatus("");
											}}
										>
											{t("toast.close")}
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{data ? (
				<motion.div
					key="actions-content"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					className="flex flex-col w-full max-w-xl px-4 sm:px-6"
				>
					{/* Hero Card */}
					<div className="rounded-xl border border-white/10 relative w-full">
						{/* Background with gradient */}
						<div
							className="absolute inset-0 overflow-hidden rounded-xl"
							style={{
								background:
									"linear-gradient(135deg, color-mix(in srgb, var(--theme-gradient-from) 10%, transparent), color-mix(in srgb, var(--theme-background) 50%, transparent), color-mix(in srgb, var(--theme-background) 80%, transparent))",
							}}
						/>
						<div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
							<div
								className="absolute -top-16 -right-16 w-32 sm:w-48 h-32 sm:h-48 rounded-xl blur-3xl"
								style={{
									backgroundColor:
										"color-mix(in srgb, var(--theme-accent) 20%, transparent)",
								}}
							/>
							<div
								className="absolute -bottom-8 -left-8 w-24 sm:w-32 h-24 sm:h-32 rounded-xl blur-2xl"
								style={{
									backgroundColor:
										"color-mix(in srgb, var(--theme-accent) 10%, transparent)",
								}}
							/>
						</div>

						{/* Top Bar */}
						<div className="relative z-10 flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/5">
							<button
								type="button"
								onClick={() => navigate(-1)}
								className="flex items-center gap-1 sm:gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								<span className="text-xs hidden sm:inline">
									{t("common.back")}
								</span>
							</button>

							<div className="flex items-center gap-0.5 sm:gap-1">
								{user && !isLocal && (
									<>
										<button
											type="button"
											onClick={handleShare}
											className="p-1.5 hover:bg-white/10 transition-colors rounded-xl text-neutral-400 hover:text-white cursor-pointer"
										>
											<Share2 className="h-3.5 w-3.5" />
										</button>
										<button
											type="button"
											onClick={handleSave}
											className="p-1.5 transition-colors rounded-xl cursor-pointer text-neutral-400 hover:text-white hover:bg-white/10"
											style={
												saved
													? {
															color: "var(--theme-accent)",
															backgroundColor:
																"color-mix(in srgb, var(--theme-accent) 10%, transparent)",
														}
													: {}
											}
										>
											<Bookmark
												className="h-3.5 w-3.5 transition-colors"
												style={
													saved
														? {
																fill: "var(--theme-accent)",
																color: "var(--theme-accent)",
															}
														: {}
												}
											/>
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
								<div className="relative h-12 w-12 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl sm:rounded-xl border border-white/10 shadow-lg">
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
										<GeneratedIcon
											name={data?.name}
											className="h-12 w-12 sm:h-16 sm:w-16"
										/>
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
												<div className="flex items-center gap-1 mt-0.5 flex-wrap">
													{data?.og_author && (
														<button
															type="button"
															onClick={() =>
																data?.og_author_url &&
																openLink(`${data?.og_author_url}`)
															}
															className="flex items-center gap-1 text-xs cursor-pointer hover:underline"
															style={{ color: "var(--theme-accent)" }}
														>
															<User
																size={14}
																className="shrink-0 text-neutral-400"
															/>
															<span className="truncate">
																{data?.og_author}
															</span>
														</button>
													)}
													{data?.og_author && data?.author && (
														<span className="mx-0.5 text-xs text-neutral-400">
															•
														</span>
													)}
													{data?.author && (
														<button
															type="button"
															onClick={() => openLink(`${data?.author_url}`)}
															className="flex items-center gap-1 text-xs cursor-pointer truncate hover:underline"
															style={{ color: "var(--theme-accent)" }}
														>
															{!data?.og_author && (
																<User
																	size={14}
																	className="shrink-0 text-neutral-400"
																/>
															)}
															<span>{data?.author}</span>
														</button>
													)}
												</div>
											)}
										</div>

										{/* Status Badge */}
										<div
											className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-xl text-[9px] sm:text-[10px] font-medium whitespace-nowrap border ${
												installed
													? ""
													: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
											}`}
											style={
												installed
													? {
															backgroundColor:
																"color-mix(in srgb, var(--theme-accent) 20%, transparent)",
															color: "var(--theme-accent)",
															borderColor:
																"color-mix(in srgb, var(--theme-accent) 30%, transparent)",
														}
													: {}
											}
										>
											<div
												className={`w-1 h-1 rounded-xl ${
													installed ? "" : "bg-neutral-400"
												}`}
												style={
													installed
														? { backgroundColor: "var(--theme-accent)" }
														: {}
												}
											/>
											<span className="hidden sm:inline">
												{installed
													? t("actions.installed")
													: t("actions.notInstalled")}
											</span>
											<span className="sm:hidden">{installed ? "✓" : "—"}</span>
										</div>
									</div>

									{/* Stats Row */}
									{!isLocal && (
										<div className="flex items-center gap-2 mt-1 flex-wrap">
											<div className="flex items-center gap-1 text-xs">
												<Download size={14} className="text-neutral-400" />
												<span
													className="font-medium"
													style={{ color: "var(--theme-accent)" }}
												>
													{data.downloads?.toLocaleString() || 0}
												</span>
											</div>
											{data?.script_url && (
												<button
													type="button"
													onClick={() => openLink(data?.script_url)}
													className="flex items-center gap-1.5 text-xs cursor-pointer hover:underline"
													style={{ color: "var(--theme-accent)" }}
												>
													<BadgeCheck
														size={14}
														className="shrink-0 text-neutral-400"
													/>
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
										className="flex-1 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-neutral-500/30 hover:bg-neutral-500/40 transition-colors duration-200 rounded-xl text-white font-medium cursor-pointer border border-white/10"
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
														className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-white hover:bg-white/90 transition-colors duration-200 rounded-xl text-black font-semibold cursor-pointer"
													>
														<Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-black" />
														<span className="hidden sm:inline">
															{t("actions.start")}
														</span>
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
															style={{ zIndex: 10000 }}
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
																			className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors duration-150 flex flex-col gap-0.5"
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
													className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-white hover:bg-white/90 transition-colors duration-200 rounded-xl text-black font-semibold cursor-pointer"
												>
													<Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-black" />
													<span className="hidden sm:inline">
														{t("actions.start")}
													</span>
													<span className="sm:hidden">Start</span>
												</button>
											)}
										</div>

										{/* More Options */}
										<div className="relative" ref={moreMenuRef}>
											<button
												type="button"
												onClick={() => setMoreMenuOpen((v) => !v)}
												className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-xl text-neutral-300 cursor-pointer border border-white/10"
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
															onClick={() => handleOpenFolder()}
															className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors duration-150 flex items-center gap-2"
														>
															<Folder size={13} className="sm:w-3.5 sm:h-3.5" />
															<span className="text-xs sm:text-sm">
																{t("iframe.openFolder")}
															</span>
														</button>
														<button
															type="button"
															onClick={() => {
																handleUpdate();
																setMoreMenuOpen(false);
															}}
															className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors duration-150 flex items-center gap-2"
														>
															<RefreshCcw
																size={13}
																className="sm:w-3.5 sm:h-3.5"
															/>
															<span className="text-xs sm:text-sm">Update</span>
														</button>
														<button
															type="button"
															onClick={() => {
																handleUpdate();
																setMoreMenuOpen(false);
															}}
															className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors duration-150 flex items-center gap-2"
														>
															<RefreshCcw
																size={13}
																className="sm:w-3.5 sm:h-3.5"
															/>
															<span className="text-xs sm:text-sm">Update</span>
														</button>
														<button
															type="button"
															onClick={() => {
																handleOpenEditor();
																setMoreMenuOpen(false);
															}}
															className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors duration-150 flex items-center gap-2"
														>
															<CodeXml
																size={13}
																className="sm:w-3.5 sm:h-3.5"
															/>
															<span className="text-xs sm:text-sm">Code</span>
														</button>
														{data?.id && !isLocal && (
															<button
																type="button"
																onClick={() => {
																	setShowReportMenu(true);
																}}
																className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-red-400 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors duration-150 flex items-center gap-2"
															>
																<Flag size={13} className="sm:w-3.5 sm:h-3.5" />
																<span className="text-xs sm:text-sm">
																	{t("error.report.report")}
																</span>
															</button>
														)}
														<button
															type="button"
															onClick={() => {
																handleDeleteDeps();
																setMoreMenuOpen(false);
															}}
															className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-red-400 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors duration-150 flex items-center gap-2"
														>
															<Trash2 size={13} className="sm:w-3.5 sm:h-3.5" />
															<span className="text-xs sm:text-sm">
																{t("actions.uninstall")}
															</span>
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
										className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-white hover:bg-white/90 transition-colors duration-200 rounded-xl text-black font-semibold cursor-pointer"
									>
										<Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
										<span className="hidden sm:inline">
											{t("actions.install")}
										</span>
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
