"use client";

import { useState, useEffect } from 'react';
import { AdminLayout, adminTheme } from '@/components/admin/AdminLayout';
import {
  Home, Phone, Briefcase, User, Star, Globe,
  ChevronDown, ChevronUp, Check, X, Pencil,
  Building, Layers, Eye, Upload, AlertCircle, HelpCircle, Clock, DollarSign, Target, Shield, Key, RefreshCw
} from 'lucide-react';

import csTranslations from '../../../messages/cs.json';
import enTranslations from '../../../messages/en.json';
import deTranslations from '../../../messages/de.json';
import plTranslations from '../../../messages/pl.json';
import skTranslations from '../../../messages/sk.json';
import ruTranslations from '../../../messages/ru.json';

const SITE_COLOR = '#10B981';
const LOCALES = ['cs', 'en', 'de', 'pl', 'sk', 'ru'] as const;
const GITHUB_REPO = 'EmperorKunDis/Bez-n-zvu';
const SITE_FOLDER = 'pavel_jaros_sprava';

const translationFiles: Record<string, Record<string, unknown>> = {
  cs: csTranslations, en: enTranslations, de: deTranslations,
  pl: plTranslations, sk: skTranslations, ru: ruTranslations,
};

const SECTIONS = [
  { id: 'nav', title: 'Navigace', icon: Home, keys: ['services', 'pricing', 'howItWorks', 'about', 'references', 'contact', 'cta'] },
  { id: 'hero', title: 'Hero sekce', icon: Home, keys: ['title', 'subtitle', 'cta'] },
  { id: 'target', title: 'Cílová skupina', icon: Target, keys: ['title', 'subtitle'], nested: {
    'investor': ['title', 'text'], 'remote': ['title', 'text'], 'time': ['title', 'text']
  }},
  { id: 'process', title: 'Proces', icon: Clock, keys: ['title', 'subtitle'], nested: {
    'step1': ['title', 'text'], 'step2': ['title', 'text'], 'step3': ['title', 'text'], 'step4': ['title', 'text']
  }},
  { id: 'benefits', title: 'Výhody', icon: Shield, keys: ['title', 'subtitle'], nested: {
    'tenants': ['title', 'text'], 'guarantee': ['title', 'text'], 'management': ['title', 'text'], 'legal': ['title', 'text']
  }},
  { id: 'pricing', title: 'Ceník', icon: DollarSign, keys: ['title', 'subtitle'], nested: {
    'start': ['name', 'price', 'description', 'cta'],
    'premium': ['name', 'badge', 'price', 'description', 'cta']
  }},
  { id: 'about', title: 'O nás', icon: User, keys: ['title', 'intro', 'motivation'], nested: {
    'group': ['title', 'subtitle', 'reality', 'reconstruction', 'design']
  }},
  { id: 'references', title: 'Reference', icon: Star, keys: ['title'], nested: {
    'client1': ['name', 'subtitle', 'text'], 'client2': ['name', 'subtitle', 'text']
  }},
  { id: 'faq', title: 'FAQ', icon: HelpCircle, keys: ['title'], nested: {
    'q1': ['question', 'answer'], 'q2': ['question', 'answer'], 'q3': ['question', 'answer'], 'q4': ['question', 'answer']
  }},
  { id: 'contact', title: 'Kontakt', icon: Phone, keys: ['title', 'subtitle', 'phone', 'email', 'address'], nested: {
    'form': ['name', 'email', 'phone', 'propertyAddress', 'message', 'gdpr', 'submit', 'sending', 'success', 'error']
  }},
  { id: 'footer', title: 'Patička', icon: Layers, keys: ['copyright', 'privacy'], nested: {
    'contact': ['title', 'name', 'phone', 'email', 'ico', 'address'],
    'services': ['title', 'reality', 'reconstruction', 'design'],
    'info': ['title', 'services', 'pricing', 'faq']
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
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('github_token');
    if (saved) setGithubToken(saved);
  }, []);

  useEffect(() => {
    setTranslations(JSON.parse(JSON.stringify(translationFiles[activeLocale])));
    setHasChanges(false);
  }, [activeLocale]);

  const saveToken = () => {
    localStorage.setItem('github_token', githubToken);
    setShowTokenInput(false);
    setStatusMessage('Token uložen');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  const getValue = (key: string): string => {
    const keys = key.split('.');
    let current: unknown = translations;
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else return '';
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
    if (!githubToken) { setShowTokenInput(true); return; }

    setUploadStatus('uploading');
    setStatusMessage('Ukládám...');

    try {
      const filePath = `${SITE_FOLDER}/messages/${activeLocale}.json`;
      const content = JSON.stringify(translations, null, 2);

      const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
        headers: { 'Authorization': `token ${githubToken}` }
      });
      const sha = getRes.ok ? (await getRes.json()).sha : undefined;

      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
        method: 'PUT',
        headers: { 'Authorization': `token ${githubToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Update ${activeLocale}.json`,
          content: btoa(unescape(encodeURIComponent(content))),
          sha
        })
      });

      if (res.ok) {
        setUploadStatus('success');
        setStatusMessage('Uloženo!');
        setHasChanges(false);
      } else throw new Error((await res.json()).message);
    } catch (e) {
      setUploadStatus('error');
      setStatusMessage(`Chyba: ${e instanceof Error ? e.message : 'Neznámá'}`);
    }
    setTimeout(() => { setUploadStatus('idle'); setStatusMessage(''); }, 3000);
  };

  const renderField = (fullKey: string, label: string) => {
    const value = getValue(fullKey);
    const isEditing = editingKey === fullKey;
    return (
      <div key={fullKey} className="p-4 rounded-lg" style={{ background: adminTheme.bg.tertiary }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-xs text-gray-500 mb-1">{fullKey}</label>
            {isEditing ? (
              <div className="space-y-2">
                {value.length > 100 ? (
                  <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: adminTheme.bg.primary, border: `2px solid ${SITE_COLOR}`, color: adminTheme.text.primary }} autoFocus />
                ) : (
                  <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full h-10 px-3 rounded-lg text-sm" style={{ background: adminTheme.bg.primary, border: `2px solid ${SITE_COLOR}`, color: adminTheme.text.primary }} autoFocus />
                )}
                <div className="flex gap-2">
                  <button onClick={() => setValue(fullKey, editValue)} className="flex items-center gap-1 px-3 py-1.5 rounded text-sm text-white" style={{ background: SITE_COLOR }}><Check className="w-4 h-4" />OK</button>
                  <button onClick={() => setEditingKey(null)} className="flex items-center gap-1 px-3 py-1.5 rounded text-sm" style={{ background: adminTheme.bg.accent, color: adminTheme.text.secondary }}><X className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <p className="text-white text-sm">{value || <span className="text-gray-500 italic">prázdné</span>}</p>
            )}
          </div>
          {!isEditing && (
            <button onClick={() => { setEditingKey(fullKey); setEditValue(value); }} className="p-2 rounded hover:bg-white/10"><Pencil className="w-4 h-4 text-gray-400" /></button>
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
        <button onClick={() => setExpandedSection(isExpanded ? null : section.id)} className="w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${SITE_COLOR}20` }}><Icon className="w-4 h-4" style={{ color: SITE_COLOR }} /></div>
            <span className="font-medium text-white">{section.title}</span>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {isExpanded && (
          <div className="p-4 pt-0 space-y-2">
            {section.keys.map(key => renderField(`${section.id}.${key}`, key))}
            {section.nested && Object.entries(section.nested).map(([nk, fields]) => (
              <div key={nk} className="mt-3 pl-3 border-l-2" style={{ borderColor: `${SITE_COLOR}40` }}>
                <p className="text-xs text-gray-400 mb-2">{section.id}.{nk}</p>
                {fields.map(f => renderField(`${section.id}.${nk}.${f}`, f))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout activeSection="dashboard" onSectionChange={() => {}}>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: SITE_COLOR }}><Building className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-xl font-bold text-white">PJ Správa - Editor</h1></div>
          </div>
          <div className="flex items-center gap-2">
            {statusMessage && <span className={`text-sm ${uploadStatus === 'success' ? 'text-green-400' : uploadStatus === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>{statusMessage}</span>}
            {hasChanges && !statusMessage && <span className="text-yellow-400 text-sm">●</span>}
            <button onClick={() => setShowTokenInput(!showTokenInput)} className="p-2 rounded-lg" style={{ background: adminTheme.bg.tertiary, border: `1px solid ${githubToken ? '#10B981' : adminTheme.border.medium}` }}>
              <Key className="w-4 h-4" style={{ color: githubToken ? '#10B981' : adminTheme.text.muted }} />
            </button>
            <button onClick={uploadToGitHub} disabled={uploadStatus === 'uploading' || !hasChanges} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50" style={{ background: SITE_COLOR }}>
              {uploadStatus === 'uploading' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Uložit
            </button>
            <a href="/" target="_blank" className="p-2 rounded-lg" style={{ background: adminTheme.bg.tertiary }}><Eye className="w-4 h-4 text-gray-400" /></a>
          </div>
        </div>

        {showTokenInput && (
          <div className="p-4 rounded-xl" style={{ background: adminTheme.bg.secondary, border: `1px solid ${SITE_COLOR}50` }}>
            <p className="text-sm text-gray-400 mb-2">GitHub Token <a href="https://github.com/settings/tokens/new" target="_blank" className="text-blue-400">(vytvořit)</a></p>
            <div className="flex gap-2">
              <input type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} placeholder="ghp_..." className="flex-1 h-9 px-3 rounded text-sm" style={{ background: adminTheme.bg.primary, border: `1px solid ${adminTheme.border.medium}`, color: adminTheme.text.primary }} />
              <button onClick={saveToken} className="px-4 py-1.5 rounded text-white text-sm" style={{ background: SITE_COLOR }}>Uložit</button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: adminTheme.bg.secondary }}>
          <Globe className="w-4 h-4" style={{ color: SITE_COLOR }} />
          {LOCALES.map(l => (<button key={l} onClick={() => setActiveLocale(l)} className="px-3 py-1 rounded text-sm" style={{ background: activeLocale === l ? SITE_COLOR : 'transparent', color: activeLocale === l ? 'white' : adminTheme.text.secondary }}>{l.toUpperCase()}</button>))}
        </div>

        <div className="space-y-3">{SECTIONS.map(s => renderSection(s))}</div>
      </div>
    </AdminLayout>
  );
}
