"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { TranslationEditor } from '@/components/admin/TranslationEditor';
import { ImageManager } from '@/components/admin/ImageManager';
import { ThemeSettings } from '@/components/admin/ThemeSettings';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Image as ImageIcon,
  Globe,
  Eye,
  Edit,
  Building2,
  DollarSign
} from 'lucide-react';

const csTranslations = {
  nav: {
    services: "Služby",
    pricing: "Ceník",
    howItWorks: "Jak to funguje",
    about: "O nás",
    references: "Reference",
    contact: "Kontakt",
    cta: "Nezávazná konzultace"
  },
  hero: {
    title: "Profesionální správa nemovitostí",
    subtitle: "Kompletní správa vašeho nájmu bez starostí.",
    cta: "Nezávazná konzultace"
  },
  target: {
    title: "Pro koho je naše služba",
    subtitle: "Pomáháme majitelům nemovitostí maximalizovat výnosy a minimalizovat starosti.",
    investor: {
      title: "Investoři",
      text: "Vlastníte více nemovitostí a chcete profesionální správu?"
    },
    remote: {
      title: "Vzdálení majitelé",
      text: "Žijete v zahraničí nebo daleko od své nemovitosti?"
    },
    time: {
      title: "Zaneprázdnění majitelé",
      text: "Nemáte čas řešit problémy s nájemníky?"
    }
  },
  pricing: {
    title: "Ceník služeb",
    subtitle: "Vyberte si tarif, který vám vyhovuje."
  }
};

const sampleImages = [
  { path: '/logo/PJ_Sprava_logo.svg', name: 'PJ Sprava Logo', type: 'local' as const, category: 'logo' },
  { path: '/logo/PJ_Sprava_symbol.svg', name: 'PJ Sprava Symbol', type: 'local' as const, category: 'logo' },
  { path: '/images/PajaSpravaBezPozadi.png', name: 'Pavel Sprava', type: 'local' as const, category: 'images' },
  { path: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073', name: 'Hero Background', type: 'external' as const, category: 'hero' },
];

const contentSections = [
  {
    id: 'hero',
    title: 'Hero sekce',
    description: 'Hlavní banner na úvodní stránce',
    fields: [
      { key: 'hero.title', label: 'Hlavní nadpis', type: 'text' as const, value: 'Profesionální správa nemovitostí' },
      { key: 'hero.subtitle', label: 'Podnadpis', type: 'textarea' as const, value: 'Kompletní správa vašeho nájmu bez starostí.' },
      { key: 'hero.cta', label: 'Text tlačítka', type: 'text' as const, value: 'Nezávazná konzultace' },
    ]
  },
  {
    id: 'services',
    title: 'Služby',
    description: 'Nabízené služby správy',
    fields: [
      { key: 'target.title', label: 'Nadpis sekce', type: 'text' as const, value: 'Pro koho je naše služba' },
      { key: 'target.subtitle', label: 'Podnadpis', type: 'textarea' as const, value: 'Pomáháme majitelům nemovitostí maximalizovat výnosy.' },
      { key: 'target.investor.title', label: 'Investoři - nadpis', type: 'text' as const, value: 'Investoři' },
      { key: 'target.investor.text', label: 'Investoři - popis', type: 'textarea' as const, value: 'Vlastníte více nemovitostí a chcete profesionální správu?' },
    ]
  },
  {
    id: 'about',
    title: 'O nás',
    description: 'Informace o firmě',
    fields: [
      { key: 'about.title', label: 'Nadpis', type: 'text' as const, value: 'O nás' },
      { key: 'about.intro', label: 'Úvod', type: 'textarea' as const, value: 'Jsem Pavel Jaroš a pomáhám majitelům nemovitostí s profesionální správou.' },
    ]
  },
  {
    id: 'contact',
    title: 'Kontakt',
    description: 'Kontaktní informace',
    fields: [
      { key: 'contact.phone', label: 'Telefon', type: 'text' as const, value: '+420 777 558 730' },
      { key: 'contact.email', label: 'E-mail', type: 'text' as const, value: 'sprava@pj-group.cz' },
      { key: 'contact.address', label: 'Působnost', type: 'text' as const, value: 'Karlovarský kraj i celá ČR' },
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
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSaveTranslations = async (locale: string, translations: Record<string, unknown>) => {
    console.log('Saving translations for', locale, translations);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Celkem sekcí</p>
                      <p className="text-3xl font-bold text-gray-900">9</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tarify</p>
                      <p className="text-3xl font-bold text-gray-900">3</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-yellow-600" />
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
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-6 w-6 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Rychlé akce</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveSection('hero')}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Edit className="h-6 w-6 text-green-700 mb-2" />
                    <p className="font-medium text-gray-900">Upravit Hero</p>
                    <p className="text-sm text-gray-500">Změnit hlavní banner</p>
                  </button>

                  <button
                    onClick={() => setActiveSection('translations')}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Globe className="h-6 w-6 text-purple-700 mb-2" />
                    <p className="font-medium text-gray-900">Překlady</p>
                    <p className="text-sm text-gray-500">Upravit texty</p>
                  </button>

                  <button
                    onClick={() => setActiveSection('images')}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <ImageIcon className="h-6 w-6 text-blue-700 mb-2" />
                    <p className="font-medium text-gray-900">Obrázky</p>
                    <p className="text-sm text-gray-500">Správa médií</p>
                  </button>

                  <a
                    href="/"
                    target="_blank"
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Eye className="h-6 w-6 text-yellow-600 mb-2" />
                    <p className="font-medium text-gray-900">Zobrazit web</p>
                    <p className="text-sm text-gray-500">Otevřít v novém okně</p>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Informace o webu</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Web</span>
                    <span className="font-medium">Pavel Jaroš Správa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téma</span>
                    <span className="font-medium">Správa nemovitostí</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Barva</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-green-700"></span>
                      <span className="font-medium">Zelená</span>
                    </span>
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
            translations={{ cs: csTranslations }}
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
      siteName="PJ Správa"
      themeColor={themeColor}
    >
      {renderContent()}
    </AdminLayout>
  );
}
