"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { LayoutDashboard, Image as ImageIcon, Settings, LogOut, Menu, X, Home, Briefcase, Phone, Globe, Lock, ChevronLeft, ChevronRight, Layers, ExternalLink, FolderOpen, HelpCircle, Bell, Search, Hammer, Star, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// PJ REKONSTRUKCE - STANDALONE ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════

const theme = {
  bg: { primary: '#0F0F12', secondary: '#1A1A1F', tertiary: '#242429', accent: '#2D2D35' },
  text: { primary: '#FFFFFF', secondary: '#A1A1AA', muted: '#71717A' },
  status: { success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' },
  border: { subtle: 'rgba(255, 255, 255, 0.06)', medium: 'rgba(255, 255, 255, 0.1)', strong: 'rgba(255, 255, 255, 0.15)' },
  radius: { sm: '6px', md: '10px', lg: '14px', xl: '20px' },
};

const SITE_COLOR = '#F59E0B';
const SITE_NAME = 'PJ Rekonstrukce';

export const siteData = {
  name: 'PJ Rekonstrukce',
  url: '/',
  color: '#F59E0B',
  sections: {
    hero: {
      title: 'Proměníme vaše sny v realitu.',
      subtitle: 'Provádíme kompletní rekonstrukce bytů a domů v Karlovarském kraji. Od prvotního návrhu až po finální úklid – spolehlivě, kvalitně a v termínu.',
      ctaPrimary: 'Spočítat cenu rekonstrukce',
      ctaSecondary: 'Prohlédnout realizace',
    },
    services: [
      { id: 'cores', title: 'Rekonstrukce bytových jader', description: 'Modernizujeme a přestavujeme umakartová i zděná jádra.' },
      { id: 'apartments', title: 'Kompletní rekonstrukce bytů', description: 'Zajistíme vše od bouracích prací přes nové rozvody až po finální povrchy.' },
      { id: 'houses', title: 'Rekonstrukce rodinných domů', description: 'Realizujeme vnitřní i vnější rekonstrukce domů, včetně zateplení a fasád.' },
      { id: 'crafts', title: 'Řemeslné práce', description: 'Nabízíme i samostatné zednické, obkladačské, podlahářské, instalatérské a elektrikářské práce.' },
    ],
    projects: [
      { name: 'Proměna bytu 3+1', location: 'Karlovy Vary' },
      { name: 'Nová koupelna a jádro', location: 'Cheb' },
      { name: 'Rekonstrukce přízemí rodinného domu', location: 'Sokolov' },
    ],
    why: [
      { title: 'Jedna firma, všechny práce', text: 'Nemusíte shánět a koordinovat různá řemesla.' },
      { title: 'Dodržujeme termíny a rozpočty', text: 'Na začátku stanovíme pevný rozpočet a harmonogram prací.' },
      { title: 'Důraz na kvalitu a detail', text: 'Používáme certifikované materiály a ověřené postupy.' },
      { title: 'Osobní přístup a poradenství', text: 'Jsme vaším partnerem po celou dobu projektu.' },
    ],
    process: [
      { step: 1, title: 'Kontakt a úvodní konzultace', text: 'Zavoláte nám nebo napíšete. Probereme vaše představy zdarma.' },
      { step: 2, title: 'Zaměření a cenová nabídka', text: 'Provedeme přesné zaměření a do týdne vám připravíme detailní nabídku.' },
      { step: 3, title: 'Smlouva a harmonogram', text: 'Po odsouhlasení nabídky podepíšeme smlouvu o dílo.' },
      { step: 4, title: 'Realizace rekonstrukce', text: 'Náš tým se pustí do práce.' },
      { step: 5, title: 'Předání a záruka', text: 'Po dokončení prací a finálním úklidu vám dílo protokolárně předáme.' },
    ],
    references: [
      { name: 'Rodina Nováková', location: 'Mariánské Lázně', text: 'Oceňuji skvělou komunikaci pana Jaroše a dodržení ceny i termínu.' },
      { name: 'Petr S.', location: 'Cheb', text: 'Vše zvládli v rekordním čase a ve skvělé kvalitě. Mohu jen doporučit.' },
    ],
    contact: { phone: '+420 777 558 730', email: 'pavel.jaros@kwcz.cz', address: 'Karlovarský kraj' },
  },
  images: [
    { path: '/images/PajaBezPrdeleReko.png', name: 'Pavel Jaroš - Rekonstrukce', category: 'profile' },
    { path: '/logo/PJ_Reko_logo.svg', name: 'PJ Rekonstrukce Logo', category: 'logo' },
    { path: '/logo/PJ_Reko_symbol.svg', name: 'PJ Rekonstrukce Symbol', category: 'logo' },
  ],
};

interface AdminLayoutProps { children: ReactNode; activeSection: string; onSectionChange: (section: string) => void; }

export function AdminLayout({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { if (sessionStorage.getItem('admin-auth-rekonstrukce') === 'true') setIsAuthenticated(true); }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'H3sl0Pr4utJ3d3') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth-rekonstrukce', 'true');
    } else { setError('Nesprávné přihlašovací údaje'); }
  };

  const handleLogout = () => { setIsAuthenticated(false); sessionStorage.removeItem('admin-auth-rekonstrukce'); };

  const navGroups = [
    { label: 'Hlavní', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'visual-editor', label: 'Vizuální editor', icon: Layers, badge: 'Pro' }] },
    { label: 'Obsah webu', items: [{ id: 'hero', label: 'Hero sekce', icon: Home }, { id: 'services', label: 'Služby', icon: Briefcase }, { id: 'projects', label: 'Realizace', icon: ImageIcon }, { id: 'why', label: 'Proč my', icon: CheckCircle }, { id: 'process', label: 'Proces', icon: Clock }, { id: 'references', label: 'Reference', icon: Star }, { id: 'contact', label: 'Kontakt', icon: Phone }] },
    { label: 'Správa', items: [{ id: 'translations', label: 'Překlady (6 jazyků)', icon: Globe }, { id: 'images', label: 'Média & Obrázky', icon: FolderOpen }, { id: 'seo', label: 'SEO & Meta', icon: Search }, { id: 'settings', label: 'Nastavení', icon: Settings }] }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: `radial-gradient(ellipse at top, ${theme.bg.secondary} 0%, ${theme.bg.primary} 60%)` }}>
        <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: SITE_COLOR }} />
        <div className="relative w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mb-6"><img src="/logo/PJ_Reko_logo.svg" alt="PJ Rekonstrukce" className="h-16 mx-auto" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ background: SITE_COLOR, boxShadow: `0 0 40px ${SITE_COLOR}40` }}>
              <Hammer className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-white">{SITE_NAME} Admin</h1>
            <p style={{ color: theme.text.muted }}>Správa webu PJ Rekonstrukce</p>
          </div>
          <div className="p-8 backdrop-blur-xl" style={{ background: `${theme.bg.secondary}ee`, borderRadius: theme.radius.xl, border: `1px solid ${theme.border.medium}` }}>
            <form onSubmit={handleLogin} className="space-y-6">
              <div><label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Uživatelské jméno</label>
                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.text.muted }} />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Zadejte jméno" className="w-full h-12 pl-12 pr-4 text-sm focus:outline-none" style={{ background: theme.bg.primary, border: `1px solid ${theme.border.medium}`, borderRadius: theme.radius.lg, color: theme.text.primary }} />
                </div></div>
              <div><label className="block text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>Heslo</label>
                <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.text.muted }} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-12 pl-12 pr-4 text-sm focus:outline-none" style={{ background: theme.bg.primary, border: `1px solid ${theme.border.medium}`, borderRadius: theme.radius.lg, color: theme.text.primary }} />
                </div></div>
              {error && <div className="flex items-center gap-3 px-4 py-3 text-sm" style={{ background: `${theme.status.error}15`, border: `1px solid ${theme.status.error}30`, borderRadius: theme.radius.md, color: theme.status.error }}><AlertCircle className="w-4 h-4" />{error}</div>}
              <button type="submit" className="w-full h-12 font-semibold text-white transition-all hover:scale-[1.02]" style={{ background: SITE_COLOR, borderRadius: theme.radius.lg, boxShadow: `0 4px 20px ${SITE_COLOR}40` }}>Přihlásit se</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: theme.bg.primary }}>
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-72'} ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ background: theme.bg.secondary, borderRight: `1px solid ${theme.border.subtle}` }}>
        <div className="px-4 py-4" style={{ borderBottom: `1px solid ${theme.border.subtle}` }}>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${sidebarCollapsed ? 'justify-center' : ''}`} style={{ background: `${SITE_COLOR}15`, border: `1px solid ${SITE_COLOR}30` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: SITE_COLOR }}><Hammer className="w-5 h-5 text-white" /></div>
            {!sidebarCollapsed && <div className="flex-1 text-left min-w-0"><p className="font-semibold text-sm truncate text-white">{SITE_NAME}</p><p className="text-xs truncate" style={{ color: theme.text.muted }}>Admin Panel</p></div>}
          </div>
          <div className="flex items-center justify-between mt-4">
            {!sidebarCollapsed && <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.muted }}>Navigace</span>}
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex p-2 rounded-lg" style={{ color: theme.text.muted }}>{sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}</button>
            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-2" style={{ color: theme.text.muted }}><X className="w-5 h-5" /></button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navGroups.map((group, gi) => (<div key={gi} className="mb-6">{!sidebarCollapsed && <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.muted }}>{group.label}</div>}
            <div className="space-y-1">{group.items.map((item) => { const isActive = activeSection === item.id; return (<button key={item.id} onClick={() => { onSectionChange(item.id); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${sidebarCollapsed ? 'justify-center' : ''}`} style={{ background: isActive ? `${SITE_COLOR}20` : 'transparent', color: isActive ? theme.text.primary : theme.text.secondary, border: isActive ? `1px solid ${SITE_COLOR}30` : '1px solid transparent' }} title={sidebarCollapsed ? item.label : undefined}><item.icon className="w-5 h-5" style={{ color: isActive ? SITE_COLOR : theme.text.muted }} />{!sidebarCollapsed && <><span className="flex-1 text-sm font-medium">{item.label}</span>{'badge' in item && item.badge && <span className="px-2 py-0.5 text-xs font-semibold rounded-full text-white" style={{ background: SITE_COLOR }}>{item.badge}</span>}</>}</button>); })}</div>
          </div>))}
        </nav>
        <div className="p-3 space-y-1" style={{ borderTop: `1px solid ${theme.border.subtle}` }}>
          <a href="/" target="_blank" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${sidebarCollapsed ? 'justify-center' : ''}`} style={{ color: theme.text.secondary }}><ExternalLink className="w-5 h-5" />{!sidebarCollapsed && <span className="text-sm">Zobrazit web</span>}</a>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${sidebarCollapsed ? 'justify-center' : ''}`} style={{ color: theme.status.error }}><LogOut className="w-5 h-5" />{!sidebarCollapsed && <span className="text-sm">Odhlásit se</span>}</button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-xl" style={{ background: `${theme.bg.primary}ee`, borderBottom: `1px solid ${theme.border.subtle}` }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg" style={{ color: theme.text.muted }}><Menu className="w-5 h-5" /></button>
            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full" style={{ background: SITE_COLOR }} /><h1 className="text-lg font-semibold text-white">{navGroups.flatMap(g => g.items).find(item => item.id === activeSection)?.label || 'Dashboard'}</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl relative" style={{ color: theme.text.muted }}><Bell className="w-5 h-5" /><span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: theme.status.success }} /></button>
            <button className="p-2.5 rounded-xl" style={{ color: theme.text.muted }}><HelpCircle className="w-5 h-5" /></button>
            <div className="h-8 w-px mx-2" style={{ background: theme.border.medium }} />
            <button className="flex items-center gap-3 p-1.5 rounded-xl"><div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold text-sm" style={{ background: SITE_COLOR }}>A</div><div className="hidden sm:block text-left"><p className="text-sm font-medium text-white">Admin</p><p className="text-xs" style={{ color: theme.text.muted }}>{SITE_NAME}</p></div></button>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8 overflow-auto" style={{ background: theme.bg.primary }}><div className="max-w-7xl mx-auto">{children}</div></div>
      </main>
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
    </div>
  );
}

export { theme as adminTheme };
