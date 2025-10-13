"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Menu, Phone, MapPin, Mail, Globe, AlertCircle, CheckCircle2, Loader2, Lightbulb, Key, MessageSquare, Palette } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../../i18n/routing';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    propertyType: '',
    budget: '',
    message: '',
    consent: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const languages = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    setLanguageMenuOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!formData.name || !formData.email || !formData.message) {
      setFormError('Vyplňte prosím všechna povinná pole.');
      return;
    }

    if (!formData.consent) {
      setFormError('Prosím potvrďte souhlas se zpracováním osobních údajů.');
      return;
    }

    setFormLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          propertyType: '',
          budget: '',
          message: '',
          consent: false,
        });
      } else {
        setFormError(data.error || 'Nastala chyba při odesílání formuláře.');
      }
    } catch (error) {
      setFormError('Nastala chyba při odesílání formuláře. Zkuste to prosím znovu.');
    } finally {
      setFormLoading(false);
    }
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
            <div className="flex items-center">
              <Image
                src="/logo/PJGroupLogo.png"
                alt="PJ Group Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">{t('nav.home')}</a>
              <a href="#sluzby" className="text-gray-300 hover:text-white transition-colors">{t('nav.services')}</a>
              <a href="#portfolio" className="text-gray-300 hover:text-white transition-colors">{t('nav.portfolio')}</a>
              <Link href={`/${locale}/discover-style`} className="text-gray-300 hover:text-white transition-colors">{t('nav.discoverStyle')}</Link>
              <a href="#o-me" className="text-gray-300 hover:text-white transition-colors">{t('nav.about')}</a>
              <a href="#kontakt" className="text-gray-300 hover:text-white transition-colors">{t('nav.contact')}</a>
            </nav>

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

              <Button
                className="bg-white hover:bg-gray-200 text-black font-semibold"
                onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('nav.cta')}
              </Button>
              <Menu className="h-6 w-6 md:hidden text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-[145px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000"
            alt="Interior Design"
            fill
            className="object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-white hover:bg-gray-200 text-black text-lg px-8 py-6 font-semibold"
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.ctaPrimary')}
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 font-semibold"
                onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.ctaSecondary')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Teaser Section */}
      <section id="portfolio" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('portfolio.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden group cursor-pointer bg-gray-900 border-gray-800">
              <CardContent className="p-0 relative">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2074"
                    alt={t('portfolio.project1.name')}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{t('portfolio.project1.name')}</h3>
                  <p className="text-gray-400">{t('portfolio.project1.location')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group cursor-pointer bg-gray-900 border-gray-800">
              <CardContent className="p-0 relative">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070"
                    alt={t('portfolio.project2.name')}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{t('portfolio.project2.name')}</h3>
                  <p className="text-gray-400">{t('portfolio.project2.location')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group cursor-pointer bg-gray-900 border-gray-800">
              <CardContent className="p-0 relative">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070"
                    alt={t('portfolio.project3.name')}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{t('portfolio.project3.name')}</h3>
                  <p className="text-gray-400">{t('portfolio.project3.location')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3 font-semibold">
              {t('portfolio.viewAll')}
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="sluzby" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('services.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-800 hover:border-white transition-all bg-gray-900">
              <CardContent className="p-8 text-center">
                <Lightbulb className="h-16 w-16 text-white mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">{t('services.design.title')}</h3>
                <p className="text-gray-400 leading-relaxed">{t('services.design.text')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-800 hover:border-white transition-all bg-gray-900">
              <CardContent className="p-8 text-center">
                <Key className="h-16 w-16 text-white mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">{t('services.turnkey.title')}</h3>
                <p className="text-gray-400 leading-relaxed">{t('services.turnkey.text')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-800 hover:border-white transition-all bg-gray-900">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-16 w-16 text-white mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">{t('services.consultation.title')}</h3>
                <p className="text-gray-400 leading-relaxed">{t('services.consultation.text')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="o-me" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Image */}
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/images/PavelDesignBezPozadi.png"
                alt="Pavel Jaroš - Interiérový designér"
                fill
                className="object-contain object-center"
              />
            </div>

            {/* Right side - Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">{t('philosophy.title')}</h2>
              <p className="text-xl text-gray-300 leading-relaxed">{t('philosophy.text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('process.title')}</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 bg-white text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  {i}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{t(`process.step${i}.title`)}</h3>
                  <p className="text-gray-400 leading-relaxed">{t(`process.step${i}.text`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-20 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t('contact.subtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-4 mt-1 flex-shrink-0 text-gray-400" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Adresa</h3>
                  <p className="text-gray-400">{t('contact.address')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-4 mt-1 flex-shrink-0 text-gray-400" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Telefon</h3>
                  <a href={`tel:${t('contact.phone')}`} className="text-gray-400 hover:text-white">{t('contact.phone')}</a>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-4 mt-1 flex-shrink-0 text-gray-400" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">E-mail</h3>
                  <a href={`mailto:${t('contact.email')}`} className="text-gray-400 hover:text-white">{t('contact.email')}</a>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">{t('contact.ico')}</p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                {formError && (
                  <div className="bg-red-900/30 border border-red-500 rounded-md p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{formError}</p>
                  </div>
                )}

                {formSuccess && (
                  <div className="bg-green-900/30 border border-green-500 rounded-md p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{t('contact.form.success')}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder={t('contact.form.name')}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={formLoading}
                  />
                  <Input
                    placeholder={t('contact.form.email')}
                    type="email"
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={formLoading}
                  />
                </div>
                <Input
                  placeholder={t('contact.form.phone')}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={formLoading}
                />
                <select
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-white focus:outline-none"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="" className="text-gray-900">{t('contact.form.service')}</option>
                  <option value="online" className="text-gray-900">{t('contact.form.serviceOnline')}</option>
                  <option value="design" className="text-gray-900">{t('contact.form.serviceDesign')}</option>
                  <option value="turnkey" className="text-gray-900">{t('contact.form.serviceTurnkey')}</option>
                </select>
                <Input
                  placeholder={t('contact.form.propertyType')}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  disabled={formLoading}
                />
                <Input
                  placeholder={t('contact.form.budget')}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-white"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  disabled={formLoading}
                />
                <Textarea
                  placeholder={t('contact.form.message')}
                  rows={4}
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-white resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={formLoading}
                />

                <label className="flex items-start cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    className="mr-3 mt-0.5"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    required
                    disabled={formLoading}
                  />
                  <span className="text-gray-400">{t('contact.form.gdpr')}</span>
                </label>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3 text-lg"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    t('contact.form.submit')
                  )}
                </Button>
              </form>
            </div>
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
