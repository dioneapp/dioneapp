import { useAuthContext } from "@/components/contexts/auth-context";
import { ErrorBoundary } from "@/components/features/layout/error-handler";
import OfflineIndicator from "@/components/features/layout/offline-indicator";
import Sidebar from "@/components/features/layout/sidebar";
import Titlebar from "@/components/features/layout/titlebar";
import TopbarNav from "@/components/features/layout/topbar-nav";
import Account from "@/pages/account";
import ErrorPage from "@/pages/error";
import FirstTime from "@/pages/first-time";
import Home from "@/pages/home";
import Install from "@/pages/install";
import Library from "@/pages/library";
import Loading from "@/pages/loading";
import QuickAI from "@/pages/quick-ai";
import Report from "@/pages/report";
import Settings from "@/pages/settings";
import { TranslationProvider } from "@/translations/translation-context";
import { apiJson } from "@/utils/api";
import { initializeTheme } from "@/utils/theme";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function App() {
	const { user } = useAuthContext();
	const location = useLocation();
	const { pathname } = location;
	const [_isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
	const [_isLoading, setIsLoading] = useState(true);
	const [config, setConfig] = useState<any | null>(() => {
		const stored = localStorage.getItem("config");
		return stored ? JSON.parse(stored) : null;
	});
	const navigate = useNavigate();

	// Initialize theme on app load
	useEffect(() => {
		initializeTheme();

		// Avoid titlebar drag errors
		localStorage.removeItem("isFullscreen");
		return () => {
			localStorage.removeItem("isFullscreen");
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// check for ctrl+shift+r
			if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") {
				e.preventDefault(); // prevent browser refresh
				navigate("/report");
			}
			// check for ctrl+k
			if (e.ctrlKey && e.key.toLowerCase() === "k") {
				e.preventDefault(); // prevent browser refresh
				navigate("/quick-ai");
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [navigate]);

	useEffect(() => {
		window.electron.ipcRenderer.invoke("check-first-launch").then((result) => {
			setIsFirstLaunch(result);
			localStorage.setItem("firstLaunch", result.toString());
			setIsLoading(false);
			if (result === true) {
				navigate("/first-time");
			} else {
				window.electron.ipcRenderer.invoke("init-env");
			}
		});
	}, []);

	useEffect(() => {
		const handleConfigUpdate = () => {
			const updatedConfig = localStorage.getItem("config");
			if (updatedConfig) {
				setConfig(JSON.parse(updatedConfig));
			}
		};

		window.addEventListener("config-updated", handleConfigUpdate);
		return () =>
			window.removeEventListener("config-updated", handleConfigUpdate);
	}, []);

	useEffect(() => {
		const cachedConfig = localStorage.getItem("config");
		if (cachedConfig) setConfig(JSON.parse(cachedConfig));

		const fetchConfig = async () => {
			try {
				const data = await apiJson<any>("/config");
				setConfig(data);
				localStorage.setItem("config", JSON.stringify(data));
			} catch (error) {
				console.error("Failed to load config: ", error);
			}
		};
		fetchConfig();
	}, []);

	useEffect(() => {
		// start session
		handleStartSession();
	}, [user]);

	async function handleStartSession() {
		if (!user || user.id === "") return;
		window.electron.ipcRenderer.send("start-session", {
			user: user,
		});
	}

	const routes = {
		"*": ErrorPage,
		"/": Home,
		"/loading": Loading,
		"/settings": Settings,
		"/first-time": FirstTime,
		"/library": Library,
		"/account": Account,
		"/report": Report,
		"/quick-ai": QuickAI,
	};

	const getPage = () => {
		if (pathname.startsWith("/install/")) {
			const searchParams = new URLSearchParams(location.search);
			const isLocal = searchParams.get("isLocal");
			const action = searchParams.get("action");
			const id = pathname.split("/")[2];
			return () => (
				<Install
					id={id}
					isLocal={isLocal === "true"}
					action={action as "install" | "start" | "navigate"}
				/>
			);
		}

		return routes[pathname as keyof typeof routes] || Home;
	};

	const PageComponent = getPage();
	const layoutMode = config?.layoutMode || "sidebar";

	return (
		<TranslationProvider>
			<div className="h-screen w-screen overflow-hidden" id="main">
				{pathname !== "/first-time" && layoutMode === "sidebar" && <Titlebar />}
				<OfflineIndicator />
				<div
					className={`flex ${layoutMode === "topbar" ? "flex-col" : ""} h-screen`}
				>
					{pathname !== "/first-time" && (
						<div
							className={`${layoutMode === "topbar" ? "absolute w-full" : "h-full"}`}
						>
							{layoutMode === "sidebar" ? <Sidebar /> : <TopbarNav />}
						</div>
					)}
					<div
						className={`flex-1 ${layoutMode === "topbar" ? "mt-6	" : ""} w-full h-full overflow-x-hidden overflow-y-overlay`}
					>
						<div
							className="page page-transition w-full h-full"
							key={location.pathname}
						>
							<ErrorBoundary>
								<PageComponent />
							</ErrorBoundary>
						</div>
					</div>
				</div>
			</div>
		</TranslationProvider>
	);
}

export default App;
