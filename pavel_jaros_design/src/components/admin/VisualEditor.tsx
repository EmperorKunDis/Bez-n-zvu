"use client";

import { useState, useCallback } from 'react';
import {
  Layers,
  MousePointer2,
  Move,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  Plus,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Smartphone,
  Tablet,
  Monitor,
  Settings2,
  Palette,
  Layout,
  Box,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Trash2,
  Copy,
  Clipboard,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
}

interface VisualEditorProps {
  themeColor: string;
  initialElements?: PageElement[];
  onSave?: (elements: PageElement[]) => void;
}

const defaultElements: PageElement[] = [
  {
    id: 'hero-section',
    type: 'section',
    name: 'Hero sekce',
    visible: true,
    styles: {
      backgroundColor: '#1a1a1a',
      padding: '80px 20px',
    },
    children: [
      {
        id: 'hero-title',
        type: 'heading',
        name: 'Hlavní nadpis',
        content: 'Prodávám nemovitosti s nadšením',
        visible: true,
        styles: {
          color: '#ffffff',
          fontSize: '48px',
          fontWeight: 'bold',
          textAlign: 'center',
        }
      },
      {
        id: 'hero-subtitle',
        type: 'text',
        name: 'Podnadpis',
        content: 'Váš spolehlivý partner v oblasti realit',
        visible: true,
        styles: {
          color: '#a1a1aa',
          fontSize: '18px',
          textAlign: 'center',
          margin: '20px 0',
        }
      },
      {
        id: 'hero-cta',
        type: 'button',
        name: 'CTA tlačítko',
        content: 'Prohlédnout nemovitosti',
        href: '#properties',
        visible: true,
        styles: {
          backgroundColor: '#b91c1c',
          color: '#ffffff',
          padding: '16px 32px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
        }
      }
    ]
  },
  {
    id: 'services-section',
    type: 'section',
    name: 'Služby',
    visible: true,
    styles: {
      backgroundColor: '#ffffff',
      padding: '60px 20px',
    },
    children: [
      {
        id: 'services-title',
        type: 'heading',
        name: 'Nadpis služeb',
        content: 'Komplexní služby v oblasti realit',
        visible: true,
        styles: {
          color: '#171717',
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
        }
      },
      {
        id: 'services-desc',
        type: 'text',
        name: 'Popis služeb',
        content: 'Nabízím kompletní servis při prodeji i pronájmu nemovitostí.',
        visible: true,
        styles: {
          color: '#525252',
          fontSize: '16px',
          textAlign: 'center',
          margin: '16px 0',
        }
      }
    ]
  },
  {
    id: 'about-section',
    type: 'section',
    name: 'O mně',
    visible: true,
    styles: {
      backgroundColor: '#f5f5f5',
      padding: '60px 20px',
    },
    children: [
      {
        id: 'about-image',
        type: 'image',
        name: 'Fotka',
        src: '/images/PavelFotka.png',
        visible: true,
        styles: {
          width: '200px',
          height: '200px',
          borderRadius: '100px',
        }
      },
      {
        id: 'about-name',
        type: 'heading',
        name: 'Jméno',
        content: 'Pavel Jaroš',
        visible: true,
        styles: {
          color: '#171717',
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '24px 0 8px',
        }
      },
      {
        id: 'about-title',
        type: 'text',
        name: 'Titul',
        content: 'Realitní specialista',
        visible: true,
        styles: {
          color: '#b91c1c',
          fontSize: '18px',
          textAlign: 'center',
        }
      }
    ]
  },
  {
    id: 'contact-section',
    type: 'section',
    name: 'Kontakt',
    visible: true,
    styles: {
      backgroundColor: '#171717',
      padding: '60px 20px',
    },
    children: [
      {
        id: 'contact-title',
        type: 'heading',
        name: 'Kontakt nadpis',
        content: 'Kontaktujte mě',
        visible: true,
        styles: {
          color: '#ffffff',
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
        }
      },
      {
        id: 'contact-info',
        type: 'text',
        name: 'Kontaktní údaje',
        content: '+420 777 558 730 | pavel.jaros@kwcz.cz',
        visible: true,
        styles: {
          color: '#a1a1aa',
          fontSize: '18px',
          textAlign: 'center',
          margin: '20px 0',
        }
      }
    ]
  }
];

