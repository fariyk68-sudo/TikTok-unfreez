
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
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  analysisSummary: string;
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
  profile: TikTokProfile | null;
  boost: BoostStrategy | null;
  error: string | null;
}
