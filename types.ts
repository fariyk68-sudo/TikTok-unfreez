
export enum AccountStatus {
  HEALTHY = 'Healthy',
  FROZEN = 'Frozen',
  WARNED = 'Warned',
  SHADOWBANNED = 'Shadowbanned'
}

export interface TikTokProfile {
  username: string;
  status: AccountStatus;
  engagementRate: number;
  followerGrowth: number;
  averageViews: number;
  followers: number;
  likes: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  analysisSummary: string;
  timestamp: number;
}

export interface BoostStrategy {
  title: string;
  steps: string[];
  hashtags: string[];
  bestPostingTimes: string[];
  contentPillars: string[];
}

export interface AnalysisState {
  loading: boolean;
  scanStep: string;
  profile: TikTokProfile | null;
  boost: BoostStrategy | null;
  error: string | null;
  history: TikTokProfile[];
}
