"use client";

import { useState } from 'react';
import {
  ArrowUpRight,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  Layers,
  Edit,
  Globe,
  Eye,
  Sparkles,
  Clock,
  Activity,
  Zap,
  Plus,
  ChevronRight,
  BarChart3,
  Users,
  MousePointerClick,
  Building2,
  Palette,
  Hammer,
  KeyRound,
  ExternalLink,
  Settings,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Pencil,
  Trash2,
  Copy,
  Move,
  Upload,
  Download,
  RefreshCw,
  Save,
  X,
  Check,
  Home,
  Briefcase,
  MessageSquare,
  DollarSign,
  Camera,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Type,
  Link2,
  Bold,
  Italic,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Undo,
  Redo
} from 'lucide-react';
import { adminTheme as theme, websiteData, type SiteKey } from './AdminLayout';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface DashboardProps {
  onNavigate: (section: string) => void;
  currentSite: SiteKey;
  onSiteChange: (site: SiteKey) => void;
}

interface EditableItem {
  id: string;
  type: 'text' | 'image' | 'link' | 'rich-text';
  label: string;
  value: string;
  placeholder?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function Dashboard({ onNavigate, currentSite, onSiteChange }: DashboardProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('hero');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const siteData = websiteData[currentSite];
  const siteColor = siteData?.color || theme.brand.primary;

  // Stats data based on current site
  const getStats = () => {
    const sections = siteData?.sections || {};
    const sectionCount = Object.keys(sections).length;
    const imageCount = siteData?.images?.length || 0;

    return [
      {
        label: 'Sekce webu',
        value: sectionCount.toString(),
        change: 'Aktivní',
        trend: 'up',
        icon: FileText,
        color: siteColor,
      },
      {
        label: 'Projekty / Položky',
        value: currentSite === 'reality'
          ? (sections.properties?.length || 0).toString()
          : currentSite === 'design'
          ? (sections.portfolio?.length || 0).toString()
          : currentSite === 'rekonstrukce'
          ? (sections.projects?.length || 0).toString()
          : (sections.pricing?.length || 0).toString(),
        change: '+2 tento měsíc',
        trend: 'up',
        icon: BarChart3,
        color: '#F59E0B',
      },
      {
        label: 'Média',
        value: imageCount.toString(),
        change: 'Nahráno',
        trend: 'up',
        icon: ImageIcon,
        color: '#3B82F6',
      },
      {
        label: 'Jazyky',
        value: '6',
        change: 'CS, EN, DE, SK, PL, RU',
        trend: 'up',
        icon: Globe,
        color: '#8B5CF6',
      },
    ];
  };

  const stats = getStats();

  // Get site-specific content sections
  const getContentSections = () => {
    const sections = siteData?.sections || {};

    const result: { id: string; title: string; icon: typeof Home; items: EditableItem[]; expanded?: boolean }[] = [];

    // Hero Section - universal
    if (sections.hero) {
      result.push({
        id: 'hero',
        title: 'Hero Sekce',
        icon: Home,
        items: [
          { id: 'hero-title', type: 'text', label: 'Hlavní nadpis', value: sections.hero.title || '' },
          { id: 'hero-subtitle', type: 'text', label: 'Podnadpis', value: sections.hero.subtitle || '' },
          { id: 'hero-cta', type: 'text', label: 'CTA tlačítko', value: sections.hero.cta || sections.hero.ctaPrimary || '' },
          { id: 'hero-image', type: 'image', label: 'Hlavní obrázek', value: sections.hero.image || '' },
        ],
      });
    }

    // Services - universal
    if (sections.services && Array.isArray(sections.services)) {
      result.push({
        id: 'services',
        title: 'Služby',
        icon: Briefcase,
        items: sections.services.map((service: { id: string; title: string; description: string }, index: number) => ({
          id: `service-${index}`,
          type: 'rich-text' as const,
          label: service.title,
          value: service.description,
        })),
      });
    }

    // Site-specific sections
    if (currentSite === 'reality') {
      if (sections.properties) {
        result.push({
          id: 'properties',
          title: 'Nemovitosti',
          icon: Building2,
          items: sections.properties.map((prop: { title: string; price: string; image: string }, index: number) => ({
            id: `property-${index}`,
            type: 'text' as const,
            label: prop.title,
            value: prop.price,
          })),
        });
      }
      if (sections.references) {
        result.push({
          id: 'references',
          title: 'Reference',
          icon: Star,
          items: sections.references.map((ref: { name: string; text: string }, index: number) => ({
            id: `reference-${index}`,
            type: 'rich-text' as const,
            label: ref.name,
            value: ref.text,
          })),
        });
      }
    }

    if (currentSite === 'design') {
      if (sections.portfolio) {
        result.push({
          id: 'portfolio',
          title: 'Portfolio',
          icon: ImageIcon,
          items: sections.portfolio.map((item: { name: string; location: string; image: string }, index: number) => ({
            id: `portfolio-${index}`,
            type: 'text' as const,
            label: item.name,
            value: item.location,
          })),
        });
      }
      if (sections.philosophy) {
        result.push({
          id: 'philosophy',
          title: 'Filozofie',
          icon: Sparkles,
          items: [
            { id: 'philosophy-title', type: 'text', label: 'Nadpis', value: sections.philosophy.title },
            { id: 'philosophy-text', type: 'rich-text', label: 'Text', value: sections.philosophy.text },
          ],
        });
      }
      if (sections.process) {
        result.push({
          id: 'process',
          title: 'Proces',
          icon: Clock,
          items: sections.process.map((step: { step: number; title: string; text: string }) => ({
            id: `process-${step.step}`,
            type: 'text' as const,
            label: `Krok ${step.step}: ${step.title}`,
            value: step.text,
          })),
        });
      }
    }

    if (currentSite === 'rekonstrukce') {
      if (sections.projects) {
        result.push({
          id: 'projects',
          title: 'Realizace',
          icon: Hammer,
          items: sections.projects.map((proj: { name: string; location: string }, index: number) => ({
            id: `project-${index}`,
            type: 'text' as const,
            label: proj.name,
            value: proj.location,
          })),
        });
      }
      if (sections.why) {
        result.push({
          id: 'why',
          title: 'Proč my',
          icon: CheckCircle,
          items: sections.why.map((item: { title: string; text: string }, index: number) => ({
            id: `why-${index}`,
            type: 'rich-text' as const,
            label: item.title,
            value: item.text,
          })),
        });
      }
    }

    if (currentSite === 'sprava') {
      if (sections.target) {
        result.push({
          id: 'target',
          title: 'Cílová skupina',
          icon: Users,
          items: sections.target.map((item: { id: string; title: string; text: string }) => ({
            id: `target-${item.id}`,
            type: 'rich-text' as const,
            label: item.title,
            value: item.text,
          })),
        });
      }
      if (sections.pricing) {
        result.push({
          id: 'pricing',
          title: 'Ceník',
          icon: DollarSign,
          items: sections.pricing.map((tarif: { id: string; name: string; price: string; description: string }) => ({
            id: `pricing-${tarif.id}`,
            type: 'text' as const,
            label: tarif.name,
            value: `${tarif.price} - ${tarif.description}`,
          })),
        });
      }
      if (sections.faq) {
        result.push({
          id: 'faq',
          title: 'FAQ',
          icon: MessageSquare,
          items: sections.faq.map((item: { question: string; answer: string }, index: number) => ({
            id: `faq-${index}`,
            type: 'rich-text' as const,
            label: item.question,
            value: item.answer,
          })),
        });
      }
    }

    // Contact - universal
    if (sections.contact) {
      result.push({
        id: 'contact',
        title: 'Kontakt',
        icon: Phone,
        items: [
          { id: 'contact-phone', type: 'text', label: 'Telefon', value: sections.contact.phone || '' },
          { id: 'contact-email', type: 'text', label: 'E-mail', value: sections.contact.email || '' },
          { id: 'contact-address', type: 'text', label: 'Adresa', value: sections.contact.address || '' },
        ],
      });
    }

    return result;
  };

  const contentSections = getContentSections();

  // Quick actions based on site
  const quickActions = [
    { label: 'Upravit Hero', desc: 'Hlavní banner', icon: Edit, section: 'hero', color: siteColor },
    { label: 'Překlady', desc: '6 jazyků', icon: Globe, section: 'translations', color: '#3B82F6' },
    { label: 'Média', desc: 'Obrázky & Loga', icon: ImageIcon, section: 'images', color: '#22C55E' },
    { label: 'Zobrazit web', desc: 'Nové okno', icon: Eye, section: 'external', color: '#8B5CF6' },
  ];

  // Site cards for switcher
  const siteCards = Object.entries(websiteData).map(([key, data]) => ({
    key: key as SiteKey,
    name: data.name,
    color: data.color,
    icon: data.icon,
    url: data.url,
    isActive: currentSite === key,
  }));

  return (
    <div className="space-y-8">

      {/* ═══════════════════════════════════════════════════════════════════
          SITE SWITCHER CARDS
      ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {siteCards.map((site) => (
          <button
            key={site.key}
            onClick={() => onSiteChange(site.key)}
            className={`relative p-4 rounded-xl transition-all duration-300 group ${
              site.isActive ? 'ring-2' : ''
            }`}
            style={{
              background: site.isActive
                ? `linear-gradient(135deg, ${site.color}20 0%, ${site.color}10 100%)`
                : theme.bg.secondary,
              border: `1px solid ${site.isActive ? site.color : theme.border.subtle}`,
              ringColor: site.color,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: site.color }}
              >
                <site.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p
                  className="font-semibold text-sm"
                  style={{ color: site.isActive ? site.color : theme.text.primary }}
                >
                  {site.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: theme.text.muted }}
                >
                  {site.isActive ? 'Aktivní' : 'Přepnout'}
                </p>
              </div>
            </div>
            {site.isActive && (
              <div
                className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                style={{ background: site.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          WELCOME HERO SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden p-8 lg:p-10"
        style={{
          background: `linear-gradient(135deg, ${theme.bg.secondary} 0%, ${theme.bg.tertiary} 100%)`,
          borderRadius: theme.radius.xl,
          border: `1px solid ${theme.border.medium}`,
        }}
      >
        {/* Decorative Elements */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: siteColor, transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-60 h-60 rounded-full blur-3xl opacity-10"
          style={{ background: siteColor }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${theme.border.medium} 1px, transparent 1px), linear-gradient(90deg, ${theme.border.medium} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{
                  background: `${siteColor}20`,
                  color: siteColor,
                  border: `1px solid ${siteColor}30`,
                }}
              >
                <Sparkles className="w-4 h-4" />
                Editor pro {siteData?.name}
              </div>

              <h2
                className="text-3xl lg:text-4xl font-bold mb-3"
                style={{ color: theme.text.primary }}
              >
                Profesionální správa webu
              </h2>
              <p
                className="text-lg leading-relaxed"
                style={{ color: theme.text.secondary }}
              >
                Upravujte všechny sekce, texty, obrázky a překlady. Změny se projeví okamžitě na webu.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('visual-editor')}
                className="flex items-center gap-3 px-6 py-3.5 font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] group"
                style={{
                  background: `linear-gradient(135deg, ${siteColor} 0%, ${siteColor}cc 100%)`,
                  borderRadius: theme.radius.lg,
                  boxShadow: `0 4px 24px ${siteColor}40`,
                }}
              >
                <Layers className="w-5 h-5" />
                Vizuální editor
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <a
                href={siteData?.url || '/'}
                target="_blank"
                className="flex items-center gap-2 px-5 py-3.5 font-medium transition-all hover:scale-[1.02]"
                style={{
                  background: theme.bg.tertiary,
                  color: theme.text.primary,
                  borderRadius: theme.radius.lg,
                  border: `1px solid ${theme.border.medium}`,
                }}
              >
                <Eye className="w-5 h-5" />
                Náhled
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS GRID
      ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group p-5 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: theme.bg.secondary,
              borderRadius: theme.radius.xl,
              border: `1px solid ${theme.border.subtle}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${stat.color}40`;
              e.currentTarget.style.boxShadow = `0 8px 32px ${stat.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.border.subtle;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: theme.text.muted }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: theme.text.primary }}
                >
                  {stat.value}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{
                  background: `${stat.color}15`,
                }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" style={{ color: theme.status.success }} />
              <span
                className="text-sm"
                style={{ color: theme.text.muted }}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENT EDITOR SECTIONS
      ════════════════════════════════════════════════════════════════════ */}
      <div
        className="overflow-hidden"
        style={{
          background: theme.bg.secondary,
          borderRadius: theme.radius.xl,
          border: `1px solid ${theme.border.subtle}`,
        }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${theme.border.subtle}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${siteColor}15` }}
            >
              <Edit className="w-5 h-5" style={{ color: siteColor }} />
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: theme.text.primary }}
              >
                Obsah webu {siteData?.name}
              </h3>
              <p className="text-sm" style={{ color: theme.text.muted }}>
                Klikněte na sekci pro úpravu
              </p>
            </div>
          </div>

          {hasUnsavedChanges && (
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: theme.status.warning }}>
                Neuložené změny
              </span>
              <button
                className="flex items-center gap-2 px-4 py-2 font-medium text-white rounded-lg transition-all hover:scale-[1.02]"
                style={{ background: theme.status.success }}
              >
                <Save className="w-4 h-4" />
                Uložit vše
              </button>
            </div>
          )}
        </div>

        <div className="divide-y" style={{ borderColor: theme.border.subtle }}>
          {contentSections.map((section) => (
            <div key={section.id}>
              {/* Section Header */}
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-5 transition-colors"
                style={{ background: expandedSection === section.id ? theme.bg.tertiary : 'transparent' }}
                onMouseEnter={(e) => {
                  if (expandedSection !== section.id) e.currentTarget.style.background = theme.bg.accent;
                }}
                onMouseLeave={(e) => {
                  if (expandedSection !== section.id) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${siteColor}15` }}
                  >
                    <section.icon className="w-5 h-5" style={{ color: siteColor }} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold" style={{ color: theme.text.primary }}>
                      {section.title}
                    </p>
                    <p className="text-sm" style={{ color: theme.text.muted }}>
                      {section.items.length} položek
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(section.id);
                    }}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: theme.text.muted }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${siteColor}20`;
                      e.currentTarget.style.color = siteColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = theme.text.muted;
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  {expandedSection === section.id ? (
                    <ChevronUp className="w-5 h-5" style={{ color: theme.text.muted }} />
                  ) : (
                    <ChevronDown className="w-5 h-5" style={{ color: theme.text.muted }} />
                  )}
                </div>
              </button>

              {/* Section Content */}
              {expandedSection === section.id && (
                <div
                  className="px-5 pb-5 space-y-3"
                  style={{ background: theme.bg.tertiary }}
                >
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl transition-all"
                      style={{
                        background: theme.bg.secondary,
                        border: `1px solid ${editingItem === item.id ? siteColor : theme.border.subtle}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {item.type === 'image' ? (
                              <ImageIcon className="w-4 h-4" style={{ color: theme.text.muted }} />
                            ) : item.type === 'rich-text' ? (
                              <Type className="w-4 h-4" style={{ color: theme.text.muted }} />
                            ) : (
                              <Edit className="w-4 h-4" style={{ color: theme.text.muted }} />
                            )}
                            <span className="text-sm font-medium" style={{ color: theme.text.secondary }}>
                              {item.label}
                            </span>
                          </div>

                          {editingItem === item.id ? (
                            <div className="space-y-3">
                              {item.type === 'image' ? (
                                <div className="flex items-center gap-3">
                                  <input
                                    type="text"
                                    defaultValue={item.value}
                                    placeholder="URL obrázku nebo nahrát..."
                                    className="flex-1 h-10 px-4 text-sm rounded-lg focus:outline-none"
                                    style={{
                                      background: theme.bg.primary,
                                      border: `1px solid ${theme.border.medium}`,
                                      color: theme.text.primary,
                                    }}
                                  />
                                  <button
                                    className="h-10 px-4 rounded-lg flex items-center gap-2 text-sm font-medium"
                                    style={{
                                      background: `${siteColor}15`,
                                      color: siteColor,
                                    }}
                                  >
                                    <Upload className="w-4 h-4" />
                                    Nahrát
                                  </button>
                                </div>
                              ) : item.type === 'rich-text' ? (
                                <div>
                                  <div
                                    className="flex items-center gap-1 p-2 rounded-t-lg"
                                    style={{
                                      background: theme.bg.primary,
                                      border: `1px solid ${theme.border.medium}`,
                                      borderBottom: 'none',
                                    }}
                                  >
                                    <button className="p-1.5 rounded hover:bg-white/10" style={{ color: theme.text.muted }}>
                                      <Bold className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-white/10" style={{ color: theme.text.muted }}>
                                      <Italic className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-4 mx-1" style={{ background: theme.border.medium }} />
                                    <button className="p-1.5 rounded hover:bg-white/10" style={{ color: theme.text.muted }}>
                                      <AlignLeft className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-white/10" style={{ color: theme.text.muted }}>
                                      <AlignCenter className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-white/10" style={{ color: theme.text.muted }}>
                                      <AlignRight className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-4 mx-1" style={{ background: theme.border.medium }} />
                                    <button className="p-1.5 rounded hover:bg-white/10" style={{ color: theme.text.muted }}>
                                      <List className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-white/10" style={{ color: theme.text.muted }}>
                                      <Link2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <textarea
                                    defaultValue={item.value}
                                    rows={4}
                                    className="w-full px-4 py-3 text-sm rounded-b-lg focus:outline-none resize-none"
                                    style={{
                                      background: theme.bg.primary,
                                      border: `1px solid ${theme.border.medium}`,
                                      color: theme.text.primary,
                                    }}
                                  />
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  defaultValue={item.value}
                                  className="w-full h-10 px-4 text-sm rounded-lg focus:outline-none"
                                  style={{
                                    background: theme.bg.primary,
                                    border: `1px solid ${theme.border.medium}`,
                                    color: theme.text.primary,
                                  }}
                                />
                              )}

                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                                  style={{ color: theme.text.muted }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = theme.bg.accent}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  Zrušit
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingItem(null);
                                    setHasUnsavedChanges(true);
                                  }}
                                  className="px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-all hover:scale-[1.02]"
                                  style={{ background: siteColor }}
                                >
                                  Uložit
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p
                              className="text-sm truncate"
                              style={{ color: theme.text.primary }}
                            >
                              {item.value || <span style={{ color: theme.text.muted }}>Prázdné</span>}
                            </p>
                          )}
                        </div>

                        {editingItem !== item.id && (
                          <button
                            onClick={() => setEditingItem(item.id)}
                            className="p-2 rounded-lg transition-colors flex-shrink-0"
                            style={{ color: theme.text.muted }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = `${siteColor}20`;
                              e.currentTarget.style.color = siteColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = theme.text.muted;
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      background: theme.bg.secondary,
                      border: `1px dashed ${theme.border.medium}`,
                      color: theme.text.muted,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = siteColor;
                      e.currentTarget.style.color = siteColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.border.medium;
                      e.currentTarget.style.color = theme.text.muted;
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Přidat položku
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          QUICK ACTIONS
      ════════════════════════════════════════════════════════════════════ */}
      <div
        className="overflow-hidden"
        style={{
          background: theme.bg.secondary,
          borderRadius: theme.radius.xl,
          border: `1px solid ${theme.border.subtle}`,
        }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${theme.border.subtle}` }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: theme.text.primary }}
          >
            Rychlé akce
          </h3>
          <Zap className="w-5 h-5" style={{ color: theme.text.muted }} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => action.section === 'external' ? window.open(siteData?.url || '/', '_blank') : onNavigate(action.section)}
              className="p-6 text-left transition-all group"
              style={{
                borderRight: index < 3 ? `1px solid ${theme.border.subtle}` : undefined,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.bg.tertiary}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: `${action.color}15` }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <p
                className="font-semibold mb-1"
                style={{ color: theme.text.primary }}
              >
                {action.label}
              </p>
              <p
                className="text-sm"
                style={{ color: theme.text.muted }}
              >
                {action.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          IMAGES & MEDIA PREVIEW
      ════════════════════════════════════════════════════════════════════ */}
      <div
        className="overflow-hidden"
        style={{
          background: theme.bg.secondary,
          borderRadius: theme.radius.xl,
          border: `1px solid ${theme.border.subtle}`,
        }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${theme.border.subtle}` }}
        >
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5" style={{ color: siteColor }} />
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.text.primary }}
            >
              Média & Obrázky
            </h3>
          </div>
          <button
            onClick={() => onNavigate('images')}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: siteColor }}
          >
            Zobrazit vše
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {siteData?.images?.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl overflow-hidden relative group"
                style={{
                  background: theme.bg.tertiary,
                  border: `1px solid ${theme.border.subtle}`,
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8" style={{ color: theme.text.muted }} />
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.7)' }}
                >
                  <button
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </button>
                  <button
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <Pencil className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 p-2 text-xs truncate"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    color: theme.text.secondary,
                  }}
                >
                  {image.split('/').pop()}
                </div>
              </div>
            ))}

            {/* Upload placeholder */}
            <button
              onClick={() => onNavigate('images')}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
              style={{
                background: theme.bg.tertiary,
                border: `2px dashed ${theme.border.medium}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = siteColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border.medium;
              }}
            >
              <Plus className="w-6 h-6" style={{ color: theme.text.muted }} />
              <span className="text-xs" style={{ color: theme.text.muted }}>
                Nahrát
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SYSTEM INFO
      ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div
          className="overflow-hidden"
          style={{
            background: theme.bg.secondary,
            borderRadius: theme.radius.xl,
            border: `1px solid ${theme.border.subtle}`,
          }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${theme.border.subtle}` }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.text.primary }}
            >
              Nedávná aktivita
            </h3>
            <Clock className="w-5 h-5" style={{ color: theme.text.muted }} />
          </div>

          <div>
            {[
              { action: 'Hero sekce aktualizována', time: 'Před 1 hodinou', type: 'update' },
              { action: 'Nový obrázek nahrán', time: 'Před 3 hodinami', type: 'upload' },
              { action: 'Překlady upraveny (DE)', time: 'Včera', type: 'translation' },
              { action: 'Kontaktní údaje změněny', time: 'Před 2 dny', type: 'update' },
            ].map((item, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-center justify-between transition-colors"
                style={{
                  borderBottom: index < 3
                    ? `1px solid ${theme.border.subtle}`
                    : undefined
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.bg.tertiary}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: item.type === 'update'
                        ? theme.status.success
                        : item.type === 'upload'
                          ? theme.status.info
                          : siteColor
                    }}
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.text.primary }}
                  >
                    {item.action}
                  </p>
                </div>
                <p
                  className="text-sm"
                  style={{ color: theme.text.muted }}
                >
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div
          className="overflow-hidden"
          style={{
            background: theme.bg.secondary,
            borderRadius: theme.radius.xl,
            border: `1px solid ${theme.border.subtle}`,
          }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${theme.border.subtle}` }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: theme.text.primary }}
            >
              Informace o systému
            </h3>
            <Activity className="w-5 h-5" style={{ color: theme.status.success }} />
          </div>

          <div>
            {[
              { label: 'Aktuální web', value: siteData?.name || 'Neznámý' },
              { label: 'Framework', value: 'Next.js 15' },
              { label: 'Jazyky', value: 'CS, EN, DE, SK, PL, RU' },
              { label: 'Status', value: 'Online', isStatus: true },
            ].map((item, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-center justify-between"
                style={{
                  borderBottom: index < 3
                    ? `1px solid ${theme.border.subtle}`
                    : undefined
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: theme.text.muted }}
                >
                  {item.label}
                </p>
                {item.isStatus ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: theme.status.success }}
                    />
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.status.success }}
                    >
                      {item.value}
                    </p>
                  </div>
                ) : (
                  <p
                    className="text-sm font-medium"
                    style={{ color: theme.text.primary }}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
