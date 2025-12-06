"use client";

import { useState, useEffect } from 'react';
import { Check, Save, RefreshCw, Palette, Sparkles } from 'lucide-react';

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

interface ThemeSettingsProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: 'Modrá', value: '#2563eb', tailwind: 'blue-600' },
  { name: 'Červená', value: '#b91c1c', tailwind: 'red-700' },
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
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: colors.dark }}>
          <Palette className="w-5 h-5" style={{ color: selectedColor }} />
          Nastavení motivu
        </h2>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          Přizpůsobte si barvy administračního panelu
        </p>
      </div>

      {/* Color Section */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-5 w-5" style={{ color: selectedColor }} />
          <h3 className="font-medium" style={{ color: colors.dark }}>Barva motivu</h3>
        </div>

        {/* Preset Colors Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-6">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className={`relative w-full aspect-square rounded-xl transition-all hover:scale-105 ${
                selectedColor === color.value ? 'ring-2 ring-offset-2 ring-offset-white' : ''
              }`}
              style={{
                backgroundColor: color.value,
                ringColor: color.value
              }}
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
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: selectedColor === color.value ? color.value : colors.background,
                color: selectedColor === color.value ? 'white' : colors.textSecondary,
                border: `1px solid ${selectedColor === color.value ? color.value : colors.border}`
              }}
            >
              {color.name}
            </button>
          ))}
        </div>

        {/* Custom Color Picker */}
        <div
          className="flex items-center gap-4 p-4 rounded-xl"
          style={{ backgroundColor: colors.background }}
        >
          <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
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
              placeholder="#2563eb"
              className="w-28 px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                color: colors.dark
              }}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`
        }}
      >
        <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>Náhled komponent:</p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            className="px-5 py-2.5 rounded-lg text-white font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: selectedColor }}
          >
            Primární tlačítko
          </button>
          <button
            className="px-5 py-2.5 rounded-lg font-medium border-2 bg-transparent transition-all"
            style={{
              borderColor: selectedColor,
              color: selectedColor
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${selectedColor}10`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
            style={{ backgroundColor: `${selectedColor}15` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: selectedColor }} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: saved ? colors.success : selectedColor }}
      >
        {saving ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Ukládám...
          </>
        ) : saved ? (
          <>
            <Check className="h-4 w-4" />
            Uloženo!
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Uložit změny
          </>
        )}
      </button>

      {/* Info Note */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: `${colors.primary}08`,
          border: `1px solid ${colors.primary}20`
        }}
      >
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          <span className="font-medium" style={{ color: colors.dark }}>Poznámka:</span> Změna barvy se projeví okamžitě v administračním panelu.
          Pro změnu barvy na produkčním webu je potřeba upravit CSS proměnné nebo Tailwind třídy v komponentách.
        </p>
      </div>
    </div>
  );
}
