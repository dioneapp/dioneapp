import { getCurrentPort } from "@renderer/utils/getPort";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { openLink } from "../../utils/openLink";
import QuickLaunch from "./quick-launch";
import Icon from "../icons/icon";

export default function Sidebar() {
	const [authToken, setAuthToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [logged, setLogged] = useState<boolean>(false);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [dbUser, setDbUser] = useState<any>(null);

	// this is basically for security, in web, we can add a option to persist a session
	useEffect(() => {
		const session = localStorage.getItem("session");
		if (!session) return;
		const data = JSON.parse(session);
		if (data.expires_at * 1000 < new Date().getTime()) {
			localStorage.removeItem("session");
			localStorage.removeItem("user");
			localStorage.removeItem("dbUser");
			setLogged(false);
		}
	}, []);

	useEffect(() => {
		const session = localStorage.getItem("session");
		const user = localStorage.getItem("user");
		const dbUser = localStorage.getItem("dbUser");
		if (session && user) {
			setLogged(true);
		} else {
			setLogged(false);
		}
		if (dbUser) {
			setDbUser(JSON.parse(dbUser));
		}
		setLoading(false);
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

		const listenForDownloadToken = () => {
			window.electron.ipcRenderer.on("download", (_event, downloadID) => {
				console.log("go to download", downloadID);
				navigate(`/install/${downloadID}`);
			});
		};

		listenForAuthToken();
		listenForDownloadToken();
	}, []);

	useEffect(() => {
		if (authToken && refreshToken) {
			async function setSessionAPI(token: string, refreshToken: string) {
				const port = await getCurrentPort();
				const response = await fetch(`http://localhost:${port}/db/set-session`, {
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
				}
			}

			setSessionAPI(authToken, refreshToken);
		}
	}, [authToken, refreshToken]);

	useEffect(() => {
		getUser();
	}, [logged]);

	async function setSession(session: any) {
		localStorage.setItem("session", JSON.stringify(session));
	}
	async function setUser(user: any) {
		localStorage.setItem("user", JSON.stringify(user));
	}
	async function getUser() {
		if (dbUser) return;
		const dbUserStr = localStorage.getItem("dbUser");
		if (dbUserStr && JSON.parse(dbUserStr).length !== 0) return;

		const userStr = localStorage.getItem("user");
		if (!userStr) return;

		const user = JSON.parse(userStr);
		const port = await getCurrentPort();

		try {
			const response = await fetch(`http://localhost:${port}/db/user/${user.id}`);
			if (!response.ok) console.error("Error getting user:", response.status);

			const data = await response.json();
			console.log("data", data);
			setDbUser(data);
		} catch (error) {
			console.error("Error getting user:", error);
			setDbUser(null);
		}
	}

	useEffect(() => {
		if (dbUser) {
			localStorage.setItem("dbUser", JSON.stringify(dbUser));
		}
	}, [dbUser]);

	async function logout() {
		localStorage.removeItem("session");
		localStorage.removeItem("user");
		localStorage.removeItem("dbUser");
		setLogged(false);
		// remove this after beta
		window.location.href = "/login";
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen w-70 border-r border-white/10 overflow-hidden">
			<div className="absolute -top-10 -left-14 bg-[#BCB1E7] blur-3xl w-64 h-64 rounded-full rounded-bl-none rounded-tl-none opacity-40" />
			<div className="flex flex-col items-center justify-start h-full w-full p-4 z-50 px-6">
				<div className="w-full h-44 flex flex-col justify-center items-start gap-2">
					<Link
						to={"/"}
						className="flex gap-2 hover:opacity-80 transition-opacity"
					>
						<Icon name="Dio" className="h-8 w-8" />
						<h1 className="font-semibold text-3xl">Dione</h1>
					</Link>
					<p className="text-xs text-neutral-400 px-0.5">
						Explore, Install, Innovate — in 1 Click.
					</p>
					<div className="mt-2 w-full flex gap-2 px-0.5">
						<button
							type="button"
							onClick={() => openLink("https://getdione.app/discord")}
							className="flex items-center justify-center gap-2 text-xs w-full bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
						>
							<Icon name="Discord" className="h-4 w-4" />

							<span className="font-semibold">Discord</span>
						</button>

						<button
							type="button"
							onClick={() => openLink("https://getdione.app/github")}
							className="flex items-center justify-center gap-2 text-xs w-full bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
						>
							<Icon name="GitHub" className="h-4 w-4" />

							<span className="font-semibold">GitHub</span>
						</button>
					</div>
				</div>
				{/* we can use this space to warn about things, for example if we detect that dione is running on dev mode without api keys or smth */}
				{/* <div className="h-fit bg-orange-300/20 border border-white/5 rounded-xl backdrop-blur-3xl w-full">
					<div className="justify-center items-start py-8 px-6 flex flex-col gap-1"> 
						<h1 className="font-semibold text-xl text-neutral-200">Warning!</h1>
						<h2 className="text-[10px] text-neutral-300 text-balance">You are using an alpha version for testing, you will experience bugs and errors that you should report. With this in mind, be careful and proceed with caution.</h2>
					</div>
				</div> */}
				<QuickLaunch />
				<div className="h-0.5 rounded-full w-full from-transparent via-white/40 to-transparent bg-gradient-to-l mt-4" />
				<div className="mt-4 w-full flex items-center justify-between gap-2 pb-4">
					{!loading && logged && dbUser && (
						<button
							type="button"
							className="border border-white/10 hover:bg-white/10 rounded-lg overflow-hidden transition-all flex items-center justify-center w-24 h-9 cursor-pointer hover:opacity-60 duration-500"
						>
							<img
								src={dbUser[0]?.avatar_url || "/svgs/User.svg"}
								alt="user avatar"
								className="h-full w-full object-cover object-center"
							/>
						</button>
					)}
					{!loading && (
						<div className="flex gap-2 items-center justify-start w-full h-full">
							{logged ? (
								<button
									type="button"
									className="w-9 h-9 border border-white/10 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
									onClick={logout}
								>
									<Icon name="Logout" className="h-5 w-5" />
								</button>
							) : (
								<button
									type="button"
									className="p-2 bg-white/5 border rounded-full border-white/10 hover:bg-white/10 transition-colors flex gap-1 items-center cursor-pointer"
									onClick={() => openLink("https://getdione.app/auth/login")}
								>
									{/* <span className="text-xs text-neutral-300 font-semibold">Login</span> */}
									<Icon name="Login" className="h-5 w-5" />
								</button>
							)}
						</div>
					)}
					<div className="flex gap-2 items-center justify-end w-full h-full">
						<Link
							to={"/library"}
							className="p-2 border border-white/10 hover:bg-white/10 rounded-full transition-colors flex gap-1 items-center"
						>
							<Icon name="Library" className="h-5 w-5" />
						</Link>
						<Link
							to={"/settings"}
							className="p-2 border border-white/10 hover:bg-white/10 rounded-full transition-colors flex gap-1 items-center"
						>
							<Icon name="Settings" className="h-5 w-5" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
