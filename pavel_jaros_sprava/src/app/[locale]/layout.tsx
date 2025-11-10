import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../global.css";
import ClientBody from "../ClientBody";
import Script from "next/script";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {routing} from '../../../i18n/routing';
import {notFound} from 'next/navigation';
import {ErrorBoundary} from '../../components/ErrorBoundary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});

  const title = "Pavel Jaroš - Realitní makléř | Keller Williams";
  const description = "Profesionální realitní služby v Praze a okolí. Prodej, pronájem a odhad nemovitostí. Maximalizujte zisk z vaší nemovitosti.";

  return {
    title,
    description,
    keywords: ['realitní makléř', 'prodej nemovitostí', 'pronájem nemovitostí', 'odhad nemovitostí', 'Praha', 'Keller Williams', 'reality', 'byty', 'domy'],
    authors: [{name: 'Pavel Jaroš'}],
    creator: 'Pavel Jaroš',
    publisher: 'Keller Williams',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://pavel-jaros.cz'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'cs': '/cs',
        'en': '/en',
        'de': '/de',
        'pl': '/pl',
        'sk': '/sk',
        'ru': '/ru',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://pavel-jaros.cz/${locale}`,
      siteName: 'Pavel Jaroš Reality',
      images: [
        {
          url: 'https://ext.same-assets.com/2530056946/4049786394.png',
          width: 1200,
          height: 630,
          alt: 'Pavel Jaroš - Realitní makléř',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ext.same-assets.com/2530056946/4049786394.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add your verification codes when available
      // google: 'your-google-site-verification',
      // yandex: 'your-yandex-verification',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const dynamic = 'force-static';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Pavel Jaroš",
    "image": "https://ext.same-assets.com/2530056946/2707997203.png",
    "telephone": "+420-XXX-XXX-XXX",
    "email": "pavel.jaros@example.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Praha",
      "addressCountry": "CZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.0755",
      "longitude": "14.4378"
    },
    "url": `https://pavel-jaros.cz/${locale}`,
    "logo": "https://ext.same-assets.com/2530056946/3299068684.svg",
    "description": "Profesionální realitní služby v Praze a okolí. Prodej, pronájem a odhad nemovitostí.",
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": "Praha"
    },
    "knowsAbout": ["Real Estate", "Property Sales", "Property Rental", "Property Valuation"],
    "memberOf": {
      "@type": "Organization",
      "name": "Keller Williams"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "3"
    }
  };

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            <ClientBody>{children}</ClientBody>
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
