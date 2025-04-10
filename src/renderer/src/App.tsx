import {
	Route,
	Routes,
	useLocation,
	Navigate,
	useSearchParams,
	useNavigate,
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
import NoAccess from "./pages/no-access";

function App() {
	const { pathname } = useLocation();
	const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isLogged, setIsLogged] = useState<boolean>(false);
	const [haveAccess, setHaveAccess] = useState<boolean>(false);
	const navigate = useNavigate();

	async function checkSession() {
		const session = localStorage.getItem("session");
		if (session) {
			console.log('User is logged')
			setIsLogged(true);
			// if have a session, check access
			checkAccess();
		} else {
			console.log('User is not logged')
			setIsLogged(false);
			if (pathname !== "/first-time") {
				navigate("/first-time");
			}
		}
	}

	async function checkAccess() {
		const dbUser = localStorage.getItem("dbUser");
		if (dbUser) {
			const dbUserObj = JSON.parse(dbUser);
			if (dbUserObj[0].tester === true) {
				console.log('User its a tester')
				setHaveAccess(true);
			} else {
				console.log('User is not a tester')
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
	}, []);

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
							<Route path="/no_access" element={<NoAccess />} />
						</Routes>
					</div>
				</div>
			</div>
		</ToastProvider>
	);
}

export default App;
