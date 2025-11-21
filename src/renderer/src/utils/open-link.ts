export const openLink = (url: string) => {
	if (url.startsWith("/")) {
		window.location.href = url;
	} else {
		window.electron.ipcRenderer.invoke("open-external-link", url);
	}
};

export const openFolder = async (path: string) => {
	await window.electron.ipcRenderer.invoke("open-dir", path);
};
