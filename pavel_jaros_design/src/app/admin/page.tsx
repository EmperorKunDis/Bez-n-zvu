"use client";

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { TranslationEditor } from '@/components/admin/TranslationEditor';
import { ImageManager } from '@/components/admin/ImageManager';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Image as ImageIcon,
  Globe,
  TrendingUp,
  Eye,
  Edit,
  Palette
} from 'lucide-react';

const csTranslations = {
  nav: {
    home: "Domů",
    services: "Služby",
    portfolio: "Portfolio",
    discoverStyle: "Objevte svůj styl",
    about: "O mně",
    contact: "Kontakt",
    cta: "Nezávazná konzultace"
  },
  hero: {
    title: "Interiérový design, který vypráví váš příběh",
    subtitle: "Vytvářím jedinečné interiéry, které odrážejí vaši osobnost a životní styl.",
    ctaPrimary: "Prohlédnout portfolio",
    ctaSecondary: "Kontaktovat"
  },
  services: {
    title: "Naše služby",
    design: {
      title: "Návrh interiéru",
      text: "Kompletní návrh interiéru od konceptu po realizaci."
    },
    turnkey: {
      title: "Realizace na klíč",
      text: "Komplexní realizace projektu včetně dozoru a koordinace řemeslníků."
    },
    consultation: {
      title: "Online konzultace",
      text: "Profesionální poradenství na dálku pro váš projekt."
    }
  }
};

const sampleImages = [
  { path: '/logo/PJ_Group_logo.svg', name: 'PJ Group Logo', type: 'local' as const, category: 'logo' },
  { path: '/logo/PJ_Group_symbol.svg', name: 'PJ Group Symbol', type: 'local' as const, category: 'logo' },
  { path: '/images/PavelDesignBezPozadi.png', name: 'Pavel Design', type: 'local' as const, category: 'images' },
  { path: '/design/boho.png', name: 'Boho Style', type: 'local' as const, category: 'styles' },
  { path: '/design/scand.png', name: 'Scandinavian Style', type: 'local' as const, category: 'styles' },
  { path: '/design/minim.png', name: 'Minimalist Style', type: 'local' as const, category: 'styles' },
  { path: '/design/industrial.jpg', name: 'Industrial Style', type: 'local' as const, category: 'styles' },
  { path: '/design/vintage.png', name: 'Vintage Style', type: 'local' as const, category: 'styles' },
];

const contentSections = [
  {
    id: 'hero',
    title: 'Hero sekce',
    description: 'Hlavní banner na úvodní stránce',
    fields: [
      { key: 'hero.title', label: 'Hlavní nadpis', type: 'text' as const, value: 'Interiérový design, který vypráví váš příběh' },
      { key: 'hero.subtitle', label: 'Podnadpis', type: 'textarea' as const, value: 'Vytvářím jedinečné interiéry, které odrážejí vaši osobnost a životní styl.' },
      { key: 'hero.ctaPrimary', label: 'Primární tlačítko', type: 'text' as const, value: 'Prohlédnout portfolio' },
      { key: 'hero.ctaSecondary', label: 'Sekundární tlačítko', type: 'text' as const, value: 'Kontaktovat' },
    ]
  },
  {
    id: 'services',
    title: 'Služby',
    description: 'Nabízené designové služby',
    fields: [
      { key: 'services.title', label: 'Nadpis sekce', type: 'text' as const, value: 'Naše služby' },
      { key: 'services.design.title', label: 'Návrh - nadpis', type: 'text' as const, value: 'Návrh interiéru' },
      { key: 'services.design.text', label: 'Návrh - popis', type: 'textarea' as const, value: 'Kompletní návrh interiéru od konceptu po realizaci.' },
    ]
  },
  {
    id: 'about',
    title: 'O mně',
    description: 'Informace o designérovi',
    fields: [
      { key: 'philosophy.title', label: 'Nadpis', type: 'text' as const, value: 'Můj přístup k designu' },
      { key: 'philosophy.text', label: 'Text', type: 'textarea' as const, value: 'Věřím, že každý prostor má potenciál být výjimečný...' },
    ]
  },
  {
    id: 'contact',
    title: 'Kontakt',
    description: 'Kontaktní informace',
    fields: [
      { key: 'contact.phone', label: 'Telefon', type: 'text' as const, value: '+420 777 558 730' },
      { key: 'contact.email', label: 'E-mail', type: 'text' as const, value: 'design@pj-group.cz' },
      { key: 'contact.address', label: 'Adresa', type: 'text' as const, value: 'Karlovy Vary, Česká republika' },
    ]
  },
];

const THEME_COLOR = '#b91c1c'; // red-700

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

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
                      <p className="text-3xl font-bold text-gray-900">6</p>
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
                      <p className="text-sm text-gray-600">Designové styly</p>
                      <p className="text-3xl font-bold text-gray-900">10</p>
                    </div>
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Palette className="h-6 w-6 text-pink-700" />
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
            </div>

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
            themeColor={THEME_COLOR}
          />
        );

      case 'translations':
        return (
          <TranslationEditor
            themeColor={THEME_COLOR}
            translations={{ cs: csTranslations }}
            onSave={handleSaveTranslations}
          />
        );

      case 'images':
        return (
          <ImageManager
            images={sampleImages}
            themeColor={THEME_COLOR}
          />
        );

      case 'settings':
        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Nastavení</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Pro změnu nastavení webu upravte konfigurační soubory projektu.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      siteName="PJ Design"
      themeColor={THEME_COLOR}
    >
      {renderContent()}
    </AdminLayout>
  );
}
