import "@assets/main.css";

import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { GlobalContext } from "./components/layout/global-context";
import "./assets/main.css";
import { TranslationProvider } from "./translations/translationContext";
import { ToastProvider } from "./utils/useToast";
import { AuthContextProvider } from "./components/contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<HashRouter>
		<TranslationProvider>
			<ToastProvider>
				<AuthContextProvider>
					<GlobalContext>
						<App />
					</GlobalContext>
				</AuthContextProvider>
			</ToastProvider>
		</TranslationProvider>
	</HashRouter>,
);
