import { useTranslation } from "@/translations/translation-context";
import { X } from "lucide-react";

export default function DeleteDepsModal({
	inUseDeps,
	selectedDeps,
	setSelectedDeps,
	handleUninstall,
	setDeleteDepsModal,
}: {
	inUseDeps: string[];
	selectedDeps: string[];
	setSelectedDeps: (deps: string[]) => void;
	handleUninstall: (uninstallDeps: boolean) => void;
	setDeleteDepsModal: (show: boolean) => void;
}) {
	const { t } = useTranslation();

	return (
		<div
			className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-3xl"
			style={{ zIndex: 100 }}
		>
			<div
				className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-2xl w-full backdrop-blur-md"
				style={{
					height: inUseDeps && inUseDeps.length <= 3 ? undefined : "28rem",
					minHeight: inUseDeps && inUseDeps.length <= 3 ? undefined : "16rem",
					maxHeight: inUseDeps && inUseDeps.length > 3 ? "28rem" : undefined,
				}}
			>
				<div className="flex justify-between w-full items-center">
					<h2 className="font-semibold text-lg flex items-center justify-center">
						{t("deleteLoading.uninstall.deps")}
					</h2>
					<button
						type="button"
						className="cursor-pointer z-50 flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full"
						onClick={() => setDeleteDepsModal(false)}
					>
						<X className="h-3 w-3" />
					</button>
				</div>
				<div className="pt-6 w-full h-full flex flex-col">
					<div className="flex flex-col gap-2 w-full overflow-auto border border-white/10 rounded-xl p-4">
						{inUseDeps && inUseDeps.length > 0 ? (
							inUseDeps.map((dep, index) => {
								const selected = selectedDeps.includes(dep);
								return (
									<label
										key={index}
										className={
											"flex items-center gap-3 py-2 cursor-pointer select-none"
										}
										style={{ alignItems: "flex-start" }}
									>
										<input
											type="checkbox"
											checked={selected}
											onChange={() => {
												if (selectedDeps.includes(dep)) {
													setSelectedDeps(
														selectedDeps.filter((d) => d !== dep),
													);
												} else {
													setSelectedDeps([...selectedDeps, dep]);
												}
											}}
										className="form-checkbox h-4 w-4 rounded border-white/30 bg-transparent focus:ring-0 focus:outline-none mt-0.5"
										style={{ accentColor: "var(--theme-accent)" }}
										/>
										<span className="text-xs text-neutral-300 font-medium">
											{dep}
										</span>
									</label>
								);
							})
						) : (
							<p className="text-xs text-neutral-400 text-center">
								{t("deleteLoading.error.deps")}
							</p>
						)}
					</div>
					<div className="flex justify-between mt-4">
						<div className="">
							<button
								type="button"
								className="flex items-center justify-center gap-2 p-2 text-xs border border-white/10 rounded-full text-neutral-300 font-medium py-1 text-center cursor-pointer"
								onClick={() => {
									if (selectedDeps.length === inUseDeps.length) {
										setSelectedDeps([]);
									} else {
										setSelectedDeps([...inUseDeps]);
									}
								}}
							>
								{selectedDeps.length === inUseDeps.length ? (
									<span className="font-semibold">
										{t("common.unselectAll")}
									</span>
								) : (
									<span className="font-semibold">{t("common.selectAll")}</span>
								)}
							</button>
						</div>
						<div className="flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={() => {
									setDeleteDepsModal(false);
									// handleUninstall(false);
								}}
								className="flex items-center justify-center gap-2 p-4 text-xs bg-white/10 hover:bg-white/20 transition-colors duration-400 rounded-full text-white font-semibold py-1 text-center cursor-pointer"
							>
								{t("common.cancel")}
							</button>
							<button
								type="button"
								onClick={() => {
									setDeleteDepsModal(false);
									handleUninstall(true);
								}}
								className="flex items-center justify-center gap-2 p-4 text-xs bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
							>
								<span className="font-semibold">{t("actions.uninstall")}</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
