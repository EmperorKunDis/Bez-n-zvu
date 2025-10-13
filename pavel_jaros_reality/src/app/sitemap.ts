import { MetadataRoute} from 'next';
import { routing } from '../../i18n/routing';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pavel-jaros.cz';

  // Generate entries for all locales
  const localeEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    },
  ]);

  // Add additional static pages if needed
  // const additionalPages: MetadataRoute.Sitemap = [
  //   {
  //     url: `${baseUrl}/blog`,
  //     lastModified: new Date(),
  //     changeFrequency: 'daily',
  //     priority: 0.8,
  //   },
  // ];

  return [
    ...localeEntries,
    // ...additionalPages,
  ];
}
