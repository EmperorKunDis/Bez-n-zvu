"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Instagram, Linkedin, Menu, Phone, MapPin, Mail, Home as HomeIcon, Building2, Hammer, PaintBucket, Wrench, Shield, Clock, FileCheck, Users, Check, Globe, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../../i18n/routing';
import { useState } from 'react';

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
    <div className="min-h-screen">
      {/* Cookie Banner */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg p-3 z-50 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-600 flex-1 min-w-0">
            {t('cookie.message')}
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="text-xs">{t('cookie.reject')}</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs" size="sm">{t('cookie.accept')}</Button>
            <Button variant="outline" size="sm" className="text-xs">{t('cookie.preferences')}</Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b fixed top-[65px] left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/logo/PJRekoLogo.png"
                alt="PJ Rekonstrukce"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">{t('nav.home')}</a>
              <a href="#sluzby" className="text-gray-700 hover:text-blue-600 transition-colors">{t('nav.services')}</a>
              <a href="#realizace" className="text-gray-700 hover:text-blue-600 transition-colors">{t('nav.projects')}</a>
              <a href="#o-nas" className="text-gray-700 hover:text-blue-600 transition-colors">{t('nav.about')}</a>
              <a href="#kontakt" className="text-gray-700 hover:text-blue-600 transition-colors">{t('nav.contact')}</a>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Phone */}
              <div className="hidden lg:flex items-center text-blue-600">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">{t('contact.phone')}</span>
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Globe className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 uppercase">{locale}</span>
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                          locale === lang.code ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('nav.cta')}
              </Button>
              <Menu className="h-6 w-6 md:hidden" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-[145px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070"
            alt="Modern home reconstruction"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 font-semibold"
                onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.ctaPrimary')}
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6 font-semibold"
                onClick={() => document.getElementById('realizace')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.ctaSecondary')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="sluzby" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('services.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-blue-600 transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <HomeIcon className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4 text-gray-900">{t('services.cores.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('services.cores.text')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-600 transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4 text-gray-900">{t('services.apartments.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('services.apartments.text')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-600 transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <HomeIcon className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4 text-gray-900">{t('services.houses.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('services.houses.text')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-600 transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <Wrench className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4 text-gray-900">{t('services.crafts.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('services.crafts.text')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('why.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('why.one.title')}</h3>
              <p className="text-gray-600">{t('why.one.text')}</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('why.two.title')}</h3>
              <p className="text-gray-600">{t('why.two.text')}</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('why.three.title')}</h3>
              <p className="text-gray-600">{t('why.three.text')}</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('why.four.title')}</h3>
              <p className="text-gray-600">{t('why.four.text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Teaser Section */}
      <section id="realizace" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('projects.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden group cursor-pointer">
              <CardContent className="p-0 relative">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?q=80&w=2070"
                    alt="Rekonstrukce bytu 3+1"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold text-gray-900">
                      PŘED / PO
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('projects.project1.name')}</h3>
                  <p className="text-gray-600">{t('projects.project1.location')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group cursor-pointer">
              <CardContent className="p-0 relative">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2070"
                    alt="Nová koupelna"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold text-gray-900">
                      PŘED / PO
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('projects.project2.name')}</h3>
                  <p className="text-gray-600">{t('projects.project2.location')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group cursor-pointer">
              <CardContent className="p-0 relative">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053"
                    alt="Rekonstrukce domu"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold text-gray-900">
                      PŘED / PO
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('projects.project3.name')}</h3>
                  <p className="text-gray-600">{t('projects.project3.location')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 font-semibold">
              {t('projects.viewAll')}
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('process.title')}</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  {i}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{t(`process.step${i}.title`)}</h3>
                  <p className="text-gray-600 leading-relaxed">{t(`process.step${i}.text`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* References Section */}
      <section id="reference" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{t('references.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-4">
                  <p className="text-blue-100 italic text-lg leading-relaxed">"{t('references.client1.text')}"</p>
                </div>
                <p className="font-semibold">{t('references.client1.name')}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-4">
                  <p className="text-blue-100 italic text-lg leading-relaxed">"{t('references.client2.text')}"</p>
                </div>
                <p className="font-semibold">{t('references.client2.name')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="o-nas" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] lg:aspect-[3/4]">
              <Image
                src="/images/PajaBezPrdeleReko.png"
                alt="Pavel Jaroš"
                fill
                className="object-contain rounded-lg shadow-xl"
              />
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">O nás</h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>Jsem Pavel Jaroš a specializuji se na kompletní rekonstrukce bytů a domů. S mnohaletými zkušenostmi v oboru vám pomohu proměnit váš prostor v místo, kde budete rádi trávit čas.</p>
                <p>Mým cílem je poskytnout vám kvalitní služby za férové ceny a dodržet všechny dohodnuté termíny. Každý projekt je pro mě jedinečný a přistupuji k němu s maximální pečlivostí.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">{t('contact.subtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Adresa</h3>
                  <p className="text-blue-100">{t('contact.address')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Telefon</h3>
                  <a href={`tel:${t('contact.phone')}`} className="text-blue-100 hover:text-white">{t('contact.phone')}</a>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">E-mail</h3>
                  <a href={`mailto:${t('contact.email')}`} className="text-blue-100 hover:text-white">{t('contact.email')}</a>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Provozní doba</h3>
                  <p className="text-blue-100">{t('contact.hours')}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                {formError && (
                  <div className="bg-blue-700 border border-blue-500 rounded-md p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{formError}</p>
                  </div>
                )}

                {formSuccess && (
                  <div className="bg-blue-700 border border-blue-500 rounded-md p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{t('contact.form.success')}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder={t('contact.form.name')}
                    className="bg-transparent border-white/30 text-white placeholder:text-white/70 focus:border-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={formLoading}
                  />
                  <Input
                    placeholder={t('contact.form.email')}
                    type="email"
                    className="bg-transparent border-white/30 text-white placeholder:text-white/70 focus:border-white"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={formLoading}
                  />
                </div>
                <Input
                  placeholder={t('contact.form.phone')}
                  className="bg-transparent border-white/30 text-white placeholder:text-white/70 focus:border-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={formLoading}
                />
                <select
                  className="w-full bg-transparent border border-white/30 text-white rounded-md px-3 py-2 focus:border-white focus:outline-none"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="" className="text-gray-900">{t('contact.form.service')}</option>
                  <option value="apartment" className="text-gray-900">{t('contact.form.serviceOptions.apartment')}</option>
                  <option value="core" className="text-gray-900">{t('contact.form.serviceOptions.core')}</option>
                  <option value="house" className="text-gray-900">{t('contact.form.serviceOptions.house')}</option>
                  <option value="other" className="text-gray-900">{t('contact.form.serviceOptions.other')}</option>
                </select>
                <Textarea
                  placeholder={t('contact.form.message')}
                  rows={4}
                  className="bg-transparent border-white/30 text-white placeholder:text-white/70 focus:border-white resize-none"
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
                  <span className="text-blue-100">{t('contact.form.gdpr')}</span>
                </label>

                <Button
                  type="submit"
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 text-lg"
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
      <footer className="bg-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Contact Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.contact.title')}</h3>
              <div className="space-y-2 text-sm text-blue-100">
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
              <div className="space-y-2 text-sm text-blue-100">
                <a href="#" className="block hover:text-white">{t('footer.services.management')}</a>
                <a href="#" className="block hover:text-white">{t('footer.services.reality')}</a>
                <a href="#" className="block hover:text-white">{t('footer.services.design')}</a>
              </div>
            </div>

            {/* Info Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.info.title')}</h3>
              <div className="space-y-2 text-sm text-blue-100">
                <a href="#sluzby" className="block hover:text-white">{t('footer.info.services')}</a>
                <a href="#realizace" className="block hover:text-white">{t('footer.info.projects')}</a>
                <a href="#" className="block hover:text-white">{t('footer.info.process')}</a>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-600 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-100">
            <p>{t('footer.copyright')}</p>
            <a href="#" className="hover:text-white mt-4 md:mt-0">{t('footer.privacy')}</a>
          </div>

          <div className="flex justify-center space-x-6 mt-8">
            <Facebook className="h-6 w-6 hover:text-blue-200 cursor-pointer transition-colors" />
            <Instagram className="h-6 w-6 hover:text-blue-200 cursor-pointer transition-colors" />
            <Linkedin className="h-6 w-6 hover:text-blue-200 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
