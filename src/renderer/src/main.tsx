import "@assets/main.css";

import App from "@/App";
import { AuthContextProvider } from "@/components/contexts/auth-context";
import { ScriptsContext } from "@/components/contexts/ScriptsContext";
import { TranslationProvider } from "@/translations/translation-context";
import { ToastProvider } from "@/utils/use-toast";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

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
