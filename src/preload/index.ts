import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge } from "electron";

// Custom APIs for renderer
const api = {
	updateDiscordPresence: (details: string, state: string) => {
		return electronAPI.ipcRenderer.invoke(
			"update-discord-presence",
			details,
			state,
		);
	},
	getSystemUsage: () => {
		return electronAPI.ipcRenderer.invoke("get-system-usage");
	},
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("api", api);
		contextBridge.exposeInMainWorld("captureScreenshot", () => {
			return electronAPI.ipcRenderer.invoke("capture-screenshot");
		});
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-ignore (define in dts)
	window.electron = electronAPI;
	// @ts-ignore (define in dts)
	window.api = api;
}
