import { NextRequest, NextResponse } from 'next/server';
import { Status } from '@prisma/client';
import { propertyDb } from '@/lib/property-watcher/db';

/**
 * GET /api/properties
 *
 * Získej seznam všech nemovitostí (s filtrem)
 *
 * Query params:
 *   - status: 'PRODEJ' | 'PRONAJEM' | 'HOTOVO' (optional)
 *
 * Response:
 *   [
 *     {
 *       id: string,
 *       folderId: string,
 *       status: string,
 *       title: string,
 *       subtitle: string,
 *       address: string,
 *       price: string | null,
 *       disposition: string | null,
 *       area: number | null,
 *       floors: number | null,
 *       mainImage: string,
 *       createdAt: string,
 *       updatedAt: string,
 *     }
 *   ]
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get('status');

    // Validace statusu
    let status: Status | undefined;
    if (statusParam) {
      if (!['PRODEJ', 'PRONAJEM', 'HOTOVO'].includes(statusParam)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be PRODEJ, PRONAJEM, or HOTOVO' },
          { status: 400 }
        );
      }
      status = statusParam as Status;
    }

    // Načti nemovitosti z DB
    const properties = await propertyDb.getAllProperties(status ? { status } : undefined);

    // Formátuj response (vrátíme jen základní info, ne celý popis)
    const response = properties.map(property => ({
      id: property.id,
      folderId: property.folderId,
      status: property.status,
      title: property.title,
      subtitle: property.subtitle,
      address: property.address,
      price: property.price,
      disposition: property.disposition,
      area: property.area,
      floors: property.floors,
      mainImage: property.mainImage,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
    }));

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });

  } catch (error) {
    console.error('API Error [GET /api/properties]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
