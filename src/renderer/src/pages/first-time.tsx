import Icon from "@renderer/components/icons/icon";
import { openLink } from "@renderer/utils/openLink";
import { useToast } from "@renderer/utils/useToast";

export default function FirstTime() {
    // toast stuff
    const { addToast } = useToast()
    const showToast = (variant: "default" | "success" | "error" | "warning", message: string, fixed?: "true" | "false") => {
        addToast({
            variant,
            children: message,
            fixed
        })
    }   

    const copyToClipboard = () => {
        navigator.clipboard.writeText("https://getdione.app/auth/login")
        showToast("success", "Copied to the clipboard correctly, now paste it in your browser!")
    }

    return (
        <div className="absolute w-screen h-screen inset-0 z-50 bg-[#080808]/5 overflow-hidden">
            {/* background stuff */}
            <div>
                <div className="absolute -top-4 left-1/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl z-10" />
                <div className="absolute -bottom-24 right-1/4 w-32 h-32 bg-[#BCB1E7] rounded-full blur-3xl z-10" />
                <div className="absolute -bottom-24 rotate-45 left-4 w-32 h-32 bg-[#BCB1E7] rounded-full blur-3xl z-10" />
                <div className="absolute top-24 rotate-45 right-4 w-32 h-32 bg-[#BCB1E7] rounded-full blur-3xl z-10" />
            </div>
            <div className="w-full h-full flex flex-col  items-center justify-center">
                <div className="flex flex-col gap-4 justify-center items-center">
                <Icon name="Dio" className="w-20 h-20 animate-bounce mb-2"/>
                <h1 className="text-6xl font-semibold">Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-t from-white via-[#BCB1E7] to-[#BCB1E7]">Dione</span></h1>
                <h2 className="text-neutral-400 text-balance text-center max-w-xl">Thank you for joining us early on this journey. Log into your account to get started.</h2>
                </div>
                <div className="mt-12 flex flex-col gap-4">
                <button className="bg-white/10 w-28 rounded-full p-1.5 border border-white/10 text-sm text-neutral-300 hover:bg-white/20 transition-colors duration-300 cursor-pointer" onClick={() => openLink("https://getdione.app/auth/login")}>
                    Log in
                </button>
                <button className="text-xs text-white opacity-50 flex items-center justify-center gap-1 hover:opacity-80 transition-opacity duration-300" onClick={copyToClipboard}>
                    <span><Icon name="Link" className="w-4 h-4"/></span>
                    <span>Copy Link</span>
                </button>
                </div>
            </div>
        </div>  
    )
}