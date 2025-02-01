import { motion } from "framer-motion";

export default function Loading() {
    return (
        <motion.div
        key="actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-6 w-full max-w-xl overflow-auto"
    >
        <div className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-auto max-w-xl w-full backdrop-blur-md">
            <div className="absolute top-0 left-0.5/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl z-10" />
            <div className="relative z-10">
                <div className="flex gap-4">
                    <div className="flex w-full gap-2 animate-pulse">
                        <div className="h-16 w-18 rounded-xl bg-white/10" />
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-2 bg-white/10 rounded-xl w-full max-w-xs mt-1" />
                            <div className="h-2 bg-white/10 rounded-xl w-full max-w-[200px] mt-1" />
                            <div className="h-2 bg-white/10 rounded-xl w-full max-w-[100px] mt-1" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-2 w-full mt-4">
                    <div className="h-8 bg-white/10 rounded-full w-24" />
                </div>
            </div>
        </div>
    </motion.div>
    );
}