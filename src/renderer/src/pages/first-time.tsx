import Icon from "@renderer/components/icons/icon";
import { getCurrentPort } from "@renderer/utils/getPort";
import { openLink } from "@renderer/utils/openLink";
import { useToast } from "@renderer/utils/useToast";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Background from "@renderer/components/first-time/background";

export default function FirstTime() {
	// toast stuff
	const { addToast } = useToast();
	const showToast = (
		variant: "default" | "success" | "error" | "warning",
		message: string,
		fixed?: "true" | "false",
	) => {
		addToast({
			variant,
			children: message,
			fixed,
		});
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText("https://getdione.app/auth/login");
		showToast(
			"success",
			"Copied to the clipboard correctly, now paste it in your browser!",
		);
	};

	// auth stuff
	const [authToken, setAuthToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [_logged, setLogged] = useState<boolean>(false);

	// levels
	const [level, setLevel] = useState(1);

	useEffect(() => {
		function shouldRedirect() {
			const session = localStorage.getItem("session");
			const user = localStorage.getItem("user");
			if (session && user) {
				setLogged(true);
				setLevel(3);
			}
		}
		shouldRedirect();
	}, [])

	useEffect(() => {
		const session = localStorage.getItem("session");
		const user = localStorage.getItem("user");
		if (session && user) {
			setLogged(true);
		} else {
			setLogged(false);
		}
	}, []);

	useEffect(() => {
		const listenForAuthToken = () => {
			window.electron.ipcRenderer.on("auth-token", (_event, authToken) => {
				setAuthToken(authToken);
			});
			window.electron.ipcRenderer.on(
				"refresh-token",
				(_event, refreshToken) => {
					setRefreshToken(refreshToken);
				},
			);
		};
		listenForAuthToken();
	}, []);

	useEffect(() => {
		if (authToken && refreshToken) {
			async function setSessionAPI(token: string, refreshToken: string) {
				const port = await getCurrentPort();
				const response = await fetch(`http://localhost:${port}/set-session`, {
					headers: {
						accessToken: token,
						refreshToken: refreshToken,
					},
				});
				const data = await response.json();
				if (data.session) {
					setSession(data.session);
					setUser(data.user);
					setLogged(true);
					setLevel(3);
				}
			}

			setSessionAPI(authToken, refreshToken);
		}
	}, [authToken, refreshToken]);

	async function setSession(session: any) {
		localStorage.setItem("session", JSON.stringify(session));
	}
	async function setUser(user: any) {
		localStorage.setItem("user", JSON.stringify(user));
	}

	return (
		<div className="absolute w-screen h-screen inset-0 z-50 bg-[#080808]/5 overflow-hidden">
			{/* background stuff */}
			<Background />
			{level === 1 && (
				<div className="w-full h-full flex flex-col  items-center justify-center">
					<div className="flex flex-col gap-4 justify-center items-center">
						<Icon name="Dio" className="w-20 h-20 animate-bounce mb-2" />
						<h1 className="text-6xl font-semibold">
							Welcome to{" "}
							<span className="bg-clip-text text-transparent bg-gradient-to-t from-white via-[#BCB1E7] to-[#BCB1E7]">
								Dione
							</span>
						</h1>
						<h2 className="text-neutral-400 text-balance text-center max-w-xl">
							Thank you for joining us early on this journey. Log into your
							account to get started.
						</h2>
					</div>
					<div className="mt-12 flex flex-col gap-4">
						<button
							type="button"
							className="bg-white/10 w-28 rounded-full p-1.5 text-sm text-neutral-300 hover:bg-white/20 transition-colors duration-300 cursor-pointer"
							onClick={() => {
								setLevel(2);
								openLink("https://getdione.app/auth/login");
							}}
						>
							Log in
						</button>
						<button
							type="button"
							className="text-xs text-white opacity-50 flex items-center justify-center gap-1 hover:opacity-80 transition-opacity duration-300"
							onClick={copyToClipboard}
						>
							<span>
								<Icon name="Link" className="w-4 h-4" />
							</span>
							<span>Copy Link</span>
						</button>
					</div>
				</div>
			)}
			{level === 2 && (
				<div className="w-full h-full flex flex-col  items-center justify-center">
					<div className="flex flex-col gap-4 justify-center items-center">
						<Icon name="Dio" className="w-20 h-20 animate-bounce mb-2" />
						<h1 className="text-6xl font-semibold">Logging in...</h1>
						<h2 className="text-neutral-400 text-balance text-center max-w-xl">
							Enter your credentials in your browser to access Dione
						</h2>
					</div>
					<div className="mt-12 flex flex-col gap-4">
						<div className="flex flex-col gap-2 items-center justify-center">
							<h3 className="text-white/50 text-xs">Could not authenticate?</h3>
							<button
								type="button"
								className="bg-white/10 w-28 rounded-full p-1.5 text-sm text-neutral-300 hover:bg-white/20 transition-colors duration-300 cursor-pointer"
								onClick={() => {
									setLevel(1);
								}}
							>
								Go back
							</button>
						</div>
					</div>
				</div>
			)}
			{level === 3 && (
				<div className="w-full h-full flex flex-col  items-center justify-center">
					<div className="flex flex-col gap-4 justify-center items-center">
						<Icon name="Dio" className="w-20 h-20 animate-bounce mb-2" />
						<h1 className="text-6xl font-semibold">You are ready!</h1>
						<h2 className="text-neutral-400 text-balance text-center max-w-xl">
							We are glad to have you here{" "}
							{
								JSON.parse(localStorage.getItem("user") || "{}").user_metadata
									?.name
							}
							!
						</h2>
					</div>
					<div className="mt-12 flex flex-col gap-4">
						<div className="flex flex-col gap-2 items-center justify-center">
							<Link
								to="/?loginFinished=true"
								className="bg-white/20 transition-all duration-400 w-28 rounded-full p-2 text-sm text-neutral-200 cursor-pointer"
							>
								<span className="text-center w-full flex items-center justify-center">
									Finish
								</span>
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
