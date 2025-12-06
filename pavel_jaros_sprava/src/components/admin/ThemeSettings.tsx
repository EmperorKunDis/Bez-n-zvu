"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Save, RefreshCw, Palette } from 'lucide-react';

interface ThemeSettingsProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: 'Červená', value: '#b91c1c', tailwind: 'red-700' },
  { name: 'Modrá', value: '#2563eb', tailwind: 'blue-600' },
  { name: 'Zelená', value: '#15803d', tailwind: 'green-700' },
  { name: 'Fialová', value: '#7c3aed', tailwind: 'violet-600' },
  { name: 'Oranžová', value: '#ea580c', tailwind: 'orange-600' },
  { name: 'Růžová', value: '#db2777', tailwind: 'pink-600' },
  { name: 'Tyrkysová', value: '#0891b2', tailwind: 'cyan-600' },
  { name: 'Tmavě šedá', value: '#374151', tailwind: 'gray-700' },
];

export function ThemeSettings({ currentColor, onColorChange }: ThemeSettingsProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [customColor, setCustomColor] = useState(currentColor);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved color from localStorage
    const savedColor = localStorage.getItem('admin-theme-color');
    if (savedColor) {
      setSelectedColor(savedColor);
      setCustomColor(savedColor);
    }
  }, []);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('admin-theme-color', selectedColor);
      onColorChange(selectedColor);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving theme:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="h-6 w-6 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Barva motivu</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Vyberte hlavní barvu pro administrační panel a tlačítka na webu.
          </p>

          {/* Preset Colors */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-6">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={`relative w-full aspect-square rounded-lg transition-all hover:scale-105 ${
                  selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-900' : ''
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {selectedColor === color.value && (
                  <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>

          {/* Color Names */}
          <div className="flex flex-wrap gap-2 mb-6">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedColor === color.value
                    ? 'text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
                style={selectedColor === color.value ? { backgroundColor: color.value } : {}}
              >
                {color.name}
              </button>
            ))}
          </div>

          {/* Custom Color Picker */}
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-700">
              Vlastní barva:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setSelectedColor(e.target.value);
                }}
                className="w-12 h-10 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    setSelectedColor(e.target.value);
                  }
                }}
                placeholder="#b91c1c"
                className="w-28 px-3 py-2 border rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-3">Náhled:</p>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: selectedColor }}
              >
                Primární tlačítko
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium border-2"
                style={{ borderColor: selectedColor, color: selectedColor }}
              >
                Sekundární tlačítko
              </button>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: selectedColor }}
              >
                Badge
              </span>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="text-white"
            style={{ backgroundColor: selectedColor }}
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Ukládám...
              </>
            ) : saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Uloženo!
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Uložit barvu
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-900 mb-3">Poznámka</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Změna barvy se projeví okamžitě v administračním panelu.
            Pro změnu barvy na produkčním webu je potřeba upravit CSS proměnné
            v souboru <code className="bg-gray-100 px-1 rounded">global.css</code> nebo
            třídy Tailwind v komponentách.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
