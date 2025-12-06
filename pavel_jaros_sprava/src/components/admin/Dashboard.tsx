"use client";

import { useState } from 'react';
import { Home, Phone, Image as ImageIcon, Globe, Eye, Edit, ArrowUpRight, ChevronDown, ChevronUp, Check, X, KeyRound, Layers, Clock, Activity, Star, CheckCircle, Pencil, Users, DollarSign, Shield, HelpCircle } from 'lucide-react';
import { siteData, adminTheme as theme } from './AdminLayout';

const SITE_COLOR = '#10B981';

interface DashboardProps { onNavigate: (section: string) => void; }

export function Dashboard({ onNavigate }: DashboardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const stats = [
    { label: 'Tarify', value: siteData.sections.pricing.length.toString(), icon: DollarSign, color: SITE_COLOR },
    { label: 'Reference', value: siteData.sections.references.length.toString(), icon: Star, color: '#22C55E' },
    { label: 'Obrázky', value: siteData.images.length.toString(), icon: ImageIcon, color: '#3B82F6' },
    { label: 'Jazyky', value: '6', icon: Globe, color: '#8B5CF6' },
  ];

  const contentSections = [
    { id: 'hero', title: 'Hero sekce', icon: Home, description: 'Hlavní banner', fields: [{ key: 'hero.title', label: 'Hlavní nadpis', value: siteData.sections.hero.title }, { key: 'hero.subtitle', label: 'Podnadpis', value: siteData.sections.hero.subtitle }, { key: 'hero.cta', label: 'CTA tlačítko', value: siteData.sections.hero.cta }] },
    { id: 'target', title: 'Cílová skupina', icon: Users, description: `${siteData.sections.target.length} skupin`, fields: siteData.sections.target.flatMap((t, i) => [{ key: `target.${i}.title`, label: `Skupina ${i+1}`, value: t.title }, { key: `target.${i}.text`, label: `Popis ${i+1}`, value: t.text }]) },
    { id: 'pricing', title: 'Ceník', icon: DollarSign, description: `${siteData.sections.pricing.length} tarifů`, fields: siteData.sections.pricing.flatMap((p, i) => [{ key: `pricing.${i}.name`, label: p.name, value: `${p.price} - ${p.description}` }, { key: `pricing.${i}.features`, label: `Funkce tarifu ${p.name}`, value: p.features.join(', ') }]) },
    { id: 'benefits', title: 'Výhody', icon: Shield, description: `${siteData.sections.benefits.length} výhod`, fields: siteData.sections.benefits.map((b, i) => ({ key: `benefits.${i}`, label: b.title, value: b.text })) },
    { id: 'process', title: 'Proces', icon: Clock, description: `${siteData.sections.process.length} kroků`, fields: siteData.sections.process.map((p) => ({ key: `process.${p.step}`, label: `Krok ${p.step}: ${p.title}`, value: p.text })) },
    { id: 'references', title: 'Reference', icon: Star, description: `${siteData.sections.references.length} referencí`, fields: siteData.sections.references.flatMap((r, i) => [{ key: `ref.${i}.name`, label: `Klient ${i+1}`, value: `${r.name} (${r.subtitle})` }, { key: `ref.${i}.text`, label: `Text ${i+1}`, value: r.text }]) },
    { id: 'faq', title: 'FAQ', icon: HelpCircle, description: `${siteData.sections.faq.length} otázek`, fields: siteData.sections.faq.map((f, i) => ({ key: `faq.${i}`, label: f.question, value: f.answer })) },
    { id: 'contact', title: 'Kontakt', icon: Phone, description: 'Kontaktní údaje', fields: [{ key: 'contact.phone', label: 'Telefon', value: siteData.sections.contact.phone }, { key: 'contact.email', label: 'E-mail', value: siteData.sections.contact.email }, { key: 'contact.address', label: 'Adresa', value: siteData.sections.contact.address }] },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: SITE_COLOR }}><KeyRound className="w-6 h-6 text-white" /></div>
          <div><h1 className="text-2xl font-bold text-white">PJ Správa</h1><p className="text-gray-400">Správa webu Správa nemovitostí</p></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('visual-editor')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium" style={{ background: SITE_COLOR }}><Layers className="w-4 h-4" />Vizuální editor</button>
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: theme.bg.tertiary, border: `1px solid ${theme.border.medium}`, color: theme.text.secondary }}><Eye className="w-4 h-4" />Náhled<ArrowUpRight className="w-4 h-4" /></a>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (<div key={i} className="p-5 rounded-xl" style={{ background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}><div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${stat.color}20` }}><stat.icon className="w-5 h-5" style={{ color: stat.color }} /></div><p className="text-2xl font-bold text-white">{stat.value}</p><p className="text-sm text-gray-400">{stat.label}</p></div>))}
      </div>

      <div className="rounded-xl p-6" style={{ background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}>
        <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><ImageIcon className="w-6 h-6" style={{ color: SITE_COLOR }} /><div><h2 className="text-lg font-bold text-white">Obrázky webu</h2><p className="text-sm text-gray-400">Skutečné obrázky z /public</p></div></div><button onClick={() => onNavigate('images')} className="text-sm px-4 py-2 rounded-lg" style={{ background: `${SITE_COLOR}20`, color: SITE_COLOR }}>Spravovat média</button></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {siteData.images.map((img, i) => (<div key={i} className="rounded-xl overflow-hidden" style={{ background: theme.bg.tertiary, border: `1px solid ${theme.border.medium}` }}><div className="aspect-video bg-black/30 flex items-center justify-center p-4"><img src={img.path} alt={img.name} className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23333" width="100" height="100"/></svg>'; }} /></div><div className="p-3"><p className="text-sm font-medium text-white truncate">{img.name}</p><p className="text-xs text-gray-400">{img.path}</p><span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full" style={{ background: `${SITE_COLOR}20`, color: SITE_COLOR }}>{img.category}</span></div></div>))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-white">Obsah webu</h2><p className="text-sm text-gray-400">Kliknutím rozbalíte sekci</p></div>
        {contentSections.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (<div key={section.id} className="rounded-xl overflow-hidden" style={{ background: theme.bg.secondary, border: `1px solid ${isExpanded ? SITE_COLOR + '50' : theme.border.subtle}` }}>
            <button onClick={() => setExpandedSection(isExpanded ? null : section.id)} className="w-full p-5 flex items-center justify-between" style={{ background: isExpanded ? `${SITE_COLOR}10` : 'transparent' }}>
              <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${SITE_COLOR}20` }}><section.icon className="w-5 h-5" style={{ color: SITE_COLOR }} /></div><div className="text-left"><h3 className="font-semibold text-white">{section.title}</h3><p className="text-sm text-gray-400">{section.description}</p></div></div>
              <div className="flex items-center gap-3"><span className="text-sm text-gray-400">{section.fields.length} polí</span>{isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}</div>
            </button>
            {isExpanded && (<div className="p-5 pt-0 space-y-4" style={{ borderTop: `1px solid ${theme.border.subtle}` }}>
              {section.fields.map((f) => (<div key={f.key} className="p-4 rounded-lg" style={{ background: theme.bg.tertiary }}><div className="flex items-start justify-between gap-4"><div className="flex-1 min-w-0"><label className="block text-sm font-medium text-gray-400 mb-2">{f.label}</label>{editingField === f.key ? (<div className="space-y-3">{f.value.length > 100 ? <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none resize-none" style={{ background: theme.bg.primary, border: `1px solid ${SITE_COLOR}`, color: theme.text.primary }} autoFocus /> : <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full h-10 px-4 rounded-lg text-sm focus:outline-none" style={{ background: theme.bg.primary, border: `1px solid ${SITE_COLOR}`, color: theme.text.primary }} autoFocus />}<div className="flex items-center gap-2"><button onClick={() => { console.log('Save:', f.key, editValue); setEditingField(null); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: SITE_COLOR }}><Check className="w-4 h-4" />Uložit</button><button onClick={() => setEditingField(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ background: theme.bg.accent, color: theme.text.secondary }}><X className="w-4 h-4" />Zrušit</button></div></div>) : <p className="text-white text-sm">{f.value}</p>}</div>{editingField !== f.key && <button onClick={() => { setEditingField(f.key); setEditValue(f.value); }} className="p-2 rounded-lg flex-shrink-0" style={{ color: theme.text.muted }}><Pencil className="w-4 h-4" /></button>}</div></div>))}
              <button onClick={() => onNavigate(section.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: SITE_COLOR }}><Edit className="w-4 h-4" />Upravit v editoru</button>
            </div>)}
          </div>);
        })}
      </div>

      <div className="rounded-xl p-6" style={{ background: `linear-gradient(135deg, ${SITE_COLOR}15 0%, ${SITE_COLOR}05 100%)`, border: `1px solid ${SITE_COLOR}30` }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div><h3 className="text-lg font-bold text-white">Rychlé akce</h3><p className="text-sm text-gray-400">Spravujte obsah webu PJ Správa</p></div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate('translations')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: theme.bg.tertiary, color: theme.text.primary, border: `1px solid ${theme.border.medium}` }}><Globe className="w-4 h-4" />Překlady</button>
            <button onClick={() => onNavigate('images')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: theme.bg.tertiary, color: theme.text.primary, border: `1px solid ${theme.border.medium}` }}><ImageIcon className="w-4 h-4" />Média</button>
            <button onClick={() => onNavigate('visual-editor')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: SITE_COLOR }}><Edit className="w-4 h-4" />Vizuální editor</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden" style={{ background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.border.subtle}` }}><h3 className="text-lg font-semibold text-white">Nedávná aktivita</h3><Clock className="w-5 h-5" style={{ color: theme.text.muted }} /></div>
          <div>{[{ action: 'Ceník aktualizován', time: 'Před 1 hodinou' }, { action: 'Nový obrázek nahrán', time: 'Před 3 hodinami' }, { action: 'Překlady upraveny', time: 'Včera' }].map((item, i) => (<div key={i} className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: i < 2 ? `1px solid ${theme.border.subtle}` : undefined }}><div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} /><p className="text-sm font-medium text-white">{item.action}</p></div><p className="text-sm text-gray-400">{item.time}</p></div>))}</div>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme.border.subtle}` }}><h3 className="text-lg font-semibold text-white">Informace o webu</h3><Activity className="w-5 h-5" style={{ color: '#22C55E' }} /></div>
          <div>{[{ label: 'Web', value: 'PJ Správa' }, { label: 'Framework', value: 'Next.js 15' }, { label: 'Jazyky', value: 'CS, EN, DE, SK, PL, RU' }, { label: 'Status', value: 'Online', isStatus: true }].map((item, i) => (<div key={i} className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: i < 3 ? `1px solid ${theme.border.subtle}` : undefined }}><p className="text-sm text-gray-400">{item.label}</p>{item.isStatus ? <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22C55E' }} /><p className="text-sm font-medium" style={{ color: '#22C55E' }}>{item.value}</p></div> : <p className="text-sm font-medium text-white">{item.value}</p>}</div>))}</div>
        </div>
      </div>
    </div>
  );
}
