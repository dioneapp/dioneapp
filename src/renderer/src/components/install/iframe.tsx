import { motion } from "framer-motion";


interface IframeProps {
    iframeSrc: string;
    handleStop: () => void;
    handleReloadIframe: () => void;
}

export default function IframeComponent({ iframeSrc, handleStop, handleReloadIframe }: IframeProps) {
    return (
        <div className="w-full h-full flex flex-col gap-2">
        <div className="w-full flex gap-2 justify-end items-center">
        <button className="w-fit flex items-center justify-center border border-white/10 p-2 cursor-pointer z-50 rounded-xl text-black font-medium" onClick={handleStop}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M320-640v320-320Zm-80 400v-480h480v480H240Zm80-80h320v-320H320v320Z"/></svg>
        </button>
        <button className="w-fit flex items-center justify-center border border-white/10 p-2 cursor-pointer z-50 rounded-xl text-black font-medium" onClick={handleReloadIframe}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>
        </button>
        </div>
        <motion.div
            key="iframe"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl h-[600px] rounded-xl overflow-hidden border border-white/10 shadow-xl"
        >
            <iframe
                id="iframe"
                src={iframeSrc}
                className="w-full h-full bg-white"
                style={{ border: 0 }}
            />
        </motion.div>
        </div>
    )
}