export const openLink = (url: string) => {
	if (url.startsWith("/")) {
		window.location.href = url;
	} else {
		window.electron.ipcRenderer.invoke("open-external-link", url);
	}
};
