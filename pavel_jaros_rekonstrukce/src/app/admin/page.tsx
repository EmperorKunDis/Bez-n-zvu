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
  Hammer,
  Layers,
  ArrowUpRight,
  Sparkles,
  Clock,
  Activity,
  Zap
} from 'lucide-react';

// Design System Colors (matching AdminLayout)
const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  secondary: '#64748B',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  dark: '#1E293B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
};

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
    }
  }
};

const sampleImages = [
  { path: '/logo/PJ_Group_logo.svg', name: 'PJ Group Logo', type: 'local' as const, category: 'logo' },
  { path: '/logo/PJ_Group_symbol.svg', name: 'PJ Group Symbol', type: 'local' as const, category: 'logo' },
  { path: '/images/PavelRekonstrukceBezPozadi.png', name: 'Pavel Rekonstrukce', type: 'local' as const, category: 'images' },
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
    ]
  },
  {
    id: 'services',
    title: 'Služby',
    description: 'Nabízené služby rekonstrukcí',
    fields: [
      { key: 'services.title', label: 'Nadpis sekce', type: 'text' as const, value: 'Naše služby' },
      { key: 'services.cores.title', label: 'Jádra - nadpis', type: 'text' as const, value: 'Rekonstrukce jader' },
      { key: 'services.cores.text', label: 'Jádra - popis', type: 'textarea' as const, value: 'Kompletní rekonstrukce bytových jader včetně rozvodů.' },
    ]
  },
  {
    id: 'about',
    title: 'O nás',
    description: 'Informace o firmě',
    fields: [
      { key: 'about.title', label: 'Nadpis', type: 'text' as const, value: 'O naší firmě' },
      { key: 'about.text', label: 'Text', type: 'textarea' as const, value: 'Jsme zkušený tým profesionálů...' },
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

const DEFAULT_THEME_COLOR = '#2563EB';

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
              className="relative overflow-hidden rounded-xl p-8"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primary}05 100%)`,
                border: `1px solid ${colors.primary}30`
              }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                <Sparkles className="w-full h-full" style={{ color: colors.primary }} />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.dark }}>
                  Vítejte v editoru
                </h2>
                <p className="max-w-xl" style={{ color: colors.textSecondary }}>
                  Spravujte obsah svého webu pomocí intuitivního rozhraní. Upravujte texty, obrázky a nastavení v reálném čase.
                </p>
                <button
                  onClick={() => setActiveSection('visual-editor')}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: colors.primary }}
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
                { label: 'Celkem sekcí', value: '6', icon: FileText, color: '#EF4444', change: '+2' },
                { label: 'Projekty', value: '24', icon: Hammer, color: '#F59E0B', change: '+8' },
                { label: 'Obrázky', value: sampleImages.length.toString(), icon: ImageIcon, color: '#3B82F6', change: '+5' },
                { label: 'Aktivita', value: 'Online', icon: Activity, color: '#A855F7', change: 'Live' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl p-5 transition-all hover:shadow-md group"
                  style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm mb-1" style={{ color: colors.textMuted }}>{stat.label}</p>
                      <p className="text-3xl font-bold" style={{ color: colors.dark }}>{stat.value}</p>
                    </div>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs" style={{ color: colors.textMuted }}>tento měsíc</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="p-5" style={{ borderBottom: `1px solid ${colors.border}` }}>
                <h3 className="text-lg font-semibold" style={{ color: colors.dark }}>Rychlé akce</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4">
                {[
                  { label: 'Upravit Hero', desc: 'Změnit hlavní banner', icon: Edit, section: 'hero', color: colors.primary },
                  { label: 'Překlady', desc: 'Upravit texty', icon: Globe, section: 'translations', color: '#3B82F6' },
                  { label: 'Obrázky', desc: 'Správa médií', icon: ImageIcon, section: 'images', color: '#22C55E' },
                  { label: 'Zobrazit web', desc: 'Otevřít v novém okně', icon: Eye, section: 'external', color: '#A855F7' },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => action.section === 'external' ? window.open('/', '_blank') : setActiveSection(action.section)}
                    className="p-5 text-left transition-colors group"
                    style={{
                      borderRight: i < 3 ? `1px solid ${colors.border}` : undefined,
                      borderBottom: `1px solid ${colors.border}`
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${action.color}15` }}
                    >
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <p className="font-medium text-sm" style={{ color: colors.dark }}>{action.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>{action.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div
                  className="p-5 flex items-center justify-between"
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                  <h3 className="text-lg font-semibold" style={{ color: colors.dark }}>Nedávná aktivita</h3>
                  <Clock className="w-4 h-4" style={{ color: colors.textMuted }} />
                </div>
                <div>
                  {[
                    { action: 'Nová realizace přidána', time: 'Před 1 hodinou' },
                    { action: 'Aktualizace ceníku služeb', time: 'Před 3 hodinami' },
                    { action: 'Nahrání fotek z projektu', time: 'Včera' },
                    { action: 'Změna kontaktních údajů', time: 'Před 2 dny' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="px-5 py-3 flex items-center justify-between transition-colors"
                      style={{ borderBottom: i < 3 ? `1px solid ${colors.border}` : undefined }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <p className="text-sm" style={{ color: colors.dark }}>{item.action}</p>
                      <p className="text-xs" style={{ color: colors.textMuted }}>{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div
                  className="p-5 flex items-center justify-between"
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                  <h3 className="text-lg font-semibold" style={{ color: colors.dark }}>Informace o webu</h3>
                  <Zap className="w-4 h-4" style={{ color: colors.primary }} />
                </div>
                <div>
                  {[
                    { label: 'Web', value: 'Pavel Jaroš Rekonstrukce' },
                    { label: 'Framework', value: 'Next.js 15' },
                    { label: 'Internacionalizace', value: 'next-intl (6 jazyků)' },
                    { label: 'Stylování', value: 'Tailwind CSS' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="px-5 py-3 flex items-center justify-between"
                      style={{ borderBottom: i < 3 ? `1px solid ${colors.border}` : undefined }}
                    >
                      <p className="text-sm" style={{ color: colors.textMuted }}>{item.label}</p>
                      <p className="text-sm font-medium" style={{ color: colors.dark }}>{item.value}</p>
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
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}
          >
            <ContentEditor
              sections={contentSections.filter(s => s.id === activeSection)}
              onSave={handleSaveContent}
              themeColor={themeColor}
            />
          </div>
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
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}
          >
            <ImageManager
              images={sampleImages}
              themeColor={themeColor}
            />
          </div>
        );

      case 'settings':
        return (
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}
          >
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
      siteName="PJ Rekonstrukce"
      themeColor={themeColor}
    >
      {renderContent()}
    </AdminLayout>
  );
}
