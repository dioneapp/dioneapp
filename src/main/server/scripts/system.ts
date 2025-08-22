import si from "systeminformation";
import logger from "../utils/logger";
import { readDioneConfig } from "./dependencies/dependencies";

export async function getSystemInfo() {
	let os;
	let gpu = "cpu"; // Default to CPU if no GPU detected

	try {
		const gpus = (await si.graphics()).controllers;
		
		// Check if there are any GPUs at all
		if (!gpus || gpus.length === 0) {
			logger.info("No GPU detected, using CPU-only mode");
			gpu = "cpu";
		} else {
			// Check all GPUs, not just the first one
			let foundGpu = false;
			for (const controller of gpus) {
				// Check vendor and model for GPU identification
				const vendorAndModel = `${controller.vendor} ${controller.model}`.toLowerCase();
				
				// More comprehensive GPU detection
				if (/nvidia/i.test(vendorAndModel)) {
					gpu = "nvidia";
					logger.info(`Found NVIDIA GPU: ${controller.model}`);
					foundGpu = true;
					break; // Prioritize discrete GPUs
				} else if (/amd|radeon/i.test(vendorAndModel)) {
					gpu = "amd";
					logger.info(`Found AMD GPU: ${controller.model}`);
					foundGpu = true;
					break; // Prioritize discrete GPUs
				}
			}
			
			// If GPUs exist but none are recognized as NVIDIA/AMD
			if (!foundGpu) {
				gpu = "unknown";
				logger.info(`GPUs detected but not recognized as NVIDIA/AMD:`);
				gpus.forEach((g, i) => {
					logger.info(`  GPU ${i}: ${g.vendor} ${g.model}`);
				});
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
			const requiredGpus = dioneConfig.requirements.gpus.map(g => g.toLowerCase());
			
			// Check if CPU-only is required but we have a GPU
			if ((requiredGpus.includes("cpu") || requiredGpus.includes("none")) && 
			    gpu !== "cpu" && gpu !== "unknown") {
				logger.error(`This app requires CPU-only mode but ${gpu} GPU was detected`);
				return {
					success: false,
					reasons: ["gpu-not-supported"],
				};
			}
			
			// Only fail if we have a known GPU that doesn't match requirements
			// Allow "unknown" GPUs to pass (might be integrated or less common GPUs)
			if (gpu !== "unknown" && gpu !== "cpu" && 
			    !requiredGpus.includes(gpu) && 
			    !requiredGpus.includes("all")) {
				logger.error(`GPU ${gpu} is not supported. Required: ${requiredGpus.join(", ")}`);
				return {
					success: false,
					reasons: ["gpu-not-supported"],
				};
			}
			
			// Log warning for unknown GPUs but don't fail
			if (gpu === "unknown") {
				logger.warn(`Could not identify GPU vendor. Required: ${requiredGpus.join(", ")}. Proceeding anyway...`);
			}
		}
	}
	return {
		success: true,
	};
}
