"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { TranslationEditor } from '@/components/admin/TranslationEditor';
import { ImageManager } from '@/components/admin/ImageManager';
import { ThemeSettings } from '@/components/admin/ThemeSettings';
import { VisualEditor } from '@/components/admin/VisualEditor';
import {
  FileText,
  Image as ImageIcon,
  Globe,
  Eye,
  Edit,
  Palette,
  Layers,
  ArrowUpRight,
  Sparkles,
  Clock,
  Activity,
  Zap
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

const DEFAULT_THEME_COLOR = '#b91c1c';

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
            {/* Welcome Banner */}
            <div
              className="relative overflow-hidden rounded-2xl p-8"
              style={{
                background: `linear-gradient(135deg, ${themeColor}20 0%, ${themeColor}05 100%)`,
                border: `1px solid ${themeColor}30`
              }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                <Sparkles className="w-full h-full" style={{ color: themeColor }} />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2">Vítejte v editoru</h2>
                <p className="text-gray-400 max-w-xl">
                  Spravujte obsah svého webu pomocí intuitivního rozhraní. Upravujte texty, obrázky a nastavení v reálném čase.
                </p>
                <button
                  onClick={() => setActiveSection('visual-editor')}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: themeColor }}
                >
                  <Layers className="w-4 h-4" />
                  Spustit vizuální editor
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Celkem sekcí', value: '6', icon: FileText, color: '#ef4444', change: '+2' },
                { label: 'Designové styly', value: '10', icon: Palette, color: '#ec4899', change: '+3' },
                { label: 'Obrázky', value: sampleImages.length.toString(), icon: ImageIcon, color: '#3b82f6', change: '+5' },
                { label: 'Aktivita', value: 'Online', icon: Activity, color: '#a855f7', change: 'Live' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-[#141414] rounded-xl p-5 border border-white/10 hover:border-white/20 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-600">tento měsíc</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-[#141414] rounded-xl border border-white/10 overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Rychlé akce</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4">
                {[
                  { label: 'Upravit Hero', desc: 'Změnit hlavní banner', icon: Edit, section: 'hero', color: themeColor },
                  { label: 'Překlady', desc: 'Upravit texty', icon: Globe, section: 'translations', color: '#3b82f6' },
                  { label: 'Obrázky', desc: 'Správa médií', icon: ImageIcon, section: 'images', color: '#22c55e' },
                  { label: 'Zobrazit web', desc: 'Otevřít v novém okně', icon: Eye, section: 'external', color: '#a855f7' },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => action.section === 'external' ? window.open('/', '_blank') : setActiveSection(action.section)}
                    className="p-5 text-left hover:bg-white/5 transition-colors border-r border-b border-white/5 last:border-r-0 group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${action.color}20` }}
                    >
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <p className="font-medium text-white text-sm">{action.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#141414] rounded-xl border border-white/10 overflow-hidden">
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Nedávná aktivita</h3>
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { action: 'Změna textu v Hero sekci', time: 'Před 2 hodinami' },
                    { action: 'Nahrání nového obrázku', time: 'Před 5 hodinami' },
                    { action: 'Aktualizace portfolio', time: 'Včera' },
                    { action: 'Změna barvy tématu', time: 'Před 2 dny' },
                  ].map((item, i) => (
                    <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <p className="text-sm text-gray-300">{item.action}</p>
                      <p className="text-xs text-gray-600">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#141414] rounded-xl border border-white/10 overflow-hidden">
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Informace o webu</h3>
                  <Zap className="w-4 h-4" style={{ color: themeColor }} />
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { label: 'Web', value: 'Pavel Jaroš Design' },
                    { label: 'Framework', value: 'Next.js 15' },
                    { label: 'Internacionalizace', value: 'next-intl (6 jazyků)' },
                    { label: 'Stylování', value: 'Tailwind CSS' },
                  ].map((item, i) => (
                    <div key={i} className="px-5 py-3 flex items-center justify-between">
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'visual-editor':
        return (
          <VisualEditor
            themeColor={themeColor}
            onSave={(elements) => console.log('Saving elements:', elements)}
          />
        );

      case 'hero':
      case 'services':
      case 'about':
      case 'contact':
        return (
          <div className="bg-[#141414] rounded-xl border border-white/10 p-6">
            <ContentEditor
              sections={contentSections.filter(s => s.id === activeSection)}
              onSave={handleSaveContent}
              themeColor={themeColor}
            />
          </div>
        );

      case 'translations':
        return (
          <div className="bg-[#141414] rounded-xl border border-white/10 p-6">
            <TranslationEditor
              themeColor={themeColor}
              translations={{ cs: csTranslations }}
              onSave={handleSaveTranslations}
            />
          </div>
        );

      case 'images':
        return (
          <div className="bg-[#141414] rounded-xl border border-white/10 p-6">
            <ImageManager
              images={sampleImages}
              themeColor={themeColor}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="bg-[#141414] rounded-xl border border-white/10 p-6">
            <ThemeSettings
              currentColor={themeColor}
              onColorChange={handleThemeColorChange}
            />
          </div>
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
      themeColor={themeColor}
    >
      {renderContent()}
    </AdminLayout>
  );
}
