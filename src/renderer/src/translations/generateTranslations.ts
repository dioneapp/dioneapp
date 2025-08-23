import * as fs from "fs";
import * as path from "path";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.argv[2] || process.env.GEMINI_API_KEY;

if (!apiKey) {
	console.error("❌ Error: GEMINI_API_KEY not provided. Please pass it as a command line argument or set it as an environment variable.");
	console.error("Usage: npm run generate-translations <GEMINI_API_KEY>");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const languages: Record<string, string> = {
	es: "Spanish",
	ar: "Arabic",
	bn: "Bengali",
	de: "German",
	fr: "French",
	hi: "Hindi",
	id: "Indonesian",
	ja: "Japanese",
	pt: "Portuguese",
	ru: "Russian",
	zh: "Chinese",
};

const baseFilePath = path.join(__dirname, "languages/en.ts");
const baseContent = fs.readFileSync(baseFilePath, "utf-8");

async function translateFile(langCode: string, langName: string) {
	try {
		console.log(`🔄 Translating to ${langName} (${langCode})...`);
		
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash-lite",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `
You are a professional translator. 
Translate the following TypeScript object from English into **${langName} (${langCode})**.
Keep the SAME structure and keys. 
Return ONLY valid TypeScript code, nothing else, without any codeblock, just raw:

${baseContent}
`,
						},
					],
				},
			],
		});

		const translatedText = response.text?.trim() || "";
		
		if (!translatedText) {
			throw new Error("No translation received from AI");
		}

		const outputPath = path.join(__dirname, `languages/${langCode}.ts`);
		
		fs.writeFileSync(outputPath, translatedText, "utf-8");

		console.log(`✅ File generated: ${outputPath}`);
	} catch (error) {
		console.error(`❌ Error translating ${langCode}:`, error);
		throw error;
	}
}

async function main() {
	console.log("🚀 Starting translation generation...");
	console.log(`📁 Base file: ${baseFilePath}`);
	console.log(`🌍 Languages to translate: ${Object.keys(languages).join(", ")}`);
	
	const startTime = Date.now();
	let successCount = 0;
	let errorCount = 0;

	for (const [code, name] of Object.entries(languages)) {
		try {
			await translateFile(code, name);
			successCount++;
		} catch (error) {
			errorCount++;
			console.error(`Failed to translate ${code}:`, error);
		}
	}

	const endTime = Date.now();
	const duration = ((endTime - startTime) / 1000).toFixed(2);
	
	console.log("\n📊 Translation Summary:");
	console.log(`✅ Successful: ${successCount}`);
	console.log(`❌ Failed: ${errorCount}`);
	console.log(`⏱️ Duration: ${duration}s`);
	
	if (errorCount > 0) {
		console.error("\nSome translations failed. Please check the errors above.");
		process.exit(1);
	} else {
		console.log("\n🎉 All translations completed successfully!");
	}
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
