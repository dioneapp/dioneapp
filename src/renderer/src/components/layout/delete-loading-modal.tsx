import { useEffect, useRef } from "react";
import Icon from "../icons/icon";
import { motion } from "framer-motion";

export default function DeleteLoadingModal({
	status,
    onClose
}: {
	status: string;
    onClose: () => void;
}) {

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
			{status === "deleting" && (
				<div className="flex flex-col gap-14 justify-center items-center ">
                    <span><Icon name="Pending" className="h-24 w-24 animate-spin" /></span>
                    <span><h1 className="font-medium text-3xl">Uninstalling...</h1></span>
				</div>
			)}
			{status === "deleted" && (
				<div className="flex flex-col gap-2 justify-center items-center ">
                <span><Icon name="Success" className="h-24 w-24" /></span>
                <span><h1 className="font-medium text-3xl mt-12">Uninstalled <span className="text-green-500">successfully</span></h1></span>
                <span><h2 className="text-sm text-neutral-400">Closing this modal in <span ref={countdownRef} className="text-neutral-300">5</span> seconds...</h2></span>
            </div>
			)}
            {status === "error"  && (
				<div className="flex flex-col gap-2 justify-center items-center ">
                <span><Icon name="Error" className="h-24 w-24 text-red-500" /></span>
                <span><h1 className="font-medium text-3xl mt-10">An unexpected <span className="text-red-500">error</span> has ocurred</h1></span>
                <span><h2 className="text-sm text-neutral-400">Please try again later or check the logs for more information.</h2></span>
            </div>
			)}
		</motion.div>
	);
}