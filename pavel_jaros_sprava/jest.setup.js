// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  useLocale: () => 'cs',
  NextIntlClientProvider: ({ children }) => children,
}));

// Mock next-intl/server
jest.mock('next-intl/server', () => ({
  getTranslations: () => (key) => key,
  getMessages: () => Promise.resolve({}),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock i18n/routing
jest.mock('./i18n/routing', () => ({
  routing: {
    locales: ['cs', 'en', 'de', 'pl', 'sk', 'ru'],
    defaultLocale: 'cs',
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/',
}));
