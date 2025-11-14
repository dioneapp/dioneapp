import { useTranslation } from "@renderer/translations/translationContext";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface EntryNameDialogProps {
	open: boolean;
	title: string;
	description?: string;
	value: string;
	placeholder?: string;
	error?: string | null;
	isSubmitting?: boolean;
	confirmLabel: string;
	onChange: (value: string) => void;
	onCancel: () => void;
	onConfirm: () => void;
}

const EntryNameDialog = ({
	open,
	title,
	description,
	value,
	placeholder,
	error,
	isSubmitting = false,
	confirmLabel,
	onChange,
	onCancel,
	onConfirm,
}: EntryNameDialogProps) => {
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!open) return;

		const frame = window.requestAnimationFrame(() => {
			if (inputRef.current) {
				inputRef.current.focus();
				inputRef.current.select();
			}
		});

		return () => window.cancelAnimationFrame(frame);
	}, [open]);

	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onCancel();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onCancel]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="w-full max-w-sm rounded-lg border border-white/10 bg-neutral-950/90 p-5 shadow-2xl">
				<h2 className="text-base font-semibold text-neutral-50">{title}</h2>
				{description && (
					<p className="mt-1 text-sm text-neutral-400">{description}</p>
				)}
				<form
					className="mt-4 space-y-4"
					onSubmit={(event) => {
						event.preventDefault();
						onConfirm();
					}}
				>
					<label className="flex flex-col gap-2 text-sm text-neutral-200">
						<span>{t("entryDialog.name")}</span>
						<input
							ref={inputRef}
							type="text"
							value={value}
							onChange={(event) => onChange(event.target.value)}
							placeholder={placeholder}
							className="w-full rounded-md border border-white/10 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-50 outline-none transition-colors focus:border-white/30 focus:bg-neutral-900/95"
							spellCheck={false}
						/>
					</label>
					{error && <p className="text-xs text-rose-400">{error}</p>}
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onCancel}
							className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-sm text-neutral-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
						>
							{t("common.cancel")}
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex items-center gap-2 rounded-md border border-indigo-400/40 bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								confirmLabel
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EntryNameDialog;
