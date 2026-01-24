import type { Variable } from "../types/dione-types";

/**
 * Enhances the system environment with user-defined variables
 * - PATH: appends with colon separator
 * - Other existing vars: appends with space separator
 * - New vars: sets directly
 * - Never overrides existing values, only enhances them
 */
export function customEnvironment(
	systemEnv: Record<string, string>,
	variables: Variable[],
): Record<string, string> {
	const enhanced = { ...systemEnv };

	for (const { key, value } of variables) {
		if (key === "PATH") {
			enhanced[key] = enhanced[key] ? `${enhanced[key]}:${value}` : value;
		} else if (enhanced[key]) {
			enhanced[key] = `${enhanced[key]} ${value}`;
		} else {
			enhanced[key] = value;
		}
	}

	return enhanced;
}
