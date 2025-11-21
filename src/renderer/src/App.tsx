import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "./components/contexts/auth-context";
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
import QuickAI from "./pages/quick-ai";
import Report from "./pages/report";
import Settings from "./pages/settings";
import { TranslationProvider } from "./translations/translation-context";

function App() {
	const { user } = useAuthContext();
	const location = useLocation();
	const { pathname } = location;
	const [_isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
	const [_isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

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
			console.log("is first launch?", result);
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
		"/no_access": NoAccess,
		"/account": Account,
		"/report": Report,
		"/quick-ai": QuickAI,
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
						<div className="page page-transition" key={location.pathname}>
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
