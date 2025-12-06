"use client";

import { useState } from 'react';
import { Save, RefreshCw, ChevronDown, ChevronRight, Image as ImageIcon, Type, Link, Hash, ToggleLeft, Check } from 'lucide-react';

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

interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'url' | 'number' | 'boolean';
  value: string;
  description?: string;
}

interface ContentSection {
  id: string;
  title: string;
  description?: string;
  fields: ContentField[];
}

interface ContentEditorProps {
  sections: ContentSection[];
  onSave: (sections: ContentSection[]) => void;
  themeColor: string;
}

export function ContentEditor({ sections: initialSections, onSave, themeColor }: ContentEditorProps) {
  const [sections, setSections] = useState<ContentSection[]>(initialSections);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(initialSections.map(s => s.id)));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const updateField = (sectionId: string, fieldKey: string, value: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.key === fieldKey ? { ...field, value } : field
              )
            }
          : section
      )
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(sections);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'textarea': return <Type className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'url': return <Link className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      case 'boolean': return <ToggleLeft className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const inputStyle = {
    backgroundColor: colors.background,
    border: `1px solid ${colors.border}`,
    color: colors.dark,
  };

  const renderField = (sectionId: string, field: ContentField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span style={{ color: colors.textMuted }}>{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium" style={{ color: colors.dark }}>
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs ml-6" style={{ color: colors.textMuted }}>{field.description}</p>
            )}
            <textarea
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-sm resize-y ml-6 focus:outline-none focus:ring-2"
              style={inputStyle}
            />
          </div>
        );

      case 'image':
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span style={{ color: colors.textMuted }}>{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium" style={{ color: colors.dark }}>
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs ml-6" style={{ color: colors.textMuted }}>{field.description}</p>
            )}
            <div className="flex gap-3 ml-6">
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateField(sectionId, field.key, e.target.value)}
                placeholder="URL obrázku..."
                className="flex-1 h-11 px-4 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={inputStyle}
              />
              {field.value && (
                <div
                  className="w-20 h-11 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  <img
                    src={field.value}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'url':
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span style={{ color: colors.textMuted }}>{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium" style={{ color: colors.dark }}>
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs ml-6" style={{ color: colors.textMuted }}>{field.description}</p>
            )}
            <input
              type="url"
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              placeholder="https://..."
              className="w-full h-11 px-4 rounded-lg text-sm ml-6 focus:outline-none focus:ring-2"
              style={inputStyle}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span style={{ color: colors.textMuted }}>{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium" style={{ color: colors.dark }}>
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs ml-6" style={{ color: colors.textMuted }}>{field.description}</p>
            )}
            <input
              type="number"
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              className="w-full h-11 px-4 rounded-lg text-sm ml-6 focus:outline-none focus:ring-2"
              style={inputStyle}
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={field.key} className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              checked={field.value === 'true'}
              onChange={(e) => updateField(sectionId, field.key, e.target.checked ? 'true' : 'false')}
              className="w-5 h-5 rounded"
              style={{ accentColor: colors.primary }}
            />
            <div>
              <label className="text-sm font-medium" style={{ color: colors.dark }}>
                {field.label}
              </label>
              {field.description && (
                <p className="text-xs" style={{ color: colors.textMuted }}>{field.description}</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span style={{ color: colors.textMuted }}>{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium" style={{ color: colors.dark }}>
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs ml-6" style={{ color: colors.textMuted }}>{field.description}</p>
            )}
            <input
              type="text"
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              className="w-full h-11 px-4 rounded-lg text-sm ml-6 focus:outline-none focus:ring-2"
              style={inputStyle}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: colors.dark }}>Úprava obsahu</h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Upravte obsah jednotlivých sekcí webu
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: saved ? colors.success : colors.primary }}
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
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-5 py-4 flex items-center justify-between transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span style={{ color: colors.textSecondary }}>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </span>
                <div className="text-left">
                  <h3 className="font-semibold" style={{ color: colors.dark }}>{section.title}</h3>
                  {section.description && (
                    <p className="text-sm" style={{ color: colors.textMuted }}>{section.description}</p>
                  )}
                </div>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
              >
                {section.fields.length} polí
              </span>
            </button>

            {expandedSections.has(section.id) && (
              <div
                className="p-5 space-y-5"
                style={{
                  borderTop: `1px solid ${colors.border}`,
                  backgroundColor: colors.background
                }}
              >
                {section.fields.map((field) => renderField(section.id, field))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
