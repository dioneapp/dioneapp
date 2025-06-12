import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { en } from "./languages/en";
import { es } from "./languages/es";

// available languages
const languages = {
	en: "English",
	es: "Spanish",
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

	// save language preference
	useEffect(() => {
		localStorage.setItem("language", language);
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
