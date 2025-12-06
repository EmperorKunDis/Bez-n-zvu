"use client";

import { useState, useEffect, type ReactNode } from 'react';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Briefcase,
  User,
  Phone,
  Globe,
  Lock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Layers,
  ExternalLink,
  FolderOpen,
  HelpCircle,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  Building2,
  Hammer,
  PaintBucket,
  KeyRound,
  Star,
  FileText,
  MessageSquare,
  Users,
  MapPin,
  Mail,
  Clock,
  Shield,
  TrendingUp,
  Palette,
  Grid3X3,
  Type,
  ImagePlus,
  Link2,
  Video,
  FileImage,
  Pencil,
  Plus,
  Trash2,
  Copy,
  Move,
  Check,
  AlertCircle
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// PROFESSIONAL DESIGN SYSTEM - Premium Dark SaaS Aesthetic
// ═══════════════════════════════════════════════════════════════════════════

const theme = {
  // Core Colors
  bg: {
    primary: '#0F0F12',
    secondary: '#1A1A1F',
    tertiary: '#242429',
    accent: '#2D2D35',
  },
  // Brand Colors
  brand: {
    primary: '#DC2626',      // Red - PJ Group brand
    secondary: '#EF4444',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #F87171 100%)',
  },
  // Site-specific colors
  sites: {
    reality: { primary: '#DC2626', name: 'Reality', icon: Building2 },
    design: { primary: '#8B5CF6', name: 'Design', icon: Palette },
    rekonstrukce: { primary: '#F59E0B', name: 'Rekonstrukce', icon: Hammer },
    sprava: { primary: '#10B981', name: 'Správa', icon: KeyRound },
    group: { primary: '#6366F1', name: 'PJ Group', icon: Grid3X3 },
  },
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
    inverse: '#0F0F12',
  },
  // Status Colors
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  // Border & Effects
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    medium: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    glow: '0 0 40px rgba(220, 38, 38, 0.15)',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// WEBSITE DATA - Mirroring Real Content
// ═══════════════════════════════════════════════════════════════════════════

