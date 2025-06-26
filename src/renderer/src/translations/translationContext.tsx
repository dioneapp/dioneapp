import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { ar } from "./languages/ar";
import { bn } from "./languages/bn";
import { en } from "./languages/en";
import { es } from "./languages/es";
import { fr } from "./languages/fr";
import { hi } from "./languages/hi";
import { id } from "./languages/id";
import { pt } from "./languages/pt";
import { ru } from "./languages/ru";
import { zh } from "./languages/zh";
import { getCurrentPort } from "@renderer/utils/getPort";

// available languages
export const languages = {
	en: "English",
	es: "Spanish",
	ar: "Arabic",
	bn: "Bengali",
	fr: "French",
	hi: "Hindi",
	id: "Indonesian",
	pt: "Portuguese",
	ru: "Russian",
	zh: "Chinese",
} as const;

type Language = keyof typeof languages;

// context type
type TranslationContextType = {
	t: (key: string) => string;
	language: Language;
	setLanguage: (lang: Language) => void;
};

// create context
const TranslationContext = createContext<TranslationContextType | undefined>(
	undefined,
);

// translations object
const translations = {
	en,
	es,
	ar,
	bn,
	fr,
	hi,
	id,
	pt,
	ru,
	zh,
} as const;

// helper to get nested translation
const getNestedTranslation = (obj: any, path: string): string => {
	const keys = path.split(".");
	let result = obj;
	const missingFields: string[] = [];

	for (const key of keys) {
		if (result[key] === undefined) {
			missingFields.push(key);
			// continue traversing to find all missing fields
			result = {};
			continue;
		}
		result = result[key];
	}

	if (missingFields.length > 0) {
		const missingPath = keys
			.slice(0, keys.indexOf(missingFields[0]) + 1)
			.join(".");
		console.warn(`Translation missing fields: ${missingPath} in ${path}`);
		return path;
	}

	return result;
};

// provider component
export function TranslationProvider({ children }: { children: ReactNode }) {
	// get initial language from config or default to english
	const [language, setLanguage] = useState<Language>(() => {
		const savedLang = localStorage.getItem("language") as Language;
		return savedLang && languages[savedLang] ? savedLang : "en";
	});

	// translation function
	const t = (key: string): string => {
		return getNestedTranslation(translations[language], key);
	};

	async function fetchConfig() {
		const port = await getCurrentPort();
		const response = await fetch(`http://localhost:${port}/config`);
		const data = await response.json();
		return data;
	}

	const handleUpdateSettings = async (newConfig: Partial<any>) => {
		if (!newConfig.language) return;
		const port = await getCurrentPort();
		const config = await fetchConfig();
		if (newConfig.language === config.language) return;
		const response = await fetch(`http://localhost:${port}/config/update`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...config, ...newConfig }),
		});	

		if (!response.ok) throw new Error("Failed to update config");
		const updatedConfig = await response.json();
		setLanguage(updatedConfig.language);
		localStorage.setItem("language", updatedConfig.language);
	}

	// save language preference
	useEffect(() => {
		if (language) {
			handleUpdateSettings({ language: language });
		}

	}, [language]);

	return (
		<TranslationContext.Provider value={{ t, language, setLanguage }}>
			{children}
		</TranslationContext.Provider>
	);
}

// hook to use translations
export function useTranslation() {
	const context = useContext(TranslationContext);
	if (context === undefined) {
		throw new Error("useTranslation must be used within a TranslationProvider");
	}
	return context;
}
