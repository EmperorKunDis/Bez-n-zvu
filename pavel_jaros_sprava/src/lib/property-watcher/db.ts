import { PrismaClient, Property, Status } from '@prisma/client';
import {
  PropertyData,
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyNotFoundError,
  getImagePath,
} from '../types/property';

// Prisma Client singleton
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Database operations pro Property Management System
 */
export class PropertyDatabase {
  /**
   * Vytvoř novou nemovitost v databázi
   */
  async createProperty(input: CreatePropertyInput): Promise<Property> {
    const { folderId, status, data } = input;

    try {
      const property = await prisma.property.create({
        data: {
          folderId,
          status,
          title: data.title,
          subtitle: data.subtitle,
          address: data.address,
          price: data.price || null,
          description: data.description,
          disposition: data.disposition || null,
          area: data.area || null,
          floors: data.floors || null,
          details: JSON.stringify(data.details),
          mainImage: getImagePath(folderId, status, data.images[0]),
          images: JSON.stringify(
            data.images.map(img => getImagePath(folderId, status, img))
          ),
          youtubeUrl: data.youtubeUrl || null,
          googleMapUrl: data.googleMapUrl || null,
        },
      });

      console.log(`[DB] ✓ Created property: ${folderId} (${status})`);
      return property;

    } catch (error) {
      console.error(`[DB] ✗ Failed to create property ${folderId}:`, error);
      throw error;
    }
  }

  /**
   * Aktualizuj existující nemovitost
   */
  async updateProperty(input: UpdatePropertyInput): Promise<Property> {
    const { folderId, data, status } = input;

    try {
      // Najdi property
      const existing = await this.getPropertyByFolderId(folderId);
      if (!existing) {
        throw new PropertyNotFoundError(folderId);
      }

      // Připrav update data
      const updateData: any = {};

      if (data) {
        if (data.title) updateData.title = data.title;
        if (data.subtitle) updateData.subtitle = data.subtitle;
        if (data.address) updateData.address = data.address;
        if (data.price !== undefined) updateData.price = data.price || null;
        if (data.description) updateData.description = data.description;
        if (data.disposition !== undefined) updateData.disposition = data.disposition || null;
        if (data.area !== undefined) updateData.area = data.area || null;
        if (data.floors !== undefined) updateData.floors = data.floors || null;
        if (data.details) updateData.details = JSON.stringify(data.details);
        if (data.youtubeUrl !== undefined) updateData.youtubeUrl = data.youtubeUrl || null;
        if (data.googleMapUrl !== undefined) updateData.googleMapUrl = data.googleMapUrl || null;

        // Update images pokud jsou k dispozici
        if (data.images && data.images.length > 0) {
          const currentStatus = status || existing.status;
          updateData.mainImage = getImagePath(folderId, currentStatus, data.images[0]);
          updateData.images = JSON.stringify(
            data.images.map(img => getImagePath(folderId, currentStatus, img))
          );
        }
      }

      if (status) {
        updateData.status = status;

        // Pokud se mění status, musíme aktualizovat i cesty k obrázkům
        const currentImages = JSON.parse(existing.images) as string[];
        const imageNames = currentImages.map(path => path.split('/').pop()!);

        updateData.mainImage = getImagePath(folderId, status, imageNames[0]);
        updateData.images = JSON.stringify(
          imageNames.map(img => getImagePath(folderId, status, img))
        );
      }

      const property = await prisma.property.update({
        where: { folderId },
        data: updateData,
      });

      console.log(`[DB] ✓ Updated property: ${folderId}`);
      return property;

    } catch (error) {
      console.error(`[DB] ✗ Failed to update property ${folderId}:`, error);
      throw error;
    }
  }

  /**
   * Smaž nemovitost z databáze
   */
  async deleteProperty(folderId: string): Promise<void> {
    try {
      await prisma.property.delete({
        where: { folderId },
      });

      console.log(`[DB] ✓ Deleted property: ${folderId}`);

    } catch (error) {
      // Pokud nemovitost neexistuje, není to chyba
      if ((error as any).code === 'P2025') {
        console.log(`[DB] ⚠ Property ${folderId} already deleted or doesn't exist`);
        return;
      }

      console.error(`[DB] ✗ Failed to delete property ${folderId}:`, error);
      throw error;
    }
  }

  /**
   * Přesuň nemovitost (změň status)
   */
  async moveProperty(folderId: string, newStatus: Status): Promise<Property> {
    return this.updateProperty({
      folderId,
      status: newStatus,
    });
  }

  /**
   * Najdi nemovitost podle folderId
   */
  async getPropertyByFolderId(folderId: string): Promise<Property | null> {
    try {
      return await prisma.property.findUnique({
        where: { folderId },
      });
    } catch (error) {
      console.error(`[DB] ✗ Failed to get property ${folderId}:`, error);
      return null;
    }
  }

  /**
   * Získej všechny nemovitosti (s filtrem)
   */
  async getAllProperties(filter?: { status?: Status }): Promise<Property[]> {
    try {
      return await prisma.property.findMany({
        where: filter?.status ? { status: filter.status } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('[DB] ✗ Failed to get all properties:', error);
      return [];
    }
  }

  /**
   * Získej statistiky nemovitostí
   */
  async getStats(): Promise<{
    total: number;
    prodej: number;
    pronajem: number;
    hotovo: number;
  }> {
    try {
      const [total, prodej, pronajem, hotovo] = await Promise.all([
        prisma.property.count(),
        prisma.property.count({ where: { status: Status.PRODEJ } }),
        prisma.property.count({ where: { status: Status.PRONAJEM } }),
        prisma.property.count({ where: { status: Status.HOTOVO } }),
      ]);

      return { total, prodej, pronajem, hotovo };

    } catch (error) {
      console.error('[DB] ✗ Failed to get stats:', error);
      return { total: 0, prodej: 0, pronajem: 0, hotovo: 0 };
    }
  }

  /**
   * Kontrola existence nemovitosti
   */
  async propertyExists(folderId: string): Promise<boolean> {
    const property = await this.getPropertyByFolderId(folderId);
    return property !== null;
  }

  /**
   * Vymaž všechny nemovitosti (pro testing)
   */
  async deleteAll(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('deleteAll() is not allowed in production');
    }

    await prisma.property.deleteMany({});
    console.log('[DB] ✓ Deleted all properties');
  }
}

// Export singleton instance
export const propertyDb = new PropertyDatabase();
