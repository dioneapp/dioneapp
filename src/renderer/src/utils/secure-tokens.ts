export async function saveRefreshToken(token: string) {
	return await window.electron.ipcRenderer.invoke("secure-token:save", token);
}

export async function getRefreshToken(): Promise<string | null> {
	return await window.electron.ipcRenderer.invoke("secure-token:get");
}

export async function deleteRefreshToken() {
	return await window.electron.ipcRenderer.invoke("secure-token:delete");
}

export async function saveExpiresAt(expiresAt: number) {
	return await window.electron.ipcRenderer.invoke(
		"secure-token:save-expiresAt",
		expiresAt,
	);
}

export async function getExpiresAt(): Promise<number | null> {
	return await window.electron.ipcRenderer.invoke("secure-token:get-expiresAt");
}

export async function deleteExpiresAt() {
	return await window.electron.ipcRenderer.invoke(
		"secure-token:delete-expiresAt",
	);
}
