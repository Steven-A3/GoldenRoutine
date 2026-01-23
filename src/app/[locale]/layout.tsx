import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { locales, isRtlLocale, type Locale } from "@/i18n/config";
import {
  defaultMetadata,
  structuredData,
  faqStructuredData,
  siteConfig,
  howToStructuredData,
  softwareApplicationStructuredData,
  stepsItemListStructuredData,
  potentialActionsStructuredData,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = defaultMetadata;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// SEO-optimized locale titles and descriptions for all 31 languages
const localeMetadata: Record<string, { title: string; description: string; keywords: string }> = {
  en: {
    title: "Morning Golden Time - Best Morning Routine App for Mindful Productivity",
    description: "Transform your morning with the #1 morning routine app. Digital detox, affirmations, weather planning, journaling, and habit tracking. Start your golden hour routine today!",
    keywords: "morning routine app, morning golden time, golden hour routine, morning habit tracker, digital detox app, morning mindfulness, morning affirmations, morning journaling, morning productivity, daily routine tracker, best morning routine app, mindful morning routine, wake up routine, healthy morning habits",
  },
  ko: {
    title: "모닝 골든 타임 - 최고의 아침 루틴 앱 | 마음챙김 생산성",
    description: "최고의 아침 루틴 앱으로 아침을 황금빛으로 물들이세요. 디지털 디톡스, 확언, 날씨 확인, 저널링, 습관 추적 기능을 제공합니다.",
    keywords: "아침 루틴 앱, 모닝 골든 타임, 골든 아워 루틴, 아침 습관 추적기, 디지털 디톡스, 아침 마음챙김, 아침 확언, 아침 저널링, 아침 생산성, 일일 루틴",
  },
  ja: {
    title: "モーニングゴールデンタイム - 最高の朝ルーティンアプリ | マインドフル生産性",
    description: "究極のルーティンアプリで朝を黄金の時間に変えましょう。デジタルデトックス、アファメーション、天気予報、ジャーナリング、習慣追跡機能。",
    keywords: "朝ルーティンアプリ, モーニングゴールデンタイム, ゴールデンアワールーティン, 朝の習慣トラッカー, デジタルデトックス, 朝のマインドフルネス, 朝のアファメーション, 朝のジャーナリング",
  },
  "zh-CN": {
    title: "早晨黄金时间 - 最佳晨间习惯追踪应用 | 正念生产力",
    description: "使用排名第一的晨间习惯应用，将您的早晨变成黄金时刻。数字排毒、肯定语、天气规划、日记和习惯追踪功能。",
    keywords: "晨间习惯应用, 早晨黄金时间, 黄金时刻习惯, 习惯追踪器, 数字排毒, 晨间正念, 肯定语, 晨间日记, 生产力应用",
  },
  "zh-TW": {
    title: "早晨黃金時間 - 最佳晨間習慣追蹤應用 | 正念生產力",
    description: "使用排名第一的晨間習慣應用，將您的早晨變成黃金時刻。數位排毒、肯定語、天氣規劃、日記和習慣追蹤功能。",
    keywords: "晨間習慣應用, 早晨黃金時間, 黃金時刻習慣, 習慣追蹤器, 數位排毒, 晨間正念, 肯定語, 晨間日記, 生產力應用",
  },
  es: {
    title: "Morning Golden Time - La Mejor App de Rutina Matutina | Productividad Consciente",
    description: "Transforma tu mañana con la app de rutina matutina #1. Desintoxicación digital, afirmaciones, planificación del clima, diario y seguimiento de hábitos.",
    keywords: "app rutina matutina, morning golden time, rutina hora dorada, seguimiento hábitos mañana, desintoxicación digital, mindfulness mañana, afirmaciones matutinas, diario matutino, productividad mañana",
  },
  fr: {
    title: "Morning Golden Time - Meilleure App de Routine Matinale | Productivité Consciente",
    description: "Transformez votre matinée avec l'app de routine matinale #1. Détox numérique, affirmations, météo, journal et suivi des habitudes.",
    keywords: "app routine matinale, morning golden time, routine heure dorée, suivi habitudes matin, détox numérique, pleine conscience matin, affirmations matinales, journal matinal, productivité matin",
  },
  de: {
    title: "Morning Golden Time - Beste Morgenroutine-App | Achtsame Produktivität",
    description: "Verwandeln Sie Ihren Morgen mit der #1 Morgenroutine-App. Digital Detox, Affirmationen, Wetterplanung, Tagebuch und Gewohnheitstracking.",
    keywords: "Morgenroutine App, Morning Golden Time, goldene Stunde Routine, Gewohnheitstracker Morgen, Digital Detox, Achtsamkeit Morgen, Morgen Affirmationen, Morgen Tagebuch, Produktivität Morgen",
  },
  it: {
    title: "Morning Golden Time - Migliore App Routine Mattutina | Produttività Consapevole",
    description: "Trasforma la tua mattina con l'app di routine mattutina #1. Digital detox, affermazioni, pianificazione meteo, diario e tracciamento abitudini.",
    keywords: "app routine mattutina, morning golden time, routine ora d'oro, tracker abitudini mattina, digital detox, mindfulness mattina, affermazioni mattutine, diario mattutino",
  },
  pt: {
    title: "Morning Golden Time - Melhor App de Rotina Matinal | Produtividade Consciente",
    description: "Transforme sua manhã com o app de rotina matinal #1. Detox digital, afirmações, planejamento do tempo, diário e acompanhamento de hábitos.",
    keywords: "app rotina matinal, morning golden time, rotina hora dourada, rastreador hábitos manhã, detox digital, mindfulness manhã, afirmações matinais, diário matinal",
  },
  "pt-BR": {
    title: "Morning Golden Time - Melhor App de Rotina Matinal | Produtividade Consciente",
    description: "Transforme sua manhã com o app de rotina matinal #1. Detox digital, afirmações, planejamento do tempo, diário e acompanhamento de hábitos.",
    keywords: "app rotina matinal, morning golden time, rotina hora dourada, rastreador hábitos manhã, detox digital, mindfulness manhã, afirmações matinais, diário matinal, produtividade manhã",
  },
  ru: {
    title: "Morning Golden Time - Лучшее приложение для утренней рутины",
    description: "Преобразите свое утро с приложением #1 для утренней рутины. Цифровой детокс, аффирмации, планирование по погоде, ведение дневника и отслеживание привычек.",
    keywords: "приложение утренняя рутина, morning golden time, золотой час рутина, трекер утренних привычек, цифровой детокс, утренняя осознанность, утренние аффирмации",
  },
  ar: {
    title: "Morning Golden Time - أفضل تطبيق روتين صباحي | إنتاجية واعية",
    description: "حوّل صباحك مع تطبيق الروتين الصباحي رقم 1. ديتوكس رقمي، تأكيدات، تخطيط الطقس، يوميات وتتبع العادات.",
    keywords: "تطبيق روتين صباحي, morning golden time, روتين الساعة الذهبية, متتبع عادات الصباح, ديتوكس رقمي, وعي صباحي, تأكيدات صباحية",
  },
  hi: {
    title: "Morning Golden Time - सर्वश्रेष्ठ सुबह की दिनचर्या ऐप | सचेत उत्पादकता",
    description: "नंबर 1 सुबह की दिनचर्या ऐप के साथ अपनी सुबह को बदलें। डिजिटल डिटॉक्स, पुष्टि, मौसम योजना, जर्नलिंग और आदत ट्रैकिंग।",
    keywords: "सुबह की दिनचर्या ऐप, morning golden time, गोल्डन आवर रूटीन, सुबह आदत ट्रैकर, डिजिटल डिटॉक्स, सुबह माइंडफुलनेस, सुबह पुष्टि",
  },
  th: {
    title: "Morning Golden Time - แอพกิจวัตรตอนเช้าที่ดีที่สุด | ประสิทธิภาพอย่างมีสติ",
    description: "เปลี่ยนเช้าของคุณด้วยแอพกิจวัตรตอนเช้าอันดับ 1 ดิจิทัลดีท็อกซ์ การยืนยัน การวางแผนสภาพอากาศ การเขียนบันทึก และการติดตามนิสัย",
    keywords: "แอพกิจวัตรตอนเช้า, morning golden time, กิจวัตรชั่วโมงทอง, ตัวติดตามนิสัยตอนเช้า, ดิจิทัลดีท็อกซ์, สติตอนเช้า, การยืนยันตอนเช้า",
  },
  vi: {
    title: "Morning Golden Time - Ứng dụng Thói quen Buổi sáng Tốt nhất | Năng suất Chánh niệm",
    description: "Biến đổi buổi sáng của bạn với ứng dụng thói quen buổi sáng #1. Digital detox, khẳng định, lập kế hoạch thời tiết, viết nhật ký và theo dõi thói quen.",
    keywords: "ứng dụng thói quen buổi sáng, morning golden time, thói quen giờ vàng, theo dõi thói quen buổi sáng, digital detox, chánh niệm buổi sáng, khẳng định buổi sáng",
  },
  id: {
    title: "Morning Golden Time - Aplikasi Rutinitas Pagi Terbaik | Produktivitas Mindful",
    description: "Ubah pagi Anda dengan aplikasi rutinitas pagi #1. Digital detox, afirmasi, perencanaan cuaca, jurnal dan pelacakan kebiasaan.",
    keywords: "aplikasi rutinitas pagi, morning golden time, rutinitas jam emas, pelacak kebiasaan pagi, digital detox, mindfulness pagi, afirmasi pagi, jurnal pagi",
  },
  ms: {
    title: "Morning Golden Time - Aplikasi Rutin Pagi Terbaik | Produktiviti Mindful",
    description: "Ubah pagi anda dengan aplikasi rutin pagi #1. Digital detox, afirmasi, perancangan cuaca, jurnal dan penjejakan tabiat.",
    keywords: "aplikasi rutin pagi, morning golden time, rutin jam emas, penjejak tabiat pagi, digital detox, mindfulness pagi, afirmasi pagi",
  },
  tr: {
    title: "Morning Golden Time - En İyi Sabah Rutini Uygulaması | Bilinçli Verimlilik",
    description: "1 numaralı sabah rutini uygulamasıyla sabahınızı dönüştürün. Dijital detoks, olumlamalar, hava durumu planlaması, günlük tutma ve alışkanlık takibi.",
    keywords: "sabah rutini uygulaması, morning golden time, altın saat rutini, sabah alışkanlık takipçisi, dijital detoks, sabah farkındalığı, sabah olumlamaları",
  },
  pl: {
    title: "Morning Golden Time - Najlepsza Aplikacja do Porannej Rutyny | Świadoma Produktywność",
    description: "Odmień swój poranek z aplikacją do porannej rutyny #1. Cyfrowy detoks, afirmacje, planowanie pogody, dziennik i śledzenie nawyków.",
    keywords: "aplikacja poranna rutyna, morning golden time, rutyna złotej godziny, tracker nawyków porannych, cyfrowy detoks, poranna uważność, poranne afirmacje",
  },
  nl: {
    title: "Morning Golden Time - Beste Ochtendroutine App | Mindful Productiviteit",
    description: "Transformeer je ochtend met de #1 ochtendroutine app. Digital detox, affirmaties, weersplanning, journaling en gewoontetracking.",
    keywords: "ochtendroutine app, morning golden time, gouden uur routine, ochtend gewoontetracker, digital detox, ochtend mindfulness, ochtend affirmaties",
  },
  sv: {
    title: "Morning Golden Time - Bästa Morgonrutinappen | Medveten Produktivitet",
    description: "Förvandla din morgon med #1 morgonrutinappen. Digital detox, affirmationer, väderplanering, journalföring och vanespårning.",
    keywords: "morgonrutin app, morning golden time, gyllene timmen rutin, morgon vanespårare, digital detox, morgon mindfulness, morgon affirmationer",
  },
  da: {
    title: "Morning Golden Time - Bedste Morgenrutine App | Mindful Produktivitet",
    description: "Forvandl din morgen med #1 morgenrutine appen. Digital detox, affirmationer, vejrplanlægning, journalføring og vanestyring.",
    keywords: "morgenrutine app, morning golden time, gyldne time rutine, morgen vanesporing, digital detox, morgen mindfulness, morgen affirmationer",
  },
  no: {
    title: "Morning Golden Time - Beste Morgenrutine App | Mindful Produktivitet",
    description: "Forvandle morgenen din med #1 morgenrutine appen. Digital detox, bekreftelser, værplanlegging, journalføring og vanesporing.",
    keywords: "morgenrutine app, morning golden time, gyllen time rutine, morgen vanesporing, digital detox, morgen mindfulness, morgen bekreftelser",
  },
  fi: {
    title: "Morning Golden Time - Paras Aamurutiini Sovellus | Tietoinen Tuottavuus",
    description: "Muuta aamusi #1 aamurutiinisovelluksella. Digitaalinen detox, vahvistukset, sääsuunnittelu, päiväkirjan pito ja tavanseuranta.",
    keywords: "aamurutiini sovellus, morning golden time, kultainen tunti rutiini, aamu tapaseuranta, digitaalinen detox, aamu mindfulness, aamu vahvistukset",
  },
  cs: {
    title: "Morning Golden Time - Nejlepší Aplikace pro Ranní Rutinu | Vědomá Produktivita",
    description: "Proměňte své ráno s #1 aplikací pro ranní rutinu. Digitální detox, afirmace, plánování počasí, deník a sledování návyků.",
    keywords: "aplikace ranní rutina, morning golden time, rutina zlaté hodiny, sledování ranních návyků, digitální detox, ranní mindfulness, ranní afirmace",
  },
  hu: {
    title: "Morning Golden Time - Legjobb Reggeli Rutin Alkalmazás | Tudatos Produktivitás",
    description: "Alakítsd át a reggeledet az #1 reggeli rutin alkalmazással. Digitális detox, megerősítések, időjárás tervezés, naplóírás és szokáskövetés.",
    keywords: "reggeli rutin alkalmazás, morning golden time, arany óra rutin, reggeli szokáskövetés, digitális detox, reggeli tudatosság, reggeli megerősítések",
  },
  el: {
    title: "Morning Golden Time - Καλύτερη Εφαρμογή Πρωινής Ρουτίνας | Συνειδητή Παραγωγικότητα",
    description: "Μεταμορφώστε το πρωινό σας με την #1 εφαρμογή πρωινής ρουτίνας. Ψηφιακή αποτοξίνωση, επιβεβαιώσεις, σχεδιασμός καιρού, ημερολόγιο και παρακολούθηση συνηθειών.",
    keywords: "εφαρμογή πρωινή ρουτίνα, morning golden time, ρουτίνα χρυσής ώρας, παρακολούθηση πρωινών συνηθειών, ψηφιακή αποτοξίνωση, πρωινή ενσυνειδητότητα",
  },
  he: {
    title: "Morning Golden Time - אפליקציית שגרת בוקר מובילה | פרודוקטיביות מודעת",
    description: "שנו את הבוקר שלכם עם אפליקציית שגרת הבוקר #1. דטוקס דיגיטלי, אישורים, תכנון מזג אוויר, יומן ומעקב הרגלים.",
    keywords: "אפליקציית שגרת בוקר, morning golden time, שגרת שעת הזהב, מעקב הרגלי בוקר, דטוקס דיגיטלי, מיינדפולנס בוקר, אישורי בוקר",
  },
  uk: {
    title: "Morning Golden Time - Найкращий Додаток для Ранкової Рутини | Усвідомлена Продуктивність",
    description: "Перетворіть свій ранок з додатком #1 для ранкової рутини. Цифровий детокс, афірмації, планування погоди, щоденник та відстеження звичок.",
    keywords: "додаток ранкова рутина, morning golden time, рутина золотої години, відстеження ранкових звичок, цифровий детокс, ранкова усвідомленість, ранкові афірмації",
  },
  ro: {
    title: "Morning Golden Time - Cea Mai Bună Aplicație pentru Rutina de Dimineață | Productivitate Conștientă",
    description: "Transformă-ți dimineața cu aplicația #1 pentru rutina de dimineață. Detox digital, afirmații, planificarea vremii, jurnal și urmărirea obiceiurilor.",
    keywords: "aplicație rutină dimineață, morning golden time, rutină oră de aur, urmărire obiceiuri dimineață, detox digital, mindfulness dimineață, afirmații dimineață",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRtl = isRtlLocale(locale as Locale);
  const localeMeta = localeMetadata[locale] || localeMetadata.en;

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <head>
        {/* Primary Meta Tags */}
        <title>{localeMeta.title}</title>
        <meta name="title" content={localeMeta.title} />
        <meta name="description" content={localeMeta.description} />
        <meta name="keywords" content={localeMeta.keywords} />

        {/* Canonical URL */}
        <link rel="canonical" href={`${siteConfig.url}/${locale}`} />

        {/* Alternate Language Links for SEO (hreflang) */}
        {locales.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`${siteConfig.url}/${l}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${siteConfig.url}/en`} />

        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Golden Time" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FBBF24" />
        <meta name="msapplication-TileColor" content="#FBBF24" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteConfig.url}/${locale}`} />
        <meta property="og:title" content={localeMeta.title} />
        <meta property="og:description" content={localeMeta.description} />
        <meta property="og:image" content={`${siteConfig.url}/images/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Morning Golden Time - Transform Your Morning Routine" />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content={locale.replace("-", "_")} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@goldenroutine" />
        <meta name="twitter:creator" content="@goldenroutine" />
        <meta name="twitter:url" content={`${siteConfig.url}/${locale}`} />
        <meta name="twitter:title" content={localeMeta.title} />
        <meta name="twitter:description" content={localeMeta.description} />
        <meta name="twitter:image" content={`${siteConfig.url}/images/og-image.png`} />
        <meta name="twitter:image:alt" content="Morning Golden Time - Transform Your Morning Routine" />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow" />
        <meta name="author" content="Golden Routine Team" />
        <meta name="publisher" content="Golden Routine" />
        <meta name="application-name" content={siteConfig.name} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="copyright" content="Golden Routine" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />

        {/* App Store Smart Banner (if applicable) */}
        <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID" />

        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-9348297343583989" />

        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.openweathermap.org" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Preload Critical Resources */}
        <link
          rel="preload"
          href="/icons/icon-192x192.png"
          as="image"
          type="image/png"
        />

        {/* Fonts with display=swap for better CLS */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Structured Data - FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />

        {/* Structured Data - HowTo (6-step routine) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
        />

        {/* Structured Data - SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationStructuredData) }}
        />

        {/* Structured Data - ItemList (Steps) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(stepsItemListStructuredData) }}
        />

        {/* Structured Data - WebSite with Potential Actions */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(potentialActionsStructuredData) }}
        />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              alternateName: "Golden Routine",
              url: siteConfig.url,
              logo: {
                "@type": "ImageObject",
                url: `${siteConfig.url}/icons/icon-512x512.png`,
                width: 512,
                height: 512,
              },
              sameAs: [
                "https://twitter.com/goldenroutine",
                "https://github.com/goldenroutine",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: locales,
              },
            }),
          }}
        />

        {/* Structured Data - BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${siteConfig.url}/${locale}`,
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
