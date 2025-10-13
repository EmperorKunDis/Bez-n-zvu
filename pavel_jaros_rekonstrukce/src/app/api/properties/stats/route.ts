import { NextRequest, NextResponse } from 'next/server';
import { propertyDb } from '@/lib/property-watcher/db';

/**
 * GET /api/properties/stats
 *
 * Získej statistiky nemovitostí
 *
 * Response:
 *   {
 *     total: number,
 *     prodej: number,
 *     pronajem: number,
 *     hotovo: number,
 *   }
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await propertyDb.getStats();

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });

  } catch (error) {
    console.error('API Error [GET /api/properties/stats]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
