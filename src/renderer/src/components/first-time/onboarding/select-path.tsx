import { useTranslation } from "@renderer/translations/translationContext";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function SelectPath({ onFinish }: { onFinish: () => void }) {
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { t } = useTranslation();

    const handlePathSelection = async () => {
        setError(null);
        setSelectedPath(null);
        setSuccess(false);
        const result = await window.electron.ipcRenderer.invoke("save-dir");

        if (!result.canceled) {
                setSelectedPath(result.filePaths[0]);
            if (result) {
                setError(null);
                const accept = await window.electron.ipcRenderer.invoke("check-dir", result.filePaths[0]);

                if (accept) {
                    const configUpdated1 = await window.electron.ipcRenderer.invoke("update-config", { defaultBinFolder: result.filePaths[0] });
                    const configUpdated2 = await window.electron.ipcRenderer.invoke("update-config", { defaultInstallFolder: result.filePaths[0] });

                    if (configUpdated1 && configUpdated2) {
                        setSuccess(true);
                    } else {
                        setError("An error occurred while updating the configuration. Please try again.");
                    }
                } else {
                    setError("To avoid errors on new updates, choose a different path than the Dione executable.");
                }
            } else {
                setError("An error occurred while selecting the path. Please try again.");
            }
        } 
    }

    return (
        <AnimatePresence>
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
			<div className="flex flex-col items-center justify-center h-full w-full max-w-screen-lg">
				<motion.h1 className="text-5xl font-semibold text-center">
					{t("firstTime.selectPath.title")}
				</motion.h1>
                <div className="w-full h-44 max-w-xl min-w-xl truncate mt-12 mb-2">
                    <button onClick={handlePathSelection} className="focus:outline-none focus:ring-0 px-4 cursor-pointer active:scale-[0.97] w-full h-full bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 border-dashed transition-all duration-150 backdrop-blur-sm">
                        <span className="text-neutral-300 font-mono text-sm">{selectedPath !== null ? selectedPath : t("firstTime.selectPath.button")}</span>
                    </button>
                </div>
                {error && (<motion.span initial={{ opacity: 0, y: -10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }} transition={{ duration: 0.3 }} className="bg-red-500/10 w-full rounded-lg max-w-xl text-center text-balance p-2 text-xs text-neutral-300 backdrop-blur-sm">{error}</motion.span>)}
			{success && (
                <motion.button onClick={onFinish} initial={{ opacity: 0, y: 0, filter: "blur(20px)" }} animate={{ opacity: 1, y: 50, filter: "blur(0px)" }} exit={{ opacity: 0, y: -50, filter: "blur(20px)" }} transition={{ duration: 0.35 }} className="px-4 bg-white text-black font-medium py-1 rounded-full text-sm active:scale-[0.97] cursor-pointer">
                    {t("firstTime.selectPath.success")}
                </motion.button>
            )}
            </div>
		</section>
        </AnimatePresence>
	)
}