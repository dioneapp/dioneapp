import { ar } from "@/translations/languages/ar";
import { bn } from "@/translations/languages/bn";
import { de } from "@/translations/languages/de";
import { en } from "@/translations/languages/en";
import { es } from "@/translations/languages/es";
import { fr } from "@/translations/languages/fr";
import { hi } from "@/translations/languages/hi";
import { id } from "@/translations/languages/id";
import { ja } from "@/translations/languages/ja";
import { pl } from "@/translations/languages/pl";
import { pt } from "@/translations/languages/pt";
import { ru } from "@/translations/languages/ru";
import { zh } from "@/translations/languages/zh";
import { apiJson } from "@/utils/api";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

// available languages
export const languages = {
	en: "English",
	es: "Spanish",
	ar: "Arabic",
	bn: "Bengali",
	de: "German",
	fr: "French",
	hi: "Hindi",
	id: "Indonesian",
	ja: "Japanese",
	pt: "Portuguese",
	pl: "Polish",
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
	de,
	fr,
	hi,
	id,
	ja,
	pt,
	pl,
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

	const fetchConfig = async () => {
		return apiJson<Record<string, unknown>>("/config");
	};

	const handleUpdateSettings = async (newConfig: Partial<any>) => {
		if (!newConfig.language) return;
		const config = await fetchConfig();
		if (newConfig.language === config.language) return;
		const response = await apiJson<Record<string, any>>("/config/update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...config, ...newConfig }),
		});
		setLanguage(response.language);
		localStorage.setItem("language", response.language);
	};

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
