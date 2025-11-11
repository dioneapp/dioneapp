import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function QuickAI() {
    return (
        <div className="w-full h-[calc(100vh-93px)]">
            <div className="w-full max-w-2xl h-full flex flex-col items-center justify-center mx-auto">
            <div className="flex justify-center items-center h-full w-full max-w-2xl mt-auto">
                <ul className="text-sm gap-2 flex flex-col items-start justify-start w-full text-pretty text-neutral-300 ">
                    <li className="bg-white/10 px-4 py-1 rounded-lg flex gap-2 items-center hover:text-neutral-100 cursor-pointer transition-colors duration-200">"Open FaceFusion" <ArrowRight className="ml-2" size={16} /></li>
                    <li className="bg-white/10 px-4 py-1 rounded-lg flex gap-2 items-center hover:text-neutral-100 cursor-pointer transition-colors duration-200">"Install Applio" <ArrowRight className="ml-2" size={16} /></li>
                    <li className="bg-white/10 px-4 py-1 rounded-lg flex gap-2 items-center hover:text-neutral-100 cursor-pointer transition-colors duration-200">"What is the latest application in Dione?" <ArrowRight className="ml-2" size={16} /></li>
                </ul>
                
            </div>
            <div className="w-full max-w-2xl h-full flex flex-col justify-end mx-auto items-center">
                <div className="w-full overflow-visible h-15 rounded-xl flex justify-center items-center relative">
                    <motion.div
                    className="absolute -z-10 rounded-xl h-15 w-full backdrop-blur-3xl blur-xl shadow-xl"
                    style={{
                        background:
                            "linear-gradient(45deg, #7c3aed, #6d28d9, #a855f7, #d946ef, #ec4899)",
                        backgroundSize: "400% 400%",
                        opacity: 0.12,
                    }}
                    animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        transition: {
                            duration: 8,
                            ease: "easeInOut",
                            repeat: Number.POSITIVE_INFINITY,
                        },
                    }}
                />
                    <div className="h-15 bg-white/5 backdrop-blur-3xl border border-white/5 p-4 w-full rounded-xl overflow-hidden">
                        <input className="w-full h-full outline-none border-none bg-transparent text-white" type="text" placeholder="Ask Dio..." />
                    </div>
                </div>
                <p className="mt-4 text-[11px] text-white/50">AI can make mistakes, please check important information.</p>
            </div>
            </div>
        </div>
    )
}