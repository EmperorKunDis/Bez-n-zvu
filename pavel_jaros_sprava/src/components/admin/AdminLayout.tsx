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
  Phone,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight,
  Layers,
  ExternalLink,
  HelpCircle,
  Bell,
  Search,
  ChevronDown,
  KeyRound,
  Star,
  FileText,
  Users,
  Clock,
  Shield,
  User,
  AlertCircle,
  DollarSign
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// PJ SPRÁVA - STANDALONE ADMIN LAYOUT
// Only manages PJ Správa website content
// ═══════════════════════════════════════════════════════════════════════════

const SITE_COLOR = '#10B981';

// Design System
export const adminTheme = {
  bg: {
    primary: '#0F0F12',
    secondary: '#1A1A1F',
    tertiary: '#242429',
    accent: '#2D2D35',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
    inverse: '#0F0F12',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    medium: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    glow: '0 0 40px rgba(16, 185, 129, 0.15)',
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
// SPRAVA SITE DATA - Real content from the website
// ═══════════════════════════════════════════════════════════════════════════

export const siteData = {
  name: 'PJ Správa',
  url: '/',
  color: SITE_COLOR,
  sections: {
    hero: {
      title: 'Nepřetržitý příjem z pronájmu bez starostí.',
      subtitle: 'Svěřte nám svou nemovitost a my zařídíme vše ostatní.',
      cta: 'Chci pronajímat bez starostí',
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
    about: {
      name: 'Pavel Jaroš',
      intro: 'Profesionální správa nemovitostí v Karlovarském kraji. Postarám se o váš byt jako o svůj vlastní.',
    },
    contact: {
      phone: '+420 777 558 730',
      email: 'pavel.jaros@kwcz.cz',
      address: 'Karlovarský kraj',
    },
  },
  // ACTUAL images from /public folder
  images: [
    { path: '/images/PajaSpravaBezPozadi.png', name: 'Pavel Jaroš - Správa', category: 'osobní' },
    { path: '/logo/PJ_Sprava_logo.svg', name: 'Logo PJ Správa', category: 'logo' },
    { path: '/logo/PJ_Sprava_symbol.svg', name: 'Symbol PJ Správa', category: 'logo' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'H3sl0Pr4utJ3d3';

export function AdminLayout({
  children,
  activeSection,
  onSectionChange,
}: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('admin-auth-sprava');
    if (stored === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth-sprava', 'true');
      setError('');
    } else {
      setError('Nesprávné přihlašovací údaje');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth-sprava');
  };

  // Navigation - Sprava specific sections
  const navGroups = [
    {
      label: 'Hlavní',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'visual-editor', label: 'Vizuální editor', icon: Layers, badge: 'Pro' },
      ]
    },
    {
      label: 'Obsah webu',
      items: [
        { id: 'hero', label: 'Hero sekce', icon: Home },
        { id: 'target', label: 'Cílová skupina', icon: Users },
        { id: 'pricing', label: 'Ceník', icon: DollarSign },
        { id: 'benefits', label: 'Výhody', icon: Shield },
        { id: 'process', label: 'Proces', icon: Clock },
        { id: 'references', label: 'Reference', icon: Star },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
        { id: 'about', label: 'O nás', icon: User },
        { id: 'contact', label: 'Kontakt', icon: Phone },
      ]
    },
    {
      label: 'Správa',
      items: [
        { id: 'translations', label: 'Překlady (6 jazyků)', icon: Globe },
        { id: 'images', label: 'Média & Obrázky', icon: ImageIcon },
        { id: 'seo', label: 'SEO & Meta', icon: Search },
        { id: 'settings', label: 'Nastavení', icon: Settings },
      ]
    }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{
          background: `radial-gradient(ellipse at top, ${adminTheme.bg.secondary} 0%, ${adminTheme.bg.primary} 60%)`,
        }}
      >
        <div
          className="fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${adminTheme.border.medium} 1px, transparent 1px), linear-gradient(90deg, ${adminTheme.border.medium} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div
          className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: SITE_COLOR }}
        />
        <div
          className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: SITE_COLOR }}
        />

        <div className="relative w-full max-w-md">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{
                background: `linear-gradient(135deg, ${SITE_COLOR} 0%, ${SITE_COLOR}cc 100%)`,
                boxShadow: `0 0 40px ${SITE_COLOR}40`,
              }}
            >
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: adminTheme.text.primary }}
            >
              PJ Správa Admin
            </h1>
            <p style={{ color: adminTheme.text.muted }}>
              Správa webu PJ Správa nemovitostí
            </p>
          </div>

          <div
            className="p-8 backdrop-blur-xl"
            style={{
              background: `linear-gradient(135deg, ${adminTheme.bg.secondary}ee 0%, ${adminTheme.bg.tertiary}dd 100%)`,
              borderRadius: adminTheme.radius.xl,
              border: `1px solid ${adminTheme.border.medium}`,
              boxShadow: adminTheme.shadow.lg,
            }}
          >
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: adminTheme.text.secondary }}
                >
                  Uživatelské jméno
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: adminTheme.text.muted }}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Zadejte jméno"
                    className="w-full h-12 pl-12 pr-4 text-sm transition-all focus:outline-none"
                    style={{
                      background: adminTheme.bg.primary,
                      border: `1px solid ${adminTheme.border.medium}`,
                      borderRadius: adminTheme.radius.lg,
                      color: adminTheme.text.primary,
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: adminTheme.text.secondary }}
                >
                  Heslo
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: adminTheme.text.muted }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-12 pr-4 text-sm transition-all focus:outline-none"
                    style={{
                      background: adminTheme.bg.primary,
                      border: `1px solid ${adminTheme.border.medium}`,
                      borderRadius: adminTheme.radius.lg,
                      color: adminTheme.text.primary,
                    }}
                  />
                </div>
              </div>

              {error && (
                <div
                  className="flex items-center gap-3 px-4 py-3 text-sm"
                  style={{
                    background: `${adminTheme.status.error}15`,
                    border: `1px solid ${adminTheme.status.error}30`,
                    borderRadius: adminTheme.radius.md,
                    color: adminTheme.status.error,
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
                  background: `linear-gradient(135deg, ${SITE_COLOR} 0%, ${SITE_COLOR}cc 100%)`,
                  borderRadius: adminTheme.radius.lg,
                  boxShadow: `0 4px 20px ${SITE_COLOR}40`,
                }}
              >
                Přihlásit se
              </button>
            </form>

            <div
              className="mt-6 pt-6 text-center text-sm"
              style={{
                borderTop: `1px solid ${adminTheme.border.subtle}`,
                color: adminTheme.text.muted,
              }}
            >
              Správa nemovitostí v Karlovarském kraji
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
      style={{ background: adminTheme.bg.primary }}
    >
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: adminTheme.bg.secondary,
          borderRight: `1px solid ${adminTheme.border.subtle}`,
        }}
      >
        {/* Sidebar Header */}
        <div
          className="px-4 py-4"
          style={{ borderBottom: `1px solid ${adminTheme.border.subtle}` }}
        >
          {/* Site Header */}
          <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${sidebarCollapsed ? 'justify-center' : ''}`}
            style={{
              background: `${SITE_COLOR}15`,
              border: `1px solid ${SITE_COLOR}30`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: SITE_COLOR }}
            >
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: adminTheme.text.primary }}>
                  PJ Správa
                </p>
                <p className="text-xs truncate" style={{ color: adminTheme.text.muted }}>
                  Správa nemovitostí
                </p>
              </div>
            )}
          </div>

          {/* Collapse Button */}
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: adminTheme.text.muted }}>
                Navigace
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-lg transition-colors"
              style={{ color: adminTheme.text.muted }}
              onMouseEnter={(e) => e.currentTarget.style.background = adminTheme.bg.accent}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2"
              style={{ color: adminTheme.text.muted }}
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
                  style={{ color: adminTheme.text.muted }}
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
                          ? `linear-gradient(135deg, ${SITE_COLOR}20 0%, ${SITE_COLOR}10 100%)`
                          : 'transparent',
                        color: isActive ? adminTheme.text.primary : adminTheme.text.secondary,
                        border: isActive ? `1px solid ${SITE_COLOR}30` : '1px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = adminTheme.bg.accent;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <item.icon
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: isActive ? SITE_COLOR : adminTheme.text.muted }}
                      />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">{item.label}</span>
                          {'badge' in item && item.badge && (
                            <span
                              className="px-2 py-0.5 text-xs font-semibold rounded-full"
                              style={{
                                background: `linear-gradient(135deg, ${SITE_COLOR} 0%, ${SITE_COLOR}cc 100%)`,
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
          style={{ borderTop: `1px solid ${adminTheme.border.subtle}` }}
        >
          <a
            href="/"
            target="_blank"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            style={{ color: adminTheme.text.secondary }}
            onMouseEnter={(e) => e.currentTarget.style.background = adminTheme.bg.accent}
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
            style={{ color: adminTheme.status.error }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${adminTheme.status.error}15`}
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
            background: `${adminTheme.bg.primary}ee`,
            borderBottom: `1px solid ${adminTheme.border.subtle}`,
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg"
              style={{ color: adminTheme.text.muted }}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: SITE_COLOR }}
              />
              <h1
                className="text-lg font-semibold"
                style={{ color: adminTheme.text.primary }}
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
                style={{ color: adminTheme.text.muted }}
              />
              <input
                type="text"
                placeholder="Hledat v obsahu..."
                className="w-full h-10 pl-10 pr-4 text-sm transition-all focus:outline-none"
                style={{
                  background: adminTheme.bg.tertiary,
                  border: `1px solid ${searchFocused ? SITE_COLOR : adminTheme.border.medium}`,
                  borderRadius: adminTheme.radius.lg,
                  color: adminTheme.text.primary,
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                className="p-2.5 rounded-xl transition-colors relative"
                style={{ color: adminTheme.text.muted }}
                onMouseEnter={(e) => e.currentTarget.style.background = adminTheme.bg.tertiary}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Bell className="w-5 h-5" />
                <span
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ background: adminTheme.status.success }}
                />
              </button>
              <button
                className="p-2.5 rounded-xl transition-colors"
                style={{ color: adminTheme.text.muted }}
                onMouseEnter={(e) => e.currentTarget.style.background = adminTheme.bg.tertiary}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            <div
              className="h-8 w-px mx-2"
              style={{ background: adminTheme.border.medium }}
            />

            {/* User */}
            <button
              className="flex items-center gap-3 p-1.5 rounded-xl transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.background = adminTheme.bg.tertiary}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold text-sm"
                style={{ background: `linear-gradient(135deg, ${SITE_COLOR} 0%, ${SITE_COLOR}cc 100%)` }}
              >
                A
              </div>
              <div className="hidden sm:block text-left">
                <p
                  className="text-sm font-medium"
                  style={{ color: adminTheme.text.primary }}
                >
                  Admin
                </p>
                <p
                  className="text-xs"
                  style={{ color: adminTheme.text.muted }}
                >
                  PJ Správa
                </p>
              </div>
              <ChevronDown
                className="w-4 h-4 hidden sm:block"
                style={{ color: adminTheme.text.muted }}
              />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div
          className="flex-1 p-6 lg:p-8 overflow-auto"
          style={{ background: adminTheme.bg.primary }}
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
