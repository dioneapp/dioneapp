import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "./components/contexts/AuthContext";
import { ErrorBoundary } from "./components/layout/error-handler";
import Sidebar from "./components/layout/sidebar";
import Titlebar from "./components/layout/titlebar";
import Account from "./pages/account";
import ErrorPage from "./pages/error";
import FirstTime from "./pages/first-time";
import Home from "./pages/home";
import Install from "./pages/install";
import Library from "./pages/library";
import Loading from "./pages/loading";
import NoAccess from "./pages/no-access";
import Report from "./pages/report";
import Settings from "./pages/settings";
import { TranslationProvider } from "./translations/translationContext";

function App() {
	const { user } = useAuthContext();
	const location = useLocation();
	const { pathname } = location;
	const [_isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
	const [_isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const [isMinimized, setIsMinimized] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// check for ctrl+shift+r
			if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") {
				e.preventDefault(); // prevent browser refresh
				navigate("/report");
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [navigate]);

	useEffect(() => {
		window.electron.ipcRenderer.invoke("check-first-launch").then((result) => {
			console.log("is first launch?", result);
			setIsFirstLaunch(result);
			localStorage.setItem("firstLaunch", result.toString());
			setIsLoading(false);
			if (result === true) {
				navigate("/first-time");
			}
		});
	}, []);

	useEffect(() => {
		// start session
		handleStartSession();
	}, [user]);

	useEffect(() => {
		window.electron.ipcRenderer.on("app:minimized", () => setIsMinimized(true));
		window.electron.ipcRenderer.on("app:restored", () => setIsMinimized(false));
		return () => {
			window.electron.ipcRenderer.removeAllListeners("app:minimized");
			window.electron.ipcRenderer.removeAllListeners("app:restored");
		};
	}, []);

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
		"/no_access": NoAccess,
		"/account": Account,
		"/report": Report,
	};

	const getPage = () => {
		if (pathname.startsWith("/install/")) {
			const searchParams = new URLSearchParams(location.search);
			const isLocal = searchParams.get("isLocal");
			const id = pathname.split("/")[2];
			return () => <Install id={id} isLocal={isLocal === "true"} />;
		}

		return routes[pathname as keyof typeof routes] || Home;
	};

	const PageComponent = getPage();
	return (
		<TranslationProvider>
			<div className="h-screen w-screen overflow-hidden" id="main">
				{pathname !== "/first-time" && <Titlebar />}
				<div className="flex h-[calc(100%)]">
					{pathname !== "/first-time" && pathname !== "/no_access" && (
						<Sidebar />
					)}
					<div
						className="flex-1 overflow-x-hidden"
						id={
							pathname.includes("/install") ||
							pathname === "/account" ||
							pathname === "/first-time" ||
							pathname === "/library"
								? ""
								: pathname === "/settings"
									? "settings"
									: "view"
						}
					>
						<AnimatePresence mode="wait">
							<motion.div
								className="page"
								initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
								animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
								exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
								transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
								key={location.pathname}
							>
								<ErrorBoundary>
									<PageComponent />
								</ErrorBoundary>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</TranslationProvider>
	);
}

export default App;
