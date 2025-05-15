import { useEffect, useRef } from "react";
import Icon from "../icons/icon";
import { motion } from "framer-motion";
import { useAppContext } from "./global-context";

export default function DeleteLoadingModal({
	status,
    onClose
}: {
	status: string;
    onClose: () => void;
}) {
    const { deleteLogs } = useAppContext();
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
                <Icon name="Close" className="h-4 w-4" />
            </button>
			{status === "deleting" || status === "deleting_deps" && (
				<div className="flex flex-col gap-14 justify-center items-center ">
                    <span><Icon name="Pending" className="h-24 w-24 animate-spin" /></span>
                    <h1 className="font-medium text-3xl">{status === "deleting_deps" ? "Uninstalling dependencies" : "Uninstalling"} <span className="text-neutral-300">please wait...</span></h1>
                    <span className="flex flex-col gap-2 text-xs items-start justify-center p-4 border border-white/20 rounded max-h-24 max-w-2/4 overflow-auto">
                    {deleteLogs.map((log, index) => (
                        <p key={index}>{log.content}</p>
                    ))}
                    </span>
                </div>
			)}
			{status === "deleted" && (
				<div className="flex flex-col gap-2 justify-center items-center ">
                <span><Icon name="Success" className="h-24 w-24" /></span>
                <h1 className="font-medium text-3xl mt-12">Uninstalled <span className="text-green-500">successfully</span></h1>
                <h2 className="text-sm text-neutral-400">Closing this modal in <span ref={countdownRef} className="text-neutral-300">5</span> seconds...</h2>
            </div>
			)}
            {status === "error" || status === "error_deps" && (
				<div className="flex flex-col gap-2 justify-center items-center ">
                <span><Icon name="Error" className="h-24 w-24 text-red-500" /></span>
                <h1 className="font-medium text-3xl mt-10">An unexpected <span className="text-red-500">error</span> has ocurred</h1>
                <h2 className="text-sm text-neutral-400">{status === "error_deps" ? "Dione has not been able to remove any dependency, please do it manually." : "Please try again later or check the logs for more information."}</h2>
            </div>
			)}
		</motion.div>
	);
}