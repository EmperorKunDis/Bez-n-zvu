"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { TranslationEditor } from '@/components/admin/TranslationEditor';
import { ImageManager } from '@/components/admin/ImageManager';
import { ThemeSettings } from '@/components/admin/ThemeSettings';
import { Card, CardContent } from '@/components/ui/card';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Globe,
  TrendingUp,
  Eye,
  Edit,
  Users
} from 'lucide-react';

// Czech translations data (simplified for demo)
const csTranslations = {
  nav: {
    properties: "Nemovitosti",
    services: "Služby",
    references: "Reference",
    about: "O mně",
    contact: "Kontakt",
    contactMe: "Kontaktujte mě"
  },
  hero: {
    title: "Prodávám nemovitosti s nadšením",
    cta: "Prohlédnout nemovitosti"
  },
  services: {
    title: "Komplexní služby v oblasti realit",
    bookMeeting: "Sjednat schůzku",
    sale: {
      title: "Prodej nemovitostí",
      description: "Kompletní servis při prodeji vaší nemovitosti včetně marketingu a právního zajištění."
    },
    rent: {
      title: "Pronájem",
      description: "Pomůžeme vám najít ideálního nájemníka a zajistíme bezproblémový pronájem."
    }
  },
  about: {
    title: "Pavel Jaroš",
    subtitle: "O MNĚ"
  },
  contact: {
    title: "Kontaktujte mě",
    subtitle: "KONTAKT"
  },
  cookie: {
    message: "Tyto webové stránky používají cookies pro zlepšení uživatelského zážitku.",
    accept: "Přijmout",
    reject: "Odmítnout",
    preferences: "Nastavení"
  }
};

const enTranslations = {
  nav: {
    properties: "Properties",
    services: "Services",
    references: "References",
    about: "About",
    contact: "Contact",
    contactMe: "Contact Me"
  },
  hero: {
    title: "Selling Real Estate with Passion",
    cta: "View Properties"
  }
};

// Sample images data
const sampleImages = [
  { path: '/logo/PJ_Reality_logo.svg', name: 'PJ Reality Logo', type: 'local' as const, category: 'logo' },
  { path: '/logo/PJ_Reality_symbol.svg', name: 'PJ Reality Symbol', type: 'local' as const, category: 'logo' },
  { path: '/images/PavelFotka.png', name: 'Pavel Fotka', type: 'local' as const, category: 'images' },
  { path: 'https://ext.same-assets.com/2530056946/4049786394.png', name: 'Hero Background', type: 'external' as const, category: 'hero' },
  { path: 'https://ext.same-assets.com/2530056946/246692592.webp', name: 'Property 1', type: 'external' as const, category: 'properties' },
  { path: 'https://ext.same-assets.com/2530056946/1499260590.webp', name: 'Property 2', type: 'external' as const, category: 'properties' },
  { path: 'https://ext.same-assets.com/2530056946/3003633402.webp', name: 'Property 3', type: 'external' as const, category: 'properties' },
];

// Content sections for the editor
const contentSections = [
  {
    id: 'hero',
    title: 'Hero sekce',
    description: 'Hlavní banner na úvodní stránce',
    fields: [
      { key: 'hero.title', label: 'Hlavní nadpis', type: 'text' as const, value: 'Prodávám nemovitosti s nadšením' },
      { key: 'hero.cta', label: 'Text tlačítka', type: 'text' as const, value: 'Prohlédnout nemovitosti' },
      { key: 'hero.background', label: 'Obrázek pozadí', type: 'image' as const, value: 'https://ext.same-assets.com/2530056946/4049786394.png' },
    ]
  },
  {
    id: 'services',
    title: 'Služby',
    description: 'Sekce s nabízenými službami',
    fields: [
      { key: 'services.title', label: 'Nadpis sekce', type: 'text' as const, value: 'Komplexní služby v oblasti realit' },
      { key: 'services.sale.title', label: 'Prodej - nadpis', type: 'text' as const, value: 'Prodej nemovitostí' },
      { key: 'services.sale.description', label: 'Prodej - popis', type: 'textarea' as const, value: 'Kompletní servis při prodeji vaší nemovitosti včetně marketingu a právního zajištění.' },
      { key: 'services.rent.title', label: 'Pronájem - nadpis', type: 'text' as const, value: 'Pronájem' },
      { key: 'services.rent.description', label: 'Pronájem - popis', type: 'textarea' as const, value: 'Pomůžeme vám najít ideálního nájemníka a zajistíme bezproblémový pronájem.' },
    ]
  },
  {
    id: 'about',
    title: 'O mně',
    description: 'Osobní informace a představení',
    fields: [
      { key: 'about.title', label: 'Jméno', type: 'text' as const, value: 'Pavel Jaroš' },
      { key: 'about.photo', label: 'Fotografie', type: 'image' as const, value: '/images/PavelFotka.png' },
    ]
  },
  {
    id: 'contact',
    title: 'Kontakt',
    description: 'Kontaktní informace',
    fields: [
      { key: 'contact.phone', label: 'Telefon', type: 'text' as const, value: '+420 777 558 730' },
      { key: 'contact.email', label: 'E-mail', type: 'text' as const, value: 'pavel.jaros@kwcz.cz' },
      { key: 'contact.address', label: 'Adresa', type: 'text' as const, value: 'Karlovy Vary, Česká republika' },
    ]
  },
];

