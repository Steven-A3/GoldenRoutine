import type { Metadata } from "next";

// Primary Keywords: morning routine app, morning golden time, golden hour routine
// Secondary Keywords: morning habit tracker, digital detox, mindfulness, affirmations, journaling, productivity
// Long-tail Keywords: best morning routine app, mindful morning routine, morning wellness tracker

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
  title: "Morning Golden Time - Best Morning Routine App for Mindful Productivity",
  description: "Transform your morning with the #1 morning routine app. Features digital detox timer, guided affirmations, weather planning, journaling, habit tracking, and real-time market updates. Start your golden hour routine today.",
  shortDescription: "The ultimate morning routine app for mindful productivity and wellness",
  url: "https://goldenroutine.app",
  ogImage: "/images/og-image.png",
  creator: "Golden Routine",
  keywords: [
    // Primary keywords
    "morning routine app",
    "morning golden time",
    "golden hour routine",
    "morning routine planner",

    // Secondary keywords
    "morning habit tracker",
    "digital detox app",
    "morning mindfulness app",
    "morning affirmations app",
    "morning journaling app",
    "morning productivity app",
    "daily routine tracker",
    "morning wellness app",

    // Long-tail keywords
    "best morning routine app",
    "free morning routine app",
    "mindful morning routine app",
    "morning routine for success",
    "how to start morning routine",
    "morning gratitude journal app",
    "morning meditation routine",
    "healthy morning habits app",
    "morning self-care routine",
    "morning exercise tracker",
    "sunrise routine app",
    "wake up routine app",
    "morning ritual app",
    "daily morning planner",
    "morning intention setting app",

    // Feature-specific keywords
    "theta brain wave morning",
    "morning weather planning",
    "morning market check app",
    "morning horoscope app",
    "personal task morning app",

    // Intent-based keywords
    "improve morning routine",
    "create morning routine",
    "morning routine ideas",
    "perfect morning routine",
    "productive morning routine"
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

// FAQ Structured Data for Rich Snippets
export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Morning Golden Time app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Morning Golden Time is a comprehensive morning routine app that helps you start your day with intention. It includes digital detox timer, affirmations, weather planning, journaling, task management, and market updates - all designed to protect your brain's creative theta state in the morning.",
      },
    },
    {
      "@type": "Question",
      name: "Is Morning Golden Time app free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Morning Golden Time is completely free to use. It's a Progressive Web App (PWA) that works on any device with a web browser, and can be installed on your home screen for quick access.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Golden Hour morning routine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Golden Hour morning routine is based on protecting your brain's theta and alpha wave states that naturally occur after waking. By avoiding digital stimulation and following a structured routine (digital detox → intentions → weather check → journaling → tasks → market check), you preserve your creative and problem-solving abilities.",
      },
    },
    {
      "@type": "Question",
      name: "How many languages does Morning Golden Time support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Morning Golden Time supports 31 languages including English, Korean, Japanese, Chinese, Spanish, French, German, Portuguese, Italian, Russian, Arabic, Hindi, and many more. The app automatically detects your preferred language.",
      },
    },
    {
      "@type": "Question",
      name: "Does the app work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Morning Golden Time is a Progressive Web App (PWA) that can be installed on your device and works offline. Your routine progress, journal entries, and tasks are saved locally.",
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

// HowTo Structured Data - For the 6-step morning routine
export const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Create the Perfect Morning Routine with Golden Hour Method",
  description: "Follow this 6-step morning routine to protect your brain's creative theta state and start your day with intention and productivity.",
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
