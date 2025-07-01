import { openLink } from "@renderer/utils/openLink";
import { motion } from "framer-motion";
import { BadgeCheck, User } from "lucide-react";
import { useTranslation } from "../../translations/translationContext";
import Loading from "./loading-skeleton";

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
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{
							type: "spring",
							stiffness: 100,
							damping: 20,
						}}
						className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-auto max-w-xl w-full bg-[#080808]/60 backdrop-filter backdrop-blur-sm"
					>
						{/* background effects */}
						<div className="absolute top-0 left-1/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl z-50" />
						<div className="relative z-10">
							<div className="flex gap-4">
								<div className="relative h-16 w-16 flex-shrink-0">
									{/* biome-ignore lint/complexity/useOptionalChain: if you change && to || it will break */}
									{data?.logo_url && data?.logo_url?.startsWith("http") ? (
										<img
											onLoad={() => setImgLoading(false)}
											onError={() => setImgLoading(false)}
											src={data?.logo_url}
											alt={`${data?.name} icon`}
											className="h-16 w-16 rounded-xl border border-white/10 object-cover object-center transition-all duration-200"
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
												className="h-16 w-16 rounded-xl border border-white/10 bg-cover bg-center group-hover:border-white/20 transition-all duration-200"
											/>
										)
									)}
									{isLocal && (
										<div
											className="h-16 w-16 rounded-xl border border-white/10 bg-cover bg-center group-hover:border-white/20 transition-all duration-200 flex items-center justify-center bg-neutral-900"
										>
											<span className="text-white/70 font-semibold text-xl">
												{data?.name?.charAt(0)?.toUpperCase() || "?"}
											</span>
										</div>
									)}
								</div>
								<div className="flex flex-col">
									<h1 className="text-2xl font-medium mb-1 truncate text-white">
										{data?.name}
									</h1>
									{!isLocal && (
										<>
											<p
												className="text-xs text-[#BCB1E7] mb-1 flex gap-1 hover:underline w-full cursor-pointer text-justify max-w-md"
												onClick={() => openLink(data?.script_url)}
											>
												<span className="w-fit h-full flex items-center justify-center">
													<BadgeCheck size={16} />
												</span>
												{!isLocal &&
													data?.script_url &&
													data?.script_url.replace(
														/^https?:\/\/(raw\.githubusercontent\.com|github\.com)\//,
														"",
													)}
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
					</motion.div>
				) : (
					<Loading />
				)}
			</motion.div>
		</>
	);
}
