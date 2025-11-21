import codePrompt from "@/server/routes/ai/instructions/prompts/code";
import generalPrompt from "@/server/routes/ai/instructions/prompts/general";

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
