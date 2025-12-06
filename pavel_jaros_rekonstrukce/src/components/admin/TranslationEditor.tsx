"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Save, RefreshCw, Search, ChevronDown, ChevronRight, Globe, Copy, Check } from 'lucide-react';

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

type TranslationValue = string | Record<string, unknown>;

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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
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
        <div className="flex items-center gap-2 flex-wrap">
          {LOCALES.map((locale) => (
            <button
              key={locale.code}
              onClick={() => setActiveLocale(locale.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeLocale === locale.code
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={activeLocale === locale.code ? { backgroundColor: themeColor } : {}}
            >
              <span className="text-lg">{locale.flag}</span>
              <span className="hidden sm:inline">{locale.name}</span>
            </button>
          ))}
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hledat v překladech..."
          className="pl-10"
        />
      </div>

      {/* Translation Groups */}
      <div className="space-y-4">
        {Object.entries(groupedTranslations).map(([group, items]) => (
          <Card key={group} className="overflow-hidden">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedGroups.has(group) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 capitalize">{group}</h3>
                  <p className="text-sm text-gray-500">{Object.keys(items).length} překladů</p>
                </div>
              </div>
            </button>

            {expandedGroups.has(group) && (
              <CardContent className="border-t bg-gray-50 p-0">
                <div className="divide-y">
                  {Object.entries(items).map(([key, value]) => (
                    <div key={key} className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded">
                          {key}
                        </code>
                        <button
                          onClick={() => copyKey(key)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Kopírovat klíč"
                        >
                          {copiedKey === key ? (
                            <Check className="h-4 w-4 text-green-500" />
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
                          className="w-full bg-white"
                        />
                      ) : (
                        <Input
                          value={value}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-full bg-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {Object.keys(groupedTranslations).length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Žádné překlady nenalezeny</p>
        </div>
      )}
    </div>
  );
}
