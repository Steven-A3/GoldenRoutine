/**
 * Zodiac Fortune Generation System
 * Generates daily horoscope fortunes with lucky elements
 */

export type ZodiacSign =
  | "aries" | "taurus" | "gemini" | "cancer"
  | "leo" | "virgo" | "libra" | "scorpio"
  | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type ColorKey =
  | "red" | "scarlet" | "coral" | "orange" | "green" | "pink" | "turquoise"
  | "earthBrown" | "yellow" | "lightBlue" | "silver" | "lavender" | "white"
  | "seaGreen" | "pearl" | "gold" | "royalPurple" | "sunnyYellow" | "navyBlue"
  | "gray" | "tan" | "forestGreen" | "peach" | "deepRed" | "black" | "maroon"
  | "purple" | "royalBlue" | "brown" | "darkGreen" | "charcoal" | "electricBlue"
  | "violet" | "aquamarine" | "lightPurple";

export type MoodKey =
  | "energetic" | "calm" | "inspired" | "reflective" | "adventurous"
  | "romantic" | "focused" | "creative" | "peaceful" | "determined"
  | "optimistic" | "balanced" | "passionate" | "intuitive" | "grounded";

export type FortuneKey =
  | "aries1" | "aries2" | "aries3" | "aries4" | "aries5" | "aries6" | "aries7" | "aries8"
  | "taurus1" | "taurus2" | "taurus3" | "taurus4" | "taurus5" | "taurus6" | "taurus7" | "taurus8"
  | "gemini1" | "gemini2" | "gemini3" | "gemini4" | "gemini5" | "gemini6" | "gemini7" | "gemini8"
  | "cancer1" | "cancer2" | "cancer3" | "cancer4" | "cancer5" | "cancer6" | "cancer7" | "cancer8"
  | "leo1" | "leo2" | "leo3" | "leo4" | "leo5" | "leo6" | "leo7" | "leo8"
  | "virgo1" | "virgo2" | "virgo3" | "virgo4" | "virgo5" | "virgo6" | "virgo7" | "virgo8"
  | "libra1" | "libra2" | "libra3" | "libra4" | "libra5" | "libra6" | "libra7" | "libra8"
  | "scorpio1" | "scorpio2" | "scorpio3" | "scorpio4" | "scorpio5" | "scorpio6" | "scorpio7" | "scorpio8"
  | "sagittarius1" | "sagittarius2" | "sagittarius3" | "sagittarius4" | "sagittarius5" | "sagittarius6" | "sagittarius7" | "sagittarius8"
  | "capricorn1" | "capricorn2" | "capricorn3" | "capricorn4" | "capricorn5" | "capricorn6" | "capricorn7" | "capricorn8"
  | "aquarius1" | "aquarius2" | "aquarius3" | "aquarius4" | "aquarius5" | "aquarius6" | "aquarius7" | "aquarius8"
  | "pisces1" | "pisces2" | "pisces3" | "pisces4" | "pisces5" | "pisces6" | "pisces7" | "pisces8";

export interface ZodiacFortune {
  sign: ZodiacSign;
  fortuneKey: FortuneKey;
  luckyNumbers: number[];
  luckyColorKey: ColorKey;
  luckyColorHex: string;
  compatibility: ZodiacSign;
  moodKey: MoodKey;
  loveScore: number;
  careerScore: number;
  healthScore: number;
  overallScore: number;
}

// Seeded random number generator for consistent daily fortunes
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Get today's seed (consistent for the entire day)
function getDailySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

