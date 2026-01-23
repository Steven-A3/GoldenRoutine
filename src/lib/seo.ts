import type { Metadata } from "next";

// TARGET: Real search queries people actually use
// High-volume: "morning routine app", "habit tracker app", "how to wake up early"
// Medium-volume: "best morning routine", "daily routine planner", "morning journal app"
// Long-tail: "5am morning routine", "productive morning routine", "miracle morning app"

// SEO Constants
export const SEO_CONSTANTS = {
  SITE_NAME: "Morning Golden Time",
  DOMAIN: "goldenroutine.app",
  BASE_URL: "https://goldenroutine.app",
  DEFAULT_OG_IMAGE: "/images/og-image.png",
  TWITTER_HANDLE: "@goldenroutine",
  AUTHOR: "Golden Routine Team",
};

export const siteConfig = {
  name: "Morning Golden Time",
  title: "Best Morning Routine App 2025 - Free Habit Tracker & Daily Planner",
  description: "Start your perfect morning routine with our free app. 20-minute guided routine with habit tracking, journaling, affirmations & digital detox. Join 10,000+ people building better mornings.",
  shortDescription: "Free morning routine app with habit tracking, journaling & affirmations",
  url: "https://goldenroutine.app",
  ogImage: "/images/og-image.png",
  creator: "Golden Routine",
  keywords: [
    // HIGH VOLUME - What people actually search
    "morning routine app",
    "habit tracker app free",
    "best morning routine",
    "how to wake up early",
    "morning habits",
    "daily routine planner",

    // MEDIUM VOLUME - Specific intent
    "morning journal app",
    "self care morning routine",
    "5am morning routine",
    "productive morning routine",
    "healthy morning habits",
    "morning motivation app",
    "daily affirmations app",
    "mindfulness morning app",
    "miracle morning app",

    // LONG TAIL - High conversion
    "best morning routine app free",
    "how to start a morning routine",
    "morning routine for success",
    "morning routine ideas",
    "morning routine checklist app",
    "wake up early app",
    "morning habit tracker",
    "daily habit tracker free",
    "gratitude journal app",
    "digital detox app",

    // FEATURE BASED
    "guided morning routine",
    "morning routine timer",
    "morning weather app",
    "journaling app free",
    "affirmation app daily",
  ],
  authors: [{ name: "Golden Routine Team" }],
  category: "Lifestyle & Productivity",
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  category: siteConfig.category,

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR", "ja_JP", "zh_CN", "es_ES", "fr_FR", "de_DE"],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Morning Golden Time - Transform Your Morning Routine",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@goldenroutine",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add your IDs)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // yandex: "your-yandex-verification",
    // bing: "your-bing-verification",
  },

  // App-specific
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },

  // Alternates for i18n
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en": "/en",
      "ko": "/ko",
      "ja": "/ja",
      "zh-CN": "/zh-CN",
      "es": "/es",
      "fr": "/fr",
      "de": "/de",
      "pt": "/pt",
      "it": "/it",
      "ru": "/ru",
      "ar": "/ar",
      "hi": "/hi",
      "th": "/th",
      "vi": "/vi",
      "id": "/id",
      "ms": "/ms",
      "tr": "/tr",
      "pl": "/pl",
      "nl": "/nl",
      "sv": "/sv",
      "da": "/da",
      "no": "/no",
      "fi": "/fi",
      "cs": "/cs",
      "hu": "/hu",
      "ro": "/ro",
      "el": "/el",
      "he": "/he",
      "uk": "/uk",
      "pt-BR": "/pt-BR",
      "zh-TW": "/zh-TW",
    },
  },

  // Other
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "theme-color": "#FBBF24",
    "msapplication-TileColor": "#FBBF24",
  },
};

