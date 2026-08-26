export interface Analysis {
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
  recommended_roles: string[];
}