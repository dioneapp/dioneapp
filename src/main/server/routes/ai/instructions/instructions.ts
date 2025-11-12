import codePrompt from "./prompts/code";
import generalPrompt from "./prompts/general";

export const getSysPrompt = (
	context?: string,
	contextName?: string,
	contextPath?: string,
	contextFiles?: string[],
	contextProject?: string,
	quickAI?: boolean,
) => {
	if (!quickAI) {
		return codePrompt(
			context,
			contextName,
			contextPath,
			contextFiles,
			contextProject,
		);
	} 
	return generalPrompt();
};