// Fortune templates for each zodiac sign (positive and encouraging)
const FORTUNE_TEMPLATES: Record<ZodiacSign, string[]> = {
  aries: [
    "Your natural leadership shines today. A bold decision leads to unexpected success.",
    "The universe rewards your courage. Take that leap of faith you've been considering.",
    "Your energy is magnetic today. Others are drawn to your confident spirit.",
    "A new beginning emerges from your determination. Trust your instincts.",
    "Your pioneering spirit opens doors. Adventure awaits those who dare.",
    "The stars align for your ambitions. Your passion becomes your power.",
    "Victory favors the bold today. Your fearless approach brings rewards.",
    "An exciting opportunity matches your dynamic energy. Seize the moment."
  ],
  taurus: [
    "Patience today brings lasting rewards. Your steady approach wins the day.",
    "Financial luck flows your way. Trust your practical wisdom in matters of value.",
    "Your reliability attracts wonderful opportunities. Stay true to your path.",
    "The earth's energy grounds and supports you. Abundance is within reach.",
    "Your dedication bears fruit. The seeds you've planted begin to bloom.",
    "Comfort and joy surround you today. Embrace life's simple pleasures.",
    "Your sensible nature guides you to prosperity. Trust the process.",
    "Stability you've built creates new possibilities. Security brings freedom."
  ],
  gemini: [
    "Your wit and charm open new connections. Communication brings good fortune.",
    "Curiosity leads to discovery today. Your quick mind sees opportunities others miss.",
    "Conversations spark brilliant ideas. Share your thoughts freely.",
    "Your adaptability is your superpower. Change brings positive transformation.",
    "Mental agility brings success. Your versatile nature shines bright.",
    "New information arrives that changes everything for the better.",
    "Your social skills create valuable bonds. Networking brings rewards.",
    "Express yourself boldly. Your words have the power to inspire."
  ],
  cancer: [
    "Your intuition is especially strong today. Trust your inner voice.",
    "Home and family bring deep joy. Nurturing bonds grow stronger.",
    "Emotional intelligence guides you to success. Your sensitivity is a gift.",
    "The moon blesses your endeavors. Creative inspiration flows freely.",
    "Your caring nature attracts loyal supporters. Love surrounds you.",
    "A safe space you've created becomes a source of opportunity.",
    "Your protective instincts serve you well. Trust your heart.",
    "Deep connections form today. Your authenticity draws others close."
  ],
  leo: [
    "Your natural radiance attracts admiration. Let your light shine bright.",
    "Creative expression brings recognition. Your talents deserve celebration.",
    "Leadership opportunities emerge. Others look to you for guidance.",
    "The sun's energy amplifies your charisma. Confidence is your crown.",
    "Generosity returns to you multiplied. Your warm heart wins hearts.",
    "Center stage awaits. Your performance today earns standing ovation.",
    "Pride in your work attracts praise. Excellence is noticed.",
    "Your royal spirit commands respect. Rule your domain with grace."
  ],
  virgo: [
    "Your attention to detail reveals hidden opportunities. Precision pays off.",
    "Health and wellness efforts show positive results. Self-care is rewarded.",
    "Organization brings clarity and success. Your systems work perfectly.",
    "Analytical skills solve a puzzling situation. Logic leads to victory.",
    "Service to others brings unexpected benefits. Kindness returns to you.",
    "Perfectionism becomes productive today. Quality work is recognized.",
    "Your practical nature guides wise decisions. Common sense prevails.",
    "A methodical approach yields impressive results. Trust your process."
  ],
  libra: [
    "Harmony in relationships brings happiness. Balance creates beauty.",
    "Diplomatic skills resolve a tricky situation. Peace brings prosperity.",
    "Aesthetic sense guides successful choices. Beauty surrounds you.",
    "Partnership opportunities emerge. Collaboration multiplies success.",
    "Justice and fairness work in your favor. Equilibrium is restored.",
    "Social grace opens important doors. Charm is your passport.",
    "Artistic pursuits bring recognition. Your eye for beauty shines.",
    "Balance between work and pleasure brings fulfillment today."
  ],
  scorpio: [
    "Your intensity attracts powerful allies. Depth creates strong bonds.",
    "Transformation brings positive rebirth. Let go and grow.",
    "Intuitive insights reveal hidden truths. Your perception is accurate.",
    "Passionate pursuits lead to success. Your determination is unstoppable.",
    "Mystery works in your favor. Strategic silence brings advantage.",
    "Deep connections strengthen today. Loyalty is rewarded.",
    "Your resilience inspires others. Rising from challenges makes you stronger.",
    "Hidden resources come to light. Secret support emerges."
  ],
  sagittarius: [
    "Adventure calls and fortune follows. Expand your horizons boldly.",
    "Optimism attracts luck today. Your positive outlook manifests good things.",
    "Learning brings enlightenment. Knowledge opens unexpected doors.",
    "Travel plans align favorably. New perspectives bring growth.",
    "Philosophical insights bring peace. Wisdom guides your path.",
    "Generosity of spirit returns multiplied. Share your abundance.",
    "Freedom brings opportunity. Independence leads to discovery.",
    "Your adventurous spirit discovers hidden treasures. Explore boldly."
  ],
  capricorn: [
    "Your ambition reaches new heights. Hard work yields impressive results.",
    "Career advancement is strongly favored. Your dedication is noticed.",
    "Long-term plans begin to materialize. Patience meets opportunity.",
    "Practical wisdom guides successful decisions. Experience pays off.",
    "Authority figures recognize your worth. Respect is well-earned.",
    "Financial prudence creates security. Your discipline brings rewards.",
    "Goal achievement is within reach. Persistence brings victory.",
    "Your structured approach builds lasting success. Foundations are solid."
  ],
  aquarius: [
    "Innovation brings breakthrough success. Your unique ideas shine.",
    "Humanitarian efforts create positive ripples. Kindness matters.",
    "Technology opens new possibilities. Embrace the future.",
    "Friendship brings unexpected blessings. Your network supports you.",
    "Original thinking solves old problems. Creativity flows freely.",
    "Progressive ideas gain acceptance. You're ahead of your time.",
    "Community involvement brings fulfillment. Together we achieve more.",
    "Your independent spirit attracts like-minded souls. Be yourself boldly."
  ],
  pisces: [
    "Creative inspiration flows abundantly. Art becomes healing.",
    "Spiritual insights bring peace and clarity. Trust your dreams.",
    "Compassion creates miracles today. Empathy is your superpower.",
    "Intuition guides you perfectly. Inner wisdom knows the way.",
    "Imagination manifests reality. Dream big and believe.",
    "Emotional depth creates meaningful connections. Sensitivity is strength.",
    "Artistic expression brings recognition. Your soul speaks through creation.",
    "The universe conspires in your favor. Magic is real today."
  ]
};

