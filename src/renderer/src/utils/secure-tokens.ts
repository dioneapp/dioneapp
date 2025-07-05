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

export async function saveId(id: string) {
	return await window.electron.ipcRenderer.invoke("secure-token:save-id", id);
}

export async function getId(): Promise<string | null> {
	return await window.electron.ipcRenderer.invoke("secure-token:get-id");
}

export async function deleteId() {
	return await window.electron.ipcRenderer.invoke("secure-token:delete-id");
}