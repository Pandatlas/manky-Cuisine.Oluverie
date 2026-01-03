
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { OilProduct, AIAnalysis } from "../types";

// Removed global API_KEY constant to ensure it's read from env right before usage.

/**
 * Generates a gastronomic analysis for a specific oil product using Gemini.
 */
export const getOilGastronomy = async (oil: OilProduct): Promise<AIAnalysis> => {
  // Always use a new instance to get the latest API_KEY from process.env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `En tant que Maître Sommelier et Chef étoilé méditerranéen, analyse cette huile d'olive :
  Nom: ${oil.name}, Origine: ${oil.origin}, Description: ${oil.description}.
  
  Génère une analyse gastronomique en français incluant :
  1. Une note de dégustation poétique.
  2. Un plat signature de la cuisine méditerranéenne qui utilise cette huile comme ingrédient central.
  3. La recette détaillée (Nom du plat, Pays d'origine, Ingrédients, Étapes, Histoire culturelle).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sommelierNote: { type: Type.STRING },
            recipe: {
              type: Type.OBJECT,
              properties: {
                dishName: { type: Type.STRING },
                country: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                history: { type: Type.STRING }
              },
              required: ["dishName", "country", "ingredients", "instructions", "history"]
            }
          },
          required: ["sommelierNote", "recipe"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Generates an image of the suggested dish using the gemini image model.
 */
export const generateDishImage = async (dishName: string, country: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `A professional food photography of a traditional dish called '${dishName}' from ${country}. 
  The lighting is natural Mediterranean sun, highly appetizing, 4k, gourmet styling, focus on textures and the shine of premium olive oil.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });
    
    // Find the image part in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return "";
  } catch (error) {
    console.error(error);
    return "";
  }
};

/**
 * Creates a text chat instance for the sommelier assistant.
 */
export const createSommelierChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "Tu es un Maître Sommelier expert en cuisine méditerranéenne. Tu conseilles les meilleurs accords entre huiles d'olive et spécialités régionales (Mezze, Tapas, Antipasti). Ton ton est chaleureux et érudit.",
    },
  });
};

/**
 * Establishes a Live API connection for real-time voice interaction.
 */
export const connectToLiveSommelier = (callbacks: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'Tu es un chef cuisinier italien. Réponds avec passion sur la cuisine à l\'huile d\'olive.',
    },
  });
};

/**
 * Fix: Added the missing getGlobalSummary function used in App.tsx.
 * Generates an overall summary of the trends and flavors from a list of oils.
 */
export const getGlobalSummary = async (oils: OilProduct[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const simplifiedData = oils.map(o => ({ 
    name: o.name, 
    producer: o.producer, 
    origin: o.origin, 
    score: o.score 
  }));
  
  const prompt = `Analyse cette sélection d'huiles d'olive premium pour l'édition 2026 : ${JSON.stringify(simplifiedData)}.
  Fournis une synthèse des tendances actuelles du marché, une cartographie des saveurs dominantes et les perspectives de l'industrie oléicole.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: { type: Type.STRING },
            flavorMap: { type: Type.STRING },
            industryOutlook: { type: Type.STRING }
          },
          required: ["trends", "flavorMap", "industryOutlook"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to generate global summary:", error);
    return { 
      trends: "L'analyse des tendances est actuellement indisponible.", 
      flavorMap: "La cartographie des saveurs n'a pas pu être générée.", 
      industryOutlook: "Les perspectives industrielles sont indisponibles." 
    };
  }
};
