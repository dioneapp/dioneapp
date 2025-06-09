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

export async function sendDiscordReport(
	error: Error | string,
	additionalInfo?: Record<string, any>,
) {
	// create embed
	const embed: DiscordEmbed = {
		title: "Error Report",
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
			value: "```" + error.stack + "```",
			inline: false,
		});
	}

	// add additional info if provided
	if (additionalInfo) {
		Object.entries(additionalInfo).forEach(([key, value]) => {
			embed.fields?.push({
				name: key,
				value:
					typeof value === "object"
						? JSON.stringify(value, null, 2)
						: String(value),
				inline: true,
			});
		});
	}

	// add system info
	embed.fields?.push({
		name: "System Info",
		value: `OS: ${window.electron.process.platform}\nNode: ${window.electron.process.versions.node}\nElectron: ${window.electron.process.versions.electron}`,
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
		return success;
	} catch (err) {
		console.error("Failed to send Discord report:", err);
		return false;
	}
}