// Lucky colors for each sign (using translation keys)
const LUCKY_COLORS: Record<ZodiacSign, Array<{ key: ColorKey; hex: string }>> = {
  aries: [
    { key: "red", hex: "#DC2626" },
    { key: "scarlet", hex: "#FF2400" },
    { key: "coral", hex: "#FF7F50" },
    { key: "orange", hex: "#F97316" }
  ],
  taurus: [
    { key: "green", hex: "#16A34A" },
    { key: "pink", hex: "#EC4899" },
    { key: "turquoise", hex: "#40E0D0" },
    { key: "earthBrown", hex: "#8B4513" }
  ],
  gemini: [
    { key: "yellow", hex: "#EAB308" },
    { key: "lightBlue", hex: "#60A5FA" },
    { key: "silver", hex: "#C0C0C0" },
    { key: "lavender", hex: "#E6E6FA" }
  ],
  cancer: [
    { key: "silver", hex: "#C0C0C0" },
    { key: "white", hex: "#FFFFFF" },
    { key: "seaGreen", hex: "#2E8B57" },
    { key: "pearl", hex: "#FDEEF4" }
  ],
  leo: [
    { key: "gold", hex: "#FFD700" },
    { key: "orange", hex: "#F97316" },
    { key: "royalPurple", hex: "#7851A9" },
    { key: "sunnyYellow", hex: "#FFE135" }
  ],
  virgo: [
    { key: "navyBlue", hex: "#1E3A5F" },
    { key: "gray", hex: "#6B7280" },
    { key: "tan", hex: "#D2B48C" },
    { key: "forestGreen", hex: "#228B22" }
  ],
  libra: [
    { key: "pink", hex: "#EC4899" },
    { key: "lightBlue", hex: "#60A5FA" },
    { key: "lavender", hex: "#E6E6FA" },
    { key: "peach", hex: "#FFCBA4" }
  ],
  scorpio: [
    { key: "deepRed", hex: "#8B0000" },
    { key: "black", hex: "#1F2937" },
    { key: "maroon", hex: "#800000" },
    { key: "purple", hex: "#9333EA" }
  ],
  sagittarius: [
    { key: "purple", hex: "#9333EA" },
    { key: "turquoise", hex: "#40E0D0" },
    { key: "royalBlue", hex: "#4169E1" },
    { key: "orange", hex: "#F97316" }
  ],
  capricorn: [
    { key: "brown", hex: "#92400E" },
    { key: "black", hex: "#1F2937" },
    { key: "darkGreen", hex: "#14532D" },
    { key: "charcoal", hex: "#36454F" }
  ],
  aquarius: [
    { key: "electricBlue", hex: "#7DF9FF" },
    { key: "turquoise", hex: "#40E0D0" },
    { key: "violet", hex: "#8B5CF6" },
    { key: "silver", hex: "#C0C0C0" }
  ],
  pisces: [
    { key: "seaGreen", hex: "#2E8B57" },
    { key: "lavender", hex: "#E6E6FA" },
    { key: "aquamarine", hex: "#7FFFD4" },
    { key: "lightPurple", hex: "#A855F7" }
  ]
};

