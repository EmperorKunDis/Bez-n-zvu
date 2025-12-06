"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Building2,
  Users,
  MessageSquare,
  Globe,
  User,
  Lock,
  Palette,
  Eye,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Zap,
  ExternalLink
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  siteName: string;
  themeColor: string;
}

const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'H3sl0Pr4utJ3d3';

export function AdminLayout({ children, activeSection, onSectionChange, siteName, themeColor }: AdminLayoutProps) {
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Přehled webu' },
    { id: 'visual-editor', label: 'Vizuální editor', icon: Layers, description: 'Upravit stránku' },
    { id: 'hero', label: 'Hero sekce', icon: Home, description: 'Hlavní banner' },
    { id: 'services', label: 'Služby', icon: Building2, description: 'Nabídka služeb' },
    { id: 'about', label: 'O mně', icon: Users, description: 'Osobní profil' },
    { id: 'contact', label: 'Kontakt', icon: MessageSquare, description: 'Kontaktní údaje' },
    { id: 'translations', label: 'Překlady', icon: Globe, description: 'Jazykové verze' },
    { id: 'images', label: 'Média', icon: ImageIcon, description: 'Správa obrázků' },
    { id: 'settings', label: 'Nastavení', icon: Settings, description: 'Konfigurace' },
  ];

  // Login Screen with modern dark design
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ backgroundColor: themeColor }}
          />
          <div
            className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-10"
            style={{ backgroundColor: themeColor }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative z-10 w-full max-w-md mx-4">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
              <Zap className="w-8 h-8 text-white" style={{ filter: `drop-shadow(0 0 8px ${themeColor})` }} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Vítejte zpět</h1>
            <p className="text-gray-500">{siteName} Editor</p>
          </div>

          {/* Login Form */}
          <div className="bg-[#141414]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Uživatelské jméno
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Zadejte uživatelské jméno"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Heslo
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Zadejte heslo"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  <X className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg flex items-center justify-center gap-2"
                style={{
                  backgroundColor: themeColor,
                  boxShadow: `0 0 30px ${themeColor}40`
                }}
              >
                <Sparkles className="w-5 h-5" />
                Přihlásit se
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-center text-xs text-gray-600">
                Přístup pouze pro autorizované uživatele
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Admin Interface
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col bg-[#141414] border-r border-white/10 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${themeColor}20` }}
              >
                <Zap className="w-5 h-5" style={{ color: themeColor }} />
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <h2 className="font-bold text-white text-sm truncate">{siteName}</h2>
                  <p className="text-xs text-gray-500">Editor</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onSectionChange(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                style={isActive ? {
                  backgroundColor: `${themeColor}20`,
                  boxShadow: `inset 0 0 0 1px ${themeColor}40`
                } : {}}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon
                  className="w-5 h-5 flex-shrink-0 transition-colors"
                  style={isActive ? { color: themeColor } : {}}
                />
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    {!isActive && (
                      <p className="text-xs text-gray-600 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
                {!sidebarCollapsed && item.id === 'visual-editor' && (
                  <span
                    className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title={sidebarCollapsed ? 'Zobrazit web' : undefined}
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Zobrazit web</span>}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title={sidebarCollapsed ? 'Odhlásit se' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Odhlásit se</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#141414]/80 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg font-bold text-white">
                {navItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                {navItems.find(item => item.id === activeSection)?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-lg p-1">
              <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Náhled">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Nastavení">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-gray-500">Administrátor</p>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: themeColor }}
              >
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
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
