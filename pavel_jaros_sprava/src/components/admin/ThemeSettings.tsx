"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Save, RefreshCw, Palette, Sparkles } from 'lucide-react';

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
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Palette className="w-5 h-5" style={{ color: selectedColor }} />
          Nastavení motivu
        </h2>
        <p className="text-sm text-gray-500">
          Přizpůsobte si barvy administračního panelu
        </p>
      </div>

      {/* Color Section */}
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-5 w-5" style={{ color: selectedColor }} />
          <h3 className="font-medium text-white">Barva motivu</h3>
        </div>

        {/* Preset Colors Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-6">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className={`relative w-full aspect-square rounded-xl transition-all hover:scale-105 ${
                selectedColor === color.value ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-white' : ''
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {selectedColor === color.value && (
                <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-lg" />
              )}
            </button>
          ))}
        </div>

        {/* Color Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedColor === color.value
                  ? 'text-white'
                  : 'text-gray-400 bg-white/5 hover:bg-white/10'
              }`}
              style={selectedColor === color.value ? {
                backgroundColor: color.value,
                boxShadow: `0 0 20px ${color.value}40`
              } : {}}
            >
              {color.name}
            </button>
          ))}
        </div>

        {/* Custom Color Picker */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
          <label className="text-sm font-medium text-gray-400">
            Vlastní barva:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setSelectedColor(e.target.value);
              }}
              className="w-12 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
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
              className="w-28 px-3 py-2 bg-[#141414] border border-white/10 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-white/30"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-6">
        <p className="text-sm text-gray-400 mb-4">Náhled komponent:</p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            className="px-5 py-2.5 rounded-xl text-white font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: selectedColor,
              boxShadow: `0 0 20px ${selectedColor}30`
            }}
          >
            Primární tlačítko
          </button>
          <button
            className="px-5 py-2.5 rounded-xl font-medium border-2 bg-transparent transition-all hover:bg-white/5"
            style={{ borderColor: selectedColor, color: selectedColor }}
          >
            Sekundární tlačítko
          </button>
          <span
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: selectedColor }}
          >
            Badge
          </span>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${selectedColor}20` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: selectedColor }} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="text-white w-full sm:w-auto"
        style={{
          backgroundColor: selectedColor,
          boxShadow: `0 0 30px ${selectedColor}30`
        }}
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
            Uložit změny
          </>
        )}
      </Button>

      {/* Info Note */}
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-4">
        <p className="text-sm text-gray-400">
          <span className="font-medium text-white">Poznámka:</span> Změna barvy se projeví okamžitě v administračním panelu.
          Pro změnu barvy na produkčním webu je potřeba upravit CSS proměnné nebo Tailwind třídy v komponentách.
        </p>
      </div>
    </div>
  );
}
