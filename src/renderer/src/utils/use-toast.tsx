import { Toast, type ToastProps } from "@/components/layout/toast";
import { AnimatePresence } from "framer-motion";
import React from "react";

type ToastType = Omit<ToastProps, "onClose">;

interface ToastContextType {
	addToast: (toast: ToastType) => void;
	removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
	undefined,
);

export const ToastProvider: React.FC<{
	children: React.ReactNode;
	removeAfter?: number;
}> = ({ children, removeAfter }) => {
	const seconds = removeAfter || 3000;
	const [toasts, setToasts] = React.useState<(ToastType & { id: string })[]>(
		[],
	);

	const addToast = React.useCallback((toast: ToastType) => {
		const id = Math.random().toString();
		const newToast = { ...toast, id };
		setToasts((prev) => [...prev, newToast]);
		if (toast.fixed === "false" || toast.fixed === undefined) {
			setTimeout(() => {
				removeToast(id);
			}, seconds);
		}
	}, []);

	const removeToast = React.useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ addToast, removeToast }}>
			{children}
			<div className="absolute bottom-0 right-0 p-4 space-y-4 max-h-screen overflow-hidden pointer-events-none">
				<AnimatePresence>
					{toasts.map((toast) => (
						<Toast
							key={toast.id}
							{...toast}
							onClose={() => removeToast(toast.id)}
						>
							{toast.children}
						</Toast>
					))}
				</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = React.useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
