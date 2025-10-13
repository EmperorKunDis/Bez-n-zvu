import { z } from 'zod';
import { Status } from '@prisma/client';

// Zod schema pro validaci parsed dat z data.md
export const PropertyDataSchema = z.object({
  // Základní informace
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  address: z.string().min(1, 'Address is required'),
  price: z.string().optional(),

  // Popis
  description: z.string().min(10, 'Description must be at least 10 characters'),

  // Parametry
  disposition: z.string().optional(),
  area: z.number().positive().optional(),
  floors: z.number().positive().int().optional(),

  // Detaily (key-value páry z tabulky)
  details: z.record(z.string(), z.string()),

  // Media
  images: z.array(z.string()).min(1, 'At least one image (img00.jpg) is required'),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  googleMapUrl: z.string().optional(),
});

export type PropertyData = z.infer<typeof PropertyDataSchema>;

// Type pro vytvoření nové nemovitosti v DB
export interface CreatePropertyInput {
  folderId: string;
  status: Status;
  data: PropertyData;
}

// Type pro update nemovitosti v DB
export interface UpdatePropertyInput {
  folderId: string;
  data?: Partial<PropertyData>;
  status?: Status;
}

// Type pro property ve file systému
export interface PropertyFolder {
  path: string;
  folderId: string;
  status: Status;
  dataFile: string;
  imagesDir: string;
}

// Helper pro extrakci statusu z cesty
export function getStatusFromPath(folderPath: string): Status | null {
  if (folderPath.includes('/Prodej/')) return Status.PRODEJ;
  if (folderPath.includes('/Pronajem/')) return Status.PRONAJEM;
  if (folderPath.includes('/Hotovo/')) return Status.HOTOVO;
  return null;
}

// Helper pro extrakci folderId z cesty
export function getFolderIdFromPath(folderPath: string): string {
  const parts = folderPath.split('/');
  return parts[parts.length - 1]; // Poslední část cesty = název složky
}

// Helper pro konstrukci relativní cesty k obrázkům
export function getImagePath(folderId: string, status: Status, imageName: string): string {
  const statusFolder = status.charAt(0) + status.slice(1).toLowerCase(); // PRODEJ -> Prodej
  return `/nemovitosti/${statusFolder}/${folderId}/${imageName}`;
}

// Error types pro lepší error handling
export class PropertyValidationError extends Error {
  constructor(message: string, public errors?: z.ZodError) {
    super(message);
    this.name = 'PropertyValidationError';
  }
}

export class PropertyNotFoundError extends Error {
  constructor(folderId: string) {
    super(`Property with folderId "${folderId}" not found`);
    this.name = 'PropertyNotFoundError';
  }
}

export class PropertyParseError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'PropertyParseError';
  }
}
