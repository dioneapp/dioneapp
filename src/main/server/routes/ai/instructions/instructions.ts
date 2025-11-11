import mainPrompt from "./prompts/ollama";


export const getSysPrompt = (context?: string, contextName?: string, contextPath?: string) => {
    return mainPrompt(context, contextName, contextPath);
}