// Zodiac compatibility chart (best matches)
const COMPATIBILITY: Record<ZodiacSign, ZodiacSign[]> = {
  aries: ["leo", "sagittarius", "gemini", "aquarius"],
  taurus: ["virgo", "capricorn", "cancer", "pisces"],
  gemini: ["libra", "aquarius", "aries", "leo"],
  cancer: ["scorpio", "pisces", "taurus", "virgo"],
  leo: ["aries", "sagittarius", "gemini", "libra"],
  virgo: ["taurus", "capricorn", "cancer", "scorpio"],
  libra: ["gemini", "aquarius", "leo", "sagittarius"],
  scorpio: ["cancer", "pisces", "virgo", "capricorn"],
  sagittarius: ["aries", "leo", "libra", "aquarius"],
  capricorn: ["taurus", "virgo", "scorpio", "pisces"],
  aquarius: ["gemini", "libra", "aries", "sagittarius"],
  pisces: ["cancer", "scorpio", "taurus", "capricorn"]
};

// Moods (using translation keys)
const MOOD_KEYS: MoodKey[] = [
  "energetic", "calm", "inspired", "reflective", "adventurous",
  "romantic", "focused", "creative", "peaceful", "determined",
  "optimistic", "balanced", "passionate", "intuitive", "grounded"
];

// Fortune template keys for each sign
const FORTUNE_KEYS: Record<ZodiacSign, FortuneKey[]> = {
  aries: ["aries1", "aries2", "aries3", "aries4", "aries5", "aries6", "aries7", "aries8"],
  taurus: ["taurus1", "taurus2", "taurus3", "taurus4", "taurus5", "taurus6", "taurus7", "taurus8"],
  gemini: ["gemini1", "gemini2", "gemini3", "gemini4", "gemini5", "gemini6", "gemini7", "gemini8"],
  cancer: ["cancer1", "cancer2", "cancer3", "cancer4", "cancer5", "cancer6", "cancer7", "cancer8"],
  leo: ["leo1", "leo2", "leo3", "leo4", "leo5", "leo6", "leo7", "leo8"],
  virgo: ["virgo1", "virgo2", "virgo3", "virgo4", "virgo5", "virgo6", "virgo7", "virgo8"],
  libra: ["libra1", "libra2", "libra3", "libra4", "libra5", "libra6", "libra7", "libra8"],
  scorpio: ["scorpio1", "scorpio2", "scorpio3", "scorpio4", "scorpio5", "scorpio6", "scorpio7", "scorpio8"],
  sagittarius: ["sagittarius1", "sagittarius2", "sagittarius3", "sagittarius4", "sagittarius5", "sagittarius6", "sagittarius7", "sagittarius8"],
  capricorn: ["capricorn1", "capricorn2", "capricorn3", "capricorn4", "capricorn5", "capricorn6", "capricorn7", "capricorn8"],
  aquarius: ["aquarius1", "aquarius2", "aquarius3", "aquarius4", "aquarius5", "aquarius6", "aquarius7", "aquarius8"],
  pisces: ["pisces1", "pisces2", "pisces3", "pisces4", "pisces5", "pisces6", "pisces7", "pisces8"]
};

