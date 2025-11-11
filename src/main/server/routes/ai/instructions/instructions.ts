import mainPrompt from "./prompts/ollama";

export const getSysPrompt = (
	context?: string,
	contextName?: string,
	contextPath?: string,
	contextFiles?: string[],
	contextProject?: string,
) => {
	return mainPrompt(
		context,
		contextName,
		contextPath,
		contextFiles,
		contextProject,
	);
};
