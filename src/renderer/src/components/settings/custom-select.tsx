import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CustomSelectProps {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}

export default function CustomSelect({ value, onChange, options }: CustomSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		const handleDocumentMouseDown = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsOpen(false);
		};

		document.addEventListener("mousedown", handleDocumentMouseDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("mousedown", handleDocumentMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="bg-white/10 border text-left border-white/5 text-neutral-200 h-10 px-4 w-44 rounded-full text-sm focus:outline-none hover:bg-white/20 cursor-pointer flex items-center justify-between"
			>
				<span>{options.find((opt) => opt.value === value)?.label}</span>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.15 }}
					className="ml-2"
				>
					<ChevronDown className="w-4 h-4" />
				</motion.div>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						key="dropdown"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 5 }}
						exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
						transition={{ duration: 0.15 }}
						className="backdrop-blur-md backdrop-filter absolute z-50 mt-1 w-44 p-2 rounded-xl border border-white/5 shadow-lg bg-[#2e2d32]/90"
					>
						<div className="flex flex-col gap-1">
							{options.map((option) => (
								<button
									type="button"
									key={option.value}
									onClick={() => {
										onChange(option.value);
										setIsOpen(false);
									}}
									className={`w-full text-left rounded-xl px-4 py-2 text-sm transition-colors duration-200 
											${
												option.value !== value
													? "hover:bg-white/20 cursor-pointer text-neutral-300 hover:text-white"
													: "bg-white/20 text-white"
											}`}
								>
									{option.label}
								</button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
