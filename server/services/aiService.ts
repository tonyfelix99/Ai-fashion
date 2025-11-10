import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface AnalysisResult {
  bodyShape: string;
  skinTone: string;
  colorPalette: string[];
}

export async function analyzePhoto(photoUrl: string): Promise<AnalysisResult> {
  try {
    if (!photoUrl.startsWith("https://firebasestorage.googleapis.com")) {
      throw new Error("Invalid photo URL - only Firebase Storage URLs allowed");
    }

    const response = await axios.get(photoUrl, { 
      responseType: "arraybuffer",
      timeout: 10000,
      maxContentLength: 10 * 1024 * 1024,
    });
    const imageBytes = Buffer.from(response.data);

    const prompt = `Analyze this person's photo and provide:
1. Body shape (choose one): hourglass, pear, apple, rectangle, inverted-triangle
2. Skin tone (choose one): fair, light, medium, olive, tan, deep
3. Recommended color palette (3-5 colors that would suit this person)

Respond in JSON format:
{
  "bodyShape": "...",
  "skinTone": "...",
  "colorPalette": ["color1", "color2", "color3"]
}`;

    const contents = [
      {
        inlineData: {
          data: imageBytes.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
      prompt,
    ];

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            bodyShape: { type: "string" },
            skinTone: { type: "string" },
            colorPalette: { type: "array", items: { type: "string" } },
          },
          required: ["bodyShape", "skinTone", "colorPalette"],
        },
      },
      contents: contents,
    });

    const rawJson = aiResponse.text;
    if (!rawJson) {
      throw new Error("Empty response from AI");
    }

    const result: AnalysisResult = JSON.parse(rawJson);
    
    result.bodyShape = result.bodyShape.toLowerCase();
    result.skinTone = result.skinTone.toLowerCase();
    
    return result;
  } catch (error) {
    console.error("Error analyzing photo:", error);
    throw new Error("Failed to analyze photo");
  }
}

export async function generateTryOnImage(
  userPhotoUrl: string,
  modelImageUrl: string,
  fabricDescription: string
): Promise<string> {
  try {
    const prompt = `Generate a realistic virtual try-on image showing a person wearing a ${fabricDescription} outfit. 
The clothing design should match this style. Create a professional fashion photography style image.`;

    const outputPath = path.join(process.cwd(), "generated", `trial_${Date.now()}.png`);
    
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates in response");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content in response");
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const imageData = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(outputPath, imageData);
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data in response");
  } catch (error) {
    console.error("Error generating try-on image:", error);
    return `https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop`;
  }
}