export function VisualEditor({ themeColor, initialElements, onSave }: VisualEditorProps) {
  const [elements, setElements] = useState<PageElement[]>(initialElements || defaultElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['hero-section', 'services-section', 'about-section', 'contact-section']));
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(100);
  const [tool, setTool] = useState<'select' | 'move'>('select');
  const [history, setHistory] = useState<PageElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const updateElement = (id: string, updates: Partial<PageElement>) => {
    const updateRecursive = (els: PageElement[]): PageElement[] => {
      return els.map(el => {
        if (el.id === id) {
          return { ...el, ...updates };
        }
        if (el.children) {
          return { ...el, children: updateRecursive(el.children) };
        }
        return el;
      });
    };

    // Save to history
    setHistory(prev => [...prev.slice(0, historyIndex + 1), elements]);
    setHistoryIndex(prev => prev + 1);

    setElements(updateRecursive(elements));
  };

  const updateElementStyle = (id: string, styleKey: string, value: string) => {
    const updateRecursive = (els: PageElement[]): PageElement[] => {
      return els.map(el => {
        if (el.id === id) {
          return {
            ...el,
            styles: { ...el.styles, [styleKey]: value }
          };
        }
        if (el.children) {
          return { ...el, children: updateRecursive(el.children) };
        }
        return el;
      });
    };
    setElements(updateRecursive(elements));
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
    switch (viewportSize) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'section': return <Layout className="w-4 h-4" />;
      case 'heading': return <Type className="w-4 h-4" />;
      case 'text': return <AlignLeft className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'button': return <Square className="w-4 h-4" />;
      case 'container': return <Box className="w-4 h-4" />;
      case 'divider': return <Minus className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  // Component Tree Item
  const TreeItem = ({ element, depth = 0 }: { element: PageElement; depth?: number }) => {
    const hasChildren = element.children && element.children.length > 0;
    const isExpanded = expandedIds.has(element.id);
    const isSelected = selectedId === element.id;

    return (
      <div>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer group transition-all duration-150 ${
            isSelected
              ? 'bg-white/20 text-white'
              : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setSelectedId(element.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleExpand(element.id); }}
              className="p-0.5 hover:bg-white/10 rounded"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <span className="w-4" />
          )}
          <span className="opacity-60">{getTypeIcon(element.type)}</span>
          <span className="text-xs font-medium truncate flex-1">{element.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); updateElement(element.id, { visible: !element.visible }); }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-opacity"
          >
            {element.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {element.children!.map(child => (
              <TreeItem key={child.id} element={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Preview Element Renderer
  const PreviewElement = ({ element }: { element: PageElement }) => {
    if (!element.visible) return null;

    const isSelected = selectedId === element.id;
    const baseStyles: React.CSSProperties = {
      ...element.styles,
      position: 'relative',
      outline: isSelected ? `2px solid ${themeColor}` : 'none',
      outlineOffset: '2px',
      cursor: 'pointer',
      transition: 'outline 0.15s ease',
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedId(element.id);
    };

    switch (element.type) {
      case 'section':
        return (
          <div style={baseStyles} onClick={handleClick}>
            {isSelected && (
              <div
                className="absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium text-white rounded-t-md"
                style={{ backgroundColor: themeColor }}
              >
                {element.name}
              </div>
            )}
            <div className="max-w-5xl mx-auto">
              {element.children?.map(child => (
                <PreviewElement key={child.id} element={child} />
              ))}
            </div>
          </div>
        );

      case 'heading':
        return (
          <h2 style={baseStyles} onClick={handleClick}>
            {element.content}
          </h2>
        );

      case 'text':
        return (
          <p style={baseStyles} onClick={handleClick}>
            {element.content}
          </p>
        );

      case 'image':
        return (
          <div style={{ ...baseStyles, display: 'flex', justifyContent: 'center' }} onClick={handleClick}>
            <img
              src={element.src}
              alt={element.name}
              style={{
                width: element.styles.width,
                height: element.styles.height,
                borderRadius: element.styles.borderRadius,
                objectFit: 'cover',
              }}
            />
          </div>
        );

      case 'button':
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }} onClick={handleClick}>
            <button style={baseStyles}>
              {element.content}
            </button>
          </div>
        );

      default:
        return (
          <div style={baseStyles} onClick={handleClick}>
            {element.content}
          </div>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-white/10">
        <div className="flex items-center gap-1">
          {/* Tool Selection */}
          <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 mr-2">
            <button
              onClick={() => setTool('select')}
              className={`p-2 rounded-md transition-colors ${tool === 'select' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'}`}
              title="Vybrat"
            >
              <MousePointer2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('move')}
              className={`p-2 rounded-md transition-colors ${tool === 'move' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'}`}
              title="Přesunout"
            >
              <Move className="w-4 h-4" />
            </button>
          </div>

          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={historyIndex < 0}
            className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
            title="Zpět"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
            title="Vpřed"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Add Elements */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-500 hover:text-white transition-colors" title="Přidat sekci">
              <Layout className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-white transition-colors" title="Přidat text">
              <Type className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-white transition-colors" title="Přidat obrázek">
              <ImageIcon className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-white transition-colors" title="Přidat tlačítko">
              <Square className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Viewport Size */}
          <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1">
            <button
              onClick={() => setViewportSize('desktop')}
              className={`p-2 rounded-md transition-colors ${viewportSize === 'desktop' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'}`}
              title="Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportSize('tablet')}
              className={`p-2 rounded-md transition-colors ${viewportSize === 'tablet' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'}`}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportSize('mobile')}
              className={`p-2 rounded-md transition-colors ${viewportSize === 'mobile' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'}`}
              title="Mobil"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-2 py-1">
            <button
              onClick={() => setZoom(z => Math.max(25, z - 25))}
              className="p-1 text-gray-500 hover:text-white transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs text-gray-400 w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(200, z + 25))}
              className="p-1 text-gray-500 hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Save Button */}
          <Button
            onClick={() => onSave?.(elements)}
            className="text-white text-sm"
            style={{ backgroundColor: themeColor }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Publikovat
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Tree */}
        <div className="w-64 bg-[#141414] border-r border-white/10 flex flex-col">
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-gray-400">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Struktura</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {elements.map(element => (
              <TreeItem key={element.id} element={element} />
            ))}
          </div>
        </div>

        {/* Center - Preview Canvas */}
        <div className="flex-1 bg-[#0a0a0a] overflow-auto p-8 flex justify-center">
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              width: getViewportWidth(),
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {elements.map(element => (
              <PreviewElement key={element.id} element={element} />
            ))}
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-72 bg-[#141414] border-l border-white/10 flex flex-col">
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-gray-400">
              <Settings2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Vlastnosti</span>
            </div>
          </div>

          {selectedElement ? (
            <div className="flex-1 overflow-y-auto">
              {/* Element Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${themeColor}20` }}
                  >
                    <span style={{ color: themeColor }}>{getTypeIcon(selectedElement.type)}</span>
                  </div>
                  <div>
                    <Input
                      value={selectedElement.name}
                      onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                      className="bg-transparent border-0 p-0 h-auto text-white font-medium text-sm focus:ring-0"
                    />
                    <p className="text-xs text-gray-500 capitalize">{selectedElement.type}</p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              {(selectedElement.type === 'heading' || selectedElement.type === 'text' || selectedElement.type === 'button') && (
                <div className="p-4 border-b border-white/10">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                    Obsah
                  </label>
                  {selectedElement.type === 'text' ? (
                    <Textarea
                      value={selectedElement.content || ''}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="bg-[#1a1a1a] border-white/10 text-white text-sm resize-none"
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={selectedElement.content || ''}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="bg-[#1a1a1a] border-white/10 text-white text-sm"
                    />
                  )}

                  {/* Text Formatting */}
                  <div className="flex items-center gap-1 mt-3">
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors">
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors">
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors">
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors">
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Image Source */}
              {selectedElement.type === 'image' && (
                <div className="p-4 border-b border-white/10">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                    Zdroj obrázku
                  </label>
                  <Input
                    value={selectedElement.src || ''}
                    onChange={(e) => updateElement(selectedElement.id, { src: e.target.value })}
                    className="bg-[#1a1a1a] border-white/10 text-white text-sm"
                    placeholder="URL nebo cesta k obrázku"
                  />
                  {selectedElement.src && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                      <img src={selectedElement.src} alt="" className="w-full h-32 object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* Link for buttons */}
              {selectedElement.type === 'button' && (
                <div className="p-4 border-b border-white/10">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                    Odkaz
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      value={selectedElement.href || ''}
                      onChange={(e) => updateElement(selectedElement.id, { href: e.target.value })}
                      className="bg-[#1a1a1a] border-white/10 text-white text-sm pl-10"
                      placeholder="#sekce nebo URL"
                    />
                  </div>
                </div>
              )}

              {/* Style Section */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Barvy</span>
                </div>

                <div className="space-y-3">
                  {/* Background Color */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Pozadí</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedElement.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0"
                      />
                      <Input
                        value={selectedElement.styles.backgroundColor || ''}
                        onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value)}
                        className="bg-[#1a1a1a] border-white/10 text-white text-xs flex-1"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Text</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedElement.styles.color || '#000000'}
                        onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0"
                      />
                      <Input
                        value={selectedElement.styles.color || ''}
                        onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value)}
                        className="bg-[#1a1a1a] border-white/10 text-white text-xs flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Typografie</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Velikost</label>
                    <Input
                      value={selectedElement.styles.fontSize || ''}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'fontSize', e.target.value)}
                      className="bg-[#1a1a1a] border-white/10 text-white text-xs"
                      placeholder="16px"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Tloušťka</label>
                    <select
                      value={selectedElement.styles.fontWeight || 'normal'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'fontWeight', e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 text-white text-xs rounded-md px-3 py-2"
                    >
                      <option value="normal">Normal</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Box className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Rozměry</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Padding</label>
                    <Input
                      value={selectedElement.styles.padding || ''}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'padding', e.target.value)}
                      className="bg-[#1a1a1a] border-white/10 text-white text-xs"
                      placeholder="16px"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Margin</label>
                    <Input
                      value={selectedElement.styles.margin || ''}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'margin', e.target.value)}
                      className="bg-[#1a1a1a] border-white/10 text-white text-xs"
                      placeholder="0px"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Zaoblení</label>
                    <Input
                      value={selectedElement.styles.borderRadius || ''}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'borderRadius', e.target.value)}
                      className="bg-[#1a1a1a] border-white/10 text-white text-xs"
                      placeholder="8px"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                    <span className="text-xs">Duplikovat</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs">Smazat</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MousePointer2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Vyberte prvek pro úpravu</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
