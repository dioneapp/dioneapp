import "@assets/main.css";

import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ScriptsContext } from "./components/contexts/ScriptsContext";
import "./assets/main.css";
import { AuthContextProvider } from "./components/contexts/AuthContext";
import { TranslationProvider } from "./translations/translationContext";
import { ToastProvider } from "./utils/useToast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<HashRouter>
		<TranslationProvider>
			<ToastProvider>
				<AuthContextProvider>
					<ScriptsContext>
						<App />
					</ScriptsContext>
				</AuthContextProvider>
			</ToastProvider>
		</TranslationProvider>
	</HashRouter>,
);
