"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
  Folder
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
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            style={viewMode === 'grid' ? { backgroundColor: themeColor } : {}}
            className={viewMode === 'grid' ? 'text-white' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            style={viewMode === 'list' ? { backgroundColor: themeColor } : {}}
            className={viewMode === 'list' ? 'text-white' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {filteredImages.length} obrázků
          </span>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'text-white'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            style={selectedCategory === null ? { backgroundColor: themeColor } : {}}
          >
            Vše
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
              style={selectedCategory === category ? { backgroundColor: themeColor } : {}}
            >
              <Folder className="h-3 w-3" />
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hledat obrázky..."
          className="pl-10"
        />
      </div>

      {/* Images Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img, index) => (
            <Card key={img.path + index} className="overflow-hidden group">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={getImageUrl(img)}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">No Image</text></svg>';
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyPath(img.path)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Kopírovat cestu"
                  >
                    {copiedPath === img.path ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-700" />
                    )}
                  </button>
                  <a
                    href={getImageUrl(img)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Otevřít v novém okně"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-700" />
                  </a>
                </div>

                {/* Type Badge */}
                {img.type === 'external' && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                    Externí
                  </div>
                )}
              </div>
              <CardContent className="p-2">
                <p className="text-xs text-gray-600 truncate" title={img.name}>
                  {img.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredImages.map((img, index) => (
            <Card key={img.path + index}>
              <CardContent className="p-3 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={getImageUrl(img)}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">No Image</text></svg>';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{img.name}</p>
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
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                      Externí
                    </span>
                  )}
                  <button
                    onClick={() => copyPath(img.path)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Kopírovat cestu"
                  >
                    {copiedPath === img.path ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  <a
                    href={getImageUrl(img)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Otevřít v novém okně"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredImages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Žádné obrázky nenalezeny</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-2">Jak přidávat obrázky:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Nahrajte soubory do složky <code className="bg-blue-100 px-1 rounded">public/images/</code></li>
          <li>Pro logo použijte složku <code className="bg-blue-100 px-1 rounded">public/logo/</code></li>
          <li>Externí obrázky lze použít pomocí URL (např. Unsplash)</li>
        </ul>
      </div>
    </div>
  );
}
