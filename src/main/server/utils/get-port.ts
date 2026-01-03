export const getAvailablePort = async (): Promise<number> => {
	try {
		const { default: getPort } = await import("get-port");
		return await getPort();
	} catch (error) {
		console.error("Error finding available port:", error);
		throw new Error("Unable to find available port");
	}
};
