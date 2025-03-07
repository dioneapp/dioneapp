import { createContext, useContext, useState } from "react";

interface AppContextType {
	setInstalledApps: React.Dispatch<React.SetStateAction<string[]>>;
	installedApps: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function GlobalContext({ children }: { children: React.ReactNode }) {
	const [installedApps, setInstalledApps] = useState<string[]>([]);

	return (
		<AppContext.Provider value={{ setInstalledApps, installedApps }}>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("Context must be used within an provider");
	}
	return context;
}
