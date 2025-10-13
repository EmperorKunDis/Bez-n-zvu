"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Instagram, Linkedin, Menu, Phone, MapPin, Mail, Home as HomeIcon, Building, TrendingUp, Camera, Hammer, DollarSign, Star, Check, Globe, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
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
    message: '',
    consent: false,
    weekendContact: false,
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

    // Validation
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
          message: '',
          consent: false,
          weekendContact: false,
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
            <Button className="bg-red-700 hover:bg-red-800 text-white text-xs" size="sm">{t('cookie.accept')}</Button>
            <Button variant="outline" size="sm" className="text-xs">{t('cookie.preferences')}</Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ marginTop: "65px" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/logo/PJRealityLogo.png"
                alt="Pavel Jaroš Reality"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#nemovitosti" className="text-gray-700 hover:text-red-700 transition-colors">{t('nav.properties')}</a>
              <a href="#sluzby" className="text-gray-700 hover:text-red-700 transition-colors">{t('nav.services')}</a>
              <a href="#reference" className="text-gray-700 hover:text-red-700 transition-colors">{t('nav.references')}</a>
              <a href="#o-mne" className="text-gray-700 hover:text-red-700 transition-colors">{t('nav.about')}</a>
              <a href="#kontakt" className="text-gray-700 hover:text-red-700 transition-colors">{t('nav.contact')}</a>
            </nav>

            {/* Social Icons, Language Switcher and Contact */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-2">
                <Facebook className="h-5 w-5 text-gray-600 hover:text-red-700 cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-600 hover:text-red-700 cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-gray-600 hover:text-red-700 cursor-pointer transition-colors" />
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Globe className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 uppercase">{locale}</span>
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
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

              <Button className="bg-red-700 hover:bg-red-800 text-white font-semibold">
                {t('nav.contactMe')}
              </Button>
              <Menu className="h-6 w-6 md:hidden" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://ext.same-assets.com/2530056946/4049786394.png"
            alt="Pavel Jaroš"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              {t('hero.title')}
            </h1>
            <Button className="bg-red-700 hover:bg-red-800 text-white text-lg px-8 py-4 font-semibold">
              {t('hero.cta')}
            </Button>
          </div>
        </div>
      </section>

      {/* Property Listings */}
      <section id="nemovitosti" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-64">
                  <Image
                    src="https://ext.same-assets.com/2530056946/246692592.webp"
                    alt="Neumannova, AŠ"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-700">Neumannova, AŠ</h3>
                  <p className="text-2xl font-bold mb-4 text-gray-900">25 000 Kč</p>
                  <Button variant="outline" className="w-full border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-all">
                    {t('properties.viewProperty')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-64">
                  <Image
                    src="https://ext.same-assets.com/2530056946/1499260590.webp"
                    alt="Slavětín nad Ohří"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-700">Slavětín nad Ohří</h3>
                  <p className="text-2xl font-bold mb-4 text-gray-900">3 190 000 Kč</p>
                  <Button variant="outline" className="w-full border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-all">
                    {t('properties.viewProperty')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-64">
                  <Image
                    src="https://ext.same-assets.com/2530056946/3003633402.webp"
                    alt="Hnězdenska, Praha"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-700">Hnězdenska, Praha</h3>
                  <p className="text-2xl font-bold mb-4 text-gray-900">9 500 000 Kč</p>
                  <Button variant="outline" className="w-full border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-all">
                    {t('properties.viewProperty')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-8 py-3 font-semibold">
              {t('properties.moreProperties')}
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="sluzby" className="py-20 bg-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">{t('services.title')}</h2>
            <Button className="bg-white text-red-700 hover:bg-gray-100 px-8 py-3 font-semibold">
              {t('services.bookMeeting')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            <div className="border border-white/20 p-8 text-center hover:bg-white/10 transition-all cursor-pointer rounded-lg">
              <HomeIcon className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">{t('services.sale.title')}</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                {t('services.sale.description')}
              </p>
            </div>

            <div className="border border-white/20 p-8 text-center hover:bg-white/10 transition-all cursor-pointer rounded-lg">
              <Building className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">{t('services.rent.title')}</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                {t('services.rent.description')}
              </p>
            </div>

            <div className="border border-white/20 p-8 text-center hover:bg-white/10 transition-all cursor-pointer rounded-lg">
              <TrendingUp className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">{t('services.marketing.title')}</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                {t('services.marketing.description')}
              </p>
            </div>

            <div className="border border-white/20 p-8 text-center hover:bg-white/10 transition-all cursor-pointer rounded-lg">
              <Camera className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">{t('services.presentation.title')}</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                {t('services.presentation.description')}
              </p>
            </div>

            <div className="border border-white/20 p-8 text-center hover:bg-white/10 transition-all cursor-pointer rounded-lg">
              <Hammer className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">{t('services.reconstruction.title')}</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                {t('services.reconstruction.description')}
              </p>
            </div>

            <div className="border border-white/20 p-8 text-center hover:bg-white/10 transition-all cursor-pointer rounded-lg">
              <DollarSign className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">{t('services.valuation.title')}</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                {t('services.valuation.description')}
              </p>
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white/5 rounded-lg p-8 mb-16">
            <div className="text-center mb-12">
              <p className="text-lg mb-4 text-red-100">{t('services.activities.subtitle')}</p>
              <h3 className="text-3xl font-bold">{t('services.activities.title')}</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.communication')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.targeting')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.negotiation')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.documentation')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.supervision')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.strategy')}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.socialMedia')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.materials')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.flyers')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.print')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.portals')}</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-3 text-white" />
                  <span>{t('services.activities.list.websites')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Work Samples */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src="https://ext.same-assets.com/2530056946/131510136.webp"
                alt="Ukázka práce 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src="https://ext.same-assets.com/2530056946/2776399121.webp"
                alt="Ukázka práce 2"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src="https://ext.same-assets.com/2530056946/738826812.webp"
                alt="Ukázka práce 3"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="text-center">
            <Button className="bg-white text-red-700 hover:bg-gray-100 px-8 py-3 font-semibold">
              {t('services.bookMeeting')}
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="o-mne" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <p className="text-gray-600 mb-4 tracking-wider uppercase text-sm">{t('about.subtitle')}</p>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-red-700">{t('about.title')}</h2>
              </div>

              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>{t('about.intro')}</p>
                <p>{t('about.origin')}</p>
                <p>{t('about.motivation')}</p>
                <p>{t('about.passion')}</p>
                <p>{t('about.values')}</p>
                <p>{t('about.hobby')}</p>

                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">{t('about.location.title')}</h3>
                  <p>{t('about.location.text')}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">{t('about.experience.title')}</h3>
                  <p>{t('about.experience.text1')}</p>
                  <p className="mt-3">{t('about.experience.text2')}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">{t('about.commission.title')}</h3>
                  <p>{t('about.commission.text')}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('about.why.title')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-700 rounded-sm mr-4 flex-shrink-0"></div>
                      <span>{t('about.why.individual')}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-700 rounded-sm mr-4 flex-shrink-0"></div>
                      <span>{t('about.why.professional')}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-700 rounded-sm mr-4 flex-shrink-0"></div>
                      <span>{t('about.why.efficiency')}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-700 rounded-sm mr-4 flex-shrink-0"></div>
                      <span>{t('about.why.experience')}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-700 rounded-sm mr-4 flex-shrink-0"></div>
                      <span>{t('about.why.flexibility')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative lg:order-last">
              <div className="relative aspect-[3/4] max-w-md mx-auto lg:max-w-none">
                <Image
                  src="/images/PavelFotka.png"
                  alt="Pavel Jaroš"
                  fill
                  className="object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section id="reference" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gray-600 mb-4 tracking-wider uppercase text-sm">{t('references.subtitle')}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-red-700">{t('references.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-red-700 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">{t('references.client1.name')}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-red-100 leading-relaxed">{t('references.client1.text')}</p>
              </CardContent>
            </Card>

            <Card className="bg-red-700 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">{t('references.client2.name')}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-red-100 leading-relaxed">{t('references.client2.text')}</p>
              </CardContent>
            </Card>

            <Card className="bg-red-700 text-white border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">{t('references.client3.name')}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-red-100 leading-relaxed">{t('references.client3.text')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-20 bg-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-lg mb-4 text-red-100 tracking-wider uppercase">{t('contact.subtitle')}</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-12">{t('contact.title')}</h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t('contact.address.title')}</h3>
                    <p className="text-red-100">{t('contact.address.text')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t('contact.phone.title')}</h3>
                    <p className="text-red-100">{t('contact.phone.text')}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t('contact.email.title')}</h3>
                    <p className="text-red-100">{t('contact.email.text')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                {formError && (
                  <div className="bg-red-900/50 border border-red-500 rounded-md p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">{formError}</p>
                  </div>
                )}

                {formSuccess && (
                  <div className="bg-green-900/50 border border-green-500 rounded-md p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm">Děkujeme za vaši zprávu! Ozveme se vám co nejdříve.</p>
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
                  disabled={formLoading}
                />
                <Textarea
                  placeholder={t('contact.form.message')}
                  rows={5}
                  className="bg-transparent border-white/30 text-white placeholder:text-white/70 focus:border-white resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={formLoading}
                />

                <div className="space-y-3 text-sm">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-3 mt-0.5"
                      checked={formData.weekendContact}
                      onChange={(e) => setFormData({ ...formData, weekendContact: e.target.checked })}
                      disabled={formLoading}
                    />
                    <span className="text-red-100">{t('contact.form.weekend')}</span>
                  </label>
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-3 mt-0.5"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      required
                      disabled={formLoading}
                    />
                    <span className="text-red-100">{t('contact.form.gdpr')}</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-red-700 hover:bg-gray-100 font-semibold py-3 text-lg"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Odesílání...
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
      <footer className="bg-red-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <Image
                src="https://ext.same-assets.com/2530056946/3299068684.svg"
                alt="Keller Williams Czech Republic"
                width={300}
                height={100}
                className="mx-auto"
              />
            </div>

            <p className="text-sm mb-6 text-red-100">
              {t('footer.gdpr')}
            </p>

            <p className="text-xs mb-8 text-red-200 max-w-4xl mx-auto leading-relaxed">
              {t('footer.business')}
            </p>

            <div className="flex justify-center space-x-6 mb-8">
              <Facebook className="h-6 w-6 hover:text-red-200 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 hover:text-red-200 cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 hover:text-red-200 cursor-pointer transition-colors" />
            </div>

            <div className="flex justify-center space-x-8 text-sm">
              <a href="#" className="hover:text-red-200 transition-colors">{t('footer.ethics')}</a>
              <a href="#" className="hover:text-red-200 transition-colors">{t('footer.consumer')}</a>
              <a href="#" className="hover:text-red-200 transition-colors">{t('footer.whistleblow')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
