import Messages from "@renderer/components/ai/messages";
import { getBackendPort } from "@renderer/utils/api";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

export default function QuickAI() {
	const [messages, setMessages] = useState<{ role: string; content: string }[]>(
		[],
	);
	const [ollamaStatus, setOllamaStatus] = useState("");

	const logsEndRef = useRef<HTMLDivElement>(null);

	const chat = async (prompt: string) => {
		const userMessage = { role: "user", content: prompt };
		setMessages((prev) => [...prev, userMessage]);

		try {
			const port = await getBackendPort();
			const response = await fetch(`http://localhost:${port}/ai/ollama/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt,
					model: "llama3.2",
					quickAI: true,
				}),
			});

			if (response.status === 500) {
				console.log("ollama is closed");
				setOllamaStatus("closed");
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content: "Cant connect to Ollama. Please try again later.",
					},
				]);
				return;
			}

			const data = await response.json();

			if (data?.message?.error) {
				console.log(data?.message?.error);
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: data?.message?.error },
				]);
				return;
			}

			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: data?.message?.content },
			]);
		} catch (error) {
			console.error("Error fetching data:", error);
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "An error occurred while fetching data. Please try again.",
				},
			]);
		}
	};

	return (
		<div className="w-full h-[calc(100vh-93px)]">
			<div className="w-full max-w-3xl h-full flex flex-col items-center justify-center mx-auto">
				<div className="flex justify-center items-center h-full w-full mt-auto">
					{messages.length === 0 ? (
						<ul className="text-sm gap-2 flex flex-col items-start justify-start w-full text-pretty max-w-2xl text-neutral-300 ">
							<li
								onClick={() => chat("Open FaceFusion")}
								className="bg-white/10 px-4 py-1 rounded-lg flex gap-2 items-center hover:text-neutral-100 cursor-pointer transition-colors duration-200"
							>
								"Open FaceFusion" <ArrowRight className="ml-2" size={16} />
							</li>
							<li
								onClick={() => chat("Install Applio")}
								className="bg-white/10 px-4 py-1 rounded-lg flex gap-2 items-center hover:text-neutral-100 cursor-pointer transition-colors duration-200"
							>
								"Install Applio" <ArrowRight className="ml-2" size={16} />
							</li>
							<li
								onClick={() => chat("What is the latest application in Dione?")}
								className="bg-white/10 px-4 py-1 rounded-lg flex gap-2 items-center hover:text-neutral-100 cursor-pointer transition-colors duration-200"
							>
								"What is the latest application in Dione?"{" "}
								<ArrowRight className="ml-2" size={16} />
							</li>
						</ul>
					) : (
						<div className="w-full mx-auto flex justify-center items-center">
							<div ref={logsEndRef} />
							<Messages messages={messages} logsEndRef={logsEndRef} quickAI />
						</div>
					)}
				</div>
				<div className="w-full max-w-2xl h-full flex flex-col justify-end mx-auto items-center">
					<div className="w-full overflow-visible h-20 rounded-xl flex flex-col justify-center items-center relative">
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
						{ollamaStatus === "closed" && (
							<div className="absolute right-0 -top-6 text-[11px] mb-2 flex items-center justify-end ml-auto gap-2 backdrop-blur-3xl rounded-full overflow-hidden">
								<span className="bg-red-500/10 px-2 text-red-500 font-semibold">
									Ollama not found
								</span>
							</div>
						)}
						<div className="sticky max-w-2xl h-15 bg-white/5 backdrop-blur-3xl border border-white/5 w-full rounded-xl overflow-hidden">
							<input
								className="w-full h-full outline-none border-none bg-transparent text-white px-4"
								type="text"
								placeholder="Ask Dio..."
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										chat(e.currentTarget.value);
										e.currentTarget.value = "";
									}
								}}
							/>
						</div>
					</div>
					<p className="mt-4 text-[11px] text-white/50">
						AI can make mistakes, please check important information.
					</p>
				</div>
			</div>
		</div>
	);
}
