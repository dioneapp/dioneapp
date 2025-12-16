import { apiFetch } from "./api";

export const reportBadContent = async (
	type: "script" | "ai",
	script?: Record<string, any>,
	ai?: Record<string, any>,
) => {
	const report = {
		type,
		script,
		ai,
		timestamp: new Date().toISOString(),
	};

	const response = await apiFetch("/report", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(report),
	});

	if (!response.ok || response.status !== 200) {
		return "error";
	}

	return "reported";
};
