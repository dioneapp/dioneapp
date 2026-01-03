import { motion } from "framer-motion";
import * as React from "react";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
	variant: "default" | "success" | "error" | "warning";
	fixed?: string;
	onClose: () => void;
	button?: boolean;
	buttonText?: string;
	buttonAction?: () => void;
	removeAfter?: number;
}

const variantClasses = {
	default: "bg-neutral-700/80",
	success: "bg-green-500/20",
	error: "bg-red-500/20",
	warning: "bg-yellow-500/20",
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
	(
		{
			className,
			variant,
			onClose,
			children,
			button,
			buttonText,
			buttonAction,
			removeAfter,
			...props
		},
		ref,
	) => {
		return (
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 50 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				style={{ zIndex: 1000 }}
				ref={ref}
				className={`pointer-events-auto p-2 flex w-full max-w-md backdrop-blur-3xl backdrop-filter ${button ? "flex-col rounded-xl p-4 px-6 pb-0 gap-2" : "gap-4 rounded-xl justify-between items-center"} ease-in-out ${variantClasses[variant]} ${className} overflow-hidden`}
				{...(props as any)}
			>
				<div
					className={`flex text-xs ${button ? "" : "px-6"} text-neutral-300`}
				>
					{children}
				</div>
				<div
					className={
						button ? "gap-2 my-2 w-full flex justify-end items-end mx-auto" : ""
					}
				>
					<button
						type="button"
						onClick={onClose}
						className={`flex  ${button ? "" : "items-center justify-center p-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"}`}
					>
						{!button && (
							<svg
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 flex justify-center items-center mb-auto"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						)}
					</button>
					{button && (
						<button
							type="button"
							onClick={() => {
								buttonAction?.();
								onClose();
							}}
							className="text-xs bg-neutral-800 rounded-xl border border-white/10 px-4 py-1 z-50 cursor-pointer hover:bg-neutral-700 transition-colors duration-300"
						>
							{buttonText}
						</button>
					)}
				</div>
			</motion.div>
		);
	},
);
Toast.displayName = "Toast";
