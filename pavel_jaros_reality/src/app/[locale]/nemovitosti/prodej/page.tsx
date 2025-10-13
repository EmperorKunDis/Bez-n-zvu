'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Home as HomeIcon, Maximize2, Loader2 } from 'lucide-react';

interface Property {
  id: string;
  folderId: string;
  status: string;
  title: string;
  subtitle: string;
  address: string;
  price: string | null;
  disposition: string | null;
  area: number | null;
  floors: number | null;
  mainImage: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProdejPage() {
  const t = useTranslations();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties?status=PRODEJ');
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError('Nepodařilo se načíst nemovitosti');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-red-700" />
          <p className="text-gray-600">Načítám nemovitosti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProperties}>Zkusit znovu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-red-700 hover:text-red-800 mb-4 inline-block">
            ← Zpět na hlavní stránku
          </Link>
          <h1 className="text-4xl font-bold text-red-700">Nemovitosti na prodej</h1>
          <p className="text-gray-600 mt-2">
            Aktuálně máme {properties.length} {properties.length === 1 ? 'nemovitost' : properties.length < 5 ? 'nemovitosti' : 'nemovitostí'} na prodej
          </p>
        </div>
      </header>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {properties.length === 0 ? (
            <div className="text-center py-20">
              <HomeIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Momentálně nemáme žádné nemovitosti na prodej
              </h3>
              <p className="text-gray-500 mb-6">
                Brzy přidáme nové nabídky. Zkuste to později.
              </p>
              <Link href="/">
                <Button className="bg-red-700 hover:bg-red-800">
                  Zpět na hlavní stránku
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative h-64">
                      <Image
                        src={property.mainImage}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      {property.price && (
                        <div className="absolute top-4 right-4 bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                          {property.price}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-red-700 line-clamp-1">
                        {property.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {property.subtitle}
                      </p>

                      {/* Property Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        {property.disposition && (
                          <div className="flex items-center gap-1">
                            <HomeIcon className="h-4 w-4" />
                            <span>{property.disposition}</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center gap-1">
                            <Maximize2 className="h-4 w-4" />
                            <span>{property.area} m²</span>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>

                      {/* View Button */}
                      <Link href={`/nemovitosti/${property.folderId}`}>
                        <Button
                          className="w-full bg-red-700 hover:bg-red-800 text-white"
                        >
                          Zobrazit detail
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
