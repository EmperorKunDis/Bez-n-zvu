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
  Eye,
  Edit,
  Hammer
} from 'lucide-react';

const csTranslations = {
  nav: {
    home: "Domů",
    services: "Služby",
    projects: "Realizace",
    about: "O nás",
    contact: "Kontakt",
    cta: "Nezávazná konzultace"
  },
  hero: {
    title: "Rekonstrukce bytů a domů na klíč",
    subtitle: "Profesionální rekonstrukce s garancí termínů a ceny.",
    ctaPrimary: "Nezávazná poptávka",
    ctaSecondary: "Naše realizace"
  },
  services: {
    title: "Naše služby",
    cores: {
      title: "Rekonstrukce jader",
      text: "Kompletní rekonstrukce bytových jader včetně rozvodů."
    },
    apartments: {
      title: "Rekonstrukce bytů",
      text: "Celková rekonstrukce bytů od návrhu po realizaci."
    },
    houses: {
      title: "Rekonstrukce domů",
      text: "Rekonstrukce rodinných domů včetně zateplení."
    },
    crafts: {
      title: "Řemeslné práce",
      text: "Jednotlivé řemeslné práce a drobné opravy."
    }
  }
};

const sampleImages = [
  { path: '/logo/PJ_Reko_logo.svg', name: 'PJ Reko Logo', type: 'local' as const, category: 'logo' },
  { path: '/logo/PJ_Reko_symbol.svg', name: 'PJ Reko Symbol', type: 'local' as const, category: 'logo' },
  { path: '/images/PajaBezPrdeleReko.png', name: 'Pavel Reko', type: 'local' as const, category: 'images' },
  { path: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070', name: 'Hero Background', type: 'external' as const, category: 'hero' },
  { path: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?q=80&w=2070', name: 'Project 1', type: 'external' as const, category: 'projects' },
  { path: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2070', name: 'Project 2', type: 'external' as const, category: 'projects' },
];

const contentSections = [
  {
    id: 'hero',
    title: 'Hero sekce',
    description: 'Hlavní banner na úvodní stránce',
    fields: [
      { key: 'hero.title', label: 'Hlavní nadpis', type: 'text' as const, value: 'Rekonstrukce bytů a domů na klíč' },
      { key: 'hero.subtitle', label: 'Podnadpis', type: 'textarea' as const, value: 'Profesionální rekonstrukce s garancí termínů a ceny.' },
      { key: 'hero.ctaPrimary', label: 'Primární tlačítko', type: 'text' as const, value: 'Nezávazná poptávka' },
      { key: 'hero.ctaSecondary', label: 'Sekundární tlačítko', type: 'text' as const, value: 'Naše realizace' },
    ]
  },
  {
    id: 'services',
    title: 'Služby',
    description: 'Nabízené stavební služby',
    fields: [
      { key: 'services.title', label: 'Nadpis sekce', type: 'text' as const, value: 'Naše služby' },
      { key: 'services.cores.title', label: 'Jádra - nadpis', type: 'text' as const, value: 'Rekonstrukce jader' },
      { key: 'services.cores.text', label: 'Jádra - popis', type: 'textarea' as const, value: 'Kompletní rekonstrukce bytových jader včetně rozvodů.' },
      { key: 'services.apartments.title', label: 'Byty - nadpis', type: 'text' as const, value: 'Rekonstrukce bytů' },
      { key: 'services.apartments.text', label: 'Byty - popis', type: 'textarea' as const, value: 'Celková rekonstrukce bytů od návrhu po realizaci.' },
    ]
  },
  {
    id: 'about',
    title: 'O nás',
    description: 'Informace o firmě',
    fields: [
      { key: 'about.title', label: 'Nadpis', type: 'text' as const, value: 'O nás' },
      { key: 'about.text', label: 'Text', type: 'textarea' as const, value: 'Jsem Pavel Jaroš a specializuji se na kompletní rekonstrukce bytů a domů.' },
    ]
  },
  {
    id: 'contact',
    title: 'Kontakt',
    description: 'Kontaktní informace',
    fields: [
      { key: 'contact.phone', label: 'Telefon', type: 'text' as const, value: '+420 777 558 730' },
      { key: 'contact.email', label: 'E-mail', type: 'text' as const, value: 'rekonstrukce@pj-group.cz' },
      { key: 'contact.address', label: 'Adresa', type: 'text' as const, value: 'Karlovy Vary, Česká republika' },
    ]
  },
];

const THEME_COLOR = '#2563eb'; // blue-600

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
                      <p className="text-3xl font-bold text-gray-900">7</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Realizace</p>
                      <p className="text-3xl font-bold text-gray-900">3</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Hammer className="h-6 w-6 text-orange-600" />
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
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-green-600" />
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
                      <Globe className="h-6 w-6 text-purple-600" />
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
                    <Edit className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-900">Upravit Hero</p>
                    <p className="text-sm text-gray-500">Změnit hlavní banner</p>
                  </button>

                  <button
                    onClick={() => setActiveSection('translations')}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Globe className="h-6 w-6 text-purple-600 mb-2" />
                    <p className="font-medium text-gray-900">Překlady</p>
                    <p className="text-sm text-gray-500">Upravit texty</p>
                  </button>

                  <button
                    onClick={() => setActiveSection('images')}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <ImageIcon className="h-6 w-6 text-green-600 mb-2" />
                    <p className="font-medium text-gray-900">Obrázky</p>
                    <p className="text-sm text-gray-500">Správa médií</p>
                  </button>

                  <a
                    href="/"
                    target="_blank"
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Eye className="h-6 w-6 text-orange-600 mb-2" />
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
      siteName="PJ Rekonstrukce"
      themeColor={THEME_COLOR}
    >
      {renderContent()}
    </AdminLayout>
  );
}
