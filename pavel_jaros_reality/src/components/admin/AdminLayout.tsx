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
  ChevronLeft,
  ChevronRight,
  Layers,
  ExternalLink,
  FolderOpen,
  HelpCircle,
  Bell,
  Search,
  Building2,
  Star,
  AlertCircle
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// PJ REALITY - STANDALONE ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════

const theme = {
  bg: {
    primary: '#0F0F12',
    secondary: '#1A1A1F',
    tertiary: '#242429',
    accent: '#2D2D35',
  },
  brand: {
    primary: '#DC2626',
    secondary: '#EF4444',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
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
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
};

// PJ Reality specific color
const SITE_COLOR = '#DC2626';
const SITE_NAME = 'PJ Reality';

// ═══════════════════════════════════════════════════════════════════════════
// REALITY WEBSITE DATA - Actual content from the website
// ═══════════════════════════════════════════════════════════════════════════

export const siteData = {
  name: 'PJ Reality',
  url: '/',
  color: '#DC2626',
  sections: {
    hero: {
      title: 'Maximalizujte zisk z vaší nemovitosti',
      cta: 'MNOU NABÍZENÉ SLUŽBY',
    },
    services: [
      {
        id: 'sale',
        title: 'PRODEJ',
        description: 'Mým cílem je prodat vaši nemovitost za nejvyšší možnou cenu na trhu a zajistit, aby celý proces proběhl hladce a efektivně.'
      },
      {
        id: 'rent',
        title: 'PRONÁJEM',
        description: 'Vždy se snažím dosáhnout co nejvyšší ceny pronájmu a současně najít solventní nájemníky, kteří budou mít zájem o dlouhodobý pronájem.'
      },
      {
        id: 'marketing',
        title: 'MARKETING A STRATEGIE',
        description: 'Marketing a reklama tvoří neoddělitelnou část mé práce. Dávám si záležet na zvolení vhodné strategie s maximálním nasazením.'
      },
      {
        id: 'presentation',
        title: 'PREZENTACE NEMOVITOSTI',
        description: 'Při prezentaci nemovitosti vždy kladu důraz na detail s využitím nejnovějších technologií, včetně kvalitních fotografií a 3D vizualizací.'
      },
      {
        id: 'reconstruction',
        title: 'REKONSTRUKCE NEMOVITOSTI',
        description: 'Díky zkušenostem z několika kompletních rekonstrukcí, vám mohu doporučit vhodné řešení a případně zajistit profesionály.'
      },
      {
        id: 'valuation',
        title: 'ODHAD CENY NEMOVITOSTI',
        description: 'K ocenění nemovitosti využívám ověřené nástroje, jako jsou například cenové mapy, společně s katastrem nemovitostí.'
      },
    ],
    about: {
      name: 'Pavel Jaroš',
      subtitle: 'O MNĚ',
      intro: 'Jmenuji se Pavel Jaroš a jsem realitní makléř, který se neustále snaží o profesní růst a zdokonalování v oboru.',
      origin: 'Pocházím z Chebu a v realitách se pohybují čtvrtým rokem jako investor (nákup - rekonstrukce - prodej).',
      motivation: 'Jelikož bych se rád v tomto oboru zdokonalil, rozhodl jsem se pro cestu realitního makléře.',
      passion: 'Baví mě hledat vhodná řešení, komunikovat, propojovat dodavatele, investory a vše ostatní, co s nemovitostmi souvisí.',
      values: 'Vyznačuji se empatií a plně chápu, že každý klient vyžaduje individuální a flexibilní přístup.',
    },
    references: [
      {
        name: 'Daniela Baudýsová',
        text: 'Děkujeme za rychlý a bezproblémový prodej chaty. Pan Jaroš je ochotný, vstřícný a velmi profesionální. Určitě doporučujeme.'
      },
      {
        name: 'David',
        text: 'Pan Jaroš byl skvělý – profesionální, rychlý a vždy k dispozici. Díky za bezproblémový prodej a lidský přístup.'
      },
      {
        name: 'Josef Neumann',
        text: 'Proaktivní přístup a perfektní komunikace. Maximální spokojenost!'
      },
    ],
    contact: {
      address: 'Kaprova 52/6, Praha 1',
      phone: '+420 777 558 730',
      email: 'pavel.jaros@kwcz.cz',
    },
  },
  // ACTUAL IMAGES from /public folder
  images: [
    { path: '/images/PavelFotka.png', name: 'Pavel Jaroš - Foto', category: 'profile' },
    { path: '/logo/PJ_Reality_logo.svg', name: 'PJ Reality Logo', category: 'logo' },
    { path: '/logo/PJ_Reality_symbol.svg', name: 'PJ Reality Symbol', category: 'logo' },
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
    const stored = sessionStorage.getItem('admin-auth-reality');
    if (stored === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth-reality', 'true');
      setError('');
    } else {
      setError('Nesprávné přihlašovací údaje');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth-reality');
  };

  // Navigation for PJ Reality ONLY
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
        { id: 'services', label: 'Služby', icon: Briefcase },
        { id: 'about', label: 'O mně', icon: User },
        { id: 'references', label: 'Reference', icon: Star },
        { id: 'contact', label: 'Kontakt', icon: Phone },
      ]
    },
    {
      label: 'Správa',
      items: [
        { id: 'translations', label: 'Překlady (6 jazyků)', icon: Globe },
        { id: 'images', label: 'Média & Obrázky', icon: FolderOpen },
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
          style={{ background: SITE_COLOR }}
        />
        <div
          className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: SITE_COLOR }}
        />

        <div className="relative w-full max-w-md">
          <div className="text-center mb-10">
            {/* Logo */}
            <div className="mb-6">
              <img
                src="/logo/PJ_Reality_logo.svg"
                alt="PJ Reality"
                className="h-16 mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{
                background: `linear-gradient(135deg, ${SITE_COLOR} 0%, ${SITE_COLOR}cc 100%)`,
                boxShadow: `0 0 40px ${SITE_COLOR}40`,
              }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: theme.text.primary }}
            >
              {SITE_NAME} Admin
            </h1>
            <p style={{ color: theme.text.muted }}>
              Správa webu PJ Reality
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
                  background: `linear-gradient(135deg, ${SITE_COLOR} 0%, ${SITE_COLOR}cc 100%)`,
                  borderRadius: theme.radius.lg,
                  boxShadow: `0 4px 20px ${SITE_COLOR}40`,
                }}
              >
                Přihlásit se
              </button>
            </form>
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
        {/* Sidebar Header - REALITY ONLY */}
        <div
          className="px-4 py-4"
          style={{ borderBottom: `1px solid ${theme.border.subtle}` }}
        >
          <div className={`flex items-center gap-3 p-3 rounded-xl ${sidebarCollapsed ? 'justify-center' : ''}`}
            style={{
              background: `${SITE_COLOR}15`,
              border: `1px solid ${SITE_COLOR}30`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: SITE_COLOR }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: theme.text.primary }}>
                  {SITE_NAME}
                </p>
                <p className="text-xs truncate" style={{ color: theme.text.muted }}>
                  Admin Panel
                </p>
              </div>
            )}
          </div>

          {/* Collapse Button */}
          <div className="flex items-center justify-between mt-4">
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
                          ? `linear-gradient(135deg, ${SITE_COLOR}20 0%, ${SITE_COLOR}10 100%)`
                          : 'transparent',
                        color: isActive ? theme.text.primary : theme.text.secondary,
                        border: isActive ? `1px solid ${SITE_COLOR}30` : '1px solid transparent',
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
                        style={{ color: isActive ? SITE_COLOR : theme.text.muted }}
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
          style={{ borderTop: `1px solid ${theme.border.subtle}` }}
        >
          <a
            href="/"
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
                style={{ background: SITE_COLOR }}
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
                  border: `1px solid ${searchFocused ? SITE_COLOR : theme.border.medium}`,
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
                style={{ background: `linear-gradient(135deg, ${SITE_COLOR} 0%, ${SITE_COLOR}cc 100%)` }}
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
                  {SITE_NAME}
                </p>
              </div>
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

export { theme as adminTheme };
