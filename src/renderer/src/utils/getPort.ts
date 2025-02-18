export const getCurrentPort = async () => {
	return await window.electron.ipcRenderer.invoke("get-current-port");
};
