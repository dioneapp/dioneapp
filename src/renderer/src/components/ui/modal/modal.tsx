import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
	showCloseButton?: boolean;
	closeOnBackdropClick?: boolean;
	closeOnEscape?: boolean;
}

const maxWidthClasses = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	full: "max-w-full",
};

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	maxWidth = "xl",
	showCloseButton = true,
	closeOnBackdropClick = true,
	closeOnEscape = true,
}: ModalProps) {
	useEffect(() => {
		if (!isOpen || !closeOnEscape) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose, closeOnEscape]);

	const modalContent = (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 w-full h-full z-50 flex justify-center items-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={closeOnBackdropClick ? onClose : undefined}
						className="fixed inset-0 backdrop-blur-sm bg-[#080808]/80"
					/>

					{/* Modal Content */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className={`relative ${maxWidthClasses[maxWidth]} w-full border border-white/10 rounded-xl bg-[#080808] flex flex-col overflow-hidden mx-auto my-auto`}
					>
						{/* Header */}
						{(title || showCloseButton) && (
							<div className="p-6 pb-0 flex items-center justify-between">
								{title && (
									<h2 className="text-xl font-semibold text-white w-full">{title}</h2>
								)}
								{showCloseButton && (
									<button
										onClick={onClose}
										className="ml-auto p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition-colors duration-200 cursor-pointer"
										type="button"
									>
										<X className="w-5 h-5" />
									</button>
								)}
							</div>
						)}

						{/* Body */}
						<div className="p-6 relative z-10">{children}</div>

						{/* Background effects */}
						<div className="absolute w-full h-full overflow-hidden pointer-events-none">
							<div
								className="absolute top-0 left-2/4 w-32 h-32 rounded-xl -translate-y-1/2 blur-3xl"
								style={{ backgroundColor: "var(--theme-blur)" }}
							/>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);

	return createPortal(modalContent, document.body);
}

interface ModalFooterProps {
	children: React.ReactNode;
	className?: string;
}

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
	return (
		<div className={`mt-4 flex justify-end gap-2 ${className}`}>{children}</div>
	);
}

interface ModalBodyProps {
	children: React.ReactNode;
	className?: string;
}

export function ModalBody({ children, className = "" }: ModalBodyProps) {
	return <div className={`flex flex-col gap-4 ${className}`}>{children}</div>;
}
