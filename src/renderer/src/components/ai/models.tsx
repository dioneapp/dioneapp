import { useScriptsContext } from "@/components/contexts/ScriptsContext";
import { apiFetch } from "@/utils/api";
import { useEffect, useState } from "react";

export default function Models({ setOllamaModel, setOllamaSupport, ollamaModel }: { setOllamaModel: (model: string) => void, setOllamaSupport: (support: any) => void, ollamaModel: string }) {
    const [downloadedModels, setDownloadedModels] = useState<any[]>([]);
    const [availableModels, setAvailableModels] = useState<any[]>([]);
    const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
    const { sockets, connectApp } = useScriptsContext();

    async function getDownloadedModels() {
        const response = await apiFetch("/ai/ollama/models", {
            method: "GET",
        });
        const data = await response.json();
        setDownloadedModels(data.models || []);
    }

    async function getAvailableModels() {
        const response = await apiFetch("/ai/ollama/available-models", {
            method: "GET",
        });
        const data = await response.json();
        setAvailableModels(data.models || []);
    }

    useEffect(() => {
        getDownloadedModels();
        getAvailableModels();

        // connect to socket
        if (!sockets["ollama"]) {
            console.log("[Models] Connecting to ollama socket...");
            connectApp("ollama", true);
        } else {
            console.log("[Models] Ollama socket already connected:", sockets["ollama"]);
        }
    }, []);

    useEffect(() => {
        const socketData = sockets["ollama"];
        if (!socketData || !socketData.socket) {
            console.log("[Models] No ollama socket available yet");
            return;
        }
        const socket = socketData.socket;
        console.log("[Models] Setting up ollama:download-progress listener");

        const handleProgress = (data: { model: string; percentage: number; status: string }) => {
            console.log("[Models] Received download progress:", data);
            if (data.status === "downloading" || data.status === "pulling") {
                setDownloadProgress(prev => ({ ...prev, [data.model]: data.percentage }));
            } else if (data.status === "verifying") {
                setDownloadProgress(prev => ({ ...prev, [data.model]: 100 }));
            } else if (data.status === "completed" || data.status === "error") {
                setDownloadProgress(prev => {
                    const newState = { ...prev };
                    delete newState[data.model];
                    return newState;
                });
                if (data.status === "completed") {
                    getDownloadedModels();
                }
            }
        };

        socket.on("ollama:download-progress", handleProgress);

        return () => {
            socket.off("ollama:download-progress", handleProgress);
        };
    }, [sockets]);

    const handleDownloadModel = async (model: string) => {
        if (downloadProgress[model] !== undefined) return;

        setDownloadProgress(prev => ({ ...prev, [model]: 0 }));

        const response = await apiFetch(`/ai/ollama/download-model?model=${model}`, {
            method: "POST",
        });
        const data = await response.json();

        if (data?.success) {
            getDownloadedModels();
            setOllamaModel(model);
        } else {
            setDownloadProgress(prev => {
                const newState = { ...prev };
                delete newState[model];
                return newState;
            });
        }
    };

    const handleSelectModel = (model: any, group: any) => {
        setOllamaModel(model.id);
        setOllamaSupport(group.support);
    };

    return (
        <section className="w-full h-full flex flex-col items-center justify-start pt-16">

            <div id="logs" className="w-full h-full max-h-[calc(100vh-23rem)] overflow-y-auto">
                <div className="w-full max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Available Models</h1>
                    {Object.entries(availableModels).map(([groupKey, group]) => (
                        <div key={groupKey} className="mb-6 w-full">
                            <h2 className="text-xl font-bold mb-2 capitalize">{groupKey}</h2>
                            <p className="text-sm text-neutral-400 mb-3 text-pretty">{group.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {group.models.map((model: { id: string; name: string; size: string }) => {
                                    const isDownloaded = downloadedModels?.some(dm => dm.name === model.id);
                                    const progress = downloadProgress[model.id];
                                    const isDownloading = progress !== undefined;

                                    return (
                                        <div
                                            onClick={() => (!isDownloaded && !isDownloading) ? handleDownloadModel(model.id) : handleSelectModel(model, group)}
                                            key={model.id}
                                            className={`p-4 rounded-xl flex flex-col items-start justify-start gap-2 shadow-sm cursor-pointer transition-colors relative overflow-hidden ${isDownloaded
                                                ? `bg-neutral-700 hover:bg-neutral-600 ${ollamaModel === model.id ? "border border-neutral-400" : ""}`
                                                : "bg-neutral-900 hover:bg-neutral-800"
                                                }`}
                                        >
                                            {isDownloading && (
                                                <div
                                                    className="absolute left-0 top-0 h-full bg-white/10 transition-all duration-300 ease-out"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            )}
                                            <div className="flex justify-between items-center w-full z-10">
                                                <h3 className="text-lg font-semibold">{model.name}</h3>
                                                {isDownloading && <span className="text-xs font-mono">{progress}%</span>}
                                            </div>
                                            <p className="text-[11px] text-neutral-400 uppercase z-10">{model.size}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>

    );
}