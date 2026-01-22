import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(en|ko|ja|zh-CN|zh-TW|es|fr|de|it|pt|pt-BR|ru|ar|hi|th|vi|id|ms|tr|pl|nl|sv|da|no|fi|cs|hu|el|he|uk|ro)/:path*'
  ]
};