export const websiteData = {
  reality: {
    name: 'PJ Reality',
    url: '/pavel_jaros_reality',
    color: '#DC2626',
    icon: Building2,
    sections: {
      hero: {
        title: 'Maximalizujte zisk z vaší nemovitosti',
        cta: 'MNOU NABÍZENÉ SLUŽBY',
        image: 'https://ext.same-assets.com/2530056946/4049786394.png',
      },
      services: [
        { id: 'sale', title: 'PRODEJ', icon: 'HomeIcon', description: 'Mým cílem je prodat vaši nemovitost za nejvyšší možnou cenu na trhu.' },
        { id: 'rent', title: 'PRONÁJEM', icon: 'Building', description: 'Vždy se snažím dosáhnout co nejvyšší ceny pronájmu.' },
        { id: 'marketing', title: 'MARKETING A STRATEGIE', icon: 'TrendingUp', description: 'Marketing a reklama tvoří neoddělitelnou část mé práce.' },
        { id: 'presentation', title: 'PREZENTACE NEMOVITOSTI', icon: 'Camera', description: 'Kvalitní fotografie a 3D vizualizace.' },
        { id: 'reconstruction', title: 'REKONSTRUKCE NEMOVITOSTI', icon: 'Hammer', description: 'Zkušenosti z kompletních rekonstrukcí.' },
        { id: 'valuation', title: 'ODHAD CENY NEMOVITOSTI', icon: 'DollarSign', description: 'Využívám ověřené nástroje k ocenění.' },
      ],
      properties: [
        { title: 'Neumannova, AŠ', price: '25 000 Kč', image: 'https://ext.same-assets.com/2530056946/246692592.webp' },
        { title: 'Slavětín nad Ohří', price: '3 190 000 Kč', image: 'https://ext.same-assets.com/2530056946/1499260590.webp' },
        { title: 'Hnězdenska, Praha', price: '9 500 000 Kč', image: 'https://ext.same-assets.com/2530056946/3003633402.webp' },
      ],
      about: {
        name: 'Pavel Jaroš',
        subtitle: 'O MNĚ',
        intro: 'Jmenuji se Pavel Jaroš a jsem realitní makléř, který se neustále snaží o profesní růst.',
        image: '/images/PavelFotka.png',
      },
      references: [
        { name: 'Daniela Baudýsová', text: 'Děkujeme za rychlý a bezproblémový prodej chaty.' },
        { name: 'David', text: 'Pan Jaroš byl skvělý – profesionální, rychlý a vždy k dispozici.' },
        { name: 'Josef Neumann', text: 'Proaktivní přístup a perfektní komunikace.' },
      ],
      contact: {
        address: 'Kaprova 52/6, Praha 1',
        phone: '+420 777 558 730',
        email: 'pavel.jaros@kwcz.cz',
      },
    },
    images: [
      '/images/PavelFotka.png',
      '/logo/PJ_Reality_logo.svg',
    ],
  },
  design: {
    name: 'PJ Design',
    url: '/pavel_jaros_design',
    color: '#8B5CF6',
    icon: Palette,
    sections: {
      hero: {
        title: 'Vytváříme interiéry s duší a příběhem.',
        subtitle: 'Od prvního nápadu po poslední polštář.',
        ctaPrimary: 'Prohlédnout portfolio',
        ctaSecondary: 'Domluvit si konzultaci',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000',
      },
      services: [
        { id: 'design', title: 'Návrh interiéru', icon: 'Lightbulb', description: 'Kompletní designový koncept včetně 3D vizualizací.' },
        { id: 'turnkey', title: 'Realizace na klíč', icon: 'Key', description: 'Od stavebních úprav až po finální dekorace.' },
        { id: 'consultation', title: 'Osobní konzultace', icon: 'MessageSquare', description: 'Poradíme s barvami, dispozicí nebo výběrem doplňků.' },
      ],
      portfolio: [
        { name: 'Harmonie dřeva a betonu', location: 'Cheb', image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2074' },
        { name: 'Prvorepubliková elegance', location: 'Karlovy Vary', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070' },
        { name: 'Skandinávská čistota', location: 'Sokolov', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070' },
      ],
      philosophy: {
        title: 'Design, který vám rozumí',
        text: 'Věřím, že dobrý design je dokonalým spojením estetiky, funkčnosti a osobnosti klienta.',
      },
      process: [
        { step: 1, title: 'Úvodní schůzka a analýza potřeb', text: 'Poznáme se, probereme vaše sny a rozpočet.' },
        { step: 2, title: 'Tvorba konceptu a dispozičního řešení', text: 'Připravím moodboard a varianty uspořádání.' },
        { step: 3, title: '3D vizualizace a výběr materiálů', text: 'Uvidíte interiér v realistické podobě.' },
        { step: 4, title: 'Technická dokumentace', text: 'Detailní plány pro řemeslníky.' },
        { step: 5, title: 'Autorský dozor nebo kompletní realizace', text: 'Dohlédnu na průběh prací.' },
      ],
      contact: {
        phone: '+420 777 558 730',
        email: 'pavel.jaros@kwcz.cz',
        address: 'Karlovarský kraj',
      },
    },
    images: [
      '/images/PavelDesignBezPozadi.png',
      '/logo/PJ_Group_logo.svg',
    ],
  },
  rekonstrukce: {
    name: 'PJ Rekonstrukce',
    url: '/pavel_jaros_rekonstrukce',
    color: '#F59E0B',
    icon: Hammer,
    sections: {
      hero: {
        title: 'Proměníme vaše sny v realitu.',
        subtitle: 'Kompletní rekonstrukce bytů a domů v Karlovarském kraji.',
        ctaPrimary: 'Spočítat cenu rekonstrukce',
        ctaSecondary: 'Prohlédnout realizace',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070',
      },
      services: [
        { id: 'cores', title: 'Rekonstrukce bytových jader', icon: 'HomeIcon', description: 'Modernizujeme umakartová i zděná jádra.' },
        { id: 'apartments', title: 'Kompletní rekonstrukce bytů', icon: 'Building2', description: 'Od bouracích prací po finální povrchy.' },
        { id: 'houses', title: 'Rekonstrukce rodinných domů', icon: 'HomeIcon', description: 'Vnitřní i vnější rekonstrukce domů.' },
        { id: 'crafts', title: 'Řemeslné práce', icon: 'Wrench', description: 'Zednické, obkladačské, podlahářské práce.' },
      ],
      why: [
        { title: 'Jedna firma, všechny práce', text: 'Nemusíte shánět různá řemesla.', icon: 'Hammer' },
        { title: 'Dodržujeme termíny a rozpočty', text: 'Pevný rozpočet a harmonogram.', icon: 'Clock' },
        { title: 'Důraz na kvalitu a detail', text: 'Certifikované materiály.', icon: 'Shield' },
        { title: 'Osobní přístup a poradenství', text: 'Partner po celou dobu projektu.', icon: 'Users' },
      ],
      projects: [
        { name: 'Proměna bytu 3+1', location: 'Karlovy Vary', image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?q=80&w=2070' },
        { name: 'Nová koupelna a jádro', location: 'Cheb', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2070' },
        { name: 'Rekonstrukce přízemí', location: 'Sokolov', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053' },
      ],
      process: [
        { step: 1, title: 'Kontakt a úvodní konzultace', text: 'Probereme vaše představy zdarma.' },
        { step: 2, title: 'Zaměření a cenová nabídka', text: 'Detailní a transparentní nabídka do týdne.' },
        { step: 3, title: 'Smlouva a harmonogram', text: 'Pevný rozpočet a závazný harmonogram.' },
        { step: 4, title: 'Realizace rekonstrukce', text: 'Pravidelná komunikace a kontrolní dny.' },
        { step: 5, title: 'Předání a záruka', text: 'Protokolární předání s plnou zárukou.' },
      ],
      references: [
        { name: 'Rodina Nováková', location: 'Mariánské Lázně', text: 'Skvělá komunikace a dodržení termínu.' },
        { name: 'Petr S.', location: 'Cheb', text: 'Rekordní čas a skvělá kvalita.' },
      ],
      contact: {
        phone: '+420 777 558 730',
        email: 'pavel.jaros@kwcz.cz',
        address: 'Karlovarský kraj',
        hours: 'Po - Pá: 8:00 - 16:00',
      },
    },
    images: [
      '/images/PajaBezPrdeleReko.png',
      '/logo/PJ_Reko_logo.svg',
    ],
  },
  sprava: {
    name: 'PJ Správa',
    url: '/pavel_jaros_sprava',
    color: '#10B981',
    icon: KeyRound,
    sections: {
      hero: {
        title: 'Nepřetržitý příjem z pronájmu bez starostí.',
        subtitle: 'Svěřte nám svou nemovitost a my zařídíme vše ostatní.',
        cta: 'Chci pronajímat bez starostí',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073',
      },
      target: [
        { id: 'investor', title: 'Jste investor', icon: 'Building2', text: 'Vlastníte investiční byty a chcete pasivní příjem.' },
        { id: 'remote', title: 'Bydlíte jinde', icon: 'Globe', text: 'Žijete mimo region a nemůžete se starat.' },
        { id: 'time', title: 'Ceníte si svůj čas', icon: 'Clock', text: 'Nechcete řešit komunikaci a opravy.' },
      ],
      pricing: [
        {
          id: 'start',
          name: 'Tarif START',
          price: '12 % z nájemného',
          description: 'Profesionální správa nájmu a administrativy.',
          features: ['Kompletní správa nájmu', 'Výběr nájemníků', 'Zajištění smluv', 'Předání bytu', 'Komunikace'],
        },
        {
          id: 'plus',
          name: 'Tarif PLUS',
          price: '15 % z nájemného',
          description: 'Rozšířená péče s garancí příjmů.',
          features: ['Vše z tarifu START', 'Garance 50% nájmu'],
        },
        {
          id: 'premium',
          name: 'Tarif PREMIUM',
          price: '20 % z nájemného',
          description: 'Maximální jistota a prioritní péče.',
          features: ['Vše z tarifu PLUS', 'Kompletní servis', 'Prioritní péče', '100% garance nájmu'],
          recommended: true,
        },
      ],
      benefits: [
        { title: 'Pečlivý výběr nájemníků', text: 'Důkladné prověření zájemců.', icon: 'Shield' },
        { title: 'Garantovaný příjem', text: 'Jistota platby každý měsíc.', icon: 'TrendingUp' },
        { title: 'Kompletní správa', text: 'Od oprav po revize.', icon: 'Wrench' },
        { title: 'Právní servis', text: 'Profesionální nájemní smlouvy.', icon: 'FileCheck' },
      ],
      process: [
        { step: 1, title: 'Nezávazná konzultace', text: 'Probereme vaši nemovitost zdarma.' },
        { step: 2, title: 'Výběr tarifu a strategie', text: 'Doporučíme ideální tarif.' },
        { step: 3, title: 'Podpis transparentní smlouvy', text: 'Žádné skryté podmínky.' },
        { step: 4, title: 'My se staráme, vy vyděláváte', text: 'Sledujte příchozí platby.' },
      ],
      references: [
        { name: 'Petr N., Praha', subtitle: 'majitel bytu 2+1', text: 'Nemusím se o nic starat, peníze chodí včas.' },
        { name: 'Ing. Jana D., Cheb', subtitle: 'majitelka bytu 3+kk', text: 'Tarif PREMIUM mi dává absolutní jistotu.' },
      ],
      faq: [
        { question: 'Co se stane, když nájemník neplatí?', answer: 'V tarifu PREMIUM vám nájemné garantujeme.' },
        { question: 'Jak probíhá výběr nájemníka?', answer: 'Vícekrokový proces s důkladným prověřením.' },
        { question: 'Co když je potřeba něco opravit?', answer: 'Drobné opravy řešíme okamžitě.' },
        { question: 'Jaká je délka smlouvy?', answer: 'Standardně 12 měsíců s automatickým prodloužením.' },
      ],
      contact: {
        phone: '+420 777 558 730',
        email: 'pavel.jaros@kwcz.cz',
        address: 'Karlovarský kraj',
      },
    },
    images: [
      '/images/PajaSpravaBezPozadi.png',
      '/logo/PJ_Sprava_logo.svg',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type SiteKey = 'reality' | 'design' | 'rekonstrukce' | 'sprava';

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  siteName: string;
  currentSite?: SiteKey;
  onSiteChange?: (site: SiteKey) => void;
}

const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'H3sl0Pr4utJ3d3';

export function AdminLayout({
  children,
  activeSection,
  onSectionChange,
  siteName,
  currentSite = 'design',
  onSiteChange,
}: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);

  const currentSiteData = websiteData[currentSite];
  const siteColor = currentSiteData?.color || theme.brand.primary;

  useEffect(() => {
    const stored = sessionStorage.getItem('admin-auth');
    if (stored === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      setError('');
    } else {
      setError('Nesprávné přihlašovací údaje');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
  };

  // Dynamic Navigation based on current site
  const getNavGroups = () => {
    const baseNav = [
      {
        label: 'Hlavní',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'visual-editor', label: 'Vizuální editor', icon: Layers, badge: 'Pro' },
        ]
      },
    ];

    const contentItems: { id: string; label: string; icon: typeof Home }[] = [
      { id: 'hero', label: 'Hero sekce', icon: Home },
    ];

    // Add site-specific sections
    if (currentSite === 'reality') {
      contentItems.push(
        { id: 'properties', label: 'Nemovitosti', icon: Building2 },
        { id: 'services', label: 'Služby', icon: Briefcase },
        { id: 'references', label: 'Reference', icon: Star },
        { id: 'about', label: 'O mně', icon: User },
        { id: 'contact', label: 'Kontakt', icon: Phone },
      );
    } else if (currentSite === 'design') {
      contentItems.push(
        { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
        { id: 'services', label: 'Služby', icon: Briefcase },
        { id: 'philosophy', label: 'Filozofie', icon: Sparkles },
        { id: 'process', label: 'Proces', icon: Clock },
        { id: 'contact', label: 'Kontakt', icon: Phone },
      );
    } else if (currentSite === 'rekonstrukce') {
      contentItems.push(
        { id: 'services', label: 'Služby', icon: Briefcase },
        { id: 'projects', label: 'Realizace', icon: Hammer },
        { id: 'why', label: 'Proč my', icon: Shield },
        { id: 'process', label: 'Proces', icon: Clock },
        { id: 'references', label: 'Reference', icon: Star },
        { id: 'about', label: 'O nás', icon: User },
        { id: 'contact', label: 'Kontakt', icon: Phone },
      );
    } else if (currentSite === 'sprava') {
      contentItems.push(
        { id: 'target', label: 'Cílová skupina', icon: Users },
        { id: 'pricing', label: 'Ceník', icon: FileText },
        { id: 'benefits', label: 'Výhody', icon: Shield },
        { id: 'process', label: 'Proces', icon: Clock },
        { id: 'references', label: 'Reference', icon: Star },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
        { id: 'about', label: 'O nás', icon: User },
        { id: 'contact', label: 'Kontakt', icon: Phone },
      );
    }

    baseNav.push({
      label: 'Obsah webu',
      items: contentItems,
    });

    baseNav.push({
      label: 'Správa',
      items: [
        { id: 'translations', label: 'Překlady (6 jazyků)', icon: Globe },
        { id: 'images', label: 'Média & Obrázky', icon: FolderOpen },
        { id: 'seo', label: 'SEO & Meta', icon: Search },
        { id: 'settings', label: 'Nastavení', icon: Settings },
      ]
    });

    return baseNav;
  };

  const navGroups = getNavGroups();

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{
          background: `radial-gradient(ellipse at top, ${theme.bg.secondary} 0%, ${theme.bg.primary} 60%)`,
        }}
      >
        <div
          className="fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${theme.border.medium} 1px, transparent 1px), linear-gradient(90deg, ${theme.border.medium} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div
          className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: siteColor }}
        />
        <div
          className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: siteColor }}
        />

        <div className="relative w-full max-w-md">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{
                background: `linear-gradient(135deg, ${siteColor} 0%, ${siteColor}cc 100%)`,
                boxShadow: `0 0 40px ${siteColor}40`,
              }}
            >
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: theme.text.primary }}
            >
              PJ Group Admin
            </h1>
            <p style={{ color: theme.text.muted }}>
              Profesionální správa všech webů
            </p>
          </div>

          <div
            className="p-8 backdrop-blur-xl"
            style={{
              background: `linear-gradient(135deg, ${theme.bg.secondary}ee 0%, ${theme.bg.tertiary}dd 100%)`,
              borderRadius: theme.radius.xl,
              border: `1px solid ${theme.border.medium}`,
              boxShadow: theme.shadow.lg,
            }}
          >
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text.secondary }}
                >
                  Uživatelské jméno
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: theme.text.muted }}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Zadejte jméno"
                    className="w-full h-12 pl-12 pr-4 text-sm transition-all focus:outline-none"
                    style={{
                      background: theme.bg.primary,
                      border: `1px solid ${theme.border.medium}`,
                      borderRadius: theme.radius.lg,
                      color: theme.text.primary,
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text.secondary }}
                >
                  Heslo
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: theme.text.muted }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-12 pr-4 text-sm transition-all focus:outline-none"
                    style={{
                      background: theme.bg.primary,
                      border: `1px solid ${theme.border.medium}`,
                      borderRadius: theme.radius.lg,
                      color: theme.text.primary,
                    }}
                  />
                </div>
              </div>

              {error && (
                <div
                  className="flex items-center gap-3 px-4 py-3 text-sm"
                  style={{
                    background: `${theme.status.error}15`,
                    border: `1px solid ${theme.status.error}30`,
                    borderRadius: theme.radius.md,
                    color: theme.status.error,
                  }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-12 font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${siteColor} 0%, ${siteColor}cc 100%)`,
                  borderRadius: theme.radius.lg,
                  boxShadow: `0 4px 20px ${siteColor}40`,
                }}
              >
                Přihlásit se
              </button>
            </form>

            <div
              className="mt-6 pt-6 text-center text-sm"
              style={{
                borderTop: `1px solid ${theme.border.subtle}`,
                color: theme.text.muted,
              }}
            >
              Administrace pro Reality • Design • Rekonstrukce • Správa
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN ADMIN INTERFACE
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div
      className="min-h-screen flex"
      style={{ background: theme.bg.primary }}
    >
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: theme.bg.secondary,
          borderRight: `1px solid ${theme.border.subtle}`,
        }}
      >
        {/* Sidebar Header with Site Switcher */}
        <div
          className="px-4 py-4"
          style={{ borderBottom: `1px solid ${theme.border.subtle}` }}
        >
          {/* Site Switcher */}
          <div className="relative mb-4">
            <button
              onClick={() => setSiteMenuOpen(!siteMenuOpen)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
              style={{
                background: `${siteColor}15`,
                border: `1px solid ${siteColor}30`,
              }}
            >
              {currentSiteData && (
                <>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: siteColor }}
                  >
                    <currentSiteData.icon className="w-5 h-5 text-white" />
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: theme.text.primary }}>
                          {currentSiteData.name}
                        </p>
                        <p className="text-xs truncate" style={{ color: theme.text.muted }}>
                          Aktivní web
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${siteMenuOpen ? 'rotate-180' : ''}`}
                        style={{ color: theme.text.muted }}
                      />
                    </>
                  )}
                </>
              )}
            </button>

            {/* Site Dropdown */}
            {siteMenuOpen && !sidebarCollapsed && (
              <div
                className="absolute left-0 right-0 mt-2 py-2 rounded-xl z-50"
                style={{
                  background: theme.bg.tertiary,
                  border: `1px solid ${theme.border.medium}`,
                  boxShadow: theme.shadow.lg,
                }}
              >
                {(Object.keys(websiteData) as SiteKey[]).map((siteKey) => {
                  const site = websiteData[siteKey];
                  const isActive = currentSite === siteKey;
                  return (
                    <button
                      key={siteKey}
                      onClick={() => {
                        onSiteChange?.(siteKey);
                        setSiteMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                      style={{
                        background: isActive ? `${site.color}15` : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = theme.bg.accent;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: site.color }}
                      >
                        <site.icon className="w-4 h-4 text-white" />
                      </div>
                      <span
                        className="font-medium text-sm"
                        style={{ color: isActive ? site.color : theme.text.primary }}
                      >
                        {site.name}
                      </span>
                      {isActive && (
                        <Check className="w-4 h-4 ml-auto" style={{ color: site.color }} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Collapse Button */}
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.muted }}>
                Navigace
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-lg transition-colors"
              style={{ color: theme.text.muted }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.bg.accent}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2"
              style={{ color: theme.text.muted }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              {!sidebarCollapsed && (
                <div
                  className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: theme.text.muted }}
                >
                  {group.label}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onSectionChange(item.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                        sidebarCollapsed ? 'justify-center' : ''
                      }`}
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${siteColor}20 0%, ${siteColor}10 100%)`
                          : 'transparent',
                        color: isActive ? theme.text.primary : theme.text.secondary,
                        border: isActive ? `1px solid ${siteColor}30` : '1px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = theme.bg.accent;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <item.icon
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: isActive ? siteColor : theme.text.muted }}
                      />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">{item.label}</span>
                          {'badge' in item && item.badge && (
                            <span
                              className="px-2 py-0.5 text-xs font-semibold rounded-full"
                              style={{
                                background: `linear-gradient(135deg, ${siteColor} 0%, ${siteColor}cc 100%)`,
                                color: 'white',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          className="p-3 space-y-1"
          style={{ borderTop: `1px solid ${theme.border.subtle}` }}
        >
          <a
            href={currentSiteData?.url || '/'}
            target="_blank"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            style={{ color: theme.text.secondary }}
            onMouseEnter={(e) => e.currentTarget.style.background = theme.bg.accent}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Zobrazit web</span>}
          </a>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            style={{ color: theme.status.error }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${theme.status.error}15`}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Odhlásit se</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-xl"
          style={{
            background: `${theme.bg.primary}ee`,
            borderBottom: `1px solid ${theme.border.subtle}`,
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg"
              style={{ color: theme.text.muted }}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: siteColor }}
              />
              <h1
                className="text-lg font-semibold"
                style={{ color: theme.text.primary }}
              >
                {navGroups.flatMap(g => g.items).find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div
              className="hidden md:flex items-center relative transition-all duration-200"
              style={{ width: searchFocused ? '320px' : '240px' }}
            >
              <Search
                className="absolute left-3 w-4 h-4"
                style={{ color: theme.text.muted }}
              />
              <input
                type="text"
                placeholder="Hledat v obsahu..."
                className="w-full h-10 pl-10 pr-4 text-sm transition-all focus:outline-none"
                style={{
                  background: theme.bg.tertiary,
                  border: `1px solid ${searchFocused ? siteColor : theme.border.medium}`,
                  borderRadius: theme.radius.lg,
                  color: theme.text.primary,
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                className="p-2.5 rounded-xl transition-colors relative"
                style={{ color: theme.text.muted }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.bg.tertiary}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Bell className="w-5 h-5" />
                <span
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ background: theme.status.success }}
                />
              </button>
              <button
                className="p-2.5 rounded-xl transition-colors"
                style={{ color: theme.text.muted }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.bg.tertiary}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            <div
              className="h-8 w-px mx-2"
              style={{ background: theme.border.medium }}
            />

            {/* User */}
            <button
              className="flex items-center gap-3 p-1.5 rounded-xl transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.background = theme.bg.tertiary}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold text-sm"
                style={{ background: `linear-gradient(135deg, ${siteColor} 0%, ${siteColor}cc 100%)` }}
              >
                A
              </div>
              <div className="hidden sm:block text-left">
                <p
                  className="text-sm font-medium"
                  style={{ color: theme.text.primary }}
                >
                  Admin
                </p>
                <p
                  className="text-xs"
                  style={{ color: theme.text.muted }}
                >
                  {currentSiteData?.name}
                </p>
              </div>
              <ChevronDown
                className="w-4 h-4 hidden sm:block"
                style={{ color: theme.text.muted }}
              />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div
          className="flex-1 p-6 lg:p-8 overflow-auto"
          style={{ background: theme.bg.primary }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

// Export theme and data for use in other components
export { theme as adminTheme };
export type { SiteKey };