// Structured Data for Rich Snippets
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  alternateName: "Golden Routine",
  description: siteConfig.description,
  url: siteConfig.url,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web, iOS, Android",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Digital Detox Timer with Theta Wave Protection",
    "Morning Affirmations and Intention Setting",
    "Real-time Weather and Sunlight Planning",
    "Personal Journaling with Gratitude Prompts",
    "Habit Tracking and Task Management",
    "Live Market Data and Financial News",
    "Multi-language Support (31 languages)",
    "PWA - Works Offline",
  ],
  screenshot: `${siteConfig.url}/screenshots/welcome.png`,
  softwareVersion: "1.0.0",
  author: {
    "@type": "Organization",
    name: "Golden Routine",
    url: siteConfig.url,
  },
  publisher: {
    "@type": "Organization",
    name: "Golden Routine",
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/icons/icon-512x512.png`,
    },
  },
};

// FAQ Structured Data - Target real search questions people ask
export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best morning routine app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Morning Golden Time is a free morning routine app that guides you through a 20-minute routine with 6 steps: digital detox, intention setting, weather check, journaling, habit tracking, and optional market updates. It's designed to help you wake up with purpose and build healthy morning habits.",
      },
    },
    {
      "@type": "Question",
      name: "How do I start a morning routine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start by waking up just 20 minutes earlier and following a simple routine: 1) Avoid your phone for 5 minutes (digital detox), 2) Set your intention for the day, 3) Check the weather to plan your day, 4) Write in a journal, 5) Complete 2-3 morning tasks like drinking water or stretching. Morning Golden Time app guides you through each step.",
      },
    },
    {
      "@type": "Question",
      name: "Is this habit tracker app really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Morning Golden Time is 100% free with no hidden costs or premium subscriptions. It works in your browser and can be installed on your phone like a regular app. No account required - just open and start your morning routine.",
      },
    },
    {
      "@type": "Question",
      name: "How can I wake up early and not feel tired?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The key is having something meaningful to wake up for. Our app helps by giving you a structured 20-minute routine that energizes you: start with avoiding screens (protects your brain's natural wake-up state), set positive intentions, and complete small achievable tasks. This creates momentum that makes waking up easier over time.",
      },
    },
    {
      "@type": "Question",
      name: "What should I do first thing in the morning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Research shows you should avoid checking your phone immediately. Instead: 1) Take a few deep breaths, 2) Think about how you want to feel today, 3) Drink water, 4) Do light movement or stretching. Our morning routine app guides you through the ideal first-thing-in-the-morning activities.",
      },
    },
  ],
};

// BreadcrumbList for navigation
export const breadcrumbStructuredData = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// HowTo Structured Data - Target "how to" searches
export const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Start a Morning Routine That Actually Works (6 Simple Steps)",
  description: "Learn how to build a healthy morning routine in just 20 minutes. This step-by-step guide helps you wake up early, stay productive, and build better habits.",
  image: `${siteConfig.url}/images/og-image.png`,
  totalTime: "PT20M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: "0",
  },
  supply: [],
  tool: [
    {
      "@type": "HowToTool",
      name: "Morning Golden Time App",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Digital Detox",
      text: "Start with a 5-minute digital detox to protect your brain's natural theta waves. Avoid checking phones, emails, or social media.",
      image: `${siteConfig.url}/images/steps/digital-detox.png`,
      url: `${siteConfig.url}/en#step1`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Set Your Intentions",
      text: "Choose how you want to feel today and set your primary goal. Write a personal affirmation to guide your day.",
      image: `${siteConfig.url}/images/steps/intentions.png`,
      url: `${siteConfig.url}/en#step2`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Check the Weather",
      text: "Review today's weather and sunrise/sunset times to plan your outdoor activities and clothing.",
      image: `${siteConfig.url}/images/steps/weather.png`,
      url: `${siteConfig.url}/en#step3`,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Morning Journaling",
      text: "Practice gratitude and reflect on your thoughts through guided journaling prompts.",
      image: `${siteConfig.url}/images/steps/journaling.png`,
      url: `${siteConfig.url}/en#step4`,
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Personal Tasks",
      text: "Complete your morning tasks like stretching, drinking water, and setting your top priority.",
      image: `${siteConfig.url}/images/steps/tasks.png`,
      url: `${siteConfig.url}/en#step5`,
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Market Check",
      text: "After completing mindful activities, check market data and financial news to stay informed.",
      image: `${siteConfig.url}/images/steps/market.png`,
      url: `${siteConfig.url}/en#step6`,
    },
  ],
};

