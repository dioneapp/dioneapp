export async function saveRefreshToken(token: string) {
	return await window.electron.ipcRenderer.invoke('secure-token:save', token);
}

export async function getRefreshToken(): Promise<string | null> {
	return await window.electron.ipcRenderer.invoke('secure-token:get');
}

export async function deleteRefreshToken() {
	return await window.electron.ipcRenderer.invoke('secure-token:delete');
}
