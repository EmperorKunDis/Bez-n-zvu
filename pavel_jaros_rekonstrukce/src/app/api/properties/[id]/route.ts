import { NextRequest, NextResponse } from 'next/server';
import { propertyDb } from '@/lib/property-watcher/db';

/**
 * GET /api/properties/[id]
 *
 * Získej detail konkrétní nemovitosti
 *
 * Response:
 *   {
 *     id: string,
 *     folderId: string,
 *     status: string,
 *     title: string,
 *     subtitle: string,
 *     address: string,
 *     price: string | null,
 *     description: string,
 *     disposition: string | null,
 *     area: number | null,
 *     floors: number | null,
 *     details: object,
 *     mainImage: string,
 *     images: string[],
 *     youtubeUrl: string | null,
 *     googleMapUrl: string | null,
 *     createdAt: string,
 *     updatedAt: string,
 *   }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Načti nemovitost z DB
    const property = await propertyDb.getPropertyByFolderId(id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const details = JSON.parse(property.details);
    const images = JSON.parse(property.images);

    // Formátuj response (kompletní info včetně popisu)
    const response = {
      id: property.id,
      folderId: property.folderId,
      status: property.status,
      title: property.title,
      subtitle: property.subtitle,
      address: property.address,
      price: property.price,
      description: property.description,
      disposition: property.disposition,
      area: property.area,
      floors: property.floors,
      details,
      mainImage: property.mainImage,
      images,
      youtubeUrl: property.youtubeUrl,
      googleMapUrl: property.googleMapUrl,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });

  } catch (error) {
    console.error('API Error [GET /api/properties/[id]]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}
