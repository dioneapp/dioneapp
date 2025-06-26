import Background from "@renderer/components/first-time/background";
import LanguageSelector from "@renderer/components/first-time/onboarding/language-selector";
import ExecuteSound from "@renderer/components/first-time/sound";
import Icon from "@renderer/components/icons/icon";
import { getCurrentPort } from "@renderer/utils/getPort";
import { openLink } from "@renderer/utils/openLink";
import { saveExpiresAt, saveRefreshToken } from "@renderer/utils/secure-tokens";
import { useToast } from "@renderer/utils/useToast";
import { AnimatePresence, motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useTranslation } from "../translations/translationContext";

export default function FirstTime() {
	const { t } = useTranslation();
	const { user, setUser, setRefreshSessionToken } = useAuthContext();
	const firstLaunch = localStorage.getItem("firstLaunch");
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
		navigator.clipboard.writeText("https://getdione.app/auth/login?app=true");
		showToast("success", t("firstTime.clipboard.success"));
	};

	// auth
	const [authToken, setAuthToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);

	// levels
	const [level, setLevel] = useState(1);
	const [_isTransitioning, setIsTransitioning] = useState(false);
	const [_prevLevel, setPrevLevel] = useState(1);

	// handle level changes with transitions
	const changeLevel = (newLevel) => {
		setPrevLevel(level);
		setIsTransitioning(true);
		setTimeout(() => {
			setLevel(newLevel);
			setTimeout(() => {
				setIsTransitioning(false);
			}, 50);
		}, 500);
	};

	useEffect(() => {
		function shouldRedirect() {
			if (user) {
				if (firstLaunch === "true" || firstLaunch === null) {
					changeLevel(4);
				} else {
					changeLevel(3);
				}
			}
		}
		shouldRedirect();
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
				const response = await fetch(
					`http://localhost:${port}/db/set-session`,
					{
						headers: {
							accessToken: token,
							refreshToken: refreshToken,
						},
					},
				);
				const data = await response.json();
				if (data.session) {
					window.electron.ipcRenderer.send("start-session", {
						user: data.user,
					});
					await saveExpiresAt(data.session.expires_at);
					await saveRefreshToken(data.session.refresh_token);
					setRefreshSessionToken(data.session.refresh_token);
					getUser(data.user.id);
					changeLevel(3);
				}
			}

			setSessionAPI(authToken, refreshToken);
		}
	}, [authToken, refreshToken]);

	async function getUser(id: string) {
		const port = await getCurrentPort();
		const response = await fetch(`http://localhost:${port}/db/user/${id}`);
		const data = await response.json();
		setUser(data[0]);
	}

	function onSelectLanguage() {
		changeLevel(4);
	}

	const getContainerClasses = () => {
		return "w-full h-full flex flex-col items-center justify-center z-50";
	};

	return (
		<div className="absolute w-screen h-screen inset-0 z-50 bg-[#080808]/5 overflow-hidden">
			{/* background stuff */}
			<Background />
			<ExecuteSound firstLaunch={firstLaunch || "false"} />
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 2 }}
				className="absolute blur-sm bg-[#BCB1E7]/5 h-full w-full"
				style={{ zIndex: -1 }}
			/>
			<AnimatePresence mode="wait">
				{/* 1 - welcome */}
				{level === 1 && (
					<motion.div
						key={1}
						initial={{ opacity: 0, y: -200, filter: "blur(30px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						exit={{
							opacity: 0,
							y: 200,
							filter: "blur(30px)",
							transition: { duration: 0.4 },
						}}
						transition={{
							duration: 0.6,
							delay: firstLaunch === "true" ? 3.2 : 0.4,
						}}
						className={`${getContainerClasses()} relative`}
					>
						<div className="flex flex-col gap-4 justify-center items-center transition-all duration-500">
							<Icon name="Dio" className="w-20 h-20 mb-2" />
							<h1 className="text-6xl font-semibold">
								{t("firstTime.welcome.title")}{" "}
								<span className="bg-clip-text text-transparent bg-gradient-to-t from-white via-[#BCB1E7] to-[#BCB1E7]">
									Dione
								</span>
							</h1>
							<h2 className="text-neutral-400 text-balance text-center max-w-xl">
								{t("firstTime.welcome.subtitle")}
							</h2>
						</div>
						<motion.div
							initial={{ opacity: 0, y: -200, filter: "blur(30px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							exit={{
								opacity: 0,
								y: 200,
								filter: "blur(30px)",
								transition: { duration: 0.4 },
							}}
							transition={{
								duration: 0.6,
								delay: firstLaunch === "true" ? 3.2 : 1,
							}}
							className="mt-4 flex flex-col gap-4"
						>
							<button
								type="button"
								className="bg-white/10 w-28 rounded-full p-1.5 text-sm text-neutral-300 hover:bg-white/20 transition-colors duration-300 cursor-pointer"
								onClick={() => {
									changeLevel(2);
									openLink("https://getdione.app/auth/login?app=true");
								}}
							>
								{t("firstTime.welcome.login")}
							</button>
							<button
								type="button"
								className="text-xs text-white opacity-50 flex items-center justify-center gap-1 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
								onClick={copyToClipboard}
							>
								<span>
									<LinkIcon className="w-4 h-4" />
								</span>
								<span>{t("firstTime.welcome.copyLink")}</span>
							</button>
						</motion.div>
						<motion.span
							initial={{ opacity: 0, y: 200, filter: "blur(30px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							exit={{
								opacity: 0,
								y: 200,
								filter: "blur(30px)",
								transition: { duration: 1 },
							}}
							transition={{
								delay: firstLaunch === "true" ? 3.2 : 1.4,
								duration: 0.8,
							}}
							onClick={() => {
								if (firstLaunch === "true" || firstLaunch === null) {
									changeLevel(3);
								} else {
									changeLevel(4);
								}
							}}
							className="absolute bottom-12 text-xs text-white/70 hover:text-white cursor-pointer"
						>
							{t("firstTime.welcome.skipLogin")}
						</motion.span>
					</motion.div>
				)}
				{/* 2 - logging in */}
				{level === 2 && (
					<motion.div
						key={2}
						initial={{ opacity: 0, y: -200, filter: "blur(30px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						exit={{
							opacity: 0,
							y: 200,
							filter: "blur(30px)",
							transition: { duration: 0.4 },
						}}
						transition={{ duration: 0.6 }}
						className={getContainerClasses()}
					>
						<div className="flex flex-col gap-4 justify-center items-center">
							<h1 className="text-6xl font-semibold">
								{t("firstTime.loggingIn.title")}
							</h1>
						</div>
						<div className="mt-6 flex flex-col gap-4">
							<div className="flex flex-col gap-2 items-center justify-center">
								<h3 className="text-white/50 text-xs">
									{t("firstTime.loggingIn.authError")}
								</h3>
								<button
									type="button"
									className="bg-white/10 w-28 rounded-full p-1.5 text-sm text-neutral-300 hover:bg-white/20 transition-colors duration-300 cursor-pointer"
									onClick={() => {
										changeLevel(1);
									}}
								>
									{t("firstTime.loggingIn.goBack")}
								</button>
							</div>
						</div>
					</motion.div>
				)}
				{/* first time onboarding */}
				{level === 3 && (
					<motion.div
						key={4}
						initial={{ opacity: 0, y: -200, filter: "blur(30px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						exit={{
							opacity: 0,
							y: 200,
							filter: "blur(30px)",
							transition: { duration: 0.4 },
						}}
						transition={{ duration: 0.6 }}
						className={getContainerClasses()}
					>
						<div className="flex flex-col gap-4 justify-center items-center">
							<LanguageSelector onSelectLanguage={onSelectLanguage} />
						</div>
					</motion.div>
				)}
				{/* 4 - ready */}
				{level === 4 && (
					<motion.div
						key={4}
						initial={{ opacity: 0, y: -200, filter: "blur(30px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						exit={{
							opacity: 0,
							y: 200,
							filter: "blur(30px)",
							transition: { duration: 0.4 },
						}}
						transition={{ duration: 0.6 }}
						className={getContainerClasses()}
					>
						<div className="flex flex-col gap-4 justify-center items-center">
							<Icon name="Dio" className="w-20 h-20 mb-2" />
							<h1 className="text-6xl font-semibold">
								{t("firstTime.ready.title")}
							</h1>
							<h2 className="text-neutral-400 text-balance text-center max-w-xl">
								{t("firstTime.ready.subtitle")} {user?.username}
							</h2>
						</div>
						<div className="mt-4 flex flex-col gap-4">
							<div className="flex flex-col items-center justify-center">
								<Link
									to="/?loginFinished=true"
									className="bg-white/10 w-28 rounded-full p-1.5 text-sm text-neutral-300 hover:bg-white/20 transition-colors duration-300 cursor-pointer"
								>
									<span className="text-center w-full flex items-center justify-center">
										{t("firstTime.ready.finish")}
									</span>
								</Link>
							</div>
						</div>
					</motion.div>
				)}
				<motion.div
					initial={{ opacity: 0, y: 200, filter: "blur(30px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					exit={{
						opacity: 0,
						y: 200,
						filter: "blur(30px)",
						transition: { duration: 0.4 },
					}}
					transition={{ duration: 0.6 }}
					className="absolute bottom-4 left-1/2 translate-x-[-50%]"
				>
					<div className="flex gap-2">
						{[1, 2, 3, 4].map((lvl) => (
							<div key={lvl} className="py-1">
								<div
									className={`w-6 h-1 rounded-full ${lvl === level ? "bg-[#BCB1E7] w-10" : "bg-white/20"}`}
								/>
							</div>
						))}
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
