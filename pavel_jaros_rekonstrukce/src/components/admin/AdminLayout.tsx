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
  Palette,
  HelpCircle,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// DESIGN SYSTEM TOKENS (from UI/UX Document)
// ═══════════════════════════════════════════════════════════════════

const colors = {
  primary: '#2563EB',       // Main actions, links, active states
  primaryDark: '#1D4ED8',   // Hover states
  secondary: '#64748B',     // Secondary text, icons
  success: '#22C55E',       // Success messages
  warning: '#F59E0B',       // Warnings
  danger: '#EF4444',        // Errors, delete actions
  dark: '#1E293B',          // Headings, primary text
  background: '#F8FAFC',    // Page background
  surface: '#FFFFFF',       // Cards, panels
  border: '#E2E8F0',        // Borders, dividers
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
};

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  siteName: string;
  themeColor?: string; // Optional - we'll use blue by default
}

const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'H3sl0Pr4utJ3d3';

export function AdminLayout({ children, activeSection, onSectionChange, siteName }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('admin-auth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
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

  // Grouped Navigation Structure (as per document)
  const navGroups = [
    {
      label: 'Správa obsahu',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'visual-editor', label: 'Vizuální editor', icon: Layers, badge: 'Nový' },
      ]
    },
    {
      label: 'Sekce webu',
      items: [
        { id: 'hero', label: 'Hero sekce', icon: Home },
        { id: 'services', label: 'Služby', icon: Briefcase },
        { id: 'about', label: 'O mně', icon: User },
        { id: 'contact', label: 'Kontakt', icon: Phone },
      ]
    },
    {
      label: 'Lokalizace',
      items: [
        { id: 'translations', label: 'Překlady', icon: Globe },
      ]
    },
    {
      label: 'Soubory',
      items: [
        { id: 'images', label: 'Knihovna médií', icon: FolderOpen },
      ]
    },
    {
      label: 'Systém',
      items: [
        { id: 'settings', label: 'Nastavení', icon: Settings },
      ]
    },
  ];

  // ═══════════════════════════════════════════════════════════════════
  // LOGIN SCREEN - Clean, professional design
  // ═══════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: colors.background }}
      >
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <Layers className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: colors.dark }}>
              Přihlášení do administrace
            </h1>
            <p className="mt-2" style={{ color: colors.secondary }}>
              {siteName}
            </p>
          </div>

          {/* Login Card */}
          <div
            className="rounded-xl p-8 shadow-sm"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`
            }}
          >
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Field */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.dark }}
                >
                  Uživatelské jméno
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Zadejte uživatelské jméno"
                    className="w-full h-11 pl-11 pr-4 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.dark,
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.dark }}
                >
                  Heslo
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Zadejte heslo"
                    className="w-full h-11 pl-11 pr-4 rounded-lg text-sm transition-all focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.dark,
                    }}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="flex items-center gap-2 text-sm px-4 py-3 rounded-lg"
                  style={{
                    backgroundColor: `${colors.danger}10`,
                    color: colors.danger,
                    border: `1px solid ${colors.danger}30`
                  }}
                >
                  <X className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-11 rounded-lg text-white font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: colors.primary }}
              >
                Přihlásit se
              </button>
            </form>

            <div
              className="mt-6 pt-6 text-center text-sm"
              style={{
                borderTop: `1px solid ${colors.border}`,
                color: colors.textMuted
              }}
            >
              Přístup pouze pro autorizované uživatele
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // MAIN ADMIN INTERFACE
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.background }}>

      {/* ─────────────────────────────────────────────────────────────────
          SIDEBAR (240px, collapsible to 72px)
      ───────────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-60'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors.border}`
        }}
      >
        {/* Sidebar Header - Logo Area (64px height) */}
        <div
          className="h-16 flex items-center justify-between px-4"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.primary }}
            >
              <span className="text-white font-bold text-sm">PJ</span>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <h2
                  className="font-semibold text-sm truncate"
                  style={{ color: colors.dark }}
                >
                  {siteName}
                </h2>
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  Administrace
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-md transition-colors hover:bg-gray-100"
            style={{ color: colors.secondary }}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5"
            style={{ color: colors.secondary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              {/* Group Label */}
              {!sidebarCollapsed && (
                <div
                  className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: colors.textMuted }}
                >
                  {group.label}
                </div>
              )}

              {/* Group Items */}
              <div className="px-3 space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onSectionChange(item.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        sidebarCollapsed ? 'justify-center' : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? `${colors.primary}10` : 'transparent',
                        color: isActive ? colors.primary : colors.textSecondary,
                        borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent',
                      }}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span
                            className="flex-1 text-sm font-medium"
                            style={{ color: isActive ? colors.primary : colors.dark }}
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                              style={{ backgroundColor: colors.primary }}
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
          style={{ borderTop: `1px solid ${colors.border}` }}
        >
          <a
            href="/"
            target="_blank"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-gray-100 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            style={{ color: colors.textSecondary }}
            title={sidebarCollapsed ? 'Zobrazit web' : undefined}
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Zobrazit web</span>}
          </a>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-red-50 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            style={{ color: colors.danger }}
            title={sidebarCollapsed ? 'Odhlásit se' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Odhlásit se</span>}
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────────
          MAIN CONTENT AREA
      ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Top Header Bar */}
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40"
          style={{
            backgroundColor: colors.surface,
            borderBottom: `1px solid ${colors.border}`
          }}
        >
          {/* Left: Mobile menu + Page title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              style={{ color: colors.secondary }}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1
                className="text-lg font-semibold"
                style={{ color: colors.dark }}
              >
                {navGroups.flatMap(g => g.items).find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          {/* Right: Search, Actions, User */}
          <div className="flex items-center gap-3">
            {/* Search (desktop only) */}
            <div className="hidden md:flex items-center relative">
              <Search
                className="absolute left-3 w-4 h-4"
                style={{ color: colors.textMuted }}
              />
              <input
                type="text"
                placeholder="Hledat..."
                className="h-9 pl-10 pr-4 rounded-lg text-sm w-48 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.dark
                }}
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: colors.secondary }}
                title="Náhled webu"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                style={{ color: colors.secondary }}
                title="Oznámení"
              >
                <Bell className="w-5 h-5" />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.danger }}
                />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: colors.secondary }}
                title="Nápověda"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Divider */}
            <div
              className="h-8 w-px mx-2"
              style={{ backgroundColor: colors.border }}
            />

            {/* User Menu */}
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: colors.primary }}
              >
                A
              </div>
              <div className="hidden sm:block text-left">
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.dark }}
                >
                  Admin
                </p>
              </div>
              <ChevronDown
                className="w-4 h-4 hidden sm:block"
                style={{ color: colors.textMuted }}
              />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div
          className="flex-1 p-6 lg:p-8 overflow-auto"
          style={{ backgroundColor: colors.background }}
        >
          {/* Content Container - max 1200px centered */}
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

// Export design tokens for use in other components
export { colors as adminColors };
