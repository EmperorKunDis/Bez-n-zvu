"use client";

import { useState, useEffect } from 'react';
import { AdminLayout, siteData, adminTheme } from '@/components/admin/AdminLayout';
import {
  Home, Phone, Briefcase, User, Star, Globe, Image as ImageIcon,
  ChevronDown, ChevronUp, Check, X, Pencil, RefreshCw,
  Palette, Layers, Eye, ArrowUpRight, Clock, Activity, AlertCircle, BookOpen, Sparkles
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// PJ DESIGN ADMIN - Real Translation Editor
// Loads and saves to /messages/*.json via API
// ═══════════════════════════════════════════════════════════════════════════

const SITE_COLOR = '#8B5CF6';
const LOCALES = ['cs', 'en', 'de', 'pl', 'sk', 'ru'];

// Translation sections matching the EXACT structure from cs.json
const SECTIONS = [
  { id: 'nav', title: 'Navigace', icon: Home, keys: ['home', 'services', 'portfolio', 'discoverStyle', 'about', 'contact', 'cta'] },
  { id: 'hero', title: 'Hero sekce', icon: Home, keys: ['title', 'subtitle', 'ctaPrimary', 'ctaSecondary'] },
  { id: 'portfolio', title: 'Portfolio', icon: ImageIcon, keys: ['title', 'viewAll'], nested: {
    'project1': ['name', 'location'],
    'project2': ['name', 'location'],
    'project3': ['name', 'location']
  }},
  { id: 'services', title: 'Služby', icon: Briefcase, keys: ['title'], nested: {
    'design': ['title', 'text'],
    'turnkey': ['title', 'text'],
    'consultation': ['title', 'text']
  }},
  { id: 'philosophy', title: 'Filozofie', icon: BookOpen, keys: ['title', 'text'] },
  { id: 'process', title: 'Proces', icon: Clock, keys: ['title'], nested: {
    'step1': ['title', 'text'],
    'step2': ['title', 'text'],
    'step3': ['title', 'text'],
    'step4': ['title', 'text'],
    'step5': ['title', 'text']
  }},
  { id: 'contact', title: 'Kontakt', icon: Phone, keys: ['title', 'subtitle', 'phone', 'email', 'address', 'ico'], nested: {
    'form': ['name', 'email', 'phone', 'service', 'serviceOnline', 'serviceDesign', 'serviceTurnkey', 'propertyType', 'budget', 'message', 'gdpr', 'submit', 'sending', 'success', 'error']
  }},
  { id: 'footer', title: 'Patička', icon: Layers, keys: ['copyright', 'privacy'], nested: {
    'contact': ['title', 'name', 'phone', 'email', 'ico', 'address'],
    'services': ['title', 'reconstruction', 'management', 'reality'],
    'social': ['title', 'instagram', 'pinterest']
  }},
  { id: 'cookie', title: 'Cookies', icon: AlertCircle, keys: ['message', 'accept', 'reject', 'preferences'] },
  { id: 'discoverStyle', title: 'Objevte svůj styl', icon: Sparkles, keys: ['back', 'title', 'subtitle', 'hint', 'reset'], nested: {
    'highlights': ['personal', 'visual', 'execution'],
    'showcase': ['title', 'description', 'badge', 'alt'],
    'cta': ['title', 'text', 'button']
  }},
];

export default function AdminPage() {
  const [activeLocale, setActiveLocale] = useState('cs');
  const [translations, setTranslations] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [expandedSection, setExpandedSection] = useState<string | null>('hero');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => { loadTranslations(); }, [activeLocale]);

  const loadTranslations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/translations?locale=${activeLocale}`);
      const data = await response.json();
      if (data.translations) setTranslations(data.translations);
    } catch (error) { console.error('Failed to load translations:', error); }
    setLoading(false);
  };

  const getValue = (key: string): string => {
    const keys = key.split('.');
    let current: unknown = translations;
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else { return ''; }
    }
    return typeof current === 'string' ? current : '';
  };

  const saveValue = async (key: string, value: string) => {
    setSaving(true);
    try {
      const response = await fetch('/api/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: activeLocale, key, value })
      });
      if (response.ok) {
        const keys = key.split('.');
        const newTranslations = JSON.parse(JSON.stringify(translations));
        let current: Record<string, unknown> = newTranslations;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]] as Record<string, unknown>;
        }
        current[keys[keys.length - 1]] = value;
        setTranslations(newTranslations);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else { setSaveStatus('error'); }
    } catch (error) { console.error('Failed to save:', error); setSaveStatus('error'); }
    setSaving(false);
    setEditingKey(null);
  };

  const renderField = (fullKey: string, label: string) => {
    const value = getValue(fullKey);
    const isEditing = editingKey === fullKey;
    const isLongText = value.length > 100;
    return (
      <div key={fullKey} className="p-4 rounded-lg" style={{ background: adminTheme.bg.tertiary }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-500 mb-1">{fullKey}</label>
            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
            {isEditing ? (
              <div className="space-y-3">
                {isLongText ? (
                  <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none resize-none" style={{ background: adminTheme.bg.primary, border: `2px solid ${SITE_COLOR}`, color: adminTheme.text.primary }} autoFocus />
                ) : (
                  <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full h-10 px-4 rounded-lg text-sm focus:outline-none" style={{ background: adminTheme.bg.primary, border: `2px solid ${SITE_COLOR}`, color: adminTheme.text.primary }} autoFocus />
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => saveValue(fullKey, editValue)} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: SITE_COLOR }}>
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Uložit
                  </button>
                  <button onClick={() => setEditingKey(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: adminTheme.bg.accent, color: adminTheme.text.secondary }}><X className="w-4 h-4" />Zrušit</button>
                </div>
              </div>
            ) : (
              <p className="text-white text-sm whitespace-pre-wrap">{value || <span className="text-gray-500 italic">Prázdné</span>}</p>
            )}
          </div>
          {!isEditing && (
            <button onClick={() => { setEditingKey(fullKey); setEditValue(value); }} className="p-2 rounded-lg flex-shrink-0 hover:bg-white/10" style={{ color: adminTheme.text.muted }}><Pencil className="w-4 h-4" /></button>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (section: typeof SECTIONS[0]) => {
    const isExpanded = expandedSection === section.id;
    const Icon = section.icon;
    return (
      <div key={section.id} className="rounded-xl overflow-hidden" style={{ background: adminTheme.bg.secondary, border: `1px solid ${isExpanded ? SITE_COLOR + '50' : adminTheme.border.subtle}` }}>
        <button onClick={() => setExpandedSection(isExpanded ? null : section.id)} className="w-full p-5 flex items-center justify-between" style={{ background: isExpanded ? `${SITE_COLOR}10` : 'transparent' }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${SITE_COLOR}20` }}><Icon className="w-5 h-5" style={{ color: SITE_COLOR }} /></div>
            <div className="text-left"><h3 className="font-semibold text-white">{section.title}</h3><p className="text-sm text-gray-400">{section.id}</p></div>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {isExpanded && (
          <div className="p-5 pt-0 space-y-3" style={{ borderTop: `1px solid ${adminTheme.border.subtle}` }}>
            {section.keys.map(key => renderField(`${section.id}.${key}`, key))}
            {section.nested && Object.entries(section.nested).map(([nestedKey, nestedFields]) => (
              <div key={nestedKey} className="mt-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 pl-2">{section.id}.{nestedKey}</h4>
                <div className="space-y-3 pl-4 border-l-2" style={{ borderColor: `${SITE_COLOR}40` }}>
                  {nestedFields.map(field => renderField(`${section.id}.${nestedKey}.${field}`, field))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout activeSection="dashboard" onSectionChange={() => {}}>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: SITE_COLOR }}><Palette className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-white">PJ Design - Editor obsahu</h1><p className="text-gray-400">Upravujte překlady přímo v messages/{activeLocale}.json</p></div>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'success' && <span className="flex items-center gap-2 text-green-400 text-sm"><Check className="w-4 h-4" /> Uloženo</span>}
            {saveStatus === 'error' && <span className="flex items-center gap-2 text-red-400 text-sm"><X className="w-4 h-4" /> Chyba</span>}
            <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: adminTheme.bg.tertiary, border: `1px solid ${adminTheme.border.medium}`, color: adminTheme.text.secondary }}><Eye className="w-4 h-4" />Náhled<ArrowUpRight className="w-4 h-4" /></a>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: adminTheme.bg.secondary, border: `1px solid ${adminTheme.border.subtle}` }}>
          <Globe className="w-5 h-5" style={{ color: SITE_COLOR }} /><span className="text-gray-400 text-sm">Jazyk:</span>
          <div className="flex gap-2">
            {LOCALES.map(locale => (<button key={locale} onClick={() => setActiveLocale(locale)} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all" style={{ background: activeLocale === locale ? SITE_COLOR : adminTheme.bg.tertiary, color: activeLocale === locale ? 'white' : adminTheme.text.secondary }}>{locale.toUpperCase()}</button>))}
          </div>
          <button onClick={loadTranslations} className="ml-auto p-2 rounded-lg hover:bg-white/10" style={{ color: adminTheme.text.muted }}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>

        <div className="rounded-xl p-6" style={{ background: adminTheme.bg.secondary, border: `1px solid ${adminTheme.border.subtle}` }}>
          <div className="flex items-center gap-3 mb-6"><ImageIcon className="w-6 h-6" style={{ color: SITE_COLOR }} /><div><h2 className="text-lg font-bold text-white">Obrázky webu</h2><p className="text-sm text-gray-400">Skutečné obrázky z /public</p></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {siteData.images.map((img, i) => (<div key={i} className="rounded-xl overflow-hidden" style={{ background: adminTheme.bg.tertiary, border: `1px solid ${adminTheme.border.medium}` }}><div className="aspect-video bg-black/30 flex items-center justify-center p-4"><img src={img.path} alt={img.name} className="max-h-full max-w-full object-contain" /></div><div className="p-3"><p className="text-sm font-medium text-white truncate">{img.name}</p><p className="text-xs text-gray-400">{img.path}</p></div></div>))}
          </div>
        </div>

        {loading ? (<div className="flex items-center justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin" style={{ color: SITE_COLOR }} /></div>) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-white">Sekce obsahu ({activeLocale.toUpperCase()})</h2><p className="text-sm text-gray-400">Kliknutím rozbalíte sekci</p></div>
            {SECTIONS.map(section => renderSection(section))}
          </div>
        )}

        <div className="rounded-xl p-6" style={{ background: adminTheme.bg.secondary, border: `1px solid ${adminTheme.border.subtle}` }}>
          <h3 className="text-lg font-semibold text-white mb-4">Jak to funguje</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>1. Vyberte jazyk • 2. Rozbalte sekci • 3. Klikněte na tužku • 4. Upravte a uložte</p>
            <p className="text-yellow-500">Po úpravě restartujte dev server pro zobrazení změn na webu.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
