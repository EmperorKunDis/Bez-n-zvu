"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5" style={{ color: themeColor }} />
            Správa médií
          </h2>
          <p className="text-sm text-gray-500">
            Spravujte obrázky a média webu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0a0a0a] rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {filteredImages.length} obrázků
          </span>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'text-white'
                : 'text-gray-400 bg-[#0a0a0a] border border-white/10 hover:border-white/20'
            }`}
            style={selectedCategory === null ? {
              backgroundColor: `${themeColor}20`,
              border: `1px solid ${themeColor}40`
            } : {}}
          >
            Vše
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-gray-400 bg-[#0a0a0a] border border-white/10 hover:border-white/20'
              }`}
              style={selectedCategory === category ? {
                backgroundColor: `${themeColor}20`,
                border: `1px solid ${themeColor}40`
              } : {}}
            >
              <Folder className="h-3 w-3" />
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hledat obrázky..."
          className="pl-11 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-white/30 focus:ring-0"
        />
      </div>

      {/* Images Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img, index) => (
            <div key={img.path + index} className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden group hover:border-white/20 transition-all">
              <div className="relative aspect-square bg-[#1a1a1a]">
                <img
                  src={getImageUrl(img)}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%231a1a1a" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23525252" font-size="10">No Image</text></svg>';
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyPath(img.path)}
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
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
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                    title="Otevřít v novém okně"
                  >
                    <ExternalLink className="h-4 w-4 text-white" />
                  </a>
                </div>

                {/* Type Badge */}
                {img.type === 'external' && (
                  <div
                    className="absolute top-2 right-2 text-white text-xs px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: themeColor }}
                  >
                    Externí
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm text-white truncate" title={img.name}>
                  {img.name}
                </p>
                {img.category && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
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
            <div key={img.path + index} className="bg-[#0a0a0a] rounded-xl border border-white/10 p-3 flex items-center gap-4 hover:border-white/20 transition-all">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={getImageUrl(img)}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%231a1a1a" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23525252" font-size="10">No Image</text></svg>';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{img.name}</p>
                <p className="text-xs text-gray-500 truncate font-mono">{img.path}</p>
                {img.category && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Folder className="h-3 w-3" />
                    {img.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {img.type === 'external' && (
                  <span
                    className="text-white text-xs px-2 py-1 rounded-md"
                    style={{ backgroundColor: `${themeColor}40` }}
                  >
                    Externí
                  </span>
                )}
                <button
                  onClick={() => copyPath(img.path)}
                  className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Kopírovat cestu"
                >
                  {copiedPath === img.path ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <a
                  href={getImageUrl(img)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500">Žádné obrázky nenalezeny</p>
        </div>
      )}

      {/* Info */}
      <div
        className="rounded-xl p-4 text-sm border"
        style={{
          backgroundColor: `${themeColor}10`,
          borderColor: `${themeColor}30`
        }}
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: themeColor }} />
          <div>
            <p className="font-medium text-white mb-2">Jak přidávat obrázky:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Nahrajte soubory do složky <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: `${themeColor}20` }}>public/images/</code></li>
              <li>Pro logo použijte složku <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: `${themeColor}20` }}>public/logo/</code></li>
              <li>Externí obrázky lze použít pomocí URL</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
