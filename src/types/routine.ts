export interface RoutineStep {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
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
  {
    id: 1,
    title: "세타파 보호",
    subtitle: "Digital Detox",
    icon: "🔇",
    description: "기상 직후 스마트폰 알림, 이메일, 뉴스 확인을 차단합니다",
    color: "from-purple-400 to-indigo-500",
  },
  {
    id: 2,
    title: "의도 설정",
    subtitle: "Intentions & Affirmations",
    icon: "🎯",
    description: "오늘 하루의 기분과 목표를 설정하고 긍정적인 확언을 합니다",
    color: "from-orange-400 to-amber-500",
  },
  {
    id: 3,
    title: "빛과 감정",
    subtitle: "Light & Mood",
    icon: "☀️",
    description: "오늘의 날씨를 확인하고 자연광 노출 계획을 세웁니다",
    color: "from-sky-400 to-blue-500",
  },
  {
    id: 4,
    title: "내면 의식화",
    subtitle: "Journaling",
    icon: "📝",
    description: "오늘의 운세 키워드를 확인하고 짧은 저널링을 합니다",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 5,
    title: "개인 과업",
    subtitle: "Personal Tasks",
    icon: "🏃",
    description: "운동이나 개인적인 중요 프로젝트를 먼저 수행합니다",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: 6,
    title: "시장 확인",
    subtitle: "Market Check",
    icon: "📈",
    description: "주가, 환율, 뉴스를 확인합니다 (마지막 단계)",
    color: "from-slate-400 to-gray-500",
  },
];
