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
  Globe
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  siteName: string;
  themeColor: string;
}

const ADMIN_PASSWORD = 'pj-admin-2024';

export function AdminLayout({ children, activeSection, onSectionChange, siteName, themeColor }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('admin-auth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      setError('');
    } else {
      setError('Nesprávné heslo');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero sekce', icon: Home },
    { id: 'services', label: 'Služby', icon: Building2 },
    { id: 'about', label: 'O mně', icon: Users },
    { id: 'contact', label: 'Kontakt', icon: MessageSquare },
    { id: 'translations', label: 'Překlady', icon: Globe },
    { id: 'images', label: 'Obrázky', icon: ImageIcon },
    { id: 'settings', label: 'Nastavení', icon: Settings },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: themeColor }}
            >
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">{siteName}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heslo
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Zadejte heslo..."
                className="w-full"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full text-white"
              style={{ backgroundColor: themeColor }}
            >
              Přihlásit se
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Pro přístup kontaktujte administrátora
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{ backgroundColor: themeColor }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              {sidebarOpen && (
                <div className="text-white">
                  <h2 className="font-bold text-sm">Admin Panel</h2>
                  <p className="text-xs opacity-80">{siteName}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeSection === item.id ? { backgroundColor: themeColor } : {}}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="text-sm font-medium">Odhlásit se</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {navItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Zobrazit web
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
