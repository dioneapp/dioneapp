import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useRouteError } from "react-router-dom";
import Sidebar from "./components/layout/sidebar";
import Titlebar from "./components/layout/titlebar";
import Account from "./pages/account";
import FirstTime from "./pages/first-time";
import Home from "./pages/home";
import Install from "./pages/install";
import Library from "./pages/library";
import Loading from "./pages/loading";
import NoAccess from "./pages/no-access";
import Settings from "./pages/settings";
import ErrorPage from "./pages/error";
import { ErrorBoundary } from "./components/layout/error-handler";

// transition animation config
const pageTransition = {
	initial: { opacity: 0, filter: "blur(4px)" },
	animate: { opacity: 1, filter: "blur(0px)" },
	exit: { opacity: 0, filter: "blur(4px)" },
	transition: { duration: 0.2, ease: "easeInOut" },
};

function App() {
	const { loginFinished } = useParams();
	const location = useLocation();
	const { pathname } = location;
	const [_isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
	const [_isLoading, setIsLoading] = useState(true);
	const [isLogged, setIsLogged] = useState<boolean>(false);
	const [haveAccess, setHaveAccess] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (loginFinished) {
			setIsLogged(true);
		}
	}, [loginFinished]);

	async function checkSession() {
		if (isLogged) checkAccess();
		const session = localStorage.getItem("session");
		if (session) {
			console.log("User is logged");
			setIsLogged(true);
			// if have a session, check access
			checkAccess();
		} else if (process.env.NODE_ENV === "development") {
			// in dev mode, create a mock session
			console.log("Development mode: creating mock session");
			const mockSession = {
				access_token: "dev-token",
				refresh_token: "dev-refresh-token",
				expires_at: Math.floor(Date.now() / 1000) + 3600,
			};
			const mockUser = {
				id: "dev-user",
				email: "dev@example.com",
				user_metadata: {
					name: "Developer",
				},
			};
			localStorage.setItem("session", JSON.stringify(mockSession));
			localStorage.setItem("user", JSON.stringify(mockUser));
			setIsLogged(true);
			checkAccess();
		} else {
			console.log("User is not logged");
			setIsLogged(false);
			if (pathname !== "/first-time") {
				navigate("/first-time");
			}
		}
	}

	async function checkAccess() {
		if (haveAccess) return;
		if (process.env.NODE_ENV === "development") {
			// In development mode, grant access without checking Supabase
			console.log("Development mode: granting access");
			setHaveAccess(true);
			return;
		}
		const dbUser = await localStorage.getItem("dbUser");
		if (dbUser) {
			const dbUserObj = JSON.parse(dbUser);
			if (dbUserObj[0]?.tester === true) {
				console.log("User its a tester");
				setHaveAccess(true);
			} else {
				console.log("User is not a tester");
				setHaveAccess(false);
				if (pathname !== "/no_access") {
					navigate("/no_access");
				}
			}
		}
	}

	useEffect(() => {
		window.electron.ipcRenderer.invoke("check-first-launch").then((result) => {
			console.log("is first launch?", result);
			setIsFirstLaunch(result);
			checkSession();
			setIsLoading(false);
		});

		// start session
		handleStartSession();
	}, []);

	async function handleStartSession() {
		const user = JSON.parse(localStorage.getItem("user") || "{}");
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
	};

	const getPage = () => {
		if (pathname.startsWith("/install/")) {
			const id = pathname.split("/")[2];
			return () => <Install id={id} />;
		}

		return routes[pathname as keyof typeof routes] || Home;
	};

	const PageComponent = getPage();
	return (
		<div className="h-screen w-screen overflow-hidden" id="main">
			<Titlebar />
			<div className="flex h-[calc(100%)]">
				{pathname !== "/first-time" && pathname !== "/no_access" && <Sidebar />}
				<div
					className="flex-1 overflow-x-hidden"
					id={pathname === "/settings" ? "settings" : "view"}
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={pathname}
							{...pageTransition}
							className="w-full h-full"
						>
							<ErrorBoundary>
								<PageComponent />
							</ErrorBoundary>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}

export default App;
