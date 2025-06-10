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
}

// get hardware id
async function getComputerId(): Promise<string> {
	const hwid = await window.electron.ipcRenderer.invoke('get-hwid');
	return hwid;
}

export async function sendDiscordReport(
	error: Error | string,
	additionalInfo?: Record<string, any>,
) {
	// get logs
	const logs = (await window.electron.ipcRenderer.invoke("get-logs")) || "";
	const truncatedLogs = logs.length > 882 ? `...${logs.slice(-882)}` : logs;

	// create embed
	const embed: DiscordEmbed = {
		title: additionalInfo?.userReport ? "User Report" : "Error Report",
		color: 0xff0000,
		timestamp: new Date().toISOString(),
		fields: [
			{
				name: "Error",
				value: error instanceof Error ? error.message : error,
				inline: false,
			},
		],
	};

	// add stack trace if available
	if (error instanceof Error && error.stack) {
		embed.fields?.push({
			name: "Stack Trace",
			value: `\`\`\`${error.stack}\`\`\``,
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
		value: `Computer ID: ${await getComputerId()}\nOS: ${window.electron.process.platform}\nNode: ${window.electron.process.versions.node}\nElectron: ${window.electron.process.versions.electron}`,
		inline: false,
	});

	// add last error log
	embed.fields?.push({
		name: "Last logs",
		value: `\`\`\`${truncatedLogs || "No logs available"}\`\`\``,
		inline: false,
	});

	const message: DiscordMessage = {
		embeds: [embed],
	};

	try {
		// use main process to send the report
		const success = await window.electron.ipcRenderer.invoke(
			"send-discord-report",
			message,
		);
		console.log("Discord report sent successfully");
		return success;
	} catch (err) {
		console.error("Failed to send Discord report:", err);
		return false;
	}
}
