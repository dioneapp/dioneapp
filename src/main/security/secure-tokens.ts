import fs from "node:fs";
import path from "node:path";
import { app, safeStorage } from "electron";

const SESSION_FILE = path.join(app.getPath("userData"), "session.enc");

export function saveToken(token: string) {
	const encrypted = safeStorage.encryptString(token);
	fs.writeFileSync(SESSION_FILE, encrypted);
}

export function getToken(): string | null {
	if (!fs.existsSync(SESSION_FILE)) return null;
	const encrypted = fs.readFileSync(SESSION_FILE);
	return safeStorage.decryptString(encrypted);
}

export function deleteToken() {
	if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
}
