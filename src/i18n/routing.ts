import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['zh-HK'],

  // Used when no locale matches
  defaultLocale: 'zh-HK'
});