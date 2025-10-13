"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Instagram, Menu, Globe, Palette, ArrowLeft } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../../../i18n/routing';
import { useState } from 'react';
import Link from 'next/link';

export default function DiscoverStyle() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('/design/aaa.jpeg');
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

  const languages = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const styles = [
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

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    setLanguageMenuOpen(false);
  };

  const handleStyleHover = (styleKey: string, imagePath: string) => {
    setHoveredStyle(styleKey);
    setCurrentImage(imagePath);
  };

  const handleStyleLeave = () => {
    setHoveredStyle(null);
    setCurrentImage('/design/aaa.jpeg');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cookie Banner */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-3 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-300 flex-1 min-w-0">
            {t('cookie.message')}
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="text-xs border-gray-700 text-gray-300 hover:bg-gray-900">{t('cookie.reject')}</Button>
            <Button className="bg-white hover:bg-gray-200 text-black text-xs" size="sm">{t('cookie.accept')}</Button>
            <Button variant="outline" size="sm" className="text-xs border-gray-700 text-gray-300 hover:bg-gray-900">{t('cookie.preferences')}</Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 fixed top-[65px] left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link href={`/${locale}`} className="flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm">Zpět</span>
              </Link>
              <div className="flex items-center">
                <Palette className="h-8 w-8 text-white mr-2" />
                <span className="text-xl font-bold text-white">PJ-Design</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Social */}
              <div className="hidden lg:flex space-x-3">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <svg className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.804 1.604.804 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.095 0 .989.369 1.869 1.162 2.198.145.06.221.033.255-.09l.234-.963c.013-.047.006-.094-.034-.141-.174-.21-.327-.595-.327-1.047 0-1.35 1.007-2.654 2.727-2.654 1.485 0 2.518 1.017 2.518 2.466 0 1.629-.818 2.757-1.876 2.757-.573 0-1.004-.474-.866-1.057.164-.695.483-1.447.483-1.95 0-.45-.241-.824-.74-.824-.587 0-1.059.608-1.059 1.422 0 .519.175.869.175.869l-.711 3.01c-.137.581-.094 1.433-.025 1.977-2.948-1.222-5.024-4.126-5.024-7.528 0-4.481 3.632-8.113 8.113-8.113s8.113 3.632 8.113 8.113c0 4.481-3.632 8.113-8.113 8.113z"/></svg>
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-900 transition-colors"
                >
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300 uppercase">{locale}</span>
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-800">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800 flex items-center space-x-3 ${
                          locale === lang.code ? 'bg-gray-800 text-white font-semibold' : 'text-gray-300'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Menu className="h-6 w-6 md:hidden text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Interactive Section */}
      <section className="min-h-screen pt-[145px] pb-20">
        <div className="w-full">
          {/* Title */}
          <div className="text-center mb-12 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('discoverStyle.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('discoverStyle.subtitle')}</p>
          </div>

          {/* Interactive Area */}
          <div className="w-full px-8">
            <div className="flex items-start justify-center gap-12 max-w-[1800px] mx-auto">
              {/* Left Column - Style Buttons */}
              <div className="flex flex-col gap-6 w-80">
                {styles.slice(0, 5).map((style) => (
                  <button
                    key={style.key}
                    className={`
                      w-full px-8 py-5 font-semibold transition-all duration-300 text-left text-lg
                      ${hoveredStyle === style.key
                        ? 'bg-white text-black scale-105 shadow-2xl'
                        : 'bg-gray-900/90 text-white border border-gray-700 hover:bg-gray-800 hover:border-white'
                      }
                    `}
                    onMouseEnter={() => handleStyleHover(style.key, style.image)}
                    onMouseLeave={handleStyleLeave}
                  >
                    {t(`discoverStyle.styles.${style.key}.name`)}
                  </button>
                ))}
              </div>

              {/* Center - Image and Description */}
              <div className="flex flex-col gap-6 flex-1 max-w-none">
                {/* Central Image - VELKÝ */}
                <div className="relative w-full h-[75vh] overflow-hidden border-2 border-gray-800 shadow-2xl">
                  <Image
                    key={currentImage}
                    src={currentImage}
                    alt="Interior style"
                    fill
                    className="object-cover transition-opacity duration-500"
                    priority
                  />
                </div>

                {/* Fixed Description Space Below Image */}
                <div className="w-full min-h-[120px] bg-gray-900/95 backdrop-blur-sm border border-gray-700 p-6">
                  {hoveredStyle ? (
                    <div className="transition-all duration-300">
                      <h3 className="text-xl font-bold text-white mb-3">
                        {t(`discoverStyle.styles.${hoveredStyle}.name`)}
                      </h3>
                      <p className="text-base text-gray-300 leading-relaxed">
                        {t(`discoverStyle.styles.${hoveredStyle}.description`)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 text-center">
                        Najeďte myší na styl pro zobrazení popisu
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Style Buttons */}
              <div className="flex flex-col gap-6 w-80">
                {styles.slice(5, 10).map((style) => (
                  <button
                    key={style.key}
                    className={`
                      w-full px-8 py-5 font-semibold transition-all duration-300 text-left text-lg
                      ${hoveredStyle === style.key
                        ? 'bg-white text-black scale-105 shadow-2xl'
                        : 'bg-gray-900/90 text-white border border-gray-700 hover:bg-gray-800 hover:border-white'
                      }
                    `}
                    onMouseEnter={() => handleStyleHover(style.key, style.image)}
                    onMouseLeave={handleStyleLeave}
                  >
                    {t(`discoverStyle.styles.${style.key}.name`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('discoverStyle.cta.title')}</h2>
            <p className="text-xl text-gray-300 mb-8">{t('discoverStyle.cta.text')}</p>
            <Link href={`/${locale}#kontakt`}>
              <Button className="bg-white hover:bg-gray-200 text-black text-lg px-8 py-6 font-semibold">
                {t('discoverStyle.cta.button')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Contact Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.contact.title')}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>{t('footer.contact.name')}</p>
                <p>{t('footer.contact.phone')}</p>
                <p>{t('footer.contact.email')}</p>
                <p className="mt-4">{t('footer.contact.ico')}</p>
                <p>{t('footer.contact.address')}</p>
              </div>
            </div>

            {/* Services Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.services.title')}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">{t('footer.services.reconstruction')}</a>
                <a href="#" className="block hover:text-white">{t('footer.services.management')}</a>
                <a href="#" className="block hover:text-white">{t('footer.services.reality')}</a>
              </div>
            </div>

            {/* Social Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.social.title')}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">{t('footer.social.instagram')}</a>
                <a href="#" className="block hover:text-white">{t('footer.social.pinterest')}</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>{t('footer.copyright')}</p>
            <a href="#" className="hover:text-white mt-4 md:mt-0">{t('footer.privacy')}</a>
          </div>

          <div className="flex justify-center space-x-6 mt-8">
            <Instagram className="h-6 w-6 hover:text-gray-400 cursor-pointer transition-colors" />
            <svg className="h-6 w-6 hover:text-gray-400 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.804 1.604.804 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.095 0 .989.369 1.869 1.162 2.198.145.06.221.033.255-.09l.234-.963c.013-.047.006-.094-.034-.141-.174-.21-.327-.595-.327-1.047 0-1.35 1.007-2.654 2.727-2.654 1.485 0 2.518 1.017 2.518 2.466 0 1.629-.818 2.757-1.876 2.757-.573 0-1.004-.474-.866-1.057.164-.695.483-1.447.483-1.95 0-.45-.241-.824-.74-.824-.587 0-1.059.608-1.059 1.422 0 .519.175.869.175.869l-.711 3.01c-.137.581-.094 1.433-.025 1.977-2.948-1.222-5.024-4.126-5.024-7.528 0-4.481 3.632-8.113 8.113-8.113s8.113 3.632 8.113 8.113c0 4.481-3.632 8.113-8.113 8.113z"/></svg>
          </div>
        </div>
      </footer>
    </div>
  );
}
