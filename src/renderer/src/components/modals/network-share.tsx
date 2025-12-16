import { useTranslation } from "@/translations/translation-context";
import { getBackendPort } from "@/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

interface NetworkShareModalProps {
	isOpen: boolean;
	onClose: () => void;
	targetPort?: number;
	tunnelInfo: TunnelInfo | null;
	setTunnelInfo: React.Dispatch<React.SetStateAction<any | null>>;
}

type ShareMode = "local" | "public";

interface TunnelInfo {
	url: string;
	type: "localtunnel" | "cloudflare";
	status: "active" | "connecting" | "error";
	password?: string;
	shortUrl?: string;
}

export default function NetworkShareModal({
	isOpen,
	onClose,
	targetPort,
	tunnelInfo,
	setTunnelInfo,
}: NetworkShareModalProps) {
	const { t } = useTranslation();
	const [shareMode, setShareMode] = useState<ShareMode>("local");
	const [localUrl, setLocalUrl] = useState<string>("");
	const [copied, setCopied] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [port, setPort] = useState<number | null>(null);
	const [startingTunnel, setStartingTunnel] = useState(false);

	useEffect(() => {
		if (isOpen) {
			loadNetworkInfo();
			checkActiveTunnel();
		}
	}, [targetPort, isOpen]);

	const loadNetworkInfo = async () => {
		try {
			setError(null);

			const currentPort = targetPort || (await getBackendPort());
			setPort(currentPort);

			const networkInfo = await window.electron.ipcRenderer.invoke(
				"get-network-address",
				currentPort,
			);

			if (networkInfo) {
				setLocalUrl(networkInfo.url);
			} else {
				setError(
					"Unable to get network address. Please check your connection.",
				);
			}
		} catch (err) {
			console.error("Error loading network info:", err);
			setError("Failed to load network information.");
		} finally {
			setInitialLoading(false);
		}
	};

	const checkActiveTunnel = async () => {
		try {
			const currentTunnel = await window.api.getCurrentTunnel();
			if (currentTunnel) {
				setTunnelInfo(currentTunnel);
				setShareMode("public");
			}
		} catch (err) {
			console.error("Error checking active tunnel:", err);
		}
	};

	const startPublicTunnel = async () => {
		try {
			setStartingTunnel(true);
			setError(null);

			const tunnel = await window.api.startTunnel(
				"localtunnel",
				port || undefined,
			);

			try {
				const shortUrl = await window.api.shortenUrl(tunnel.url);
				if (shortUrl) {
					tunnel.shortUrl = shortUrl;
				}
			} catch (err) {
				console.error("Error creating shortened URL:", err);
			}

			setTunnelInfo(tunnel);
			setShareMode("public");
		} catch (err: any) {
			console.error("Error starting tunnel:", err);
			setError(err.message || "Failed to start tunnel");
			setShareMode("local");
		} finally {
			setStartingTunnel(false);
		}
	};

	const stopActiveTunnel = async () => {
		try {
			await window.api.stopTunnel();
			setTunnelInfo(null);
			setShareMode("local");
		} catch (err) {
			console.error("Error stopping tunnel:", err);
		}
	};

	const handleCopy = async () => {
		let urlToCopy = "";

		if (shareMode === "local") {
			urlToCopy = localUrl;
		} else if (tunnelInfo) {
			// Prioritize short URL if available
			urlToCopy = tunnelInfo.shortUrl || tunnelInfo.url;
		}

		if (!urlToCopy) {
			setError("No URL available to copy.");
			return;
		}

		try {
			await window.copyToClipboard.writeText(urlToCopy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
			setError("Failed to copy to clipboard.");
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
					onClick={onClose}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex w-full items-center justify-between px-5 py-4">
							<h3 className="text-base font-semibold text-white">
								{t("networkShare.title")}
							</h3>
							<button
								type="button"
								onClick={onClose}
								className="p-1.5 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
							>
								<X className="w-4 h-4 text-neutral-400" />
							</button>
						</div>

						<div className="p-5 space-y-4">
							<div className="grid grid-cols-2 gap-2 p-1 bg-black/30 rounded-lg">
								<button
									type="button"
									onClick={() => {
										if (tunnelInfo) stopActiveTunnel();
										setShareMode("local");
									}}
									className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
										shareMode === "local"
											? "bg-white text-black shadow-sm"
											: "text-neutral-400 hover:text-neutral-200"
									}`}
								>
									{t("networkShare.modes.local")}
								</button>
								<button
									type="button"
									onClick={() => {
										if (tunnelInfo) {
											stopActiveTunnel();
										} else {
											startPublicTunnel();
										}
									}}
									disabled={startingTunnel}
									className={`px-4 py-2.5 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 ${
										shareMode === "public"
											? "bg-white text-black shadow-sm"
											: "text-neutral-400 hover:text-neutral-200"
									} ${startingTunnel ? "opacity-50 cursor-not-allowed" : ""}`}
								>
									{t("networkShare.modes.public")}
								</button>
							</div>

							<div className="min-h-[200px]">
								{startingTunnel && (
									<div className="space-y-3">
										<div className="bg-black/30 rounded-lg px-3 py-2.5 h-[42px] animate-pulse">
											<div className="h-4 bg-white/10 rounded w-3/4"></div>
										</div>
										<div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 space-y-2 animate-pulse">
											<div className="h-3 bg-purple-500/20 rounded w-24"></div>
											<div className="h-6 bg-purple-500/20 rounded"></div>
											<div className="h-2 bg-purple-500/20 rounded w-4/5"></div>
										</div>
									</div>
								)}

								{!startingTunnel &&
									(initialLoading ? (
										<div className="space-y-3 animate-pulse">
											<div className="bg-black/30 rounded-lg px-3 py-2.5 h-[42px]">
												<div className="h-4 bg-white/10 rounded w-3/4"></div>
											</div>
											<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 h-[60px]">
												<div className="h-3 bg-blue-500/20 rounded w-full mb-2"></div>
												<div className="h-3 bg-blue-500/20 rounded w-2/3"></div>
											</div>
										</div>
									) : error ? (
										<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-200 text-xs">
											{error}
										</div>
									) : (
										<>
											{shareMode === "local" && localUrl && (
												<div className="space-y-3">
													<div className="flex items-center justify-center pb-2">
														<div className="bg-black/30 p-4 rounded-xl border border-white/5">
															<QRCodeSVG
																value={localUrl}
																size={180}
																level="H"
																fgColor="#ffffff"
																bgColor="transparent"
															/>
														</div>
													</div>
													<div className="space-y-2">
														<label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
															{t("networkShare.local.shareUrl") || "Share URL"}
														</label>
														<div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2.5 border border-white/5">
															<input
																type="text"
																readOnly
																value={localUrl}
																className="flex-1 select-all bg-transparent text-neutral-200 text-sm font-mono focus:outline-none cursor-text"
															/>
															<button
																type="button"
																onClick={handleCopy}
																className="p-1.5 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
															>
																{copied ? (
																	<Check className="w-4 h-4 text-green-400" />
																) : (
																	<Copy className="w-4 h-4 text-neutral-400" />
																)}
															</button>
														</div>
														<p className="text-xs text-neutral-500">
															{t("networkShare.local.urlDescription") ||
																"Share this URL with devices on your local network"}
														</p>
													</div>
													<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
														<p className="text-blue-200 text-xs wrap-break-word">
															<strong>
																{t("networkShare.local.localNetwork")}
															</strong>{" "}
															{t("networkShare.local.description")}
														</p>
													</div>
												</div>
											)}

											{shareMode === "public" && tunnelInfo && (
												<div className="space-y-3">
													<div className="flex items-center justify-center pb-2">
														<div className="bg-black/30 p-4 rounded-xl border border-white/5">
															<QRCodeSVG
																value={tunnelInfo.shortUrl || tunnelInfo.url}
																size={180}
																level="H"
																fgColor="#ffffff"
																bgColor="transparent"
															/>
														</div>
													</div>
													<div className="space-y-2">
														<label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
															{t("networkShare.public.shareUrl")}
														</label>
														<div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2.5 border border-white/5">
															<input
																type="text"
																readOnly
																value={tunnelInfo.shortUrl || tunnelInfo.url}
																className="flex-1 bg-transparent text-neutral-200 text-sm font-mono focus:outline-none cursor-text"
															/>
															<button
																type="button"
																onClick={handleCopy}
																className="p-1.5 cursor-pointer hover:bg-white/10 rounded-md transition-colors"
															>
																{copied ? (
																	<Check className="w-4 h-4 text-green-400" />
																) : (
																	<Copy className="w-4 h-4 text-neutral-400" />
																)}
															</button>
														</div>
														<p className="text-xs text-neutral-500">
															{t("networkShare.public.urlDescription")}
														</p>
													</div>{" "}
													{tunnelInfo.password && (
														<div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 space-y-2">
															<p className="text-purple-200 text-xs font-medium">
																{t("networkShare.public.passwordTitle")}
															</p>
															<div className="flex items-center gap-2 bg-black/30 rounded px-2 py-1.5 group">
																<code className="flex-1 text-purple-300 font-mono text-xs blur-sm group-hover:blur-none transition-all duration-200 select-none group-hover:select-text">
																	{tunnelInfo.password}
																</code>
																<button
																	type="button"
																	onClick={() => {
																		window.copyToClipboard.writeText(
																			tunnelInfo.password || "",
																		);
																		setCopied(true);
																		setTimeout(() => setCopied(false), 2000);
																	}}
																	className="p-1 cursor-pointer hover:bg-white/10 rounded transition-colors"
																>
																	<Copy className="w-3.5 h-3.5 text-purple-300" />
																</button>
															</div>
															<p className="text-purple-300/60 text-xs">
																{t("networkShare.public.visitorMessage")}
															</p>
														</div>
													)}
													<div className="flex items-center justify-end pt-1">
														<button
															type="button"
															onClick={stopActiveTunnel}
															className="text-xs cursor-pointer px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition-colors font-medium"
														>
															{t("networkShare.public.stopSharing")}
														</button>
													</div>
												</div>
											)}
										</>
									))}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
