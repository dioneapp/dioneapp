import { apiFetch } from "@/utils/api";
import { useEffect, useState } from "react";
export default function Models({ setOllamaModel, ollamaModel }: { setOllamaModel: (model: string) => void, ollamaModel: string }) {
    const [downloadedModels, setDownloadedModels] = useState<any[]>([]);
    const [availableModels, setAvailableModels] = useState<any[]>([]);

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
    }, []);

    const handleDownloadModel = async (model: string) => {
        const response = await apiFetch(`/ai/ollama/download-model?model=${model}`, {
            method: "POST",
        });
        const data = await response.json();

        if (data?.success) {
            getDownloadedModels();
            setOllamaModel(model);
        }
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
                                    return (
                                        <div
                                            onClick={() => (!isDownloaded) ? handleDownloadModel(model.id) : setOllamaModel(model.id)}
                                            key={model.id}
                                            className={`p-4 rounded-xl flex items-start justify-start gap-2 shadow-sm cursor-pointer transition-colors ${isDownloaded
                                                ? `bg-neutral-700 hover:bg-neutral-600 ${ollamaModel === model.id ? "border border-neutral-400" : ""}`
                                                : "bg-neutral-900 hover:bg-neutral-800"
                                                }`}
                                        >
                                            <h3 className="text-lg font-semibold">{model.name}</h3>
                                            <p className="text-[11px] text-neutral-400 uppercase">{model.size}</p>
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