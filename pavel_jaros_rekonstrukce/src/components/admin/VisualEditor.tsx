"use client";

import { useState, useCallback, useEffect } from 'react';
import {
  Layers,
  MousePointer2,
  Move,
  Type,
  Image as ImageIcon,
  Square,
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
  ChevronRight,
  ChevronDown,
  Sparkles,
  Zap,
  Grid3X3,
  Maximize2,
  PanelLeftClose,
  PanelRightClose,
  Save,
  RotateCcw,
  Wand2,
  Grip,
  CircleDot,
  PenTool
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
          backgroundColor: '#dc2626',
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
          color: '#dc2626',
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
  const [zoom, setZoom] = useState(75);
  const [tool, setTool] = useState<'select' | 'move' | 'pen'>('select');
  const [history, setHistory] = useState<PageElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'design' | 'layers'>('layers');
  const [hoverElement, setHoverElement] = useState<string | null>(null);

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
      default: return '1280px';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'section': return <Layout className="w-3.5 h-3.5" />;
      case 'heading': return <Type className="w-3.5 h-3.5" />;
      case 'text': return <AlignLeft className="w-3.5 h-3.5" />;
      case 'image': return <ImageIcon className="w-3.5 h-3.5" />;
      case 'button': return <Square className="w-3.5 h-3.5" />;
      case 'container': return <Box className="w-3.5 h-3.5" />;
      case 'divider': return <Minus className="w-3.5 h-3.5" />;
      default: return <Square className="w-3.5 h-3.5" />;
    }
  };

  const TreeItem = ({ element, depth = 0 }: { element: PageElement; depth?: number }) => {
    const hasChildren = element.children && element.children.length > 0;
    const isExpanded = expandedIds.has(element.id);
    const isSelected = selectedId === element.id;
    const isHovered = hoverElement === element.id;

    return (
      <div className="select-none">
        <div
          className={`
            group flex items-center gap-2 px-3 py-2 mx-2 rounded-lg cursor-pointer
            transition-all duration-200 ease-out
            ${isSelected
              ? 'bg-gradient-to-r from-white/15 to-white/5 shadow-lg shadow-black/20'
              : isHovered
                ? 'bg-white/8'
                : 'hover:bg-white/5'
            }
          `}
          style={{
            paddingLeft: `${depth * 16 + 12}px`,
            borderLeft: isSelected ? `2px solid ${themeColor}` : '2px solid transparent',
          }}
          onClick={() => setSelectedId(element.id)}
          onMouseEnter={() => setHoverElement(element.id)}
          onMouseLeave={() => setHoverElement(null)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => { e.stopPropagation(); toggleExpand(element.id); }}
                className={`
                  p-1 rounded-md transition-all duration-200
                  ${isExpanded ? 'bg-white/10 rotate-0' : 'rotate-0'}
                  hover:bg-white/15
                `}
              >
                {isExpanded
                  ? <ChevronDown className="w-3 h-3 text-gray-400" />
                  : <ChevronRight className="w-3 h-3 text-gray-500" />
                }
              </button>
            ) : (
              <span className="w-5" />
            )}

            <div
              className={`
                p-1.5 rounded-md transition-all duration-200
                ${isSelected ? 'bg-white/15' : 'bg-white/5 group-hover:bg-white/10'}
              `}
              style={{ color: isSelected ? themeColor : '#9ca3af' }}
            >
              {getTypeIcon(element.type)}
            </div>

            <span className={`
              text-sm font-medium truncate transition-colors duration-200
              ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}
            `}>
              {element.name}
            </span>
          </div>

          <div className={`
            flex items-center gap-1 transition-opacity duration-200
            ${isSelected || isHovered ? 'opacity-100' : 'opacity-0'}
          `}>
            <button
              onClick={(e) => { e.stopPropagation(); updateElement(element.id, { visible: !element.visible }); }}
              className={`
                p-1.5 rounded-md transition-all duration-200
                ${element.visible
                  ? 'text-gray-400 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
                }
              `}
            >
              {element.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="relative">
            <div
              className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent"
              style={{ marginLeft: `${depth * 16 + 24}px` }}
            />
            {element.children!.map(child => (
              <TreeItem key={child.id} element={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const PreviewElement = ({ element }: { element: PageElement }) => {
    if (!element.visible) return null;

    const isSelected = selectedId === element.id;
    const isHovered = hoverElement === element.id;

    const baseStyles: React.CSSProperties = {
      ...element.styles,
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedId(element.id);
    };

    const SelectionOverlay = () => (
      <>
        {isSelected && (
          <>
            {/* Selection border with glow */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                border: `2px solid ${themeColor}`,
                boxShadow: `0 0 0 1px ${themeColor}40, 0 0 20px ${themeColor}30`,
              }}
            />
            {/* Corner handles */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
              <div
                key={pos}
                className="absolute w-3 h-3 rounded-full z-20 pointer-events-auto cursor-pointer"
                style={{
                  background: themeColor,
                  boxShadow: `0 0 0 2px #0a0a0a, 0 2px 8px rgba(0,0,0,0.4)`,
                  top: pos.includes('top') ? -6 : 'auto',
                  bottom: pos.includes('bottom') ? -6 : 'auto',
                  left: pos.includes('left') ? -6 : 'auto',
                  right: pos.includes('right') ? -6 : 'auto',
                }}
              />
            ))}
            {/* Label */}
            <div
              className="absolute -top-8 left-0 px-2.5 py-1 text-xs font-semibold text-white rounded-md z-20 flex items-center gap-1.5 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`,
              }}
            >
              {getTypeIcon(element.type)}
              {element.name}
            </div>
          </>
        )}
        {isHovered && !isSelected && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              border: `1px dashed ${themeColor}80`,
              background: `${themeColor}08`,
            }}
          />
        )}
      </>
    );

    switch (element.type) {
      case 'section':
        return (
          <div
            style={baseStyles}
            onClick={handleClick}
            onMouseEnter={() => setHoverElement(element.id)}
            onMouseLeave={() => setHoverElement(null)}
          >
            <SelectionOverlay />
            <div className="max-w-5xl mx-auto">
              {element.children?.map(child => (
                <PreviewElement key={child.id} element={child} />
              ))}
            </div>
          </div>
        );

      case 'heading':
        return (
          <h2
            style={baseStyles}
            onClick={handleClick}
            onMouseEnter={() => setHoverElement(element.id)}
            onMouseLeave={() => setHoverElement(null)}
          >
            <SelectionOverlay />
            {element.content}
          </h2>
        );

      case 'text':
        return (
          <p
            style={baseStyles}
            onClick={handleClick}
            onMouseEnter={() => setHoverElement(element.id)}
            onMouseLeave={() => setHoverElement(null)}
          >
            <SelectionOverlay />
            {element.content}
          </p>
        );

      case 'image':
        return (
          <div
            style={{ ...baseStyles, display: 'flex', justifyContent: 'center' }}
            onClick={handleClick}
            onMouseEnter={() => setHoverElement(element.id)}
            onMouseLeave={() => setHoverElement(null)}
          >
            <SelectionOverlay />
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
          <div
            style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
            onClick={handleClick}
            onMouseEnter={() => setHoverElement(element.id)}
            onMouseLeave={() => setHoverElement(null)}
          >
            <SelectionOverlay />
            <button style={baseStyles}>
              {element.content}
            </button>
          </div>
        );

      default:
        return (
          <div
            style={baseStyles}
            onClick={handleClick}
            onMouseEnter={() => setHoverElement(element.id)}
            onMouseLeave={() => setHoverElement(null)}
          >
            <SelectionOverlay />
            {element.content}
          </div>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden relative">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, ${themeColor}15, transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, ${themeColor}10, transparent)
          `,
        }}
      />

      {/* Main container with glass effect */}
      <div className="relative flex-1 flex flex-col bg-[#0c0c0c]/95 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden m-2">

        {/* Top Toolbar - Premium Glass Design */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          {/* Toolbar background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02]" />

          <div className="relative flex items-center gap-3">
            {/* Logo / Brand */}
            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}, ${themeColor}99)`,
                  boxShadow: `0 4px 20px ${themeColor}40`,
                }}
              >
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">Studio</span>
            </div>

            {/* Tool Selection */}
            <div className="flex items-center bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
              {[
                { id: 'select', icon: MousePointer2, label: 'Vybrat' },
                { id: 'move', icon: Move, label: 'Přesunout' },
                { id: 'pen', icon: PenTool, label: 'Kreslit' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setTool(id as typeof tool)}
                  className={`
                    relative p-2.5 rounded-lg transition-all duration-300 group
                    ${tool === id
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                    }
                  `}
                  title={label}
                >
                  {tool === id && (
                    <div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${themeColor}30, ${themeColor}10)`,
                        boxShadow: `inset 0 1px 0 ${themeColor}40`,
                      }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <button
                onClick={undo}
                disabled={historyIndex < 0}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-200"
                title="Zpět (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-200"
                title="Vpřed (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

            {/* Add Elements - Floating Pills */}
            <div className="flex items-center gap-1">
              {[
                { icon: Layout, label: 'Sekce', color: '#3b82f6' },
                { icon: Type, label: 'Text', color: '#8b5cf6' },
                { icon: ImageIcon, label: 'Obrázek', color: '#10b981' },
                { icon: Square, label: 'Tlačítko', color: '#f59e0b' },
              ].map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  className="group relative p-2 rounded-lg text-gray-500 hover:text-white transition-all duration-300"
                  title={`Přidat ${label}`}
                >
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `${color}15` }}
                  />
                  <Icon className="w-4 h-4 relative z-10" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            {/* Viewport Size */}
            <div className="flex items-center bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
              {[
                { id: 'desktop', icon: Monitor, label: 'Desktop' },
                { id: 'tablet', icon: Tablet, label: 'Tablet' },
                { id: 'mobile', icon: Smartphone, label: 'Mobile' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setViewportSize(id as typeof viewportSize)}
                  className={`
                    relative px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                    ${viewportSize === id
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                    }
                  `}
                  title={label}
                >
                  {viewportSize === id && (
                    <div className="absolute inset-0 bg-white/10 rounded-lg" />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  {viewportSize === id && (
                    <span className="text-xs font-medium relative z-10">{label}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Zoom Control - Premium Slider */}
            <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-3 py-1.5 border border-white/[0.06]">
              <button
                onClick={() => setZoom(z => Math.max(25, z - 25))}
                className="p-1 text-gray-500 hover:text-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="relative w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${((zoom - 25) / 175) * 100}%`,
                    background: `linear-gradient(90deg, ${themeColor}, ${themeColor}cc)`,
                  }}
                />
                <input
                  type="range"
                  min="25"
                  max="200"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs text-gray-400 w-10 text-center font-medium">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(200, z + 25))}
                className="p-1 text-gray-500 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle Grid */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`
                p-2.5 rounded-lg transition-all duration-300 border
                ${showGrid
                  ? 'text-white bg-white/10 border-white/10'
                  : 'text-gray-500 hover:text-white border-transparent hover:border-white/10'
                }
              `}
              title="Zobrazit mřížku"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

            {/* Panel Toggles */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                className={`
                  p-2 rounded-lg transition-all duration-300
                  ${leftPanelOpen ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}
                `}
                title="Panel vrstev"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className={`
                  p-2 rounded-lg transition-all duration-300
                  ${rightPanelOpen ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}
                `}
                title="Panel vlastností"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

            {/* Save Button - Premium Gradient */}
            <button
              onClick={() => onSave?.(elements)}
              className="relative group px-5 py-2.5 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`,
                boxShadow: `0 4px 20px ${themeColor}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}ee, ${themeColor})`,
                }}
              />
              <div className="relative flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Publikovat</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left Sidebar - Layers Panel */}
          <div
            className={`
              relative flex flex-col border-r border-white/[0.06] transition-all duration-500 ease-out overflow-hidden
              ${leftPanelOpen ? 'w-72' : 'w-0'}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

            {/* Tabs */}
            <div className="relative flex items-center gap-1 p-2 border-b border-white/[0.06]">
              {[
                { id: 'layers', icon: Layers, label: 'Vrstvy' },
                { id: 'design', icon: Palette, label: 'Design' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300
                    ${activeTab === id
                      ? 'text-white bg-white/10'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Layers List */}
            <div className="relative flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {elements.map(element => (
                <TreeItem key={element.id} element={element} />
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="relative p-3 border-t border-white/[0.06]">
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/10 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Přidat sekci</span>
              </button>
            </div>
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 relative overflow-hidden">
            {/* Canvas Background with Grid */}
            <div
              className="absolute inset-0"
              style={{
                background: showGrid
                  ? `
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px),
                    linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
                    radial-gradient(ellipse at center, #111 0%, #0a0a0a 100%)
                  `
                  : 'radial-gradient(ellipse at center, #111 0%, #0a0a0a 100%)',
                backgroundSize: showGrid
                  ? '100px 100px, 100px 100px, 20px 20px, 20px 20px, 100% 100%'
                  : '100% 100%',
              }}
            />

            {/* Canvas Container */}
            <div className="absolute inset-0 overflow-auto p-12 flex justify-center">
              <div className="relative">
                {/* Device Frame */}
                <div
                  className="relative transition-all duration-500 ease-out"
                  style={{
                    width: getViewportWidth(),
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                  }}
                >
                  {/* Browser Chrome */}
                  <div className="bg-[#1a1a1a] rounded-t-xl px-4 py-3 flex items-center gap-3 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-black/30 rounded-lg">
                        <CircleDot className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-400">paveljaros.cz</span>
                      </div>
                    </div>
                    <div className="w-16" />
                  </div>

                  {/* Page Content */}
                  <div
                    className="bg-white overflow-hidden shadow-2xl shadow-black/50"
                    style={{
                      borderRadius: '0 0 12px 12px',
                    }}
                  >
                    {elements.map(element => (
                      <PreviewElement key={element.id} element={element} />
                    ))}
                  </div>
                </div>

                {/* Viewport Label */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  {viewportSize === 'desktop' && <Monitor className="w-3.5 h-3.5 text-gray-400" />}
                  {viewportSize === 'tablet' && <Tablet className="w-3.5 h-3.5 text-gray-400" />}
                  {viewportSize === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-gray-400" />}
                  <span className="text-xs text-gray-400 font-medium">
                    {viewportSize === 'desktop' ? '1280px' : viewportSize === 'tablet' ? '768px' : '375px'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties Panel */}
          <div
            className={`
              relative flex flex-col border-l border-white/[0.06] transition-all duration-500 ease-out overflow-hidden
              ${rightPanelOpen ? 'w-80' : 'w-0'}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.02] to-transparent" />

            {selectedElement ? (
              <>
                {/* Element Header */}
                <div className="relative p-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${themeColor}25, ${themeColor}10)`,
                        boxShadow: `inset 0 1px 0 ${themeColor}30`,
                      }}
                    >
                      <span style={{ color: themeColor }}>{getTypeIcon(selectedElement.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        value={selectedElement.name}
                        onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                        className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none focus:ring-0 border-0 p-0"
                      />
                      <p className="text-xs text-gray-500 capitalize mt-0.5">{selectedElement.type}</p>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Settings2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Properties Scroll Area */}
                <div className="relative flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                  {/* Content Section */}
                  {(selectedElement.type === 'heading' || selectedElement.type === 'text' || selectedElement.type === 'button') && (
                    <div className="p-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-md bg-blue-500/20">
                          <Type className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Obsah</span>
                      </div>

                      {selectedElement.type === 'text' ? (
                        <textarea
                          value={selectedElement.content || ''}
                          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/15 focus:border-white/20 text-white text-sm rounded-xl px-4 py-3 resize-none transition-colors focus:outline-none focus:ring-0"
                          rows={3}
                          placeholder="Zadejte text..."
                        />
                      ) : (
                        <input
                          value={selectedElement.content || ''}
                          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/15 focus:border-white/20 text-white text-sm rounded-xl px-4 py-3 transition-colors focus:outline-none focus:ring-0"
                          placeholder="Zadejte text..."
                        />
                      )}

                      {/* Text Formatting */}
                      <div className="flex items-center gap-1 mt-3 p-1 bg-white/[0.03] rounded-lg">
                        {[
                          { icon: Bold, active: false },
                          { icon: Italic, active: false },
                          { icon: Underline, active: false },
                        ].map(({ icon: Icon, active }, i) => (
                          <button
                            key={i}
                            className={`
                              flex-1 p-2.5 rounded-md transition-all duration-200
                              ${active
                                ? 'bg-white/10 text-white'
                                : 'text-gray-500 hover:text-white hover:bg-white/[0.06]'
                              }
                            `}
                          >
                            <Icon className="w-4 h-4 mx-auto" />
                          </button>
                        ))}
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        {[AlignLeft, AlignCenter, AlignRight].map((Icon, i) => (
                          <button
                            key={i}
                            onClick={() => updateElementStyle(selectedElement.id, 'textAlign', ['left', 'center', 'right'][i])}
                            className={`
                              flex-1 p-2.5 rounded-md transition-all duration-200
                              ${selectedElement.styles.textAlign === ['left', 'center', 'right'][i]
                                ? 'bg-white/10 text-white'
                                : 'text-gray-500 hover:text-white hover:bg-white/[0.06]'
                              }
                            `}
                          >
                            <Icon className="w-4 h-4 mx-auto" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Source */}
                  {selectedElement.type === 'image' && (
                    <div className="p-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-md bg-green-500/20">
                          <ImageIcon className="w-3.5 h-3.5 text-green-400" />
                        </div>
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Obrázek</span>
                      </div>

                      {selectedElement.src && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
                          <img src={selectedElement.src} alt="" className="w-full h-32 object-cover" />
                        </div>
                      )}

                      <input
                        value={selectedElement.src || ''}
                        onChange={(e) => updateElement(selectedElement.id, { src: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/15 focus:border-white/20 text-white text-sm rounded-xl px-4 py-3 transition-colors focus:outline-none focus:ring-0"
                        placeholder="URL nebo cesta k obrázku"
                      />
                    </div>
                  )}

                  {/* Link for buttons */}
                  {selectedElement.type === 'button' && (
                    <div className="p-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-md bg-purple-500/20">
                          <Link className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Odkaz</span>
                      </div>

                      <div className="relative">
                        <input
                          value={selectedElement.href || ''}
                          onChange={(e) => updateElement(selectedElement.id, { href: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/15 focus:border-white/20 text-white text-sm rounded-xl pl-10 pr-4 py-3 transition-colors focus:outline-none focus:ring-0"
                          placeholder="#sekce nebo URL"
                        />
                        <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  )}

                  {/* Colors Section */}
                  <div className="p-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-md bg-pink-500/20">
                        <Palette className="w-3.5 h-3.5 text-pink-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Barvy</span>
                    </div>

                    <div className="space-y-4">
                      {/* Background Color */}
                      <div>
                        <label className="text-xs text-gray-500 mb-2 block">Pozadí</label>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <input
                              type="color"
                              value={selectedElement.styles.backgroundColor || '#ffffff'}
                              onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value)}
                              className="w-10 h-10 rounded-xl cursor-pointer border-2 border-white/10 bg-transparent"
                              style={{
                                backgroundColor: selectedElement.styles.backgroundColor || '#ffffff',
                              }}
                            />
                            <div
                              className="absolute inset-0 rounded-xl pointer-events-none"
                              style={{
                                boxShadow: `0 0 20px ${selectedElement.styles.backgroundColor || '#ffffff'}30`,
                              }}
                            />
                          </div>
                          <input
                            value={selectedElement.styles.backgroundColor || ''}
                            onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value)}
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 uppercase font-mono transition-colors focus:outline-none focus:ring-0 focus:border-white/20"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>

                      {/* Text Color */}
                      <div>
                        <label className="text-xs text-gray-500 mb-2 block">Text</label>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <input
                              type="color"
                              value={selectedElement.styles.color || '#000000'}
                              onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value)}
                              className="w-10 h-10 rounded-xl cursor-pointer border-2 border-white/10 bg-transparent"
                              style={{
                                backgroundColor: selectedElement.styles.color || '#000000',
                              }}
                            />
                          </div>
                          <input
                            value={selectedElement.styles.color || ''}
                            onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value)}
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 uppercase font-mono transition-colors focus:outline-none focus:ring-0 focus:border-white/20"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="p-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-md bg-cyan-500/20">
                        <Type className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Typografie</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-2 block">Velikost</label>
                        <input
                          value={selectedElement.styles.fontSize || ''}
                          onChange={(e) => updateElementStyle(selectedElement.id, 'fontSize', e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-0 focus:border-white/20"
                          placeholder="16px"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-2 block">Tloušťka</label>
                        <select
                          value={selectedElement.styles.fontWeight || 'normal'}
                          onChange={(e) => updateElementStyle(selectedElement.id, 'fontWeight', e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-0 focus:border-white/20 cursor-pointer"
                        >
                          <option value="normal" className="bg-[#1a1a1a]">Normal</option>
                          <option value="500" className="bg-[#1a1a1a]">Medium</option>
                          <option value="600" className="bg-[#1a1a1a]">Semibold</option>
                          <option value="bold" className="bg-[#1a1a1a]">Bold</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Spacing */}
                  <div className="p-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-md bg-orange-500/20">
                        <Box className="w-3.5 h-3.5 text-orange-400" />
                      </div>
                      <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Rozměry</span>
                    </div>

                    {/* Visual Spacing Box */}
                    <div className="relative p-4 bg-white/[0.02] rounded-xl border border-white/[0.06] mb-4">
                      {/* Margin indicator */}
                      <div className="absolute inset-2 border border-dashed border-orange-500/30 rounded-lg" />
                      {/* Padding indicator */}
                      <div className="relative p-4 border border-dashed border-blue-500/30 rounded-md">
                        <div className="h-8 bg-white/5 rounded flex items-center justify-center">
                          <span className="text-[10px] text-gray-500">Obsah</span>
                        </div>
                      </div>

                      {/* Labels */}
                      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-orange-400/70">margin</span>
                      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-blue-400/70">padding</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-2 block">Padding</label>
                        <input
                          value={selectedElement.styles.padding || ''}
                          onChange={(e) => updateElementStyle(selectedElement.id, 'padding', e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-0 focus:border-white/20"
                          placeholder="16px"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-2 block">Margin</label>
                        <input
                          value={selectedElement.styles.margin || ''}
                          onChange={(e) => updateElementStyle(selectedElement.id, 'margin', e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-3 py-2.5 transition-colors focus:outline-none focus:ring-0 focus:border-white/20"
                          placeholder="0px"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500 mb-2 block">Zaoblení rohů</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={parseInt(selectedElement.styles.borderRadius || '0')}
                            onChange={(e) => updateElementStyle(selectedElement.id, 'borderRadius', `${e.target.value}px`)}
                            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                          />
                          <input
                            value={selectedElement.styles.borderRadius || ''}
                            onChange={(e) => updateElementStyle(selectedElement.id, 'borderRadius', e.target.value)}
                            className="w-16 bg-white/[0.04] border border-white/[0.08] text-white text-xs rounded-lg px-2 py-2 text-center transition-colors focus:outline-none focus:ring-0 focus:border-white/20"
                            placeholder="0px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="relative p-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/10 transition-all duration-300">
                      <Copy className="w-4 h-4" />
                      <span>Duplikovat</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 transition-all duration-300">
                      <Trash2 className="w-4 h-4" />
                      <span>Smazat</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="relative flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div
                    className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor}15, ${themeColor}05)`,
                      boxShadow: `0 0 40px ${themeColor}10`,
                    }}
                  >
                    <MousePointer2 className="w-8 h-8" style={{ color: themeColor }} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Žádný výběr</h3>
                  <p className="text-gray-500 text-sm max-w-[200px] mx-auto">
                    Klikněte na prvek v náhledu nebo ve vrstvách pro úpravu
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="relative flex items-center justify-between px-4 py-2 border-t border-white/[0.06] text-xs">
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-green-500" />
              <span>Připojeno</span>
            </span>
            <span>•</span>
            <span>{elements.length} sekcí</span>
            <span>•</span>
            <span>Naposledy uloženo: právě teď</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>Ctrl+S uložit</span>
            <span>•</span>
            <span>Ctrl+Z zpět</span>
          </div>
        </div>
      </div>
    </div>
  );
}
