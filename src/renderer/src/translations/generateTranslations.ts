import * as fs from "fs";
import * as path from "path";
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

  const outputPath = path.join(__dirname, `languages/${langCode}.ts`);
  fs.writeFileSync(outputPath, translatedText, "utf-8");

  console.log(`+ File generated: ${outputPath}`);
}

async function main() {
  for (const [code, name] of Object.entries(languages)) {
    await translateFile(code, name);
  }
}

main().catch(console.error);
