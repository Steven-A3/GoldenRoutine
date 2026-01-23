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

// SEO-optimized locale titles and descriptions - Focus on REAL search terms people use
const localeMetadata: Record<string, { title: string; description: string; keywords: string }> = {
  en: {
    title: "Best Morning Routine App 2025 - Free Habit Tracker & Daily Planner",
    description: "Start your perfect morning routine with our free app. 20-minute guided routine with habit tracking, journaling, affirmations, weather planning & digital detox. Used by 10,000+ people daily.",
    keywords: "morning routine app, best morning routine, how to wake up early, morning habits, habit tracker app free, daily routine planner, morning journal app, self care morning routine, 5am morning routine, healthy morning habits, productive morning routine, miracle morning app, morning motivation app, daily affirmations app, mindfulness morning app",
  },
  ko: {
    title: "아침 루틴 앱 - 무료 습관 추적기 & 미라클 모닝",
    description: "20분 가이드 루틴으로 완벽한 아침을 시작하세요. 습관 추적, 저널링, 확언, 날씨 확인, 디지털 디톡스 기능. 매일 1만 명 이상이 사용합니다.",
    keywords: "아침 루틴 앱, 미라클 모닝, 습관 추적기, 아침 습관, 일찍 일어나는 법, 아침 일기, 아침 명상, 자기계발 앱, 생산성 앱, 아침 시간 활용, 기상 알람 앱, 루틴 만들기",
  },
  ja: {
    title: "朝活アプリ - 無料習慣トラッカー＆モーニングルーティン",
    description: "20分のガイド付きルーティンで完璧な朝をスタート。習慣追跡、ジャーナリング、アファメーション、天気確認、デジタルデトックス機能付き。",
    keywords: "朝活 アプリ, モーニングルーティン, 習慣 トラッカー, 早起き コツ, 朝 習慣, 朝活 おすすめ, 朝日記, 朝 瞑想, 生産性 アプリ, ルーティン アプリ, 自己啓発 アプリ",
  },
  "zh-CN": {
    title: "早起打卡App - 免费习惯追踪器 & 晨间日记",
    description: "20分钟引导式晨间习惯，助您开启完美一天。习惯打卡、写日记、每日肯定、天气查看、数字排毒。每天超过1万人使用。",
    keywords: "早起打卡app, 晨间习惯, 习惯追踪器, 早起app, 晨间日记, 自律app, 每日打卡, 习惯养成, 早睡早起, 时间管理app, 自我提升app, 正念冥想app",
  },
  "zh-TW": {
    title: "早起打卡App - 免費習慣追蹤器 & 晨間日記",
    description: "20分鐘引導式晨間習慣，助您開啟完美一天。習慣打卡、寫日記、每日肯定、天氣查看、數位排毒。每天超過1萬人使用。",
    keywords: "早起打卡app, 晨間習慣, 習慣追蹤器, 早起app, 晨間日記, 自律app, 每日打卡, 習慣養成, 早睡早起, 時間管理app, 自我提升app",
  },
  es: {
    title: "App Rutina Mañanera - Planificador Diario & Rastreador de Hábitos Gratis",
    description: "Comienza tu rutina matutina perfecta con nuestra app gratuita. Rutina guiada de 20 minutos con seguimiento de hábitos, diario, afirmaciones y más.",
    keywords: "app rutina mañanera, rutina de mañana, rastreador de hábitos gratis, levantarse temprano, hábitos matutinos, diario matutino, productividad mañana, app meditación mañana, planificador diario, app motivación",
  },
  fr: {
    title: "App Routine Matinale - Suivi d'Habitudes & Planificateur Gratuit",
    description: "Commencez votre routine matinale parfaite avec notre app gratuite. Routine guidée de 20 minutes avec suivi d'habitudes, journal, affirmations et plus.",
    keywords: "app routine matinale, routine du matin, suivi habitudes gratuit, se lever tôt, habitudes matinales, journal du matin, productivité matin, app méditation matin, planificateur quotidien, miracle morning app",
  },
  de: {
    title: "Morgenroutine App - Kostenloser Gewohnheitstracker & Tagesplaner",
    description: "Starten Sie Ihre perfekte Morgenroutine mit unserer kostenlosen App. 20-Minuten geführte Routine mit Gewohnheitstracking, Tagebuch und Affirmationen.",
    keywords: "morgenroutine app, morgenroutine, gewohnheitstracker kostenlos, früh aufstehen, morgen gewohnheiten, morgen tagebuch, produktiver morgen, meditation morgen app, tagesplaner app, miracle morning",
  },
  it: {
    title: "App Routine Mattutina - Tracker Abitudini & Pianificatore Gratuito",
    description: "Inizia la tua routine mattutina perfetta con la nostra app gratuita. Routine guidata di 20 minuti con tracciamento abitudini, diario e affermazioni.",
    keywords: "app routine mattutina, routine del mattino, tracker abitudini gratis, svegliarsi presto, abitudini mattutine, diario mattutino, produttività mattina, app meditazione mattina, pianificatore giornaliero",
  },
  pt: {
    title: "App Rotina Matinal - Rastreador de Hábitos & Planejador Grátis",
    description: "Comece sua rotina matinal perfeita com nosso app gratuito. Rotina guiada de 20 minutos com rastreamento de hábitos, diário, afirmações e mais.",
    keywords: "app rotina matinal, rotina da manhã, rastreador hábitos grátis, acordar cedo, hábitos matinais, diário matinal, produtividade manhã, app meditação manhã, planejador diário",
  },
  "pt-BR": {
    title: "App Rotina Matinal - Rastreador de Hábitos & Planejador Grátis",
    description: "Comece sua rotina matinal perfeita com nosso app gratuito. Rotina guiada de 20 minutos com rastreamento de hábitos, diário, afirmações e mais.",
    keywords: "app rotina matinal, rotina da manhã, rastreador hábitos grátis, acordar cedo, hábitos matinais, diário matinal, produtividade manhã, app meditação manhã, planejador diário, milagre da manhã",
  },
  ru: {
    title: "Приложение Утренняя Рутина - Бесплатный Трекер Привычек",
    description: "Начните идеальное утро с нашим бесплатным приложением. 20-минутный утренний ритуал с отслеживанием привычек, дневником и аффирмациями.",
    keywords: "утренняя рутина приложение, утренние привычки, трекер привычек бесплатно, рано вставать, утренний дневник, продуктивное утро, медитация утром, планировщик дня, магия утра",
  },
  ar: {
    title: "تطبيق روتين الصباح - متتبع عادات مجاني ومخطط يومي",
    description: "ابدأ روتينك الصباحي المثالي مع تطبيقنا المجاني. روتين موجه لمدة 20 دقيقة مع تتبع العادات والمذكرات والتأكيدات.",
    keywords: "تطبيق روتين الصباح, روتين صباحي, متتبع عادات مجاني, الاستيقاظ مبكرا, عادات صباحية, يوميات الصباح, إنتاجية الصباح, تطبيق تأمل صباحي",
  },
  hi: {
    title: "सुबह की दिनचर्या ऐप - मुफ्त आदत ट्रैकर और दैनिक प्लानर",
    description: "हमारे मुफ्त ऐप के साथ अपनी सही सुबह की दिनचर्या शुरू करें। आदत ट्रैकिंग, जर्नलिंग और पुष्टि के साथ 20 मिनट की गाइडेड रूटीन।",
    keywords: "सुबह की दिनचर्या ऐप, आदत ट्रैकर मुफ्त, जल्दी उठना, सुबह की आदतें, सुबह की डायरी, उत्पादक सुबह, सुबह ध्यान ऐप, दैनिक योजनाकार",
  },
  th: {
    title: "แอพกิจวัตรตอนเช้า - ติดตามนิสัยฟรี & วางแผนประจำวัน",
    description: "เริ่มต้นเช้าที่สมบูรณ์แบบด้วยแอพฟรีของเรา กิจวัตร 20 นาทีพร้อมติดตามนิสัย เขียนไดอารี่ และการยืนยัน",
    keywords: "แอพกิจวัตรตอนเช้า, กิจวัตรเช้า, ติดตามนิสัยฟรี, ตื่นเช้า, นิสัยตอนเช้า, ไดอารี่เช้า, ประสิทธิภาพตอนเช้า, แอพสมาธิเช้า",
  },
  vi: {
    title: "App Thói Quen Buổi Sáng - Theo Dõi Thói Quen Miễn Phí",
    description: "Bắt đầu buổi sáng hoàn hảo với app miễn phí. Thói quen 20 phút có hướng dẫn với theo dõi thói quen, nhật ký và khẳng định.",
    keywords: "app thói quen buổi sáng, thói quen sáng, theo dõi thói quen miễn phí, dậy sớm, thói quen buổi sáng, nhật ký sáng, năng suất buổi sáng, app thiền buổi sáng",
  },
  id: {
    title: "Aplikasi Rutinitas Pagi - Pelacak Kebiasaan Gratis & Perencana Harian",
    description: "Mulai rutinitas pagi sempurna dengan aplikasi gratis kami. Rutinitas 20 menit dengan pelacakan kebiasaan, jurnal, dan afirmasi.",
    keywords: "aplikasi rutinitas pagi, rutinitas pagi, pelacak kebiasaan gratis, bangun pagi, kebiasaan pagi, jurnal pagi, produktivitas pagi, aplikasi meditasi pagi",
  },
  ms: {
    title: "Aplikasi Rutin Pagi - Penjejak Tabiat Percuma & Perancang Harian",
    description: "Mulakan rutin pagi sempurna dengan aplikasi percuma kami. Rutin 20 minit dengan penjejakan tabiat, jurnal dan afirmasi.",
    keywords: "aplikasi rutin pagi, rutin pagi, penjejak tabiat percuma, bangun awal, tabiat pagi, jurnal pagi, produktiviti pagi, aplikasi meditasi pagi",
  },
  tr: {
    title: "Sabah Rutini Uygulaması - Ücretsiz Alışkanlık Takipçisi & Günlük Planlayıcı",
    description: "Ücretsiz uygulamamızla mükemmel sabah rutininize başlayın. Alışkanlık takibi, günlük ve olumlamalarla 20 dakikalık rehberli rutin.",
    keywords: "sabah rutini uygulaması, sabah rutini, alışkanlık takipçisi ücretsiz, erken kalkmak, sabah alışkanlıkları, sabah günlüğü, verimli sabah, sabah meditasyon uygulaması",
  },
  pl: {
    title: "Aplikacja Poranna Rutyna - Darmowy Tracker Nawyków & Planer",
    description: "Rozpocznij idealną poranną rutynę z naszą darmową aplikacją. 20-minutowa rutyna ze śledzeniem nawyków, dziennikiem i afirmacjami.",
    keywords: "aplikacja poranna rutyna, poranna rutyna, tracker nawyków za darmo, wstawać wcześnie, poranne nawyki, poranny dziennik, produktywny poranek, aplikacja medytacja rano",
  },
  nl: {
    title: "Ochtendroutine App - Gratis Gewoontetracker & Dagplanner",
    description: "Start je perfecte ochtendroutine met onze gratis app. 20 minuten routine met gewoontetracking, dagboek en affirmaties.",
    keywords: "ochtendroutine app, ochtendroutine, gewoontetracker gratis, vroeg opstaan, ochtend gewoonten, ochtend dagboek, productieve ochtend, meditatie ochtend app",
  },
  sv: {
    title: "Morgonrutin App - Gratis Vanespårare & Dagsplanerare",
    description: "Börja din perfekta morgonrutin med vår gratis app. 20-minuters rutin med vanespårning, dagbok och affirmationer.",
    keywords: "morgonrutin app, morgonrutin, vanespårare gratis, vakna tidigt, morgonvanor, morgondagbok, produktiv morgon, meditation morgon app",
  },
  da: {
    title: "Morgenrutine App - Gratis Vanesporin & Dagsplanlægger",
    description: "Start din perfekte morgenrutine med vores gratis app. 20-minutters rutine med vanesporing, dagbog og bekræftelser.",
    keywords: "morgenrutine app, morgenrutine, vanesporing gratis, vågne tidligt, morgenvaner, morgendagbog, produktiv morgen, meditation morgen app",
  },
  no: {
    title: "Morgenrutine App - Gratis Vanesporing & Dagsplanlegger",
    description: "Start din perfekte morgenrutine med vår gratis app. 20-minutters rutine med vanesporing, dagbok og bekreftelser.",
    keywords: "morgenrutine app, morgenrutine, vanesporing gratis, våkne tidlig, morgenvaner, morgendagbok, produktiv morgen, meditasjon morgen app",
  },
  fi: {
    title: "Aamurutiini Sovellus - Ilmainen Tapaseuranta & Päiväsuunnittelija",
    description: "Aloita täydellinen aamurutiinisi ilmaisella sovelluksellamme. 20 minuutin rutiini tavanseurannalla, päiväkirjalla ja vahvistuksilla.",
    keywords: "aamurutiini sovellus, aamurutiini, tapaseuranta ilmainen, herätä aikaisin, aamutavat, aamupäiväkirja, tuottava aamu, meditaatio aamu sovellus",
  },
  cs: {
    title: "Aplikace Ranní Rutina - Sledování Návyků Zdarma & Denní Plánovač",
    description: "Začněte svou dokonalou ranní rutinu s naší bezplatnou aplikací. 20minutová rutina se sledováním návyků, deníkem a afirmacemi.",
    keywords: "aplikace ranní rutina, ranní rutina, sledování návyků zdarma, vstávat brzy, ranní návyky, ranní deník, produktivní ráno, meditace ráno aplikace",
  },
  hu: {
    title: "Reggeli Rutin Alkalmazás - Ingyenes Szokáskövetés & Napi Tervező",
    description: "Kezdd el a tökéletes reggeli rutinodat ingyenes alkalmazásunkkal. 20 perces rutin szokáskövetéssel, naplóval és megerősítésekkel.",
    keywords: "reggeli rutin alkalmazás, reggeli rutin, szokáskövetés ingyen, korán kelni, reggeli szokások, reggeli napló, produktív reggel, meditáció reggel alkalmazás",
  },
  el: {
    title: "Εφαρμογή Πρωινής Ρουτίνας - Δωρεάν Παρακολούθηση Συνηθειών",
    description: "Ξεκινήστε την τέλεια πρωινή σας ρουτίνα με τη δωρεάν εφαρμογή μας. Ρουτίνα 20 λεπτών με παρακολούθηση συνηθειών και ημερολόγιο.",
    keywords: "εφαρμογή πρωινή ρουτίνα, πρωινή ρουτίνα, παρακολούθηση συνηθειών δωρεάν, ξυπνώ νωρίς, πρωινές συνήθειες, πρωινό ημερολόγιο, παραγωγικό πρωί",
  },
  he: {
    title: "אפליקציית שגרת בוקר - מעקב הרגלים חינם ומתכנן יומי",
    description: "התחל את שגרת הבוקר המושלמת שלך עם האפליקציה החינמית שלנו. שגרה של 20 דקות עם מעקב הרגלים, יומן ואישורים.",
    keywords: "אפליקציית שגרת בוקר, שגרת בוקר, מעקב הרגלים חינם, לקום מוקדם, הרגלי בוקר, יומן בוקר, בוקר פרודוקטיבי, אפליקציית מדיטציה בוקר",
  },
  uk: {
    title: "Додаток Ранкова Рутина - Безкоштовний Трекер Звичок",
    description: "Почніть ідеальний ранок з нашим безкоштовним додатком. 20-хвилинна рутина з відстеженням звичок, щоденником та афірмаціями.",
    keywords: "додаток ранкова рутина, ранкова рутина, трекер звичок безкоштовно, рано вставати, ранкові звички, ранковий щоденник, продуктивний ранок",
  },
  ro: {
    title: "Aplicație Rutină de Dimineață - Urmărire Obiceiuri Gratuit & Planificator",
    description: "Începe-ți rutina de dimineață perfectă cu aplicația noastră gratuită. Rutină de 20 de minute cu urmărirea obiceiurilor, jurnal și afirmații.",
    keywords: "aplicație rutină dimineață, rutină de dimineață, urmărire obiceiuri gratuit, a te trezi devreme, obiceiuri de dimineață, jurnal de dimineață, dimineață productivă",
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
