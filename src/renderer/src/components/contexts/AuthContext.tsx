import { getCurrentPort } from "@renderer/utils/getPort";
import { createContext, useContext, useEffect, useState } from "react";
import { deleteRefreshToken, getRefreshToken, saveRefreshToken } from "@renderer/utils/secure-tokens";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
	user: any;
	setUser: React.Dispatch<React.SetStateAction<any>>;
	session_expiresAt: number | null;
	setSession_expiresAt: React.Dispatch<React.SetStateAction<number | null>>;
	refreshSessionToken: string | null;
	setRefreshSessionToken: React.Dispatch<React.SetStateAction<string | null>>;
	logout: () => void;
	checkSession: () => void;
	loading: boolean;
	checkAccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [session_expiresAt, setSession_expiresAt] = useState<number | null>(null);
	const [refreshSessionToken, setRefreshSessionToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	// on mount, try to load auth token
	useEffect(() => {
		(async () => {
			const storedToken = await getRefreshToken();
			if (storedToken) {
				refreshSession(storedToken);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const storedToken = await getRefreshToken();
			if (!storedToken) return;
	
			// refresh token if session expires
			if (!session_expiresAt || session_expiresAt * 1000 < Date.now()) {
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
			setSession_expiresAt(data.session.expires_at);
			setRefreshSessionToken(data.session.refresh_token);
			saveRefreshToken(data.session.refresh_token);
			const response = await fetch(`http://localhost:${port}/db/user/${data.session.user.id}`);
			const userData = await response.json();
			setUser(userData[0]);
			setLoading(false);
		} else {
			setRefreshSessionToken(token);
			setLoading(false);
		}
	}

	async function checkSession() {
		if (user) {
			console.log("User is logged");
			// if user is logged, check access
			checkAccess();
		} else {
			console.log("User is not logged");
			if (pathname !== "/first-time") {
				navigate("/first-time");
			}
		}
	}

	async function checkAccess() {
		if (user) {
			if (user.tester === true) {
				console.log("User its a tester");
			} else {
				console.log("User is not a tester");
				if (pathname !== "/no_access") {
					navigate("/no_access");
				}
			}
		}
	}

	async function logout() {
		setUser(null);
		setSession_expiresAt(null);
		setRefreshSessionToken(null);
		await deleteRefreshToken();
		window.electron.ipcRenderer.send("end-session");
		// remove this after beta
		navigate("/first-time");
	}

	return (
		<AuthContext.Provider value={{ user, setUser, session_expiresAt, setSession_expiresAt, refreshSessionToken, setRefreshSessionToken, logout, checkSession, checkAccess, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthContextProvider");
	}
	return context;
}
