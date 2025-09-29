export interface AnalyticsTotals {
  totalQuizzes: number;
  activeQuizzes: number;
  totalQuestions: number;
}

export interface CategoryBreakdown {
  category: string;
  quizzes: number;
  activeQuizzes: number;
  totalQuestions: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface AnalyticsData {
  totals: AnalyticsTotals;
  categoryBreakdown: CategoryBreakdown[];
  statusBreakdown: StatusBreakdown[];
}