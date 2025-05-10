import "@assets/main.css";

import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { GlobalContext } from "./components/layout/global-context";
import './assets/main.css';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<HashRouter>
		<GlobalContext>
			<App />
		</GlobalContext>
	</HashRouter>,
);
