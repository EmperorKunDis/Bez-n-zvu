"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, RefreshCw, Eye, EyeOff, ChevronDown, ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['hero']));
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

  const renderField = (sectionId: string, field: ContentField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            <Textarea
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              rows={4}
              className="w-full resize-y"
            />
          </div>
        );

      case 'image':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            <div className="flex gap-2">
              <Input
                value={field.value}
                onChange={(e) => updateField(sectionId, field.key, e.target.value)}
                placeholder="URL obrázku..."
                className="flex-1"
              />
              {field.value && (
                <div className="w-16 h-10 rounded border overflow-hidden flex-shrink-0">
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
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            <Input
              type="url"
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              placeholder="https://..."
              className="w-full"
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            <Input
              type="number"
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              className="w-full"
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={field.key} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={field.value === 'true'}
              onChange={(e) => updateField(sectionId, field.key, e.target.checked ? 'true' : 'false')}
              className="w-5 h-5 rounded border-gray-300"
              style={{ accentColor: themeColor }}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            <Input
              value={field.value}
              onChange={(e) => updateField(sectionId, field.key, e.target.value)}
              className="w-full"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Upravte obsah jednotlivých sekcí webu
        </p>
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
          <Card key={section.id} className="overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  {section.description && (
                    <p className="text-sm text-gray-500">{section.description}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {section.fields.length} polí
              </span>
            </button>

            {expandedSections.has(section.id) && (
              <CardContent className="border-t bg-gray-50 space-y-4 p-6">
                {section.fields.map((field) => renderField(section.id, field))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
