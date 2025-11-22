import { networkInterfaces } from "node:os";
import logger from "@/server/utils/logger";

export function getLocalNetworkIP(): string | null {
	try {
		const nets = networkInterfaces();

		for (const name of Object.keys(nets)) {
			const netInterface = nets[name];
			if (!netInterface) continue;

			for (const net of netInterface) {
				// Skip internal (localhost) and IPv6 addresses
				const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
				if (net.family === familyV4Value && !net.internal) {
					return net.address;
				}
			}
		}

		return null;
	} catch (error) {
		logger.error("Error getting local network IP:", error);
		return null;
	}
}

export function getAllNetworkAddresses(): Array<{
	name: string;
	address: string;
	family: string;
	internal: boolean;
}> {
	try {
		const nets = networkInterfaces();
		const addresses: Array<{
			name: string;
			address: string;
			family: string;
			internal: boolean;
		}> = [];

		for (const name of Object.keys(nets)) {
			const netInterface = nets[name];
			if (!netInterface) continue;

			for (const net of netInterface) {
				const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
				if (net.family === familyV4Value) {
					addresses.push({
						name,
						address: net.address,
						family: "IPv4",
						internal: net.internal,
					});
				}
			}
		}

		return addresses;
	} catch (error) {
		logger.error("Error getting all network addresses:", error);
		return [];
	}
}
