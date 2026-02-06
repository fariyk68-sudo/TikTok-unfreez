
import { GoogleGenAI, Type } from "@google/genai";
import { TikTokProfile, AccountStatus, BoostStrategy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeTikTokID = async (username: string): Promise<TikTokProfile> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this TikTok username/profile ID: "${username}". 
    Simulate a deep algorithmic health audit.
    Requirements:
    - Status: Choose from [Healthy, Frozen, Warned, Shadowbanned].
    - EngagementRate: Real-world percentage (0-100).
    - RiskLevel: [Low, Medium, High, Critical].
    - Stats: Generate realistic follower counts (10k-2M) and likes (100k-10M).
    - Summary: A 10-15 word professional-sounding diagnosis.
    Format: Strict JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          username: { type: Type.STRING },
          status: { type: Type.STRING, enum: Object.values(AccountStatus) },
          engagementRate: { type: Type.NUMBER },
          followerGrowth: { type: Type.NUMBER },
          averageViews: { type: Type.NUMBER },
          followers: { type: Type.NUMBER },
          likes: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
          analysisSummary: { type: Type.STRING }
        },
        required: ["username", "status", "engagementRate", "riskLevel", "analysisSummary", "followers", "likes"]
      }
    }
  });

  return {
    ...(JSON.parse(response.text) as TikTokProfile),
    timestamp: Date.now()
  };
};

export const getUnfreezeStrategy = async (profile: TikTokProfile): Promise<BoostStrategy> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `CRITICAL: TikTok ID @${profile.username} is flagged as "${profile.status}". 
    Generate a professional "Algorithmic Unfreeze Blueprint". 
    Include 3 technical steps for metadata correction, 5 high-impact hashtags for the current algorithm, 3 specific content pillars to reset engagement, and best posting times.
    Focus on high-growth strategy. Format: Strict JSON.`,
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
