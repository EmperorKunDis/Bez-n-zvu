"use client";

import { useState } from 'react';
import { AdminLayout, siteData, adminTheme } from '@/components/admin/AdminLayout';
import { Dashboard } from '@/components/admin/Dashboard';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { TranslationEditor } from '@/components/admin/TranslationEditor';
import { ImageManager } from '@/components/admin/ImageManager';
import { ThemeSettings } from '@/components/admin/ThemeSettings';
import { VisualEditor } from '@/components/admin/VisualEditor';
import { Search } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// PJ REKONSTRUKCE ADMIN - Standalone Admin Panel
// ═══════════════════════════════════════════════════════════════════════════

const SITE_COLOR = '#F59E0B';

// Content sections for Rekonstrukce
const getContentSections = () => {
  const sections = siteData.sections;
  const result: {
    id: string;
    title: string;
    description: string;
    fields: { key: string; label: string; type: 'text' | 'textarea' | 'image'; value: string }[];
  }[] = [];

  // Hero Section
  result.push({
    id: 'hero',
    title: 'Hero sekce',
    description: 'Hlavní banner na úvodní stránce',
    fields: [
      { key: 'hero.title', label: 'Hlavní nadpis', type: 'text', value: sections.hero.title },
      { key: 'hero.subtitle', label: 'Podnadpis', type: 'textarea', value: sections.hero.subtitle },
      { key: 'hero.ctaPrimary', label: 'CTA primární', type: 'text', value: sections.hero.ctaPrimary },
      { key: 'hero.ctaSecondary', label: 'CTA sekundární', type: 'text', value: sections.hero.ctaSecondary },
    ]
  });

  // Services
  const serviceFields = sections.services.flatMap((service, index) => [
    { key: `services.${index}.title`, label: `Služba ${index + 1} - Název`, type: 'text' as const, value: service.title },
    { key: `services.${index}.description`, label: `Služba ${index + 1} - Popis`, type: 'textarea' as const, value: service.description },
  ]);
  result.push({
    id: 'services',
    title: 'Služby',
    description: 'Nabízené služby',
    fields: serviceFields,
  });

  // Projects
  const projectFields = sections.projects.map((project, index) => ({
    key: `projects.${index}`,
    label: `Projekt ${index + 1}`,
    type: 'text' as const,
    value: `${project.name} - ${project.location}`,
  }));
  result.push({
    id: 'projects',
    title: 'Realizace',
    description: 'Dokončené projekty',
    fields: projectFields,
  });

  // Why us
  const whyFields = sections.why.map((item, index) => ({
    key: `why.${index}`,
    label: item.title,
    type: 'textarea' as const,
    value: item.text,
  }));
  result.push({
    id: 'why',
    title: 'Proč my',
    description: 'Proč si vybrat nás',
    fields: whyFields,
  });

  // Process
  const processFields = sections.process.map((step) => ({
    key: `process.${step.step}`,
    label: `Krok ${step.step}: ${step.title}`,
    type: 'textarea' as const,
    value: step.text,
  }));
  result.push({
    id: 'process',
    title: 'Proces',
    description: 'Jak to funguje',
    fields: processFields,
  });

  // References
  const refFields = sections.references.flatMap((ref, index) => [
    { key: `references.${index}.name`, label: `Reference ${index + 1} - Jméno`, type: 'text' as const, value: ref.name },
    { key: `references.${index}.text`, label: `Reference ${index + 1} - Text`, type: 'textarea' as const, value: ref.text },
  ]);
  result.push({
    id: 'references',
    title: 'Reference',
    description: 'Reference klientů',
    fields: refFields,
  });

  // Contact
  result.push({
    id: 'contact',
    title: 'Kontakt',
    description: 'Kontaktní informace',
    fields: [
      { key: 'contact.phone', label: 'Telefon', type: 'text', value: sections.contact.phone },
      { key: 'contact.email', label: 'E-mail', type: 'text', value: sections.contact.email },
      { key: 'contact.address', label: 'Adresa', type: 'text', value: sections.contact.address },
      { key: 'contact.hours', label: 'Pracovní doba', type: 'text', value: sections.contact.hours },
    ],
  });

  return result;
};

// Translations
const csTranslations = {
  nav: {
    home: "Domů",
    services: "Služby",
    projects: "Realizace",
    references: "Reference",
    contact: "Kontakt",
    cta: "Spočítat cenu rekonstrukce"
  },
  hero: {
    title: "Proměníme vaše sny v realitu.",
    subtitle: "Kompletní rekonstrukce bytů a domů v Karlovarském kraji.",
    ctaPrimary: "Spočítat cenu rekonstrukce",
    ctaSecondary: "Prohlédnout realizace"
  },
  services: {
    title: "Naše služby",
    cores: {
      title: "Rekonstrukce bytových jader",
      text: "Modernizujeme umakartová i zděná jádra."
    },
    apartments: {
      title: "Kompletní rekonstrukce bytů",
      text: "Od bouracích prací po finální povrchy."
    },
    houses: {
      title: "Rekonstrukce rodinných domů",
      text: "Vnitřní i vnější rekonstrukce domů."
    }
  },
  contact: {
    phone: "+420 777 558 730",
    email: "pavel.jaros@kwcz.cz"
  }
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleSaveContent = async (sections: ReturnType<typeof getContentSections>) => {
    console.log('Saving content:', sections);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSaveTranslations = async (locale: string, translations: Record<string, unknown>) => {
    console.log('Saving translations for', locale, translations);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const contentSections = getContentSections();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;

      case 'visual-editor':
        return (
          <VisualEditor
            themeColor={SITE_COLOR}
            onSave={(elements) => console.log('Saving elements:', elements)}
          />
        );

      case 'hero':
      case 'services':
      case 'projects':
      case 'why':
      case 'process':
      case 'references':
      case 'contact':
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
              themeColor={SITE_COLOR}
            />
          </div>
        );

      case 'translations':
        return (
          <TranslationEditor
            themeColor={SITE_COLOR}
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
              images={siteData.images}
              themeColor={SITE_COLOR}
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
              <Search className="w-6 h-6" style={{ color: SITE_COLOR }} />
              <h2 className="text-xl font-bold text-white">SEO & Meta nastavení</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Title</label>
                <input
                  type="text"
                  defaultValue="PJ Rekonstrukce - Proměníme vaše sny v realitu"
                  className="w-full h-12 px-4 rounded-lg bg-[#0F0F12] border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Description</label>
                <textarea
                  rows={3}
                  defaultValue="Kompletní rekonstrukce bytů a domů v Karlovarském kraji. Bytová jádra, byty, rodinné domy - profesionální přístup a kvalitní práce."
                  className="w-full px-4 py-3 rounded-lg bg-[#0F0F12] border border-white/10 text-white focus:outline-none focus:border-white/30 resize-none"
                />
              </div>
              <button
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ background: SITE_COLOR }}
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
              currentColor={SITE_COLOR}
              onColorChange={(color) => console.log('Theme color changed:', color)}
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
    >
      {renderContent()}
    </AdminLayout>
  );
}
