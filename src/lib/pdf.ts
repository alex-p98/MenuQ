import * as pdfjsLib from "pdfjs-dist";
import OpenAI from "openai";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Add error handling for missing API key
if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error("OpenAI API key is not set. Please add it to your .env file.");
}

export async function extractTextFromPDF(file: File): Promise<string> {
  console.log("Starting PDF extraction...");
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(" ");
      fullText += text + "\n";
    }

    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF. Please try again.");
  }
}

interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
}

export async function parseMenuItems(text: string): Promise<MenuItem[]> {
  console.log("Starting menu parsing with text:", text);
  const prompt = `You are a menu analysis expert. Extract menu items from the following text and format them as JSON. Each item should have: name, description, price, and category. 

Rules:
1. Ensure descriptions are clear and appetizing
2. Standardize price format (e.g., "14.99")
3. Group similar items into logical categories
4. If a description is not available, infer one from the name and context
5. Clean up any OCR artifacts or formatting issues

Example format:
  [{
    "name": "Margherita Pizza",
    "description": "Fresh tomatoes, mozzarella, and basil",
    "price": "14.99",
    "category": "Pizza"
  }]

Menu text:
${text}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content in response");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error parsing GPT response:", error);
    throw new Error("Failed to parse menu items");
  }
}
