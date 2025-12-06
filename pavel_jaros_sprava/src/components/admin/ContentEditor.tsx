"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, RefreshCw, ChevronDown, ChevronRight, Image as ImageIcon, Type, Link, Hash, ToggleLeft } from 'lucide-react';

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

  const renderField = (sectionId: string, field: ContentField) => {
    const baseInputClass = "bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-white/30 focus:ring-0";

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium text-gray-300">
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 ml-6">{field.description}</p>
            )}
            <Textarea
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              rows={4}
              className={`${baseInputClass} w-full resize-y ml-6`}
            />
          </div>
        );

      case 'image':
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium text-gray-300">
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 ml-6">{field.description}</p>
            )}
            <div className="flex gap-3 ml-6">
              <Input
                value={field.value}
                onChange={(e) => updateField(sectionId, field.key, e.target.value)}
                placeholder="URL obrázku..."
                className={`${baseInputClass} flex-1`}
              />
              {field.value && (
                <div className="w-20 h-10 rounded-lg border border-white/10 overflow-hidden flex-shrink-0 bg-[#0a0a0a]">
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
              <span className="text-gray-500">{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium text-gray-300">
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 ml-6">{field.description}</p>
            )}
            <Input
              type="url"
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              placeholder="https://..."
              className={`${baseInputClass} w-full ml-6`}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium text-gray-300">
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 ml-6">{field.description}</p>
            )}
            <Input
              type="number"
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              className={`${baseInputClass} w-full ml-6`}
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
              className="w-5 h-5 rounded border-white/20 bg-[#0a0a0a]"
              style={{ accentColor: themeColor }}
            />
            <div>
              <label className="text-sm font-medium text-gray-300">
                {field.label}
              </label>
              {field.description && (
                <p className="text-xs text-gray-500">{field.description}</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{getFieldIcon(field.type)}</span>
              <label className="text-sm font-medium text-gray-300">
                {field.label}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 ml-6">{field.description}</p>
            )}
            <Input
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              className={`${baseInputClass} w-full ml-6`}
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
          <h2 className="text-lg font-semibold text-white">Úprava obsahu</h2>
          <p className="text-sm text-gray-500">
            Upravte obsah jednotlivých sekcí webu
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="text-white"
          style={{ backgroundColor: themeColor }}
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Ukládám...
            </>
          ) : saved ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Uloženo!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Uložit změny
            </>
          )}
        </Button>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </span>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{section.title}</h3>
                  {section.description && (
                    <p className="text-sm text-gray-500">{section.description}</p>
                  )}
                </div>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
              >
                {section.fields.length} polí
              </span>
            </button>

            {expandedSections.has(section.id) && (
              <div className="border-t border-white/10 p-5 space-y-5 bg-[#0a0a0a]/50">
                {section.fields.map((field) => renderField(section.id, field))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
