import { getCurrentPort } from "@renderer/utils/getPort";
import {
	deleteExpiresAt,
	deleteId,
	deleteRefreshToken,
	getExpiresAt,
	getId,
	getRefreshToken,
	saveExpiresAt,
	saveId,
	saveRefreshToken,
} from "@renderer/utils/secure-tokens";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthContextType } from "./types/context-types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [refreshSessionToken, setRefreshSessionToken] = useState<string | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// on mount, try to load auth token
	useEffect(() => {
		(async () => {
			const id = await getId();
			if (id) {
				fetchUser(id);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const storedToken = await getRefreshToken();
			const sessionExpiresAt = await getExpiresAt();
			if (!storedToken || !sessionExpiresAt) return;
			// refresh token if session expires
			if (sessionExpiresAt * 1000 < Date.now()) {
				await refreshSession(storedToken);
			} else {
				setRefreshSessionToken(storedToken);
				setLoading(false);
			}
		})();
	}, []);

	async function refreshSession(token: string) {
		const port = await getCurrentPort();
		const response = await fetch(`http://localhost:${port}/db/refresh-token`, {
			headers: {
				accessToken: token,
			},
		});
		const data = await response.json();
		if (data.session) {
			await saveRefreshToken(data.session.refresh_token);
			await saveExpiresAt(data.session.expires_at);
			setRefreshSessionToken(data.session.refresh_token);
			saveRefreshToken(data.session.refresh_token);
			await fetchUser(data.session.user.id);
			setLoading(false);
		} else {
			setRefreshSessionToken(token);
			setLoading(false);
		}
	}

	async function fetchUser(id: string) {
		const port = await getCurrentPort();
		const response = await fetch(`http://localhost:${port}/db/user/${id}`);
		if (response.ok) {
			const userData = await response.json();
			await saveId(id);
			setUser(userData[0]);
		} else {
			setUser(null);
		}
	}

	async function logout() {
		setUser(null);
		setRefreshSessionToken(null);
		await deleteRefreshToken();
		await deleteExpiresAt();
		await deleteId();
		window.electron.ipcRenderer.send("end-session");
		// remove this after beta
		navigate("/first-time");
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				refreshSessionToken,
				setRefreshSessionToken,
				logout,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error(
			"useAuthContext must be used within an AuthContextProvider",
		);
	}
	return context;
}
