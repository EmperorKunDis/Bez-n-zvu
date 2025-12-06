"use client";

import { useState, useCallback } from 'react';
import {
  Layers,
  MousePointer2,
  Type,
  Image as ImageIcon,
  Square,
  Minus,
  Plus,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Smartphone,
  Tablet,
  Monitor,
  Palette,
  Layout,
  Box,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy,
  ChevronRight,
  ChevronDown,
  Save,
  MoreHorizontal,
  Search,
  Lock,
  Unlock,
  GripVertical,
  ExternalLink,
  CornerDownRight
} from 'lucide-react';

interface PageElement {
  id: string;
  type: 'section' | 'heading' | 'text' | 'image' | 'button' | 'container' | 'divider';
  name: string;
  content?: string;
  src?: string;
  href?: string;
  children?: PageElement[];
  styles: {
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    textAlign?: 'left' | 'center' | 'right';
    width?: string;
    height?: string;
  };
  visible: boolean;
  locked?: boolean;
}

interface VisualEditorProps {
  themeColor: string;
  initialElements?: PageElement[];
  onSave?: (elements: PageElement[]) => void;
}

const defaultElements: PageElement[] = [
  {
    id: 'hero',
    type: 'section',
    name: 'Hero',
    visible: true,
    locked: false,
    styles: { backgroundColor: '#0f0f0f', padding: '100px 24px' },
    children: [
      {
        id: 'hero-title',
        type: 'heading',
        name: 'Nadpis',
        content: 'Prodávám nemovitosti s nadšením',
        visible: true,
        styles: { color: '#ffffff', fontSize: '56px', fontWeight: 'bold', textAlign: 'center' }
      },
      {
        id: 'hero-subtitle',
        type: 'text',
        name: 'Popis',
        content: 'Váš spolehlivý partner v oblasti realit',
        visible: true,
        styles: { color: '#737373', fontSize: '20px', textAlign: 'center', margin: '24px 0 32px' }
      },
      {
        id: 'hero-btn',
        type: 'button',
        name: 'Tlačítko',
        content: 'Zobrazit nabídku',
        href: '#properties',
        visible: true,
        styles: { backgroundColor: '#dc2626', color: '#fff', padding: '16px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '600' }
      }
    ]
  },
  {
    id: 'services',
    type: 'section',
    name: 'Služby',
    visible: true,
    locked: false,
    styles: { backgroundColor: '#ffffff', padding: '80px 24px' },
    children: [
      {
        id: 'services-title',
        type: 'heading',
        name: 'Nadpis',
        content: 'Moje služby',
        visible: true,
        styles: { color: '#0f0f0f', fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }
      },
      {
        id: 'services-text',
        type: 'text',
        name: 'Popis',
        content: 'Komplexní servis při prodeji i pronájmu nemovitostí.',
        visible: true,
        styles: { color: '#525252', fontSize: '18px', textAlign: 'center', margin: '16px 0' }
      }
    ]
  },
  {
    id: 'about',
    type: 'section',
    name: 'O mně',
    visible: true,
    locked: false,
    styles: { backgroundColor: '#fafafa', padding: '80px 24px' },
    children: [
      {
        id: 'about-img',
        type: 'image',
        name: 'Fotografie',
        src: '/images/PavelFotka.png',
        visible: true,
        styles: { width: '180px', height: '180px', borderRadius: '90px' }
      },
      {
        id: 'about-name',
        type: 'heading',
        name: 'Jméno',
        content: 'Pavel Jaroš',
        visible: true,
        styles: { color: '#0f0f0f', fontSize: '32px', fontWeight: 'bold', textAlign: 'center', margin: '24px 0 8px' }
      },
      {
        id: 'about-role',
        type: 'text',
        name: 'Pozice',
        content: 'Realitní makléř',
        visible: true,
        styles: { color: '#dc2626', fontSize: '16px', textAlign: 'center', fontWeight: '500' }
      }
    ]
  },
  {
    id: 'contact',
    type: 'section',
    name: 'Kontakt',
    visible: true,
    locked: false,
    styles: { backgroundColor: '#0f0f0f', padding: '80px 24px' },
    children: [
      {
        id: 'contact-title',
        type: 'heading',
        name: 'Nadpis',
        content: 'Kontakt',
        visible: true,
        styles: { color: '#ffffff', fontSize: '40px', fontWeight: 'bold', textAlign: 'center' }
      },
      {
        id: 'contact-info',
        type: 'text',
        name: 'Kontaktní údaje',
        content: '+420 777 558 730 • pavel.jaros@kwcz.cz',
        visible: true,
        styles: { color: '#a3a3a3', fontSize: '18px', textAlign: 'center', margin: '16px 0' }
      }
    ]
  }
];

export function VisualEditor({ themeColor, initialElements, onSave }: VisualEditorProps) {
  const [elements, setElements] = useState<PageElement[]>(initialElements || defaultElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['hero', 'services', 'about', 'contact']));
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(80);
  const [history, setHistory] = useState<PageElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTab, setPropertyTab] = useState<'style' | 'layout'>('style');

  const findElement = useCallback((id: string, els: PageElement[] = elements): PageElement | null => {
    for (const el of els) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElement(id, el.children);
        if (found) return found;
      }
    }
    return null;
  }, [elements]);

  const selectedElement = selectedId ? findElement(selectedId) : null;

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const saveHistory = () => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), elements]);
    setHistoryIndex(prev => prev + 1);
  };

  const updateElement = (id: string, updates: Partial<PageElement>) => {
    saveHistory();
    const update = (els: PageElement[]): PageElement[] =>
      els.map(el => {
        if (el.id === id) return { ...el, ...updates };
        if (el.children) return { ...el, children: update(el.children) };
        return el;
      });
    setElements(update(elements));
  };

  const updateStyle = (id: string, key: string, value: string) => {
    const update = (els: PageElement[]): PageElement[] =>
      els.map(el => {
        if (el.id === id) return { ...el, styles: { ...el.styles, [key]: value } };
        if (el.children) return { ...el, children: update(el.children) };
        return el;
      });
    setElements(update(elements));
  };

  const undo = () => {
    if (historyIndex >= 0) {
      setElements(history[historyIndex]);
      setHistoryIndex(prev => prev - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile': return 390;
      case 'tablet': return 768;
      default: return 1280;
    }
  };

  const typeIcons: Record<string, React.ReactNode> = {
    section: <Layout className="w-4 h-4" />,
    heading: <Type className="w-4 h-4" />,
    text: <AlignLeft className="w-4 h-4" />,
    image: <ImageIcon className="w-4 h-4" />,
    button: <Square className="w-4 h-4" />,
    container: <Box className="w-4 h-4" />,
    divider: <Minus className="w-4 h-4" />,
  };

  const typeLabels: Record<string, string> = {
    section: 'Sekce',
    heading: 'Nadpis',
    text: 'Text',
    image: 'Obrázek',
    button: 'Tlačítko',
    container: 'Kontejner',
    divider: 'Oddělovač',
  };

  // Layer Tree Item
  const LayerItem = ({ element, depth = 0 }: { element: PageElement; depth?: number }) => {
    const hasChildren = element.children && element.children.length > 0;
    const isExpanded = expandedIds.has(element.id);
    const isSelected = selectedId === element.id;

    if (searchQuery && !element.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      if (!hasChildren) return null;
      const matchingChildren = element.children?.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!matchingChildren?.length) return null;
    }

    return (
      <>
        <div
          className={`
            group flex items-center h-9 px-2 cursor-pointer border-l-2 transition-all
            ${isSelected
              ? 'bg-white/10 border-current'
              : 'border-transparent hover:bg-white/5'
            }
          `}
          style={{
            paddingLeft: depth * 20 + 8,
            color: isSelected ? themeColor : undefined
          }}
          onClick={() => setSelectedId(element.id)}
        >
          {/* Expand/Collapse */}
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleExpand(element.id); }}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-5" />
          )}

          {/* Icon */}
          <span className={`mr-2 ${isSelected ? '' : 'text-gray-500'}`}>
            {typeIcons[element.type]}
          </span>

          {/* Name */}
          <span className={`flex-1 text-sm truncate ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>
            {element.name}
          </span>

          {/* Quick Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); updateElement(element.id, { locked: !element.locked }); }}
              className="p-1 text-gray-500 hover:text-white rounded"
              title={element.locked ? 'Odemknout' : 'Zamknout'}
            >
              {element.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); updateElement(element.id, { visible: !element.visible }); }}
              className="p-1 text-gray-500 hover:text-white rounded"
              title={element.visible ? 'Skrýt' : 'Zobrazit'}
            >
              {element.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && element.children!.map(child => (
          <LayerItem key={child.id} element={child} depth={depth + 1} />
        ))}
      </>
    );
  };

  // Preview Element
  const PreviewElement = ({ element }: { element: PageElement }) => {
    if (!element.visible) return null;

    const isSelected = selectedId === element.id;
    const style: React.CSSProperties = {
      ...element.styles,
      position: 'relative',
      cursor: element.locked ? 'not-allowed' : 'pointer',
      opacity: element.locked ? 0.7 : 1,
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!element.locked) setSelectedId(element.id);
    };

    const Outline = () => isSelected ? (
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          outline: `2px solid ${themeColor}`,
          outlineOffset: -2,
        }}
      >
        {/* Label */}
        <span
          className="absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium text-white rounded"
          style={{ backgroundColor: themeColor }}
        >
          {element.name}
        </span>
        {/* Resize handles */}
        {['nw', 'ne', 'sw', 'se'].map(pos => (
          <div
            key={pos}
            className="absolute w-2.5 h-2.5 bg-white border-2 rounded-sm"
            style={{
              borderColor: themeColor,
              top: pos.includes('n') ? -5 : 'auto',
              bottom: pos.includes('s') ? -5 : 'auto',
              left: pos.includes('w') ? -5 : 'auto',
              right: pos.includes('e') ? -5 : 'auto',
            }}
          />
        ))}
      </div>
    ) : null;

    switch (element.type) {
      case 'section':
        return (
          <section style={style} onClick={handleClick}>
            <Outline />
            <div className="max-w-6xl mx-auto">
              {element.children?.map(child => <PreviewElement key={child.id} element={child} />)}
            </div>
          </section>
        );
      case 'heading':
        return <h2 style={style} onClick={handleClick}><Outline />{element.content}</h2>;
      case 'text':
        return <p style={style} onClick={handleClick}><Outline />{element.content}</p>;
      case 'image':
        return (
          <div style={{ ...style, display: 'flex', justifyContent: 'center' }} onClick={handleClick}>
            <Outline />
            <img src={element.src} alt="" style={{ width: element.styles.width, height: element.styles.height, borderRadius: element.styles.borderRadius, objectFit: 'cover' }} />
          </div>
        );
      case 'button':
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }} onClick={handleClick}>
            <button style={style}><Outline />{element.content}</button>
          </div>
        );
      default:
        return <div style={style} onClick={handleClick}><Outline />{element.content}</div>;
    }
  };

  // Property Field Component
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      {children}
    </div>
  );

  // Input Component
  const Input = ({ value, onChange, placeholder, icon }: { value: string; onChange: (v: string) => void; placeholder?: string; icon?: React.ReactNode }) => (
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-9 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors ${icon ? 'pl-9' : 'px-3'}`}
      />
    </div>
  );

  // Color Picker Component
  const ColorPicker = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg cursor-pointer border-2 border-white/10 bg-transparent"
        />
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-7 bg-white/5 border border-white/10 rounded text-xs text-white px-2 font-mono uppercase focus:outline-none focus:border-white/20"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* ═══════════════ HEADER BAR ═══════════════ */}
      <header className="h-12 flex items-center justify-between px-4 bg-[#111] border-b border-white/10">
        {/* Left: Logo & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: themeColor }}>
              <Layout className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Editor</span>
          </div>

          <div className="h-5 w-px bg-white/10" />

          {/* Undo/Redo */}
          <div className="flex items-center">
            <button onClick={undo} disabled={historyIndex < 0} className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors" title="Zpět">
              <Undo2 className="w-4 h-4" />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors" title="Vpřed">
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Viewport Switcher */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {[
            { id: 'desktop', icon: Monitor, label: 'Desktop', width: 1280 },
            { id: 'tablet', icon: Tablet, label: 'Tablet', width: 768 },
            { id: 'mobile', icon: Smartphone, label: 'Mobile', width: 390 },
          ].map(({ id, icon: Icon, label, width }) => (
            <button
              key={id}
              onClick={() => setViewport(id as typeof viewport)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                viewport === id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
              title={`${label} (${width}px)`}
            >
              <Icon className="w-4 h-4" />
              {viewport === id && <span className="text-xs">{width}px</span>}
            </button>
          ))}
        </div>

        {/* Right: Zoom & Save */}
        <div className="flex items-center gap-3">
          {/* Zoom */}
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(25, z - 10))} className="p-1.5 text-gray-400 hover:text-white">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400 w-12 text-center font-medium">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="p-1.5 text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-white/10" />

          {/* Save */}
          <button
            onClick={() => onSave?.(elements)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: themeColor }}
          >
            <Save className="w-4 h-4" />
            Uložit
          </button>
        </div>
      </header>

      {/* ═══════════════ MAIN AREA ═══════════════ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─────────── LEFT: LAYERS PANEL ─────────── */}
        <aside className="w-64 bg-[#111] border-r border-white/10 flex flex-col">
          {/* Panel Header */}
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-white">Vrstvy</span>
              <span className="ml-auto text-xs text-gray-600">{elements.length}</span>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledat..."
                className="w-full h-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 pl-8 pr-3 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Layer List */}
          <div className="flex-1 overflow-y-auto py-2">
            {elements.map(element => (
              <LayerItem key={element.id} element={element} />
            ))}
          </div>

          {/* Add Section */}
          <div className="p-3 border-t border-white/10">
            <button className="w-full h-9 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
              Přidat sekci
            </button>
          </div>
        </aside>

        {/* ─────────── CENTER: CANVAS ─────────── */}
        <main className="flex-1 overflow-auto bg-[#0a0a0a] relative">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Canvas Content */}
          <div className="relative min-h-full p-8 flex justify-center">
            <div
              className="relative transition-transform duration-300"
              style={{
                width: getViewportWidth(),
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              {/* Browser Frame */}
              <div className="bg-[#1a1a1a] rounded-t-xl overflow-hidden shadow-2xl">
                {/* Browser Bar */}
                <div className="h-10 flex items-center px-4 bg-[#252525] border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-1 bg-black/30 rounded-md">
                      <Lock className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-400">paveljaros.cz</span>
                    </div>
                  </div>
                  <div className="w-20" />
                </div>

                {/* Page Content */}
                <div className="bg-white min-h-[400px]">
                  {elements.map(element => (
                    <PreviewElement key={element.id} element={element} />
                  ))}
                </div>
              </div>

              {/* Viewport Label */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600">
                {viewport === 'desktop' ? 'Desktop' : viewport === 'tablet' ? 'Tablet' : 'Mobile'} • {getViewportWidth()}px
              </div>
            </div>
          </div>
        </main>

        {/* ─────────── RIGHT: PROPERTIES PANEL ─────────── */}
        <aside className="w-72 bg-[#111] border-l border-white/10 flex flex-col">
          {selectedElement ? (
            <>
              {/* Element Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                  >
                    {typeIcons[selectedElement.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={selectedElement.name}
                      onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                      className="w-full bg-transparent text-white font-medium text-sm border-0 p-0 focus:outline-none"
                    />
                    <div className="text-xs text-gray-500">{typeLabels[selectedElement.type]}</div>
                  </div>
                  <button className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/10">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                {[
                  { id: 'style', label: 'Vzhled' },
                  { id: 'layout', label: 'Rozložení' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setPropertyTab(id as typeof propertyTab)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      propertyTab === id
                        ? 'text-white border-b-2'
                        : 'text-gray-500 hover:text-white'
                    }`}
                    style={{ borderColor: propertyTab === id ? themeColor : 'transparent' }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Properties Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {propertyTab === 'style' && (
                  <>
                    {/* Content */}
                    {['heading', 'text', 'button'].includes(selectedElement.type) && (
                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Obsah</div>
                        {selectedElement.type === 'text' ? (
                          <textarea
                            value={selectedElement.content || ''}
                            onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white p-3 resize-none focus:outline-none focus:border-white/20"
                            placeholder="Zadejte text..."
                          />
                        ) : (
                          <Input
                            value={selectedElement.content || ''}
                            onChange={(v) => updateElement(selectedElement.id, { content: v })}
                            placeholder="Zadejte text..."
                          />
                        )}

                        {/* Alignment */}
                        <div className="flex bg-white/5 rounded-lg p-1">
                          {[
                            { align: 'left', icon: AlignLeft },
                            { align: 'center', icon: AlignCenter },
                            { align: 'right', icon: AlignRight },
                          ].map(({ align, icon: Icon }) => (
                            <button
                              key={align}
                              onClick={() => updateStyle(selectedElement.id, 'textAlign', align)}
                              className={`flex-1 p-2 rounded-md transition-colors ${
                                selectedElement.styles.textAlign === align
                                  ? 'bg-white/10 text-white'
                                  : 'text-gray-500 hover:text-white'
                              }`}
                            >
                              <Icon className="w-4 h-4 mx-auto" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image */}
                    {selectedElement.type === 'image' && (
                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Obrázek</div>
                        {selectedElement.src && (
                          <div className="rounded-lg overflow-hidden border border-white/10">
                            <img src={selectedElement.src} alt="" className="w-full h-24 object-cover" />
                          </div>
                        )}
                        <Input
                          value={selectedElement.src || ''}
                          onChange={(v) => updateElement(selectedElement.id, { src: v })}
                          placeholder="URL obrázku"
                          icon={<ImageIcon className="w-4 h-4" />}
                        />
                      </div>
                    )}

                    {/* Link */}
                    {selectedElement.type === 'button' && (
                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Odkaz</div>
                        <Input
                          value={selectedElement.href || ''}
                          onChange={(v) => updateElement(selectedElement.id, { href: v })}
                          placeholder="#sekce nebo URL"
                          icon={<ExternalLink className="w-4 h-4" />}
                        />
                      </div>
                    )}

                    {/* Colors */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5" />
                        Barvy
                      </div>
                      <div className="space-y-3">
                        <ColorPicker
                          value={selectedElement.styles.backgroundColor || ''}
                          onChange={(v) => updateStyle(selectedElement.id, 'backgroundColor', v)}
                          label="Pozadí"
                        />
                        <ColorPicker
                          value={selectedElement.styles.color || ''}
                          onChange={(v) => updateStyle(selectedElement.id, 'color', v)}
                          label="Text"
                        />
                      </div>
                    </div>

                    {/* Typography */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                        <Type className="w-3.5 h-3.5" />
                        Typografie
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Velikost">
                          <Input
                            value={selectedElement.styles.fontSize || ''}
                            onChange={(v) => updateStyle(selectedElement.id, 'fontSize', v)}
                            placeholder="16px"
                          />
                        </Field>
                        <Field label="Váha">
                          <select
                            value={selectedElement.styles.fontWeight || 'normal'}
                            onChange={(e) => updateStyle(selectedElement.id, 'fontWeight', e.target.value)}
                            className="w-full h-9 bg-white/5 border border-white/10 rounded-lg text-sm text-white px-3 focus:outline-none focus:border-white/20 cursor-pointer"
                          >
                            <option value="normal" className="bg-[#1a1a1a]">Normal</option>
                            <option value="500" className="bg-[#1a1a1a]">Medium</option>
                            <option value="600" className="bg-[#1a1a1a]">Semibold</option>
                            <option value="bold" className="bg-[#1a1a1a]">Bold</option>
                          </select>
                        </Field>
                      </div>
                    </div>
                  </>
                )}

                {propertyTab === 'layout' && (
                  <>
                    {/* Spacing */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                        <Box className="w-3.5 h-3.5" />
                        Odsazení
                      </div>

                      {/* Visual Box Model */}
                      <div className="relative p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
                        <span className="absolute top-1 left-2 text-[10px] text-orange-400/60">margin</span>
                        <div className="p-3 bg-blue-500/5 rounded border border-blue-500/20">
                          <span className="absolute top-[18px] left-[18px] text-[10px] text-blue-400/60">padding</span>
                          <div className="h-6 bg-white/5 rounded flex items-center justify-center">
                            <span className="text-[10px] text-gray-500">obsah</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Padding">
                          <Input
                            value={selectedElement.styles.padding || ''}
                            onChange={(v) => updateStyle(selectedElement.id, 'padding', v)}
                            placeholder="0px"
                          />
                        </Field>
                        <Field label="Margin">
                          <Input
                            value={selectedElement.styles.margin || ''}
                            onChange={(v) => updateStyle(selectedElement.id, 'margin', v)}
                            placeholder="0px"
                          />
                        </Field>
                      </div>
                    </div>

                    {/* Size */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Velikost</div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Šířka">
                          <Input
                            value={selectedElement.styles.width || ''}
                            onChange={(v) => updateStyle(selectedElement.id, 'width', v)}
                            placeholder="auto"
                          />
                        </Field>
                        <Field label="Výška">
                          <Input
                            value={selectedElement.styles.height || ''}
                            onChange={(v) => updateStyle(selectedElement.id, 'height', v)}
                            placeholder="auto"
                          />
                        </Field>
                      </div>
                    </div>

                    {/* Border Radius */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Zaoblení</div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={parseInt(selectedElement.styles.borderRadius || '0')}
                          onChange={(e) => updateStyle(selectedElement.id, 'borderRadius', `${e.target.value}px`)}
                          className="flex-1 accent-white"
                        />
                        <input
                          type="text"
                          value={selectedElement.styles.borderRadius || '0px'}
                          onChange={(e) => updateStyle(selectedElement.id, 'borderRadius', e.target.value)}
                          className="w-16 h-8 bg-white/5 border border-white/10 rounded text-xs text-white text-center focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="p-3 border-t border-white/10 flex gap-2">
                <button className="flex-1 h-9 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
                  <Copy className="w-4 h-4" />
                  Duplikovat
                </button>
                <button className="flex-1 h-9 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Smazat
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${themeColor}15` }}
              >
                <MousePointer2 className="w-7 h-7" style={{ color: themeColor }} />
              </div>
              <h3 className="text-white font-medium mb-1">Žádný výběr</h3>
              <p className="text-sm text-gray-500">Klikněte na prvek pro jeho úpravu</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
