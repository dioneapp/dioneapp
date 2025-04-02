import {
	Route,
	Routes,
	useLocation,
	Navigate,
	useSearchParams,
} from "react-router-dom";
import Loading from "./pages/loading";
import Titlebar from "./components/layout/titlebar";
import Home from "./pages/home";
import Sidebar from "./components/layout/sidebar";
import Install from "./pages/install";
import Settings from "./pages/settings";
import { ToastProvider } from "./utils/useToast";
import FirstTime from "./pages/first-time";
import { useEffect, useState } from "react";
import Library from "./pages/library";
import Login from "./pages/login";
import NoAccess from "./pages/no-access";

function App() {
	const [searchParams] = useSearchParams();
	const { pathname } = useLocation();
	const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);
	const loginFinished = searchParams.get("loginFinished");
	const [isLogged, setIsLogged] = useState<boolean>(false);
	const [haveAccess, setHaveAccess] = useState<boolean | null>();

	useEffect(() => {
		window.electron.ipcRenderer.invoke("check-first-launch").then((result) => {
			console.log("is first launch?", result);
			setIsFirstLaunch(result);
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		// check if user should have access to app		
		function checkAccess() {
			const user = localStorage.getItem("dbUser");
			if (user) {
				setIsLogged(true);
				const dbUser = JSON.parse(user);
				if (dbUser[0].tester === true) {
					console.log("User is a tester");
					setHaveAccess(true);
				} else {
					console.log("User is not a tester");
					setHaveAccess(false);
				}
			} else {
				setIsLogged(false);
			}
		}

		checkAccess();
	}, []); 

	if (isLoading || haveAccess === null) {
		return null; // this probably makes the application take a few ms longer to start, so we can wait for the result of check-first-launch to display something on the screen
	}

	if (isFirstLaunch && pathname !== "/first-time" && !loginFinished) {
		return <Navigate to="/first-time" replace />;
	}

	if (!isLogged && pathname !== "/login" && pathname !== "/first-time" && !loginFinished) {
		return <Navigate to="/login" replace />;
	}

	if (!haveAccess && isLogged && pathname !== "/no_access") {
		return <Navigate to="/no_access" replace />;
	}

	return (
		<ToastProvider>
			<div className="h-screen w-screen" id="main">
				<Titlebar />
				<div className="flex h-full">
					{pathname !== "/first-time" && <Sidebar />}
					<div className="flex-1 mt-6 overflow-x-hidden">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/loading" element={<Loading />} />
							<Route path="/install/:id" element={<Install />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/first-time" element={<FirstTime />} />
							<Route path="/library" element={<Library />} />
							<Route path="/login" element={<Login />} />
							<Route path="/no_access" element={<NoAccess />} />
						</Routes>
					</div>
				</div>
			</div>
		</ToastProvider>
	);
}

export default App;
