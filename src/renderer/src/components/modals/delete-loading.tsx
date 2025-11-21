import { motion } from "framer-motion";
import { CheckCircle, Loader2, X, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "../../translations/translation-context";
import { useScriptsContext } from "../contexts/ScriptsContext";

export default function DeleteLoadingModal({
	status,
	onClose,
}: {
	status: string;
	onClose: () => void;
}) {
	const { t } = useTranslation();
	const { deleteLogs } = useScriptsContext();
	const countdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (status === "deleted") {
			let time = 5;
			let id: number | undefined;

			const interval = () => {
				time--;
				if (countdownRef.current) {
					countdownRef.current.textContent = time.toString();
				}
				if (time === 0) {
					window.clearInterval(id);
					onClose();
				}
			};

			id = window.setInterval(interval, 1000);

			return () => {
				if (id) {
					window.clearInterval(id);
				}
			};
		}

		return () => {};
	}, [status]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-3xl"
			style={{ zIndex: 100 }}
		>
			<button
				type="button"
				onClick={onClose}
				className="absolute top-16 right-16 cursor-pointer"
			>
				<X className="h-8 w-8" />
			</button>
			{status === "deleting" || status === "deleting_deps" ? (
				<div className="flex flex-col gap-14 items-center">
					<Loader2 className="h-24 w-24 animate-spin" />
					<h1 className="font-medium text-3xl flex flex-col gap-2">
						{status === "deleting_deps"
							? t("deleteLoading.uninstalling.deps")
							: t("deleteLoading.uninstalling.title")}
						<span className="text-neutral-400 text-sm text-center">
							{t("deleteLoading.uninstalling.wait")}
						</span>
					</h1>
					{deleteLogs.length > 0 && (
						<div className="flex flex-col gap-2 p-4 border border-white/20 rounded max-h-24 max-w-1/2 overflow-auto">
							{deleteLogs.map((log, i) => (
								<p key={i} className="text-xs">
									{log.content}
								</p>
							))}
						</div>
					)}
				</div>
			) : status === "deleted" ? (
				<div className="flex flex-col gap-2 items-center">
					<CheckCircle className="h-24 w-24 text-green-500" />
					<h1 className="font-medium text-3xl mt-12">
						{t("deleteLoading.success.title")}{" "}
						<span className="text-green-500">
							{t("deleteLoading.success.subtitle")}
						</span>
					</h1>
					<h2 className="text-sm text-neutral-400">
						{t("deleteLoading.success.closing")}{" "}
						<span ref={countdownRef} className="text-neutral-300">
							5
						</span>{" "}
						{t("deleteLoading.success.seconds")}
					</h2>
				</div>
			) : status?.startsWith("error") ? (
				<div className="flex flex-col gap-2 items-center">
					<XCircle className="h-24 w-24 text-red-500" />
					<h1 className="font-medium text-3xl mt-10">
						{t("deleteLoading.error.title")}{" "}
						<span className="text-red-500">
							{t("deleteLoading.error.subtitle")}
						</span>{" "}
						{t("deleteLoading.error.hasOccurred")}
					</h1>
					<h2 className="text-sm text-neutral-400">
						{status === "error_deps"
							? t("deleteLoading.error.deps")
							: t("deleteLoading.error.general")}
					</h2>
				</div>
			) : (
				<div className="flex flex-col gap-2 items-center">
					<Loader2 className="h-24 w-24 animate-spin" />
					<h1 className="font-medium text-3xl mt-10 text-neutral-300">
						{t("deleteLoading.loading.title")}
					</h1>
					<h2 className="text-sm text-neutral-400 text-center">
						{t("deleteLoading.loading.wait")}
					</h2>
				</div>
			)}
		</motion.div>
	);
}
