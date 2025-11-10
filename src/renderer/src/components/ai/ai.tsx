import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { getCurrentPort } from "@renderer/utils/getPort"

export default function AI() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<string[]>([])
    const logsEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const chat = async (prompt: string) => {
     const port = await getCurrentPort();
     const response = await fetch(`http://localhost:${port}/ai/ollama/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, model: 'llama3.2' }),
    });
        const data = await response.json();
        setMessages((prev) => [...prev, data]);
    }

  return (
    <>
    <div className="fixed bottom-8 right-8" style={{ zIndex: 1000, transition: 'all 0.3s ease' }}>
        <div className="group relative">
          {open ? (
            <div className="flex items-center justify-end w-90 gap-2">
              <input
                type="text"
                // biome-ignore lint/a11y/noAutofocus: <explanation>
                autoFocus
                className="w-full h-10 pl-4 pr-10 bg-black/20 border border-white/20 rounded-full backdrop-blur-3xl text-white placeholder-white/50 focus:outline-none focus:ring focus:ring-purple-500/50"
                placeholder="Ask AI..."
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setOpen(false);
                  }
                  if (e.key === 'Enter') {
                    chat(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <motion.div
                className="absolute inset-0 -z-10 rounded-full blur"
                style={{
                  background: "linear-gradient(45deg, #7c3aed, #6d28d9, #a855f7, #d946ef, #ec4899)",
                  backgroundSize: "400% 400%",
                  opacity: 0.4,
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
              <button type="button" onClick={() => setOpen(false)} className="cursor-pointer w-12 h-10 rounded-full bg-white/10 backdrop-blur-3xl border border-white/10 flex items-center justify-center" title="Close">
                    <X />
                </button>
            </div>
          ) : (
            <>
              <div 
                onClick={() => setOpen(true)} 
                className="h-10 w-10 overflow-hidden border border-white/5 rounded-full backdrop-blur-3xl cursor-pointer"
              >
                <motion.div
                  className="w-full h-full rounded-full blur shadow-2xl group-hover:blur-[6px] transition-all duration-300"
                  style={{
                    background: "linear-gradient(45deg, #7c3aed, #6d28d9, #a855f7, #d946ef, #ec4899)",
                    backgroundSize: "400% 400%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
              <span className="bg-black rounded text-sm blur-xl group-hover:blur-none group-hover:right-12 opacity-0 group-hover:opacity-100 transition-all duration-200 absolute right-4 top-1/2 -translate-y-1/2 px-3 whitespace-nowrap">
                Use AI
              </span>
            </>
          )}
        </div>
    </div>
    {open && (
        <div className="fixed bottom-24 right-8" style={{zIndex: 1001}}>
            <div id="logs" className="bg-black/20 backdrop-blur-3xl rounded-2xl rounded-b-none p-4 text-neutral-200 text-sm shadow-lg w-90 max-h-80 overflow-y-auto border-x border-white/5" style={{scrollbarWidth: 'none'}}>
                <div className="space-y-3">
                    {messages.map((message: any, index: number) => (
                        <div key={index}>
                            <hr className="border-white/20 mx-0 my-2" />
                            <div className="text-sm" style={{scrollSnapAlign: 'start'}}>
                                <span className="text-neutral-400 mr-2">AI - {new Date(message.created_at).toLocaleTimeString()}:</span>
                                {message.content || (message.message?.content || 'No content')}
                            </div>
                        </div>
                    ))}
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>
    )}
    </>
  )
}
