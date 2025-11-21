import { readDioneConfig } from "@/server/scripts/dependencies/dependencies";
import logger from "@/server/utils/logger";
import si from "systeminformation";

export async function getSystemInfo() {
	let os;
	let gpu = "unknown";

	try {
		const gpus = (await si.graphics()).controllers;
		const mainGPU = gpus.find((gpu) => /nvidia|amd/i.test(gpu.vendor));
		if (mainGPU) {
			if (/nvidia/i.test(mainGPU.vendor)) {
				gpu = "nvidia";
			} else if (/amd/i.test(mainGPU.vendor)) {
				gpu = "amd";
			}
		}
		os = (await si.osInfo()).platform;
	} catch (error) {
		logger.error(`Error getting system info: ${error}`);
	}

	return { os, gpu };
}

export async function checkSystem(FILE_PATH: string) {
	const dioneConfig = await readDioneConfig(FILE_PATH);
	const { os, gpu } = await getSystemInfo();

	logger.info(`Using: ${os}, required: ${dioneConfig.requirements?.os}`);
	logger.info(`Using: ${gpu}, required: ${dioneConfig.requirements?.gpus}`);

	if (dioneConfig.requirements) {
		if (dioneConfig.requirements.os && dioneConfig.requirements.os.length > 0) {
			if (!dioneConfig.requirements.os.includes(os.toLowerCase())) {
				logger.error(`OS ${os} is not supported`);
				return {
					success: false,
					reasons: ["os-not-supported"],
				};
			}
		}
		if (
			dioneConfig.requirements.gpus &&
			dioneConfig.requirements.gpus.length > 0
		) {
			if (!dioneConfig.requirements.gpus.includes(gpu.toLowerCase())) {
				logger.error(`GPU ${gpu} is not supported`);
				return {
					success: false,
					reasons: ["gpu-not-supported"],
				};
			}
		}
	}
	return {
		success: true,
	};
}
