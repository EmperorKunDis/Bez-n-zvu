"use client";

import { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  Grid,
  List,
  ExternalLink,
  Folder,
  Info
} from 'lucide-react';

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

interface ImageItem {
  path: string;
  name: string;
  type: 'local' | 'external';
  category?: string;
}

interface ImageManagerProps {
  images: ImageItem[];
  themeColor: string;
  onUpload?: (file: File) => void;
  onDelete?: (path: string) => void;
}

export function ImageManager({ images, themeColor, onUpload, onDelete }: ImageManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const categories = Array.from(new Set(images.map(img => img.category).filter(Boolean))) as string[];

  const filteredImages = images.filter(img => {
    const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          img.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || img.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const getImageUrl = (img: ImageItem) => {
    if (img.type === 'external') return img.path;
    return img.path;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: colors.dark }}>
            <ImageIcon className="w-5 h-5" style={{ color: colors.primary }} />
            Správa médií
          </h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Spravujte obrázky a média webu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center rounded-lg p-1"
            style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 rounded-md transition-colors"
              style={{
                backgroundColor: viewMode === 'grid' ? colors.surface : 'transparent',
                color: viewMode === 'grid' ? colors.primary : colors.textMuted,
                boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-2 rounded-md transition-colors"
              style={{
                backgroundColor: viewMode === 'list' ? colors.surface : 'transparent',
                color: viewMode === 'list' ? colors.primary : colors.textMuted,
                boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm" style={{ color: colors.textMuted }}>
            {filteredImages.length} obrázků
          </span>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: selectedCategory === null ? `${colors.primary}10` : colors.surface,
              color: selectedCategory === null ? colors.primary : colors.textSecondary,
              border: `1px solid ${selectedCategory === null ? colors.primary : colors.border}`
            }}
          >
            Vše
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={{
                backgroundColor: selectedCategory === category ? `${colors.primary}10` : colors.surface,
                color: selectedCategory === category ? colors.primary : colors.textSecondary,
                border: `1px solid ${selectedCategory === category ? colors.primary : colors.border}`
              }}
            >
              <Folder className="h-3 w-3" />
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4"
          style={{ color: colors.textMuted }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hledat obrázky..."
          className="w-full h-11 pl-11 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.dark
          }}
        />
      </div>

      {/* Images Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img, index) => (
            <div
              key={img.path + index}
              className="rounded-xl overflow-hidden group transition-all hover:shadow-md"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="relative aspect-square" style={{ backgroundColor: colors.background }}>
                <img
                  src={getImageUrl(img)}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23F8FAFC" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%2394A3B8" font-size="10">No Image</text></svg>';
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyPath(img.path)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    title="Kopírovat cestu"
                  >
                    {copiedPath === img.path ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-white" />
                    )}
                  </button>
                  <a
                    href={getImageUrl(img)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    title="Otevřít v novém okně"
                  >
                    <ExternalLink className="h-4 w-4 text-white" />
                  </a>
                </div>

                {/* Type Badge */}
                {img.type === 'external' && (
                  <div
                    className="absolute top-2 right-2 text-white text-xs px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Externí
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm truncate" style={{ color: colors.dark }} title={img.name}>
                  {img.name}
                </p>
                {img.category && (
                  <p className="text-xs flex items-center gap-1 mt-1" style={{ color: colors.textMuted }}>
                    <Folder className="h-3 w-3" />
                    {img.category}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredImages.map((img, index) => (
            <div
              key={img.path + index}
              className="rounded-xl p-3 flex items-center gap-4 transition-all hover:shadow-md"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <div
                className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                style={{ backgroundColor: colors.background }}
              >
                <img
                  src={getImageUrl(img)}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23F8FAFC" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%2394A3B8" font-size="10">No Image</text></svg>';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" style={{ color: colors.dark }}>{img.name}</p>
                <p className="text-xs truncate font-mono" style={{ color: colors.textMuted }}>{img.path}</p>
                {img.category && (
                  <span className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: colors.textMuted }}>
                    <Folder className="h-3 w-3" />
                    {img.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {img.type === 'external' && (
                  <span
                    className="text-xs px-2 py-1 rounded-md"
                    style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                  >
                    Externí
                  </span>
                )}
                <button
                  onClick={() => copyPath(img.path)}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                  style={{ color: copiedPath === img.path ? colors.success : colors.textMuted }}
                  title="Kopírovat cestu"
                >
                  {copiedPath === img.path ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <a
                  href={getImageUrl(img)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                  style={{ color: colors.textMuted }}
                  title="Otevřít v novém okně"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredImages.length === 0 && (
        <div
          className="text-center py-12 rounded-xl"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`
          }}
        >
          <ImageIcon className="h-12 w-12 mx-auto mb-4" style={{ color: colors.textMuted }} />
          <p style={{ color: colors.textSecondary }}>Žádné obrázky nenalezeny</p>
        </div>
      )}

      {/* Info */}
      <div
        className="rounded-xl p-4 text-sm"
        style={{
          backgroundColor: `${colors.primary}08`,
          border: `1px solid ${colors.primary}20`
        }}
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
          <div>
            <p className="font-medium mb-2" style={{ color: colors.dark }}>Jak přidávat obrázky:</p>
            <ul className="list-disc list-inside space-y-1" style={{ color: colors.textSecondary }}>
              <li>Nahrajte soubory do složky <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>public/images/</code></li>
              <li>Pro logo použijte složku <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>public/logo/</code></li>
              <li>Externí obrázky lze použít pomocí URL</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