// SoftwareApplication Structured Data (Mobile App specific)
export const softwareApplicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  operatingSystem: "Web, iOS, Android",
  applicationCategory: "LifestyleApplication",
  applicationSubCategory: "Health & Fitness",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
  downloadUrl: siteConfig.url,
  installUrl: siteConfig.url,
  permissions: "none",
  memoryRequirements: "10MB",
  storageRequirements: "50MB",
  releaseNotes: "Version 1.0 - Initial release with 6-step morning routine",
  softwareVersion: "1.0.0",
  datePublished: "2024-01-01",
  inLanguage: [
    "en", "ko", "ja", "zh-CN", "zh-TW", "es", "fr", "de", "it",
    "pt", "pt-BR", "ru", "ar", "hi", "th", "vi", "id", "ms",
    "tr", "pl", "nl", "sv", "da", "no", "fi", "cs", "hu",
    "el", "he", "uk", "ro"
  ],
  screenshot: [
    {
      "@type": "ImageObject",
      url: `${siteConfig.url}/screenshots/welcome.png`,
      caption: "Welcome Screen - Morning Golden Time",
    },
    {
      "@type": "ImageObject",
      url: `${siteConfig.url}/screenshots/routine.png`,
      caption: "Routine Steps - Morning Golden Time",
    },
  ],
};

// ItemList Structured Data - For featuring the 6 steps
export const stepsItemListStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Morning Golden Time Routine Steps",
  description: "6 essential steps for the perfect morning routine",
  numberOfItems: 6,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Digital Detox",
      description: "Protect your brain's theta waves with a 5-minute digital detox",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Set Intentions",
      description: "Choose your mood, set goals, and write affirmations",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Weather Check",
      description: "Plan your day with weather and sunrise information",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Journaling",
      description: "Practice gratitude and reflection through journaling",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Personal Tasks",
      description: "Complete your morning tasks and set priorities",
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Market Check",
      description: "Review financial markets and stay informed",
    },
  ],
};

// Action-based Structured Data for Google Actions
export const potentialActionsStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: [
    {
      "@type": "ViewAction",
      name: "Start Morning Routine",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/{locale}`,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
          "https://schema.org/IOSPlatform",
          "https://schema.org/AndroidPlatform",
        ],
      },
    },
    {
      "@type": "ShareAction",
      name: "Share Your Results",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/{locale}/share`,
      },
    },
  ],
};

// Generate page-specific metadata
export function generatePageMetadata({
  title,
  description,
  path = "",
  locale = "en",
  ogImage,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  locale?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}/${locale}${path ? `/${path}` : ""}`;
  const image = ogImage || `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: locale.replace("-", "_"),
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@goldenroutine",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// Generate share page metadata with dynamic content
export function generateShareMetadata({
  locale = "en",
  feeling,
  goal,
  duration,
}: {
  locale?: string;
  feeling?: string;
  goal?: string;
  duration?: number;
}): Metadata {
  const baseTitle = "Someone completed their Golden Routine!";
  const title = goal
    ? `${baseTitle} Goal: ${goal.substring(0, 50)}${goal.length > 50 ? "..." : ""}`
    : baseTitle;

  const description = feeling
    ? `They're feeling ${feeling} after completing ${duration || 20} minutes of mindful morning routine. Try it yourself!`
    : `Complete your own morning routine with Morning Golden Time - the free app for mindful productivity.`;

  return generatePageMetadata({
    title,
    description,
    path: "share",
    locale,
  });
}
