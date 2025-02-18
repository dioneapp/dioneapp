import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Loading from "./pages/loading";
import Titlebar from "./components/layout/titlebar";
import Home from "./pages/home";
import Sidebar from "./components/layout/sidebar";
import Install from "./pages/install";
import Settings from "./pages/settings";
import { ToastProvider } from "./utils/useToast";
import FirstTime from "./pages/first-time";
import { useEffect, useState } from "react";

function App() {
	const { pathname } = useLocation();
	const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		window.electron.ipcRenderer.invoke("check-first-launch").then((result) => {
			setIsFirstLaunch(result);
			setIsLoading(false);
		});
	}, []);

	if (isLoading) {
		return null; // this probably makes the application take a few ms longer to start, so we can wait for the result of check-first-launch to display something on the screen
	}

	if (isFirstLaunch && pathname !== "/first-time") {
		return <Navigate to="/first-time" replace />;
	}

	return (
		<ToastProvider>
			<div className="h-screen w-screen">
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
						</Routes>
					</div>
				</div>
			</div>
		</ToastProvider>
	);
}

export default App;
