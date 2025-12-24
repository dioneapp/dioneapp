import type { AuthContextType } from "@/components/contexts/types/context-types";
import { apiFetch } from "@/utils/api";
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
} from "@/utils/secure-tokens";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
				await fetchUser(id);
			} else {
				setLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const storedToken = await getRefreshToken();
			const sessionExpiresAt = await getExpiresAt();
			if (!storedToken || !sessionExpiresAt) {
				setLoading(false);
				return;
			}
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
		const response = await apiFetch("/db/refresh-token", {
			headers: {
				api_key: import.meta.env.LOCAL_API_KEY || "",
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
		const response = await apiFetch(`/db/user/${id}`, {
			headers: {
				api_key: import.meta.env.LOCAL_API_KEY || "", // use this env variable to access the local API key
			},
		});
		if (response.ok) {
			const userData = await response.json();
			await saveId(id);
			setUser(userData[0]);
			setLoading(false);
		} else {
			setUser(null);
			setLoading(false);
		}
	}

	async function logout() {
		setUser(null);
		setRefreshSessionToken(null);
		await deleteRefreshToken();
		await deleteExpiresAt();
		await deleteId();
		window.electron.ipcRenderer.send("end-session");
		navigate("/");
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