const DEFAULT_THEME_COLOR = '#b91c1c'; // red-700

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [themeColor, setThemeColor] = useState(DEFAULT_THEME_COLOR);

  useEffect(() => {
    const savedColor = localStorage.getItem('admin-theme-color');
    if (savedColor) {
      setThemeColor(savedColor);
    }
  }, []);

  const handleThemeColorChange = (color: string) => {
    setThemeColor(color);
  };

  const handleSaveContent = async (sections: typeof contentSections) => {
    console.log('Saving content:', sections);
    // In a real app, this would save to an API
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSaveTranslations = async (locale: string, translations: Record<string, unknown>) => {
    console.log('Saving translations for', locale, translations);
    // In a real app, this would save to an API
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Celkem sekcí</p>
                      <p className="text-3xl font-bold text-gray-900">8</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Obrázky</p>
                      <p className="text-3xl font-bold text-gray-900">{sampleImages.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Jazyky</p>
                      <p className="text-3xl font-bold text-gray-900">6</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Návštěvy</p>
                      <p className="text-3xl font-bold text-gray-900">--</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Rychlé akce</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveSection('hero')}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Edit className="h-6 w-6 text-red-700 mb-2" />
                    <p className="font-medium text-gray-900">Upravit Hero</p>
                    <p className="text-sm text-gray-500">Změnit hlavní banner</p>
                  </button>

                  <button
                    onClick={() => setActiveSection('translations')}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Globe className="h-6 w-6 text-blue-700 mb-2" />
                    <p className="font-medium text-gray-900">Překlady</p>
                    <p className="text-sm text-gray-500">Upravit texty</p>
                  </button>

                  <button
                    onClick={() => setActiveSection('images')}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <ImageIcon className="h-6 w-6 text-green-700 mb-2" />
                    <p className="font-medium text-gray-900">Obrázky</p>
                    <p className="text-sm text-gray-500">Správa médií</p>
                  </button>

                  <a
                    href="/"
                    target="_blank"
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Eye className="h-6 w-6 text-purple-700 mb-2" />
                    <p className="font-medium text-gray-900">Zobrazit web</p>
                    <p className="text-sm text-gray-500">Otevřít v novém okně</p>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Informace o webu</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Web</span>
                    <span className="font-medium">Pavel Jaroš Reality</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Framework</span>
                    <span className="font-medium">Next.js 15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Internacionalizace</span>
                    <span className="font-medium">next-intl (6 jazyků)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stylování</span>
                    <span className="font-medium">Tailwind CSS</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'hero':
      case 'services':
      case 'about':
      case 'contact':
        return (
          <ContentEditor
            sections={contentSections.filter(s => s.id === activeSection)}
            onSave={handleSaveContent}
            themeColor={themeColor}
          />
        );

      case 'translations':
        return (
          <TranslationEditor
            themeColor={themeColor}
            translations={{ cs: csTranslations, en: enTranslations }}
            onSave={handleSaveTranslations}
          />
        );

      case 'images':
        return (
          <ImageManager
            images={sampleImages}
            themeColor={themeColor}
          />
        );

      case 'settings':
        return (
          <ThemeSettings
            currentColor={themeColor}
            onColorChange={handleThemeColorChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      siteName="PJ Reality"
      themeColor={themeColor}
    >
      {renderContent()}
    </AdminLayout>
  );
}
