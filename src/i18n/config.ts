export const locales = [
  'en',    // English
  'ko',    // Korean
  'ja',    // Japanese
  'zh-CN', // Chinese (Simplified)
  'zh-TW', // Chinese (Traditional)
  'es',    // Spanish
  'fr',    // French
  'de',    // German
  'it',    // Italian
  'pt',    // Portuguese
  'pt-BR', // Portuguese (Brazil)
  'ru',    // Russian
  'ar',    // Arabic
  'hi',    // Hindi
  'th',    // Thai
  'vi',    // Vietnamese
  'id',    // Indonesian
  'ms',    // Malay
  'tr',    // Turkish
  'pl',    // Polish
  'nl',    // Dutch
  'sv',    // Swedish
  'da',    // Danish
  'no',    // Norwegian
  'fi',    // Finnish
  'cs',    // Czech
  'hu',    // Hungarian
  'el',    // Greek
  'he',    // Hebrew
  'uk',    // Ukrainian
  'ro',    // Romanian
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'ko': '한국어',
  'ja': '日本語',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'pt-BR': 'Português (Brasil)',
  'ru': 'Русский',
  'ar': 'العربية',
  'hi': 'हिन्दी',
  'th': 'ไทย',
  'vi': 'Tiếng Việt',
  'id': 'Bahasa Indonesia',
  'ms': 'Bahasa Melayu',
  'tr': 'Türkçe',
  'pl': 'Polski',
  'nl': 'Nederlands',
  'sv': 'Svenska',
  'da': 'Dansk',
  'no': 'Norsk',
  'fi': 'Suomi',
  'cs': 'Čeština',
  'hu': 'Magyar',
  'el': 'Ελληνικά',
  'he': 'עברית',
  'uk': 'Українська',
  'ro': 'Română',
};

export const rtlLocales: Locale[] = ['ar', 'he'];

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
