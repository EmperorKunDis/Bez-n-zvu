"use client";

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Search, ChevronDown, ChevronRight, Globe, Copy, Check, Languages, Info, X } from 'lucide-react';

// Design System Colors
const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  success: '#22C55E',
  danger: '#EF4444',
  dark: '#1E293B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
};

interface TranslationEditorProps {
  themeColor?: string;
  translations: Record<string, Record<string, unknown>>;
  onSave: (locale: string, translations: Record<string, unknown>) => void;
}

const LOCALES = [
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

// User-friendly labels for translation keys
const keyLabels: Record<string, string> = {
  'nav.home': 'Domů',
  'nav.services': 'Služby',
  'nav.about': 'O nás',
  'nav.contact': 'Kontakt',
  'nav.gallery': 'Galerie',
  'hero.title': 'Hlavní nadpis',
  'hero.subtitle': 'Podnadpis',
  'hero.cta': 'Tlačítko výzvy',
  'services.title': 'Nadpis služeb',
  'services.subtitle': 'Popis služeb',
  'about.title': 'Nadpis sekce O nás',
  'about.description': 'Popis',
  'contact.title': 'Nadpis kontaktu',
  'contact.phone': 'Telefon',
  'contact.email': 'E-mail',
  'contact.address': 'Adresa',
};

// Group labels
const groupLabels: Record<string, string> = {
  nav: 'Navigace',
  hero: 'Úvodní sekce',
  services: 'Služby',
  about: 'O nás',
  contact: 'Kontakt',
  footer: 'Patička',
  common: 'Obecné',
};

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = String(value);
    }
  }
  return result;
}

function unflattenObject(obj: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) current[part] = {};
      current = current[part] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = obj[key];
  }
  return result;
}

function groupByPrefix(flatTranslations: Record<string, string>): Record<string, Record<string, string>> {
  const groups: Record<string, Record<string, string>> = {};
  for (const key in flatTranslations) {
    const firstDot = key.indexOf('.');
    const prefix = firstDot > -1 ? key.substring(0, firstDot) : key;
    if (!groups[prefix]) groups[prefix] = {};
    groups[prefix][key] = flatTranslations[key];
  }
  return groups;
}

export function TranslationEditor({ translations, onSave }: TranslationEditorProps) {
  const [activeLocale, setActiveLocale] = useState('cs');
  const [flatTranslations, setFlatTranslations] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['nav', 'hero']));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showKeyInfo, setShowKeyInfo] = useState<string | null>(null);

  useEffect(() => {
    if (translations[activeLocale]) {
      setFlatTranslations(flattenObject(translations[activeLocale]));
    }
  }, [activeLocale, translations]);

  const handleChange = (key: string, value: string) => {
    setFlatTranslations(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const nestedTranslations = unflattenObject(flatTranslations);
      await onSave(activeLocale, nestedTranslations);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving translations:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    newExpanded.has(group) ? newExpanded.delete(group) : newExpanded.add(group);
    setExpandedGroups(newExpanded);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getFieldLabel = (key: string): string => {
    if (keyLabels[key]) return keyLabels[key];
    const lastPart = key.split('.').pop() || key;
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const filteredTranslations = Object.entries(flatTranslations).filter(([key, value]) =>
    key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    value.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getFieldLabel(key).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTranslations = groupByPrefix(Object.fromEntries(filteredTranslations));

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div
        className="rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Languages className="w-6 h-6" style={{ color: colors.primary }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: colors.dark }}>
              Editor překladů
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              Upravte texty pro jednotlivé jazykové verze webu
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: saved ? colors.success : colors.primary }}
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Ukládám...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              Uloženo
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Uložit překlady
            </>
          )}
        </button>
      </div>

      {/* Language Selector - Pill Style */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Globe className="w-4 h-4" style={{ color: colors.textSecondary }} />
          <span className="text-sm font-medium" style={{ color: colors.dark }}>
            Vyberte jazyk
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {LOCALES.map((locale) => (
            <button
              key={locale.code}
              onClick={() => setActiveLocale(locale.code)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeLocale === locale.code ? `${colors.primary}15` : colors.background,
                color: activeLocale === locale.code ? colors.primary : colors.textSecondary,
                border: activeLocale === locale.code ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
              }}
            >
              <span className="text-lg">{locale.flag}</span>
              <span>{locale.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
          style={{ color: colors.textMuted }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hledat překlady... (Ctrl+F)"
          className="w-full h-12 pl-12 pr-4 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.dark,
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
            style={{ color: colors.textMuted }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Translation Groups */}
      <div className="space-y-4">
        {Object.entries(groupedTranslations).map(([group, items]) => (
          <div
            key={group}
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span style={{ color: colors.textSecondary }}>
                  {expandedGroups.has(group) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </span>
                <div className="text-left">
                  <h3 className="font-semibold" style={{ color: colors.dark }}>
                    {groupLabels[group] || group.charAt(0).toUpperCase() + group.slice(1)}
                  </h3>
                  <p className="text-sm" style={{ color: colors.textMuted }}>
                    {Object.keys(items).length} {Object.keys(items).length === 1 ? 'překlad' : 'překladů'}
                  </p>
                </div>
              </div>
              <div
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
              >
                {group}
              </div>
            </button>

            {/* Group Content */}
            {expandedGroups.has(group) && (
              <div style={{ borderTop: `1px solid ${colors.border}` }}>
                {Object.entries(items).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-5 hover:bg-gray-50 transition-colors"
                    style={{ borderBottom: `1px solid ${colors.border}` }}
                  >
                    {/* Field Label Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium" style={{ color: colors.dark }}>
                          {getFieldLabel(key)}
                        </label>
                        <button
                          onClick={() => setShowKeyInfo(showKeyInfo === key ? null : key)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          style={{ color: colors.textMuted }}
                          title="Zobrazit technický klíč"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => copyKey(key)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors hover:bg-gray-100"
                        style={{ color: copiedKey === key ? colors.success : colors.textMuted }}
                      >
                        {copiedKey === key ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Zkopírováno
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Kopírovat klíč
                          </>
                        )}
                      </button>
                    </div>

                    {/* Technical Key Info (hidden by default) */}
                    {showKeyInfo === key && (
                      <div
                        className="mb-3 px-3 py-2 rounded-lg text-xs font-mono"
                        style={{ backgroundColor: colors.background, color: colors.textSecondary }}
                      >
                        {key}
                      </div>
                    )}

                    {/* Input Field */}
                    {value.length > 100 ? (
                      <textarea
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg text-sm resize-none transition-all focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.dark,
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full h-11 px-4 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.dark,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {Object.keys(groupedTranslations).length === 0 && (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
        >
          <Globe className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: colors.dark }}>
            Žádné překlady nenalezeny
          </h3>
          <p style={{ color: colors.textSecondary }}>
            Zkuste upravit vyhledávací dotaz
          </p>
        </div>
      )}
    </div>
  );
}
