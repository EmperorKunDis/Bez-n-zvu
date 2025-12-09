"use client";

import { useState, useEffect } from 'react';
import { AdminLayout, siteData, adminTheme } from '@/components/admin/AdminLayout';
import {
  Home, Phone, Briefcase, User, Star, Globe, Image as ImageIcon,
  ChevronDown, ChevronUp, Check, X, Pencil,
  Hammer, Layers, Eye, ArrowUpRight, Upload, AlertCircle, HelpCircle, Clock, Key, RefreshCw, Settings
} from 'lucide-react';

// Import translations directly
import csTranslations from '../../../messages/cs.json';
import enTranslations from '../../../messages/en.json';
import deTranslations from '../../../messages/de.json';
import plTranslations from '../../../messages/pl.json';
import skTranslations from '../../../messages/sk.json';
import ruTranslations from '../../../messages/ru.json';

const SITE_COLOR = '#F59E0B';
const LOCALES = ['cs', 'en', 'de', 'pl', 'sk', 'ru'] as const;
const SITE_FOLDER = 'pavel_jaros_rekonstrukce';

// Default Cloudflare Worker URL - update after deployment
const WORKER_URL = 'https://pj-admin-github-proxy.workers.dev';

const translationFiles: Record<string, Record<string, unknown>> = {
  cs: csTranslations, en: enTranslations, de: deTranslations,
  pl: plTranslations, sk: skTranslations, ru: ruTranslations,
};

const SECTIONS = [
  { id: 'nav', title: 'Navigace', icon: Home, keys: ['home', 'services', 'projects', 'about', 'contact', 'cta'] },
  { id: 'hero', title: 'Hero sekce', icon: Home, keys: ['title', 'subtitle', 'ctaPrimary', 'ctaSecondary'] },
  { id: 'services', title: 'Služby', icon: Briefcase, keys: ['title'], nested: {
    'cores': ['title', 'text'], 'apartments': ['title', 'text'], 'houses': ['title', 'text'], 'crafts': ['title', 'text']
  }},
  { id: 'why', title: 'Proč my', icon: HelpCircle, keys: ['title'], nested: {
    'one': ['title', 'text'], 'two': ['title', 'text'], 'three': ['title', 'text'], 'four': ['title', 'text']
  }},
  { id: 'projects', title: 'Realizace', icon: ImageIcon, keys: ['title', 'subtitle', 'viewAll', 'before', 'after'], nested: {
    'project1': ['name', 'location'], 'project2': ['name', 'location'], 'project3': ['name', 'location']
  }},
  { id: 'process', title: 'Proces', icon: Clock, keys: ['title'], nested: {
    'step1': ['title', 'text'], 'step2': ['title', 'text'], 'step3': ['title', 'text'],
    'step4': ['title', 'text'], 'step5': ['title', 'text']
  }},
  { id: 'references', title: 'Reference', icon: Star, keys: ['title'], nested: {
    'client1': ['name', 'location', 'text'], 'client2': ['name', 'location', 'text']
  }},
  { id: 'contact', title: 'Kontakt', icon: Phone, keys: ['title', 'subtitle', 'phone', 'email', 'address', 'hours', 'ico'], nested: {
    'form': ['name', 'email', 'phone', 'service', 'message', 'files', 'gdpr', 'submit', 'sending', 'success', 'error']
  }},
  { id: 'footer', title: 'Patička', icon: Layers, keys: ['copyright', 'privacy'], nested: {
    'contact': ['title', 'name', 'phone', 'email', 'ico', 'address'],
    'services': ['title', 'reality', 'management', 'design'],
    'info': ['title', 'services', 'projects', 'process']
  }},
  { id: 'cookie', title: 'Cookies', icon: AlertCircle, keys: ['message', 'accept', 'reject', 'preferences'] },
];

