"use client";

import { useState } from 'react';
import {
  Home,
  Briefcase,
  Phone,
  Image as ImageIcon,
  Globe,
  Eye,
  Edit,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Palette,
  Layers,
  Clock,
  Activity,
  Sparkles,
  Pencil,
} from 'lucide-react';
import { siteData, adminTheme as theme } from './AdminLayout';

// ═══════════════════════════════════════════════════════════════════════════
// PJ DESIGN DASHBOARD - Standalone for Design website ONLY
// ═══════════════════════════════════════════════════════════════════════════

const SITE_COLOR = '#8B5CF6';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (fieldKey: string, currentValue: string) => {
    setEditingField(fieldKey);
    setEditValue(currentValue);
  };

  const handleSave = () => {
    console.log('Saving:', editingField, editValue);
    setEditingField(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  // Stats for Design website
  const stats = [
    { label: 'Služby', value: siteData.sections.services.length.toString(), icon: Briefcase, color: SITE_COLOR },
    { label: 'Portfolio', value: siteData.sections.portfolio.length.toString(), icon: ImageIcon, color: '#22C55E' },
    { label: 'Obrázky', value: siteData.images.length.toString(), icon: ImageIcon, color: '#3B82F6' },
    { label: 'Jazyky', value: '6', icon: Globe, color: '#F59E0B' },
  ];

  // Content sections for Design
  const contentSections = [
    {
      id: 'hero',
      title: 'Hero sekce',
      icon: Home,
      description: 'Hlavní banner na úvodní stránce',
      fields: [
        { key: 'hero.title', label: 'Hlavní nadpis', value: siteData.sections.hero.title },
        { key: 'hero.subtitle', label: 'Podnadpis', value: siteData.sections.hero.subtitle },
        { key: 'hero.ctaPrimary', label: 'CTA Primární', value: siteData.sections.hero.ctaPrimary },
        { key: 'hero.ctaSecondary', label: 'CTA Sekundární', value: siteData.sections.hero.ctaSecondary },
      ]
    },
    {
      id: 'services',
      title: 'Služby',
      icon: Briefcase,
      description: `${siteData.sections.services.length} nabízených služeb`,
      fields: siteData.sections.services.flatMap((service, index) => [
        { key: `services.${index}.title`, label: `Služba ${index + 1} - Název`, value: service.title },
        { key: `services.${index}.description`, label: `Služba ${index + 1} - Popis`, value: service.description },
      ])
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      icon: ImageIcon,
      description: `${siteData.sections.portfolio.length} projektů`,
      fields: siteData.sections.portfolio.map((item, index) => ({
        key: `portfolio.${index}`,
        label: `Projekt ${index + 1}`,
        value: `${item.name} - ${item.location}`,
      }))
    },
    {
      id: 'philosophy',
      title: 'Filozofie',
      icon: Sparkles,
      description: 'Designová filozofie',
      fields: [
        { key: 'philosophy.title', label: 'Nadpis', value: siteData.sections.philosophy.title },
        { key: 'philosophy.text', label: 'Text', value: siteData.sections.philosophy.text },
      ]
    },
    {
      id: 'process',
      title: 'Proces',
      icon: Clock,
      description: `${siteData.sections.process.length} kroků`,
      fields: siteData.sections.process.map((step) => ({
        key: `process.${step.step}`,
        label: `Krok ${step.step}: ${step.title}`,
        value: step.text,
      }))
    },
    {
      id: 'contact',
      title: 'Kontakt',
      icon: Phone,
      description: 'Kontaktní informace',
      fields: [
        { key: 'contact.phone', label: 'Telefon', value: siteData.sections.contact.phone },
        { key: 'contact.email', label: 'E-mail', value: siteData.sections.contact.email },
        { key: 'contact.address', label: 'Adresa', value: siteData.sections.contact.address },
      ]
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Site Info */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: SITE_COLOR }}>
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PJ Design</h1>
              <p className="text-gray-400">Správa webu Design</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('visual-editor')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ background: SITE_COLOR }}>
            <Layers className="w-4 h-4" />
            Vizuální editor
          </button>
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors" style={{ background: theme.bg.tertiary, border: `1px solid ${theme.border.medium}`, color: theme.text.secondary }}>
            <Eye className="w-4 h-4" />
            <span className="text-sm">Náhled webu</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-5 rounded-xl" style={{ background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ACTUAL IMAGES Section */}
      <div className="rounded-xl p-6" style={{ background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6" style={{ color: SITE_COLOR }} />
            <div>
              <h2 className="text-lg font-bold text-white">Obrázky webu</h2>
              <p className="text-sm text-gray-400">Skutečné obrázky z /public složky</p>
            </div>
          </div>
          <button onClick={() => onNavigate('images')} className="text-sm px-4 py-2 rounded-lg" style={{ background: `${SITE_COLOR}20`, color: SITE_COLOR }}>
            Spravovat média
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {siteData.images.map((image, index) => (
            <div key={index} className="rounded-xl overflow-hidden" style={{ background: theme.bg.tertiary, border: `1px solid ${theme.border.medium}` }}>
              <div className="aspect-video bg-black/30 flex items-center justify-center p-4">
                <img
                  src={image.path}
                  alt={image.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23333" width="100" height="100"/><text fill="%23666" x="50%" y="50%" text-anchor="middle" dy=".3em">No Image</text></svg>'; }}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{image.name}</p>
                <p className="text-xs text-gray-400">{image.path}</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full" style={{ background: image.category === 'logo' ? `${SITE_COLOR}20` : '#3B82F620', color: image.category === 'logo' ? SITE_COLOR : '#3B82F6' }}>
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Sections Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Obsah webu</h2>
          <p className="text-sm text-gray-400">Kliknutím rozbalíte sekci pro úpravy</p>
        </div>

        {contentSections.map((section) => {
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} className="rounded-xl overflow-hidden" style={{ background: theme.bg.secondary, border: `1px solid ${isExpanded ? SITE_COLOR + '50' : theme.border.subtle}` }}>
              <button onClick={() => setExpandedSection(isExpanded ? null : section.id)} className="w-full p-5 flex items-center justify-between transition-colors" style={{ background: isExpanded ? `${SITE_COLOR}10` : 'transparent' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${SITE_COLOR}20` }}>
                    <section.icon className="w-5 h-5" style={{ color: SITE_COLOR }} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">{section.title}</h3>
                    <p className="text-sm text-gray-400">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{section.fields.length} polí</span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 pt-0 space-y-4" style={{ borderTop: `1px solid ${theme.border.subtle}` }}>
                  {section.fields.map((field) => {
                    const isEditing = editingField === field.key;
                    return (
                      <div key={field.key} className="p-4 rounded-lg" style={{ background: theme.bg.tertiary }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <label className="block text-sm font-medium text-gray-400 mb-2">{field.label}</label>
                            {isEditing ? (
                              <div className="space-y-3">
                                {field.value.length > 100 ? (
                                  <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none resize-none" style={{ background: theme.bg.primary, border: `1px solid ${SITE_COLOR}`, color: theme.text.primary }} autoFocus />
                                ) : (
                                  <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full h-10 px-4 rounded-lg text-sm focus:outline-none" style={{ background: theme.bg.primary, border: `1px solid ${SITE_COLOR}`, color: theme.text.primary }} autoFocus />
                                )}
                                <div className="flex items-center gap-2">
                                  <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: SITE_COLOR }}>
                                    <Check className="w-4 h-4" />Uložit
                                  </button>
                                  <button onClick={handleCancel} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: theme.bg.accent, color: theme.text.secondary }}>
                                    <X className="w-4 h-4" />Zrušit
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-white text-sm">{field.value}</p>
                            )}
                          </div>
                          {!isEditing && (
                            <button onClick={() => handleEdit(field.key, field.value)} className="p-2 rounded-lg transition-colors flex-shrink-0" style={{ color: theme.text.muted }}>
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => onNavigate(section.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: SITE_COLOR }}>
                      <Edit className="w-4 h-4" />Upravit v editoru
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions Footer */}
      <div className="rounded-xl p-6" style={{ background: `linear-gradient(135deg, ${SITE_COLOR}15 0%, ${SITE_COLOR}05 100%)`, border: `1px solid ${SITE_COLOR}30` }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Rychlé akce</h3>
            <p className="text-sm text-gray-400">Spravujte obsah webu PJ Design</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate('translations')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: theme.bg.tertiary, color: theme.text.primary, border: `1px solid ${theme.border.medium}` }}>
              <Globe className="w-4 h-4" />Překlady
            </button>
            <button onClick={() => onNavigate('images')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: theme.bg.tertiary, color: theme.text.primary, border: `1px solid ${theme.border.medium}` }}>
              <ImageIcon className="w-4 h-4" />Média
            </button>
            <button onClick={() => onNavigate('visual-editor')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: SITE_COLOR }}>
              <Edit className="w-4 h-4" />Vizuální editor
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden" style={{ background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.border.subtle}` }}>
            <h3 className="text-lg font-semibold text-white">Nedávná aktivita</h3>
            <Clock className="w-5 h-5" style={{ color: theme.text.muted }} />
          </div>
          <div>
            {[
              { action: 'Portfolio aktualizováno', time: 'Před 1 hodinou', type: 'update' },
              { action: 'Nový obrázek nahrán', time: 'Před 3 hodinami', type: 'upload' },
              { action: 'Překlady upraveny (DE)', time: 'Včera', type: 'translation' },
            ].map((item, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: index < 2 ? `1px solid ${theme.border.subtle}` : undefined }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.type === 'update' ? '#22C55E' : item.type === 'upload' ? '#3B82F6' : SITE_COLOR }} />
                  <p className="text-sm font-medium text-white">{item.action}</p>
                </div>
                <p className="text-sm text-gray-400">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.border.subtle}` }}>
            <h3 className="text-lg font-semibold text-white">Informace o webu</h3>
            <Activity className="w-5 h-5" style={{ color: '#22C55E' }} />
          </div>
          <div>
            {[
              { label: 'Web', value: 'PJ Design' },
              { label: 'Framework', value: 'Next.js 15' },
              { label: 'Jazyky', value: 'CS, EN, DE, SK, PL, RU' },
              { label: 'Status', value: 'Online', isStatus: true },
            ].map((item, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: index < 3 ? `1px solid ${theme.border.subtle}` : undefined }}>
                <p className="text-sm text-gray-400">{item.label}</p>
                {item.isStatus ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
                    <p className="text-sm font-medium" style={{ color: '#22C55E' }}>{item.value}</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-white">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
