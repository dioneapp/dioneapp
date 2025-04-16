import { getCurrentPort } from "@renderer/utils/getPort";
import { useEffect, useState } from "react";

export default function Settings() {
	const [port, setPort] = useState<number | null>(null);
	const [versions] = useState(window.electron.process.versions);
	const [config, setConfig] = useState<any | null>(null);

	useEffect(() => {
		// get actual port
		const fetchPort = async () => {
			const currentPort = await getCurrentPort();
			setPort(currentPort);
		};
		fetchPort();

		// fetch config
		fetchConfig();
	}, [port]);

	async function fetchConfig() {
		if (port) {
			fetch(`http://localhost:${port}/config`)
				.then((res) => res.json())
				.then((data) => setConfig(data))
				.catch((err) => console.error("Failed to load config:", err));
		}
	}

	// handle to update config
	const handleUpdate = async (newConfig: Partial<any>) => {
		if (!port || !config) return;
		console.log("new config:", JSON.stringify({ ...config, ...newConfig }));
		try {
			const response = await fetch(`http://localhost:${port}/config/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...config, ...newConfig }),
			});

			if (!response.ok) throw new Error("Failed to update config");

			const updatedConfig = await response.json();
			setConfig(updatedConfig);
		} catch (error) {
			console.error("Error updating config:", error);
		}
	};

	return (
		<div className="overflow-hidden h-full pt-4">
			<div className="max-w-[2000px] h-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex flex-col space-y-4 h-full">
					{config && (
						<div className="flex flex-col space-y-4 h-full">
							<div className="flex flex-col space-y-2">
								<label className="text-sm text-neutral-200">Language</label>
								<select
									value={config.language}
									onChange={(e) => handleUpdate({ language: e.target.value })}
									className="bg-neutral-800 text-neutral-200 px-3 py-2 rounded"
								>
									<option value="en">English</option>
									<option value="es">Spanish</option>
								</select>
							</div>
						</div>
					)}

					<div className="flex flex-col text-xs text-neutral-500 text-right pb-4 select-all">
						<p>Port {port}</p>
						<p>Node v{versions.node}</p>
						<p>Electron v{versions.electron}</p>
						<p>Chromium v{versions.chrome}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
