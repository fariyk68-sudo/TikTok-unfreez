
import { GoogleGenAI, Type } from "@google/genai";
import { TikTokProfile, AccountStatus, BoostStrategy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeTikTokID = async (username: string): Promise<TikTokProfile> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this TikTok username/profile ID: "${username}". 
    Simulate a deep algorithmic scan of its engagement history, shadowban markers, and 'frozen' status. 
    Provide a realistic-looking audit report. Return data in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          username: { type: Type.STRING },
          status: { type: Type.STRING, enum: Object.values(AccountStatus) },
          engagementRate: { type: Type.NUMBER, description: "Percentage from 0 to 100" },
          followerGrowth: { type: Type.NUMBER, description: "Trend value" },
          averageViews: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
          analysisSummary: { type: Type.STRING }
        },
        required: ["username", "status", "engagementRate", "riskLevel", "analysisSummary"]
      }
    }
  });

  return JSON.parse(response.text) as TikTokProfile;
};

export const getUnfreezeStrategy = async (profile: TikTokProfile): Promise<BoostStrategy> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The TikTok account @${profile.username} is currently marked as "${profile.status}" with a "${profile.riskLevel}" risk level. 
    Generate a 100% real, actionable "UNFREEZE" and account boost strategy. 
    Include specific steps to bypass algorithmic suppression, high-engagement hashtags, and content pillars.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          bestPostingTimes: { type: Type.ARRAY, items: { type: Type.STRING } },
          contentPillars: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "steps", "hashtags", "bestPostingTimes", "contentPillars"]
      }
    }
  });

  return JSON.parse(response.text) as BoostStrategy;
};
