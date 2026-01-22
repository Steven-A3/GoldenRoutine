export interface RoutineStep {
  id: number;
  icon: string;
  color: string;
}

export interface DailyIntention {
  feeling: string;
  goal: string;
  affirmation: string;
}

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  sunlightPlan: string;
}

export interface HoroscopeData {
  sign: string;
  keyword: string;
  message: string;
}

export interface JournalEntry {
  date: string;
  content: string;
  gratitude: string[];
}

export interface PersonalTask {
  id: string;
  title: string;
  completed: boolean;
  category: "exercise" | "personal" | "health";
}

export interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
}

export interface RoutineProgress {
  currentStep: number;
  completedSteps: number[];
  startedAt: string | null;
  completedAt: string | null;
}

export const ROUTINE_STEPS: RoutineStep[] = [
  { id: 1, icon: "🔇", color: "from-purple-400 to-indigo-500" },
  { id: 2, icon: "🎯", color: "from-orange-400 to-amber-500" },
  { id: 3, icon: "☀️", color: "from-sky-400 to-blue-500" },
  { id: 4, icon: "📝", color: "from-pink-400 to-rose-500" },
  { id: 5, icon: "🏃", color: "from-green-400 to-emerald-500" },
  { id: 6, icon: "📈", color: "from-slate-400 to-gray-500" },
];
