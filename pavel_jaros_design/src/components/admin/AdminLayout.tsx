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
  TrendingUp,
  Clock,
  ArrowUpRight,
  Check,
  Plus
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// MODERN DESIGN SYSTEM - Premium SaaS Aesthetic
// ═══════════════════════════════════════════════════════════════════════════

const theme = {
  // Core Colors
  bg: {
    primary: '#0F0F12',      // Deep charcoal - main background
    secondary: '#1A1A1F',    // Elevated surfaces
    tertiary: '#242429',     // Cards, inputs
    accent: '#2D2D35',       // Hover states
  },
  // Brand Colors
  brand: {
    primary: '#6366F1',      // Indigo - main brand
    secondary: '#8B5CF6',    // Purple - accents
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
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
  // Shadows
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    glow: '0 0 40px rgba(99, 102, 241, 0.15)',
  },
  // Border Radius
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
};

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  siteName: string;
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
  const [searchFocused, setSearchFocused] = useState(false);

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

  // Navigation Structure
  const navGroups = [
    {
      label: 'Hlavní',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'visual-editor', label: 'Vizuální editor', icon: Layers, badge: 'Nový' },
      ]
    },
    {
      label: 'Obsah',
      items: [
        { id: 'hero', label: 'Hero sekce', icon: Home },
        { id: 'services', label: 'Služby', icon: Briefcase },
        { id: 'about', label: 'O mně', icon: User },
        { id: 'contact', label: 'Kontakt', icon: Phone },
      ]
    },
    {
      label: 'Správa',
      items: [
        { id: 'translations', label: 'Překlady', icon: Globe },
        { id: 'images', label: 'Média', icon: FolderOpen },
        { id: 'settings', label: 'Nastavení', icon: Settings },
      ]
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGIN SCREEN - Premium Dark Design
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ 
          background: `radial-gradient(ellipse at top, ${theme.bg.secondary} 0%, ${theme.bg.primary} 60%)`,
        }}
      >
        {/* Background Grid Pattern */}
        <div 
          className="fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${theme.border.medium} 1px, transparent 1px), linear-gradient(90deg, ${theme.border.medium} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Gradient Orbs */}
        <div 
          className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: theme.brand.primary }}
        />
        <div 
          className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: theme.brand.secondary }}
        />

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{ 
                background: theme.brand.gradient,
                boxShadow: theme.shadow.glow,
              }}
            >
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: theme.text.primary }}
            >
              {siteName}
            </h1>
            <p style={{ color: theme.text.muted }}>
              Přihlaste se do administrace
            </p>
          </div>

          {/* Login Card */}
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
              {/* Username */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text.secondary }}
                >
                  Uživatelské jméno
                </label>
                <div className="relative group">
                  <User 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
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

              {/* Password */}
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

              {/* Error */}
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
                  <X className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-12 font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: theme.brand.gradient,
                  borderRadius: theme.radius.lg,
                  boxShadow: `0 4px 20px ${theme.brand.primary}40`,
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
              Pouze pro autorizované uživatele
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
      {/* ═══════════════════════════════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: theme.bg.secondary,
          borderRight: `1px solid ${theme.border.subtle}`,
        }}
      >
        {/* Sidebar Header */}
        <div 
          className="h-16 flex items-center justify-between px-4"
          style={{ borderBottom: `1px solid ${theme.border.subtle}` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: theme.brand.gradient }}
            >
              <span className="text-white font-bold text-sm">PJ</span>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <h2 
                  className="font-semibold text-sm truncate"
                  style={{ color: theme.text.primary }}
                >
                  {siteName}
                </h2>
                <p 
                  className="text-xs"
                  style={{ color: theme.text.muted }}
                >
                  Administrace
                </p>
              </div>
            )}
          </div>

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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              {!sidebarCollapsed && (
                <div 
                  className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider"
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
                          ? `linear-gradient(135deg, ${theme.brand.primary}20 0%, ${theme.brand.secondary}10 100%)`
                          : 'transparent',
                        color: isActive ? theme.text.primary : theme.text.secondary,
                        border: isActive ? `1px solid ${theme.brand.primary}30` : '1px solid transparent',
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
                        style={{ color: isActive ? theme.brand.primary : theme.text.muted }}
                      />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">{item.label}</span>
                          {item.badge && (
                            <span
                              className="px-2 py-0.5 text-xs font-semibold rounded-full"
                              style={{ 
                                background: theme.brand.gradient,
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

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-xl"
          style={{
            background: `${theme.bg.primary}ee`,
            borderBottom: `1px solid ${theme.border.subtle}`,
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg"
              style={{ color: theme.text.muted }}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 
                className="text-lg font-semibold"
                style={{ color: theme.text.primary }}
              >
                {navGroups.flatMap(g => g.items).find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div 
              className="hidden md:flex items-center relative transition-all duration-200"
              style={{ width: searchFocused ? '280px' : '200px' }}
            >
              <Search 
                className="absolute left-3 w-4 h-4" 
                style={{ color: theme.text.muted }}
              />
              <input
                type="text"
                placeholder="Hledat..."
                className="w-full h-10 pl-10 pr-4 text-sm transition-all focus:outline-none"
                style={{
                  background: theme.bg.tertiary,
                  border: `1px solid ${searchFocused ? theme.brand.primary : theme.border.medium}`,
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
                  style={{ background: theme.status.error }}
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

            {/* Divider */}
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
                style={{ background: theme.brand.gradient }}
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

// Export theme for use in other components
export { theme as adminTheme };
