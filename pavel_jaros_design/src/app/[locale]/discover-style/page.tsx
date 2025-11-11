"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Instagram, Menu, Globe, Palette, ArrowLeft, Sparkles, Paintbrush } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../../../i18n/routing';
import { useMemo, useState } from 'react';
import Link from 'next/link';

type StyleOption = {
  key: string;
  image: string;
};

type Highlight = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const DEFAULT_IMAGE = "/design/aaa.jpeg";

const STYLE_IMAGES: StyleOption[] = [
  { key: 'rustic', image: '/design/rust.png' },
  { key: 'artdeco', image: '/design/ArtDeko.png' },
  { key: 'boho', image: '/design/boho.png' },
  { key: 'glamour', image: '/design/glamour.png' },
  { key: 'industrial', image: '/design/industrial.jpg' },
  { key: 'minimalism', image: '/design/minim.png' },
  { key: 'provencal', image: '/design/provens.png' },
  { key: 'scandinavian', image: '/design/scand.png' },
  { key: 'country', image: '/design/venkovsky.png' },
  { key: 'vintage', image: '/design/vintage.png' },
];

export default function DiscoverStyle() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(DEFAULT_IMAGE);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);

  const languages = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const highlights: Highlight[] = useMemo(() => ([
    {
      icon: Palette,
      title: t('discoverStyle.highlights.personal.title'),
      description: t('discoverStyle.highlights.personal.description'),
    },
    {
      icon: Sparkles,
      title: t('discoverStyle.highlights.visual.title'),
      description: t('discoverStyle.highlights.visual.description'),
    },
    {
      icon: Paintbrush,
      title: t('discoverStyle.highlights.execution.title'),
      description: t('discoverStyle.highlights.execution.description'),
    },
  ]), [t]);

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    setLanguageMenuOpen(false);
  };

  const handleStyleActivate = (style: StyleOption) => {
    setActiveStyle(style.key);
    setCurrentImage(style.image);
  };

  const resetStyle = () => {
    setActiveStyle(null);
    setCurrentImage(DEFAULT_IMAGE);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Cookie Banner */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md border-b border-gray-200 p-3 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-600 flex-1 min-w-0">
            {t('cookie.message')}
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="text-xs border-gray-300 text-gray-600 hover:bg-gray-100">{t('cookie.reject')}</Button>
            <Button className="bg-red-700 hover:bg-red-800 text-white text-xs" size="sm">{t('cookie.accept')}</Button>
            <Button variant="outline" size="sm" className="text-xs border-gray-300 text-gray-600 hover:bg-gray-100">{t('cookie.preferences')}</Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur shadow-sm border-b border-gray-200 fixed top-[65px] left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href={`/${locale}`} className="flex items-center text-gray-600 hover:text-red-700 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-semibold">{t('discoverStyle.back')}</span>
              </Link>
              <div className="flex items-center gap-3">
                <Image src="/logo/PJ_Group_symbol.svg" alt="PJ Group symbol" width={36} height={36} priority />
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm uppercase tracking-wide text-gray-500">Pavel Jaroš</span>
                  <span className="text-lg font-bold text-gray-900">PJ-Design</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-3 text-gray-400">
                <Instagram className="h-5 w-5 hover:text-red-700 transition-colors" />
                <svg className="h-5 w-5 hover:text-red-700 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.804 1.604.804 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.095 0 .989.369 1.869 1.162 2.198.145.06.221.033.255-.09l.234-.963c.013-.047.006-.094-.034-.141-.174-.21-.327-.595-.327-1.047 0-1.35 1.007-2.654 2.727-2.654 1.485 0 2.518 1.017 2.518 2.466 0 1.629-.818 2.757-1.876 2.757-.573 0-1.004-.474-.866-1.057.164-.695.483-1.447.483-1.95 0-.45-.241-.824-.74-.824-.587 0-1.059.608-1.059 1.422 0 .519.175.869.175.869l-.711 3.01c-.137.581-.094 1.433-.025 1.977-2.948-1.222-5.024-4.126-5.024-7.528 0-4.481 3.632-8.113 8.113-8.113s8.113 3.632 8.113 8.113c0 4.481-3.632 8.113-8.113 8.113z"/></svg>
              </div>

              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 uppercase">{locale}</span>
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                          locale === lang.code ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Menu className="h-6 w-6 md:hidden text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="min-h-screen pt-[145px] pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('discoverStyle.title')}</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">{t('discoverStyle.subtitle')}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-red-100 bg-white shadow-sm p-6 text-left">
                <Icon className="h-10 w-10 text-red-700 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <div className="mb-16 grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Image src="/logo/PJ_Group_logo.svg" alt="PJ Group logo" width={180} height={48} className="h-12 w-auto" priority />
                <Image src="/logo/PJ_Group_symbol.svg" alt="PJ Group symbol" width={48} height={48} className="h-12 w-auto" priority />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{t('discoverStyle.showcase.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('discoverStyle.showcase.description')}
              </p>
              <div className="inline-flex items-center gap-3 rounded-full border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-800">
                <Sparkles className="h-4 w-4" />
                {t('discoverStyle.showcase.badge')}
              </div>
            </div>
            <div className="relative mx-auto max-w-sm">
              <div className="absolute inset-0 rounded-3xl bg-red-100 blur-3xl opacity-60" aria-hidden="true" />
              <Image
                src="/images/PavelDesignBezPozadi.png"
                alt={t('discoverStyle.showcase.alt')}
                width={480}
                height={640}
                className="relative rounded-3xl shadow-2xl object-contain"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex flex-col gap-5 w-full lg:w-64">
              {STYLE_IMAGES.slice(0, 5).map((style) => (
                <button
                  key={style.key}
                  className={`rounded-xl border px-6 py-4 text-left text-base font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 ${
                    activeStyle === style.key
                      ? 'bg-red-700 text-white border-red-700 shadow-lg'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-red-200 hover:bg-red-50'
                  }`}
                  onMouseEnter={() => handleStyleActivate(style)}
                  onFocus={() => handleStyleActivate(style)}
                  onClick={() => handleStyleActivate(style)}
                >
                  {t(`discoverStyle.styles.${style.key}.name`)}
                </button>
              ))}
              <Button
                variant="outline"
                className="mt-2 border-gray-300 text-gray-700 hover:border-red-200 hover:bg-red-50"
                onMouseEnter={resetStyle}
                onFocus={resetStyle}
                onClick={resetStyle}
              >
                {t('discoverStyle.reset')}
              </Button>
            </div>

            <div className="flex-1 w-full">
              <div className="relative w-full overflow-hidden rounded-3xl border border-gray-200 shadow-xl aspect-[4/3]">
                <Image
                  key={currentImage}
                  src={currentImage}
                  alt={activeStyle ? t(`discoverStyle.styles.${activeStyle}.name`) : 'PJ Design style inspiration'}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition-opacity duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
              </div>

              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/60 p-6 min-h-[120px]">
                {activeStyle ? (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-red-800">
                      {t(`discoverStyle.styles.${activeStyle}.name`)}
                    </h3>
                    <p className="text-sm text-red-900 leading-relaxed">
                      {t(`discoverStyle.styles.${activeStyle}.description`)}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-red-900/70 text-sm">
                    {t('discoverStyle.hint')}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full lg:w-64">
              {STYLE_IMAGES.slice(5).map((style) => (
                <button
                  key={style.key}
                  className={`rounded-xl border px-6 py-4 text-left text-base font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 ${
                    activeStyle === style.key
                      ? 'bg-red-700 text-white border-red-700 shadow-lg'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-red-200 hover:bg-red-50'
                  }`}
                  onMouseEnter={() => handleStyleActivate(style)}
                  onFocus={() => handleStyleActivate(style)}
                  onClick={() => handleStyleActivate(style)}
                >
                  {t(`discoverStyle.styles.${style.key}.name`)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-20 rounded-3xl bg-red-700 text-white px-8 py-12 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('discoverStyle.cta.title')}</h2>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto mb-8">{t('discoverStyle.cta.text')}</p>
            <Link href={`/${locale}#kontakt`}>
              <Button className="bg-white text-red-700 hover:bg-red-100 text-lg px-8 py-6 font-semibold">
                {t('discoverStyle.cta.button')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-red-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.contact.title')}</h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>{t('footer.contact.name')}</p>
                <p>{t('footer.contact.phone')}</p>
                <p>{t('footer.contact.email')}</p>
                <p className="mt-4">{t('footer.contact.ico')}</p>
                <p>{t('footer.contact.address')}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.services.title')}</h3>
              <div className="space-y-2 text-sm text-white/80">
                <a href="#" className="block hover:text-white">{t('footer.services.reconstruction')}</a>
                <a href="#" className="block hover:text-white">{t('footer.services.management')}</a>
                <a href="#" className="block hover:text-white">{t('footer.services.reality')}</a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.social.title')}</h3>
              <div className="space-y-2 text-sm text-white/80">
                <a href="#" className="block hover:text-white">{t('footer.social.instagram')}</a>
                <a href="#" className="block hover:text-white">{t('footer.social.pinterest')}</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
            <p>{t('footer.copyright')}</p>
            <a href="#" className="hover:text-white mt-4 md:mt-0">{t('footer.privacy')}</a>
          </div>

          <div className="flex justify-center space-x-6 mt-8">
            <Instagram className="h-6 w-6 hover:text-white cursor-pointer transition-colors" />
            <svg className="h-6 w-6 hover:text-white cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.804 1.604.804 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.095 0 .989.369 1.869 1.162 2.198.145.06.221.033.255-.09l.234-.963c.013-.047.006-.094-.034-.141-.174-.21-.327-.595-.327-1.047 0-1.35 1.007-2.654 2.727-2.654 1.485 0 2.518 1.017 2.518 2.466 0 1.629-.818 2.757-1.876 2.757-.573 0-1.004-.474-.866-1.057.164-.695.483-1.447.483-1.95 0-.45-.241-.824-.74-.824-.587 0-1.059.608-1.059 1.422 0 .519.175.869.175.869l-.711 3.01c-.137.581-.094 1.433-.025 1.977-2.948-1.222-5.024-4.126-5.024-7.528 0-4.481 3.632-8.113 8.113-8.113s8.113 3.632 8.113 8.113c0 4.481-3.632 8.113-8.113 8.113z"/></svg>
          </div>
        </div>
      </footer>
    </div>
  );
}
