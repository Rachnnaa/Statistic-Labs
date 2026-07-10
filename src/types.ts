export type DistributionType =
  | 'normal'
  | 'binomial'
  | 'poisson'
  | 'uniform'
  | 'exponential'
  | 't'
  | 'chisquare'
  | 'f';

export interface DistributionInfo {
  id: DistributionType;
  name: string;
  type: 'continuous' | 'discrete';
  definition: string;
  formula: string; // LaTeX format
  meanFormula: string;
  varianceFormula: string;
  properties: string[];
  applications: string[];
  realLifeExample: string;
  advantages: string[];
  limitations: string[];
  derivation: string; // Brief LaTeX / explanation
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeProblem {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  question: string;
  answerType: 'number' | 'multiple-choice';
  options?: string[];
  correctAnswer: string; // string representation of the number or choice
  tolerance?: number; // for numeric answers
  solution: string; // step-by-step markdown/LaTeX
}

export interface SavedSettings {
  theme: 'light' | 'dark';
  favorites: DistributionType[];
  completedQuizzes: { date: string; score: number }[];
}
