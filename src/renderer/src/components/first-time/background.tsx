import { motion } from "framer-motion";

export default function Background() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 2, delay: 0.5 }}
		>
			<motion.div
				className="absolute left-1/4 -top-18 w-32 h-32 bg-[#BCB1E7] rounded-full blur-3xl z-10"
				animate={{
					x: [0, 200, 100, -100, 0],
					y: [0, -100, 100, 0, 0],
				}}
				transition={{
					duration: 30,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute right-1/6 -bottom-24 w-32 h-32 bg-[#BCB1E7] rounded-full blur-3xl z-10"
				animate={{
					x: [0, -150, 0, 150, 0],
					y: [0, 100, -100, 50, 0],
				}}
				transition={{
					duration: 35,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute -left-16 bottom-24 w-32 h-32 bg-[#BCB1E7] rounded-full blur-3xl z-10"
				animate={{
					x: [0, 200, -100, 100, 0],
					y: [0, 50, -150, 100, 0],
				}}
				transition={{
					duration: 32,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className="absolute -right-12 top-24 w-32 h-32 bg-[#BCB1E7] rounded-full blur-3xl z-10"
				animate={{
					x: [0, -200, 100, -100, 0],
					y: [0, -50, 150, -100, 0],
				}}
				transition={{
					duration: 38,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			/>
		</motion.div>
	);
}
