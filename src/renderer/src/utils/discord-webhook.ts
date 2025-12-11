interface DiscordEmbed {
	title?: string;
	description?: string;
	color?: number;
	fields?: Array<{
		name: string;
		value: string;
		inline?: boolean;
	}>;
	timestamp?: string;
}

interface DiscordMessage {
	content?: string;
	embeds?: DiscordEmbed[];
	logContent?: string;
}

const cooldown = 1 * 60 * 1000;
let lastReportAt: number | null = null;

// get hardware id
async function getComputerId(): Promise<string> {
	const hwid = await window.electron.ipcRenderer.invoke("get-hwid");
	return hwid;
}

export async function sendDiscordReport(
	error: Error | string,
	additionalInfo?: Record<string, any>,
) {
	if (lastReportAt && Date.now() - lastReportAt < cooldown) {
		console.log("Calm down, you're sending too many reports");
		return false;
	}

	lastReportAt = Date.now();
	// get logs
	const logs = (await window.electron.ipcRenderer.invoke("get-logs")) || "";
	// get app version
	const version = (await window.electron.ipcRenderer.invoke("get-version")) || "";

	// create embed
	const embed: DiscordEmbed = {
		title: additionalInfo?.UserReport ? "User Report" : "Error Report",
		color: 0xff0000,
		timestamp: new Date().toISOString(),
		fields: [
		],
	};

	// add stack trace if available
	if (error instanceof Error && error.stack) {
		embed.fields?.push({
			name: "Details",
			value: "\`\`\`" + error.stack + "\`\`\`",
			inline: false,
		});
	}

	// add additional info if provided
	if (additionalInfo) {
		for (const [key, value] of Object.entries(additionalInfo)) {
			embed.fields?.push({
				name: key,
				value:
					typeof value === "object"
						? JSON.stringify(value, null, 2)
						: String(value),
				inline: true,
			});
		}
	}

	// add system info
	embed.fields?.push({
		name: "System Info",
		value: `Computer ID: ${await getComputerId()}\nOS: ${window.electron.process.platform}\nDione v${version}`,
		inline: false,
	});

	const message: DiscordMessage = {
		embeds: [embed],
		logContent: logs,
	};

	try {
		// use main process to send the report
		const success = await window.electron.ipcRenderer.invoke(
			"send-discord-report",
			message,
		);
		if (success === "true") {
			console.log("Discord report sent successfully");
		}
		if (success === "dev-mode") {
			console.log("Discord report are disabled in dev mode");
		}
		return success;
	} catch (err) {
		console.error("Failed to send Discord report:", err);
		return false;
	}
}
