"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, RefreshCw, Search, ChevronDown, ChevronRight, Globe, Copy, Check, Languages } from 'lucide-react';

interface TranslationEditorProps {
  themeColor: string;
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
      if (!current[part]) {
        current[part] = {};
      }
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

    if (!groups[prefix]) {
      groups[prefix] = {};
    }
    groups[prefix][key] = flatTranslations[key];
  }

  return groups;
}

export function TranslationEditor({ themeColor, translations, onSave }: TranslationEditorProps) {
  const [activeLocale, setActiveLocale] = useState('cs');
  const [flatTranslations, setFlatTranslations] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['nav', 'hero']));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredTranslations = Object.entries(flatTranslations).filter(([key, value]) =>
    key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTranslations = groupByPrefix(Object.fromEntries(filteredTranslations));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Languages className="w-5 h-5" style={{ color: themeColor }} />
            Editor překladů
          </h2>
          <p className="text-sm text-gray-500">
            Upravte texty pro jednotlivé jazykové verze
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="text-white"
          style={{ backgroundColor: themeColor }}
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Ukládám...
            </>
          ) : saved ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Uloženo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Uložit překlady
            </>
          )}
        </Button>
      </div>

      {/* Language Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {LOCALES.map((locale) => (
          <button
            key={locale.code}
            onClick={() => setActiveLocale(locale.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeLocale === locale.code
                ? 'text-white'
                : 'text-gray-400 bg-[#0a0a0a] border border-white/10 hover:border-white/20'
            }`}
            style={activeLocale === locale.code ? {
              backgroundColor: `${themeColor}20`,
              border: `1px solid ${themeColor}40`
            } : {}}
          >
            <span className="text-lg">{locale.flag}</span>
            <span className="hidden sm:inline">{locale.name}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hledat v překladech..."
          className="pl-11 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-white/30 focus:ring-0"
        />
      </div>

      {/* Translation Groups */}
      <div className="space-y-3">
        {Object.entries(groupedTranslations).map(([group, items]) => (
          <div key={group} className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  {expandedGroups.has(group) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </span>
                <div className="text-left">
                  <h3 className="font-semibold text-white capitalize">{group}</h3>
                  <p className="text-sm text-gray-500">{Object.keys(items).length} překladů</p>
                </div>
              </div>
            </button>

            {expandedGroups.has(group) && (
              <div className="border-t border-white/10 divide-y divide-white/5">
                {Object.entries(items).map(([key, value]) => (
                  <div key={key} className="p-4 space-y-2 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">
                        {key}
                      </code>
                      <button
                        onClick={() => copyKey(key)}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Kopírovat klíč"
                      >
                        {copiedKey === key ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {value.length > 100 ? (
                      <Textarea
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        rows={3}
                        className="w-full bg-[#141414] border-white/10 text-white focus:border-white/30 focus:ring-0"
                      />
                    ) : (
                      <Input
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full bg-[#141414] border-white/10 text-white focus:border-white/30 focus:ring-0"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(groupedTranslations).length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500">Žádné překlady nenalezeny</p>
        </div>
      )}
    </div>
  );
}
