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
// PJ SPRAVA ADMIN - Standalone Admin Panel
// ═══════════════════════════════════════════════════════════════════════════

const SITE_COLOR = '#10B981';

// Content sections for Sprava
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
      { key: 'hero.cta', label: 'CTA tlačítko', type: 'text', value: sections.hero.cta },
    ]
  });

  // Target audience
  const targetFields = sections.target.flatMap((item, index) => [
    { key: `target.${index}.title`, label: `Skupina ${index + 1} - Název`, type: 'text' as const, value: item.title },
    { key: `target.${index}.text`, label: `Skupina ${index + 1} - Popis`, type: 'textarea' as const, value: item.text },
  ]);
  result.push({
    id: 'target',
    title: 'Cílová skupina',
    description: 'Pro koho je služba určena',
    fields: targetFields,
  });

  // Pricing
  const pricingFields = sections.pricing.flatMap((tarif, index) => [
    { key: `pricing.${index}.name`, label: `${tarif.name}`, type: 'text' as const, value: tarif.name },
    { key: `pricing.${index}.price`, label: `Cena tarifu ${tarif.name}`, type: 'text' as const, value: tarif.price },
    { key: `pricing.${index}.description`, label: `Popis tarifu ${tarif.name}`, type: 'textarea' as const, value: tarif.description },
  ]);
  result.push({
    id: 'pricing',
    title: 'Ceník',
    description: 'Tarify a ceny',
    fields: pricingFields,
  });

  // Benefits
  const benefitFields = sections.benefits.map((benefit, index) => ({
    key: `benefits.${index}`,
    label: benefit.title,
    type: 'textarea' as const,
    value: benefit.text,
  }));
  result.push({
    id: 'benefits',
    title: 'Výhody',
    description: 'Proč si vybrat naše služby',
    fields: benefitFields,
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

  // FAQ
  const faqFields = sections.faq.flatMap((item, index) => [
    { key: `faq.${index}.question`, label: `Otázka ${index + 1}`, type: 'text' as const, value: item.question },
    { key: `faq.${index}.answer`, label: `Odpověď ${index + 1}`, type: 'textarea' as const, value: item.answer },
  ]);
  result.push({
    id: 'faq',
    title: 'FAQ',
    description: 'Často kladené otázky',
    fields: faqFields,
  });

  // About
  result.push({
    id: 'about',
    title: 'O nás',
    description: 'Informace o Pavlu Jarošovi',
    fields: [
      { key: 'about.name', label: 'Jméno', type: 'text', value: sections.about.name },
      { key: 'about.intro', label: 'Úvod', type: 'textarea', value: sections.about.intro },
    ]
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
    ],
  });

  return result;
};

// Translations
const csTranslations = {
  nav: {
    home: "Domů",
    services: "Služby",
    pricing: "Ceník",
    about: "O nás",
    contact: "Kontakt",
  },
  hero: {
    title: "Nepřetržitý příjem z pronájmu bez starostí.",
    subtitle: "Svěřte nám svou nemovitost a my zařídíme vše ostatní.",
    cta: "Chci pronajímat bez starostí",
  },
  contact: {
    phone: "+420 777 558 730",
    email: "pavel.jaros@kwcz.cz",
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
      case 'target':
      case 'pricing':
      case 'benefits':
      case 'process':
      case 'references':
      case 'faq':
      case 'about':
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
                  defaultValue="PJ Správa - Nepřetržitý příjem z pronájmu bez starostí"
                  className="w-full h-12 px-4 rounded-lg bg-[#0F0F12] border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Meta Description</label>
                <textarea
                  rows={3}
                  defaultValue="Profesionální správa nemovitostí v Karlovarském kraji. Svěřte nám svou nemovitost a my zařídíme vše ostatní."
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
