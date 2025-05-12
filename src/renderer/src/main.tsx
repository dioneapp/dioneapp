import "@assets/main.css";

import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { GlobalContext } from "./components/layout/global-context";
import './assets/main.css';
import { ToastProvider } from "./utils/useToast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<HashRouter>
		<ToastProvider>
			<GlobalContext>
				<App />
			</GlobalContext>
		</ToastProvider>
	</HashRouter>,
);
