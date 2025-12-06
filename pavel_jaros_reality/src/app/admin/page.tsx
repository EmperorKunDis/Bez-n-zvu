"use client";

import { useState, useEffect } from 'react';
import { AdminLayout, websiteData, type SiteKey } from '@/components/admin/AdminLayout';
import { Dashboard } from '@/components/admin/Dashboard';
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
  Layers,
  ArrowUpRight,
  Sparkles,
  Clock,
  Activity,
  Zap,
  Home,
  Briefcase,
  User,
  Phone,
  Star,
  Building2,
  Palette,
  Hammer,
  KeyRound,
  Users,
  MessageSquare,
  DollarSign,
  Shield,
  HelpCircle,
  Search
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN PAGE - PJ Reality (Default Site: reality)
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_SITE: SiteKey = 'reality';

const colors = {
  primary: '#DC2626',
  primaryDark: '#B91C1C',
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

// Content sections based on current site
const getContentSections = (currentSite: SiteKey) => {
  const siteData = websiteData[currentSite];
  const sections = siteData?.sections || {};

  const result: {
    id: string;
    title: string;
    description: string;
    fields: { key: string; label: string; type: 'text' | 'textarea' | 'image'; value: string }[];
  }[] = [];

  // Hero Section - universal
  if (sections.hero) {
    result.push({
      id: 'hero',
      title: 'Hero sekce',
      description: 'Hlavní banner na úvodní stránce',
      fields: [
        { key: 'hero.title', label: 'Hlavní nadpis', type: 'text', value: sections.hero.title || '' },
        { key: 'hero.subtitle', label: 'Podnadpis', type: 'textarea', value: sections.hero.subtitle || '' },
        { key: 'hero.cta', label: 'CTA tlačítko', type: 'text', value: sections.hero.cta || sections.hero.ctaPrimary || '' },
      ]
    });
  }

  // Services
  if (sections.services && Array.isArray(sections.services)) {
    const serviceFields = sections.services.flatMap((service: { id: string; title: string; description: string }, index: number) => [
      { key: `services.${index}.title`, label: `Služba ${index + 1} - Název`, type: 'text' as const, value: service.title },
      { key: `services.${index}.description`, label: `Služba ${index + 1} - Popis`, type: 'textarea' as const, value: service.description },
    ]);
    result.push({
      id: 'services',
      title: 'Služby',
      description: 'Nabízené služby',
      fields: serviceFields,
    });
  }

  // Site-specific sections
  if (currentSite === 'design') {
    if (sections.portfolio) {
      result.push({
        id: 'portfolio',
        title: 'Portfolio',
        description: 'Ukázky realizací',
        fields: sections.portfolio.map((item: { name: string; location: string }, index: number) => ({
          key: `portfolio.${index}.name`,
          label: `Projekt ${index + 1}`,
          type: 'text' as const,
          value: `${item.name} - ${item.location}`,
        })),
      });
    }
    if (sections.philosophy) {
      result.push({
        id: 'philosophy',
        title: 'Filozofie',
        description: 'Designová filozofie',
        fields: [
          { key: 'philosophy.title', label: 'Nadpis', type: 'text' as const, value: sections.philosophy.title },
          { key: 'philosophy.text', label: 'Text', type: 'textarea' as const, value: sections.philosophy.text },
        ],
      });
    }
  }

  if (currentSite === 'reality') {
    if (sections.properties) {
      result.push({
        id: 'properties',
        title: 'Nemovitosti',
        description: 'Nabízené nemovitosti',
        fields: sections.properties.map((prop: { title: string; price: string }, index: number) => ({
          key: `properties.${index}`,
          label: prop.title,
          type: 'text' as const,
          value: prop.price,
        })),
      });
    }
  }

  if (currentSite === 'rekonstrukce') {
    if (sections.projects) {
      result.push({
        id: 'projects',
        title: 'Realizace',
        description: 'Dokončené projekty',
        fields: sections.projects.map((proj: { name: string; location: string }, index: number) => ({
          key: `projects.${index}`,
          label: proj.name,
          type: 'text' as const,
          value: proj.location,
        })),
      });
    }
  }

  if (currentSite === 'sprava') {
    if (sections.pricing) {
      result.push({
        id: 'pricing',
        title: 'Ceník',
        description: 'Tarify a ceny',
        fields: sections.pricing.map((tarif: { name: string; price: string; description: string }) => ({
          key: `pricing.${tarif.id}`,
          label: tarif.name,
          type: 'text' as const,
          value: `${tarif.price} - ${tarif.description}`,
        })),
      });
    }
  }

  // Contact - universal
  if (sections.contact) {
    result.push({
      id: 'contact',
      title: 'Kontakt',
      description: 'Kontaktní informace',
      fields: [
        { key: 'contact.phone', label: 'Telefon', type: 'text' as const, value: sections.contact.phone || '' },
        { key: 'contact.email', label: 'E-mail', type: 'text' as const, value: sections.contact.email || '' },
        { key: 'contact.address', label: 'Adresa', type: 'text' as const, value: sections.contact.address || '' },
      ],
    });
  }

  return result;
};

// Sample translations (from messages/*.json)
const csTranslations = {
  nav: {
    home: "Domů",
    services: "Služby",
    portfolio: "Portfolio",
    about: "O mně",
    contact: "Kontakt",
    cta: "Domluvit si konzultaci"
  },
  hero: {
    title: "Vytváříme interiéry s duší a příběhem.",
    subtitle: "Od prvního nápadu po poslední polštář.",
    ctaPrimary: "Prohlédnout portfolio",
    ctaSecondary: "Domluvit si konzultaci"
  },
  services: {
    title: "Cesta za vaším vysněným domovem",
    design: {
      title: "Návrh interiéru",
      text: "Kompletní designový koncept včetně 3D vizualizací."
    },
    turnkey: {
      title: "Realizace na klíč",
      text: "Od stavebních úprav až po finální dekorace."
    },
    consultation: {
      title: "Osobní konzultace",
      text: "Poradíme s barvami, dispozicí nebo výběrem doplňků."
    }
  },
  contact: {
    title: "Pojďme společně vytvořit váš vysněný prostor",
    phone: "+420 777 558 730",
    email: "pavel.jaros@kwcz.cz"
  }
};

// Sample images
const getSampleImages = (currentSite: SiteKey) => {
  const siteData = websiteData[currentSite];
  return siteData?.images?.map(path => ({
    path,
    name: path.split('/').pop() || 'Unknown',
    type: 'local' as const,
    category: path.includes('logo') ? 'logo' : 'images'
  })) || [];
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentSite, setCurrentSite] = useState<SiteKey>(DEFAULT_SITE);
  const [themeColor, setThemeColor] = useState(colors.primary);

  useEffect(() => {
    const savedColor = localStorage.getItem('admin-theme-color');
    if (savedColor) {
      setThemeColor(savedColor);
    }
  }, []);

  const handleThemeColorChange = (color: string) => {
    setThemeColor(color);
  };

  const handleSaveContent = async (sections: ReturnType<typeof getContentSections>) => {
    console.log('Saving content:', sections);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSaveTranslations = async (locale: string, translations: Record<string, unknown>) => {
    console.log('Saving translations for', locale, translations);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const contentSections = getContentSections(currentSite);
  const sampleImages = getSampleImages(currentSite);
  const siteData = websiteData[currentSite];
  const siteColor = siteData?.color || colors.primary;

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setActiveSection}
            currentSite={currentSite}
            onSiteChange={setCurrentSite}
          />
        );

      case 'visual-editor':
        return (
          <VisualEditor
            themeColor={siteColor}
            onSave={(elements) => console.log('Saving elements:', elements)}
          />
        );

      case 'hero':
      case 'services':
      case 'portfolio':
      case 'philosophy':
      case 'process':
      case 'about':
      case 'contact':
      case 'properties':
      case 'projects':
      case 'references':
      case 'why':
      case 'target':
      case 'pricing':
      case 'benefits':
      case 'faq':
        return (
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: '#1A1A1F',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <ContentEditor
              sections={contentSections.filter(s => s.id === activeSection)}
              onSave={handleSaveContent}
              themeColor={siteColor}
            />
          </div>
        );

      case 'translations':
        return (
          <TranslationEditor
            themeColor={siteColor}
            translations={{ cs: csTranslations }}
            onSave={handleSaveTranslations}
          />
        );

      case 'images':
        return (
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: '#1A1A1F',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <ImageManager
              images={sampleImages}
              themeColor={siteColor}
            />
          </div>
        );

      case 'seo':
        return (
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: '#1A1A1F',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6" style={{ color: siteColor }} />
              <h2 className="text-xl font-bold text-white">SEO & Meta nastavení</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Title</label>
                <input
                  type="text"
                  defaultValue={siteData?.name || ''}
                  className="w-full h-12 px-4 rounded-lg bg-[#0F0F12] border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Description</label>
                <textarea
                  rows={3}
                  defaultValue="Profesionální služby od PJ Group"
                  className="w-full px-4 py-3 rounded-lg bg-[#0F0F12] border border-white/10 text-white focus:outline-none focus:border-white/30 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Keywords</label>
                <input
                  type="text"
                  defaultValue="reality, design, rekonstrukce, správa nemovitostí"
                  className="w-full h-12 px-4 rounded-lg bg-[#0F0F12] border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <button
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ background: siteColor }}
              >
                Uložit SEO nastavení
              </button>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: '#1A1A1F',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <ThemeSettings
              currentColor={siteColor}
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
      siteName={siteData?.name || 'PJ Design'}
      currentSite={currentSite}
      onSiteChange={setCurrentSite}
    >
      {renderContent()}
    </AdminLayout>
  );
}
