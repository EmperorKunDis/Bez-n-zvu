"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LucideIcon } from "lucide-react";
import { Facebook, Instagram, Linkedin, Menu, Phone, MapPin, Mail, Home as HomeIcon, Building2, Clock, TrendingUp, Shield, Wrench, FileCheck, Check, Globe, AlertCircle, CheckCircle2, Loader2, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../../i18n/routing';
import { useState } from 'react';

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
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

  type Highlight = {
    icon: LucideIcon;
    title: string;
    description: string;
  };

  type Tariff = {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    badge?: string;
    highlight?: boolean;
  };

  const heroHighlightContent: Record<string, Highlight[]> = {
    cs: [
      {
        icon: Shield,
        title: "Kompletní správa nájmu",
        description: "Od prověření nájemníků po pravidelné kontroly řešíme celý proces za vás.",
      },
      {
        icon: FileCheck,
        title: "Transparentní smlouvy",
        description: "Jasná pravidla, žádné hvězdičky – smlouvy, kterým budete rozumět.",
      },
      {
        icon: Clock,
        title: "Reakce do 24 hodin",
        description: "Řešíme komunikaci s nájemníky i servisní zásahy bez zbytečných prodlev.",
      },
    ],
    en: [
      {
        icon: Shield,
        title: "Complete rental management",
        description: "We cover everything from tenant screening to ongoing inspections.",
      },
      {
        icon: FileCheck,
        title: "Transparent contracts",
        description: "Clear agreements with no hidden clauses or unpleasant surprises.",
      },
      {
        icon: Clock,
        title: "Response within 24h",
        description: "Tenant communication and maintenance handled without delays.",
      },
    ],
  };

  const tariffContent: Record<string, Tariff[]> = {
    cs: [
      {
        id: 'start',
        name: 'Tarif START',
        price: '12 % z nájemného',
        description: 'Profesionalizujte pronájem a administrativu bez zbytečných starostí.',
        features: [
          'Kompletní správa nájmu',
          'Výběr a prověření nájemníků',
          'Zajištění smluv',
          'Předání bytu',
          'Komunikace',
        ],
        cta: 'Zvolit tarif START',
      },
      {
        id: 'plus',
        name: 'Tarif PLUS',
        price: '15 % z nájemného',
        description: 'Rozšířená péče, která přidává garanci příjmů a dohled nad nemovitostí.',
        features: [
          'Kompletní správa nájmu',
          'Výběr a prověření nájemníků',
          'Zajištění smluv',
          'Předání bytu',
          'Komunikace',
          'Garance 50% nájmu',
        ],
        cta: 'Zvolit tarif PLUS',
      },
      {
        id: 'premium',
        name: 'Tarif PREMIUM',
        price: '20 % z nájemného',
        description: 'Maximální jistota, prioritní péče a garance příjmů i při neobsazenosti bytu.',
        features: [
          'Vše z tarifu PLUS',
          'Kompletní servis',
          'Prioritní péče',
          'Pravidelné kontroly, vyšší jistota',
          '100% garance nájmu při neobsazenosti bytu',
        ],
        cta: 'Zvolit tarif PREMIUM',
        badge: 'Doporučujeme',
        highlight: true,
      },
    ],
    en: [
      {
        id: 'start',
        name: 'START Plan',
        price: '12% of monthly rent',
        description: 'Professional administration of your rental without unnecessary hassle.',
        features: [
          'Complete rental management',
          'Tenant selection and screening',
          'Legal paperwork and contracts',
          'Handover of the property',
          'Tenant communication',
        ],
        cta: 'Choose START Plan',
      },
      {
        id: 'plus',
        name: 'PLUS Plan',
        price: '15% of monthly rent',
        description: 'Enhanced service with income protection and proactive care.',
        features: [
          'Complete rental management',
          'Tenant selection and screening',
          'Contract preparation and signing',
          'Property handover',
          'Ongoing communication',
          '50% rent guarantee in case of tenant default',
        ],
        cta: 'Choose PLUS Plan',
      },
      {
        id: 'premium',
        name: 'PREMIUM Plan',
        price: '20% of monthly rent',
        description: 'Maximum certainty with priority care and full income guarantee.',
        features: [
          'Everything from PLUS',
          'Full service management',
          'Priority care',
          'Scheduled inspections for higher security',
          '100% rent guarantee if the property is vacant',
        ],
        cta: 'Choose PREMIUM Plan',
        badge: 'Recommended',
        highlight: true,
      },
    ],
  };

  const heroHighlights = heroHighlightContent[locale] ?? heroHighlightContent.en;
  const tariffs = tariffContent[locale] ?? tariffContent.en;

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
          propertyAddress: '',
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
            <Button className="bg-green-700 hover:bg-green-800 text-white text-xs" size="sm">{t('cookie.accept')}</Button>
            <Button variant="outline" size="sm" className="text-xs">{t('cookie.preferences')}</Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur shadow-sm border-b fixed top-[65px] left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/logo/PJ_Sprava_logo.svg"
                alt="PJ Správa"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="#sluzby" className="text-gray-700 hover:text-green-700 transition-colors">{t('nav.services')}</a>
              <a href="#cenik" className="text-gray-700 hover:text-green-700 transition-colors">{t('nav.pricing')}</a>
              <a href="#proces" className="text-gray-700 hover:text-green-700 transition-colors">{t('nav.howItWorks')}</a>
              <a href="#o-nas" className="text-gray-700 hover:text-green-700 transition-colors">{t('nav.about')}</a>
              <a href="#reference" className="text-gray-700 hover:text-green-700 transition-colors">{t('nav.references')}</a>
              <a href="#kontakt" className="text-gray-700 hover:text-green-700 transition-colors">{t('nav.contact')}</a>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Phone */}
              <div className="hidden lg:flex items-center text-green-700">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">+420 777 558 730</span>
              </div>

              {/* Social */}
              <div className="hidden lg:flex items-center space-x-3 text-gray-400">
                <Facebook className="h-5 w-5 hover:text-green-700 transition-colors" />
                <Instagram className="h-5 w-5 hover:text-green-700 transition-colors" />
                <Linkedin className="h-5 w-5 hover:text-green-700 transition-colors" />
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
                          locale === lang.code ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
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
                className="bg-green-700 hover:bg-green-800 text-white font-semibold"
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
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073"
            alt="Modern apartment interior"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-4xl">
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-[1.1] text-balance">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-2xl text-white/80 leading-relaxed md:max-w-3xl">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-green-700 hover:bg-green-800 text-white text-lg px-8 py-6 font-semibold"
                  onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('hero.cta')}
                </Button>
                <Button
                  variant="outline"
                  className="border-white/60 text-white hover:bg-white hover:text-green-700 text-lg px-8 py-6 font-semibold"
                  onClick={() => document.getElementById('cenik')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('nav.pricing')}
                </Button>
              </div>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {heroHighlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex flex-col gap-3">
                  <Icon className="h-8 w-8" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="sluzby" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('target.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('target.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-green-700 transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <Building2 className="h-16 w-16 text-green-700 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('target.investor.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('target.investor.text')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-700 transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <Globe className="h-16 w-16 text-green-700 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('target.remote.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('target.remote.text')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-700 transition-all hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <Clock className="h-16 w-16 text-green-700 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('target.time.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('target.time.text')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="proces" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('process.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('process.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-start text-left md:items-center md:text-center space-y-4">
                <div className="bg-green-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold md:mx-auto">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t(`process.step${step}.title`)}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(`process.step${step}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('benefits.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('benefits.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-green-700 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('benefits.tenants.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('benefits.tenants.text')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-green-700 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('benefits.guarantee.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('benefits.guarantee.text')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Wrench className="h-12 w-12 text-green-700 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('benefits.management.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('benefits.management.text')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <FileCheck className="h-12 w-12 text-green-700 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('benefits.legal.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('benefits.legal.text')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="cenik" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{t('pricing.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('pricing.subtitle')}</p>
          </div>

          <div className="grid gap-8 max-w-6xl mx-auto md:grid-cols-2 lg:grid-cols-3">
            {tariffs.map((tariff) => (
              <Card
                key={tariff.id}
                className={`relative h-full border-2 transition-all ${
                  tariff.highlight
                    ? 'border-green-700 shadow-xl bg-white'
                    : 'border-white hover:border-green-700 hover:shadow-lg'
                }`}
              >
                {tariff.badge && (
                  <div className="absolute top-4 right-4 bg-green-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {tariff.badge}
                  </div>
                )}
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-gray-900">{tariff.name}</h3>
                    <div className="text-4xl font-bold text-green-700">{tariff.price}</div>
                    <p className="text-gray-600 leading-relaxed">{tariff.description}</p>
                  </div>

                  <div className="space-y-3 my-8">
                    {tariff.features.map((feature, index) => (
                      <div key={`${tariff.id}-feature-${index}`} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-700 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={tariff.highlight ? 'default' : 'outline'}
                    className={`mt-auto w-full font-semibold ${
                      tariff.highlight
                        ? 'bg-green-700 hover:bg-green-800 text-white'
                        : 'border-green-700 text-green-700 hover:bg-green-700 hover:text-white'
                    }`}
                    onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {tariff.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="o-nas" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative aspect-[4/5] lg:aspect-[3/4]">
              <Image
                src="/images/PajaSpravaBezPozadi.png"
                alt="Pavel Jaroš"
                fill
                className="object-contain rounded-lg shadow-xl"
              />
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">{t('about.title')}</h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>{t('about.intro')}</p>
                <p>{t('about.motivation')}</p>
              </div>
            </div>
          </div>

          {/* Group Services */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-3xl font-bold mb-4 text-gray-900 text-center">{t('about.group.title')}</h3>
            <p className="text-lg text-gray-600 mb-8 text-center">{t('about.group.subtitle')}</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-700 transition-all">
                <h4 className="text-xl font-bold mb-2 text-green-700">PJ-Reality</h4>
                <p className="text-gray-600">{t('about.group.reality')}</p>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-700 transition-all">
                <h4 className="text-xl font-bold mb-2 text-green-700">PJ-Rekonstrukce</h4>
                <p className="text-gray-600">{t('about.group.reconstruction')}</p>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-700 transition-all">
                <h4 className="text-xl font-bold mb-2 text-green-700">PJ-Design</h4>
                <p className="text-gray-600">{t('about.group.design')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section id="reference" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{t('references.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-green-700 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-4">
                  <h3 className="font-bold text-xl mb-1">{t('references.client1.name')}</h3>
                  <p className="text-green-200 text-sm">{t('references.client1.subtitle')}</p>
                </div>
                <p className="text-green-100 leading-relaxed italic">"{t('references.client1.text')}"</p>
              </CardContent>
            </Card>

            <Card className="bg-green-700 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-4">
                  <h3 className="font-bold text-xl mb-1">{t('references.client2.name')}</h3>
                  <p className="text-green-200 text-sm">{t('references.client2.subtitle')}</p>
                </div>
                <p className="text-green-100 leading-relaxed italic">"{t('references.client2.text')}"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{t('faq.title')}</h2>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-lg text-gray-900">{t(`faq.q${i}.question`)}</span>
                    <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === i ? 'transform rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                      {t(`faq.q${i}.answer`)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-20 bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">{t('contact.subtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Telefon</h3>
                  <a href="tel:+420777558730" className="text-green-100 hover:text-white">{t('contact.phone')}</a>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">E-mail</h3>
                  <a href="mailto:pavel.jaros@kwcz.cz" className="text-green-100 hover:text-white">{t('contact.email')}</a>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Působnost</h3>
                  <p className="text-green-100">{t('contact.address')}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                {formError && (
                  <div className="bg-green-900/50 border border-green-500 rounded-md p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{formError}</p>
                  </div>
                )}

                {formSuccess && (
                  <div className="bg-green-900/50 border border-green-500 rounded-md p-4 flex items-center gap-3">
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
                <Input
                  placeholder={t('contact.form.propertyAddress')}
                  className="bg-transparent border-white/30 text-white placeholder:text-white/70 focus:border-white"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  disabled={formLoading}
                />
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
                  <span className="text-green-100">{t('contact.form.gdpr')}</span>
                </label>

                <Button
                  type="submit"
                  className="w-full bg-white text-green-700 hover:bg-gray-100 font-semibold py-3 text-lg"
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
      <footer className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Contact Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.contact.title')}</h3>
              <div className="space-y-2 text-sm text-green-100">
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
              <div className="space-y-2 text-sm text-green-100">
                <a href="#" className="block hover:text-white">{t('footer.services.reality')}</a>
                <a href="#" className="block hover:text-white">{t('footer.services.reconstruction')}</a>
                <a href="#" className="block hover:text-white">{t('footer.services.design')}</a>
              </div>
            </div>

            {/* Info Column */}
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.info.title')}</h3>
              <div className="space-y-2 text-sm text-green-100">
                <a href="#sluzby" className="block hover:text-white">{t('footer.info.services')}</a>
                <a href="#cenik" className="block hover:text-white">{t('footer.info.pricing')}</a>
                <a href="#" className="block hover:text-white">{t('footer.info.faq')}</a>
              </div>
            </div>
          </div>

          <div className="border-t border-green-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-green-100">
            <p>{t('footer.copyright')}</p>
            <a href="#" className="hover:text-white mt-4 md:mt-0">{t('footer.privacy')}</a>
          </div>

          <div className="flex justify-center space-x-6 mt-8">
            <Facebook className="h-6 w-6 hover:text-green-200 cursor-pointer transition-colors" />
            <Instagram className="h-6 w-6 hover:text-green-200 cursor-pointer transition-colors" />
            <Linkedin className="h-6 w-6 hover:text-green-200 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