/**
 * Generate a daily fortune for a specific zodiac sign
 */
export function generateDailyFortune(sign: ZodiacSign): ZodiacFortune {
  const seed = getDailySeed();
  const signSeed = seed + sign.charCodeAt(0) * 1000;
  const random = seededRandom(signSeed);

  // Select fortune key
  const fortuneKeys = FORTUNE_KEYS[sign];
  const fortuneIndex = Math.floor(random() * fortuneKeys.length);
  const fortuneKey = fortuneKeys[fortuneIndex];

  // Generate lucky numbers (3 unique numbers between 1-49)
  const luckyNumbers: number[] = [];
  while (luckyNumbers.length < 3) {
    const num = Math.floor(random() * 49) + 1;
    if (!luckyNumbers.includes(num)) {
      luckyNumbers.push(num);
    }
  }
  luckyNumbers.sort((a, b) => a - b);

  // Select lucky color
  const colors = LUCKY_COLORS[sign];
  const colorIndex = Math.floor(random() * colors.length);
  const luckyColorKey = colors[colorIndex].key;
  const luckyColorHex = colors[colorIndex].hex;

  // Select compatibility
  const compatibleSigns = COMPATIBILITY[sign];
  const compatIndex = Math.floor(random() * compatibleSigns.length);
  const compatibility = compatibleSigns[compatIndex];

  // Select mood
  const moodIndex = Math.floor(random() * MOOD_KEYS.length);
  const moodKey = MOOD_KEYS[moodIndex];

  // Generate scores (between 60-100 for positive outlook)
  const loveScore = Math.floor(random() * 41) + 60;
  const careerScore = Math.floor(random() * 41) + 60;
  const healthScore = Math.floor(random() * 41) + 60;
  const overallScore = Math.round((loveScore + careerScore + healthScore) / 3);

  return {
    sign,
    fortuneKey,
    luckyNumbers,
    luckyColorKey,
    luckyColorHex,
    compatibility,
    moodKey,
    loveScore,
    careerScore,
    healthScore,
    overallScore
  };
}

/**
 * Get all zodiac signs
 */
export function getAllZodiacSigns(): ZodiacSign[] {
  return [
    "aries", "taurus", "gemini", "cancer",
    "leo", "virgo", "libra", "scorpio",
    "sagittarius", "capricorn", "aquarius", "pisces"
  ];
}

/**
 * Get zodiac sign date range
 */
export function getZodiacDateRange(sign: ZodiacSign): string {
  const ranges: Record<ZodiacSign, string> = {
    aries: "Mar 21 - Apr 19",
    taurus: "Apr 20 - May 20",
    gemini: "May 21 - Jun 20",
    cancer: "Jun 21 - Jul 22",
    leo: "Jul 23 - Aug 22",
    virgo: "Aug 23 - Sep 22",
    libra: "Sep 23 - Oct 22",
    scorpio: "Oct 23 - Nov 21",
    sagittarius: "Nov 22 - Dec 21",
    capricorn: "Dec 22 - Jan 19",
    aquarius: "Jan 20 - Feb 18",
    pisces: "Feb 19 - Mar 20"
  };
  return ranges[sign];
}

/**
 * Get zodiac element
 */
export function getZodiacElement(sign: ZodiacSign): "fire" | "earth" | "air" | "water" {
  const elements: Record<ZodiacSign, "fire" | "earth" | "air" | "water"> = {
    aries: "fire",
    taurus: "earth",
    gemini: "air",
    cancer: "water",
    leo: "fire",
    virgo: "earth",
    libra: "air",
    scorpio: "water",
    sagittarius: "fire",
    capricorn: "earth",
    aquarius: "air",
    pisces: "water"
  };
  return elements[sign];
}