export default function AdminPage() {
  const [activeLocale, setActiveLocale] = useState<typeof LOCALES[number]>('cs');
  const [translations, setTranslations] = useState<Record<string, unknown>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>('hero');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [workerUrl, setWorkerUrl] = useState(WORKER_URL);
  const [showSettings, setShowSettings] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    const savedUrl = localStorage.getItem('worker_url');
    if (savedPassword) setAdminPassword(savedPassword);
    if (savedUrl) setWorkerUrl(savedUrl);
  }, []);

  useEffect(() => {
    setTranslations(JSON.parse(JSON.stringify(translationFiles[activeLocale])));
    setHasChanges(false);
  }, [activeLocale]);

  const saveSettings = () => {
    localStorage.setItem('admin_password', adminPassword);
    localStorage.setItem('worker_url', workerUrl);
    setShowSettings(false);
    setStatusMessage('Nastavení uloženo');
    setTimeout(() => setStatusMessage(''), 2000);
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

  const setValue = (key: string, value: string) => {
    const keys = key.split('.');
    const newTranslations = JSON.parse(JSON.stringify(translations));
    let current: Record<string, unknown> = newTranslations;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
    setTranslations(newTranslations);
    setHasChanges(true);
    setEditingKey(null);
  };

  const uploadToGitHub = async () => {
    setUploadStatus('uploading');
    setStatusMessage('Nahrávám na GitHub...');

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (adminPassword) {
        headers['X-Admin-Password'] = adminPassword;
      }

      const response = await fetch(`${workerUrl}/api/translations`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          site: SITE_FOLDER,
          locale: activeLocale,
          translations: translations
        })
      });

      if (response.ok) {
        setUploadStatus('success');
        setStatusMessage(`${activeLocale}.json úspěšně nahráno na GitHub!`);
        setHasChanges(false);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error) {
      setUploadStatus('error');
      setStatusMessage(`Chyba: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    }

    setTimeout(() => { setUploadStatus('idle'); setStatusMessage(''); }, 4000);
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
                  <button onClick={() => setValue(fullKey, editValue)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: SITE_COLOR }}><Check className="w-4 h-4" />Použít</button>
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: SITE_COLOR }}><Hammer className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-white">PJ Rekonstrukce - Editor obsahu</h1><p className="text-gray-400">Upravujte texty a ukládejte přímo na GitHub</p></div>
          </div>
          <div className="flex items-center gap-3">
            {statusMessage && (
              <span className={`text-sm ${uploadStatus === 'success' ? 'text-green-400' : uploadStatus === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                {statusMessage}
              </span>
            )}
            {hasChanges && !statusMessage && <span className="text-yellow-400 text-sm">Neuložené změny</span>}
            <button onClick={() => setShowSettings(!showSettings)} className="p-2.5 rounded-xl" style={{ background: adminTheme.bg.tertiary, border: `1px solid ${adminTheme.border.medium}` }}>
              <Settings className="w-4 h-4" style={{ color: adminTheme.text.muted }} />
            </button>
            <button onClick={uploadToGitHub} disabled={uploadStatus === 'uploading' || !hasChanges} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium disabled:opacity-50" style={{ background: SITE_COLOR }}>
              {uploadStatus === 'uploading' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Uložit na GitHub
            </button>
            <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: adminTheme.bg.tertiary, border: `1px solid ${adminTheme.border.medium}`, color: adminTheme.text.secondary }}><Eye className="w-4 h-4" />Náhled<ArrowUpRight className="w-4 h-4" /></a>
          </div>
        </div>

        {showSettings && (
          <div className="rounded-xl p-6" style={{ background: adminTheme.bg.secondary, border: `1px solid ${SITE_COLOR}50` }}>
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5" style={{ color: SITE_COLOR }} />
              <h3 className="text-lg font-semibold text-white">Nastavení</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Worker URL</label>
                <input type="text" value={workerUrl} onChange={(e) => setWorkerUrl(e.target.value)} placeholder="https://pj-admin-github-proxy.workers.dev" className="w-full h-10 px-4 rounded-lg text-sm focus:outline-none" style={{ background: adminTheme.bg.primary, border: `1px solid ${adminTheme.border.medium}`, color: adminTheme.text.primary }} />
                <p className="text-xs text-gray-500 mt-1">URL vašeho Cloudflare Worker</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Admin heslo (volitelné)</label>
                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="heslo" className="w-full h-10 px-4 rounded-lg text-sm focus:outline-none" style={{ background: adminTheme.bg.primary, border: `1px solid ${adminTheme.border.medium}`, color: adminTheme.text.primary }} />
                <p className="text-xs text-gray-500 mt-1">Pokud je worker chráněn heslem</p>
              </div>
              <button onClick={saveSettings} className="px-4 py-2 rounded-lg text-white font-medium" style={{ background: SITE_COLOR }}>Uložit nastavení</button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: adminTheme.bg.secondary, border: `1px solid ${adminTheme.border.subtle}` }}>
          <Globe className="w-5 h-5" style={{ color: SITE_COLOR }} /><span className="text-gray-400 text-sm">Jazyk:</span>
          <div className="flex gap-2">
            {LOCALES.map(locale => (<button key={locale} onClick={() => setActiveLocale(locale)} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all" style={{ background: activeLocale === locale ? SITE_COLOR : adminTheme.bg.tertiary, color: activeLocale === locale ? 'white' : adminTheme.text.secondary }}>{locale.toUpperCase()}</button>))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-white">Sekce obsahu ({activeLocale.toUpperCase()})</h2></div>
          {SECTIONS.map(section => renderSection(section))}
        </div>
      </div>
    </AdminLayout>
  );
}
