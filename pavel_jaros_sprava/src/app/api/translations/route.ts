import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUPPORTED_LOCALES = ['cs', 'en', 'de', 'pl', 'sk', 'ru'];

// GET - Read translations for a locale
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'cs';

  if (!SUPPORTED_LOCALES.includes(locale)) {
    return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const translations = JSON.parse(content);
    return NextResponse.json({ locale, translations });
  } catch (error) {
    console.error('Error reading translations:', error);
    return NextResponse.json({ error: 'Failed to read translations' }, { status: 500 });
  }
}

// POST - Save translations for a locale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale, translations } = body;

    if (!locale || !translations) {
      return NextResponse.json({ error: 'Missing locale or translations' }, { status: 400 });
    }

    if (!SUPPORTED_LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);

    // Validate JSON structure
    const jsonContent = JSON.stringify(translations, null, 2);

    // Write to file
    await fs.writeFile(filePath, jsonContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: `Translations for ${locale} saved successfully`,
      locale
    });
  } catch (error) {
    console.error('Error saving translations:', error);
    return NextResponse.json({ error: 'Failed to save translations' }, { status: 500 });
  }
}

// PUT - Update specific translation key
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale, key, value } = body;

    if (!locale || !key || value === undefined) {
      return NextResponse.json({ error: 'Missing locale, key, or value' }, { status: 400 });
    }

    if (!SUPPORTED_LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);

    // Read current translations
    const content = await fs.readFile(filePath, 'utf-8');
    const translations = JSON.parse(content);

    // Update nested key (e.g., "hero.title")
    const keys = key.split('.');
    let current = translations;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    // Write back
    await fs.writeFile(filePath, JSON.stringify(translations, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: `Key ${key} updated for ${locale}`,
      locale,
      key,
      value
    });
  } catch (error) {
    console.error('Error updating translation:', error);
    return NextResponse.json({ error: 'Failed to update translation' }, { status: 500 });
  }
}
