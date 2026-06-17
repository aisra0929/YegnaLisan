/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Hero from './modules/landing/Hero';
import Services from './modules/landing/Services';
import Portfolio from './modules/landing/Portfolio';
import Team from './modules/landing/Team';
import FreelancerApply from './modules/landing/FreelancerApply';
import Contact from './modules/landing/Contact';
import AuthModule from './modules/auth/AuthModule';

// Dashboards
import ClientDashboard from './modules/client/ClientDashboard';
import FreelancerDashboard from './modules/client/FreelancerDashboard';
import EmployeeDashboard from './modules/employee/EmployeeDashboard';
import AdminDashboard from './modules/admin/AdminDashboard';

import { translations, LanType } from './lib/translations';
import { ShieldCheck, Mail, Phone, Menu, X, ArrowUpCircle, Languages, LayoutGrid } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFormRole, setAuthFormRole] = useState<UserRole>(UserRole.CLIENT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Multi-Language and Dynamic Theming states
  const [activeLanguage, setActiveLanguage] = useState<LanType>(() => {
    const saved = localStorage.getItem('yegna_lisan_language');
    if (saved === 'AMH') return 'AMH';
    return 'ENG';
  });

  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('yegna_lisan_theme');
    return (saved === 'light' ? 'light' : 'dark');
  });

  useEffect(() => {
    localStorage.setItem('yegna_lisan_language', activeLanguage);
  }, [activeLanguage]);

  useEffect(() => {
    localStorage.setItem('yegna_lisan_theme', activeTheme);
    document.documentElement.setAttribute('data-theme', activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [activeTheme]);

  const toggleLanguage = async () => {
    let next: LanType = 'ENG';
    if (activeLanguage === 'ENG') next = 'AMH';
    else next = 'ENG';

    setActiveLanguage(next);
    localStorage.setItem('yegna_lisan_language', next);

    if (currentUser) {
      const updatedUser = { ...currentUser, languagePreference: next };
      setCurrentUser(updatedUser);
      localStorage.setItem('yegna_lisan_user', JSON.stringify(updatedUser));
      try {
        await fetch(`/api/users/${currentUser.id}/update-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ languagePreference: next })
        });
      } catch (e) {
        console.error('Failed to sync language', e);
      }
    }
  };

  const toggleTheme = async () => {
    const next = activeTheme === 'dark' ? 'light' : 'dark';
    setActiveTheme(next);
    localStorage.setItem('yegna_lisan_theme', next);

    if (currentUser) {
      const updatedUser = { ...currentUser, themePreference: next };
      setCurrentUser(updatedUser);
      localStorage.setItem('yegna_lisan_user', JSON.stringify(updatedUser));
      try {
        await fetch(`/api/users/${currentUser.id}/update-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themePreference: next })
        });
      } catch (e) {
        console.error('Failed to sync theme', e);
      }
    }
  };

  // Restore session from localStorage if present
  useEffect(() => {
    const savedUser = localStorage.getItem('yegna_lisan_user');
    const savedToken = localStorage.getItem('yegna_lisan_token');
    
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setAuthToken(savedToken);
      } catch (e) {
        console.error('Failed to parse saved session', e);
      }
    }
  }, []);

  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('yegna_lisan_user', JSON.stringify(user));
    localStorage.setItem('yegna_lisan_token', token);
    setShowAuthModal(false);

    if (user.languagePreference) {
      setActiveLanguage(user.languagePreference);
      localStorage.setItem('yegna_lisan_language', user.languagePreference);
    }
    if (user.themePreference) {
      setActiveTheme(user.themePreference);
      localStorage.setItem('yegna_lisan_theme', user.themePreference);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('yegna_lisan_user');
    localStorage.removeItem('yegna_lisan_token');
  };

  const handleOpenAuth = (role: UserRole) => {
    setAuthFormRole(role);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  // Language lexicon helper shortcut
  const t = translations[activeLanguage];

  // If some user is authenticated and active, route onto their designated Dashboard Workspace
  if (currentUser) {
    switch (currentUser.role) {
      case UserRole.CLIENT:
        return (
          <ClientDashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            activeLanguage={activeLanguage}
            activeTheme={activeTheme}
            toggleLanguage={toggleLanguage}
            toggleTheme={toggleTheme}
          />
        );
      case UserRole.FREELANCER:
        return (
          <FreelancerDashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            activeLanguage={activeLanguage}
            activeTheme={activeTheme}
            toggleLanguage={toggleLanguage}
            toggleTheme={toggleTheme}
          />
        );
      case UserRole.EMPLOYEE:
        return (
          <EmployeeDashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            activeLanguage={activeLanguage}
            activeTheme={activeTheme}
            toggleLanguage={toggleLanguage}
            toggleTheme={toggleTheme}
          />
        );
      case UserRole.ADMIN:
        return (
          <AdminDashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            activeLanguage={activeLanguage}
            activeTheme={activeTheme}
            toggleLanguage={toggleLanguage}
            toggleTheme={toggleTheme}
          />
        );
      default:
        return (
          <ClientDashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            activeLanguage={activeLanguage}
            activeTheme={activeTheme}
            toggleLanguage={toggleLanguage}
            toggleTheme={toggleTheme}
          />
        );
    }
  }

  // Localized navigation link variables
  const navLinks = [
    { href: "#home", label: activeLanguage === 'AMH' ? 'ዋና ገጽ' : 'Home' },
    { href: "#services", label: activeLanguage === 'AMH' ? 'አገልግሎቶቻችን' : 'Services' },
    { href: "#portfolio", label: activeLanguage === 'AMH' ? 'ስራዎቻችን' : 'Portfolio' },
    { href: "#team", label: activeLanguage === 'AMH' ? 'የባለሙያዎች ቡድን' : 'Team' },
    { href: "#freelance", label: activeLanguage === 'AMH' ? 'የቋንቋ ባለሙያ መመዝገቢያ' : 'Apply' },
    { href: "#contact", label: activeLanguage === 'AMH' ? 'አግኙን' : 'Contact' },
  ];

  return (
    <div className={`min-h-screen selection:bg-blue-600 selection:text-white scroll-smooth transition-colors duration-300 ${
      activeTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Upper Micro Contact Info Header bar */}
      <div className={`border-b py-2 px-6 text-xs font-sans relative z-40 hidden sm:block transition-colors ${
        activeTheme === 'dark' ? 'bg-slate-900/40 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-500" /> +251 975 108 198</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-500" /> info@yegnalisan.com</span>
          </div>
          <div className="flex gap-4 font-mono text-[10px] uppercase">
            <span className="text-blue-500">Addis Ababa, Ethiopia</span>
          </div>
        </div>
      </div>

      {/* Modern Floating Navigation Header */}
      <header className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-colors ${
        activeTheme === 'dark' ? 'bg-slate-950/75 border-white/5' : 'bg-white/80 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Brand Logo - Far left */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center shadow shadow-blue-500/5 text-white font-mono font-black text-xs">
              <img 
                src={activeTheme === 'dark' ? '/src/assets/images/logo.jpg' : '/src/assets/images/logo.jpg'} 
                alt="Logo" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-blue-600', 'to-indigo-600');
                  const targetElement = e.currentTarget.parentElement;
                  if (targetElement && !targetElement.querySelector('.logo-fallback-text')) {
                    const span = document.createElement('span');
                    span.className = 'logo-fallback-text text-[10px] font-bold text-white';
                    span.innerText = 'YL';
                    targetElement.appendChild(span);
                  }
                }}
              />
            </div>
            <div>
              <p className={`text-sm font-black tracking-tight leading-none ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>የኛ ልሳን</p>
              <p className="text-[9px] font-bold text-slate-450 tracking-wider mt-0.5 uppercase">Yegna Lisan</p>
            </div>
          </a>

          {/* Links + Shimmer Capsule - Far right vertically aligned */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-xs font-semibold tracking-wide text-slate-400">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className={`transition ${activeTheme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900 text-slate-600'}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <span className="h-4 w-[1px] bg-slate-300/30"></span>

            {/* Quick toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                title="Toggle visual style"
                className="h-8 w-12 flex items-center justify-center rounded-lg border border-slate-300/20 hover:scale-105 transition cursor-pointer text-sm"
              >
                {activeTheme === 'dark' ? '☀️' : '🌙'}
              </button>

              <button
                onClick={toggleLanguage}
                title="Toggle Language"
                className="h-8 w-12 flex items-center justify-center rounded-lg border border-slate-300/20 text-[10px] font-bold text-blue-500 hover:scale-105 transition cursor-pointer font-mono"
              >
                {activeLanguage}
              </button>
            </div>

            {/* Portal Action Capsule Button */}
            <button
              onClick={() => handleOpenAuth(UserRole.CLIENT)}
              className="relative px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-semibold tracking-wide text-white border border-white/10 transition cursor-pointer shadow"
            >
              <span>{activeLanguage === 'AMH' ? 'ግባ/ተመዝገብ' : 'CLIENT GATEWAY'}</span>
            </button>
          </div>

          {/* Mobile responsive toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden absolute top-full left-0 w-full border-b py-6 px-6 space-y-4 animate-fade-in z-20 shadow-2xl ${
            activeTheme === 'dark' ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col gap-4 text-sm font-semibold text-slate-400">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className={`py-1 ${activeTheme === 'dark' ? 'hover:text-white' : 'hover:text-slate-900 text-slate-650'}`}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <button onClick={toggleTheme} className="text-xs p-1 pb-1.5">
                  {activeTheme === 'dark' ? '☀️ App Light Style' : '🌙 App Cosmic Dark Style'}
                </button>
                <button onClick={toggleLanguage} className="text-xs p-1 font-bold text-blue-500">
                  {activeLanguage === 'ENG' ? 'አማርኛ ቀይር' : 'Change to English'}
                </button>
              </div>
            </div>
            
            <div className="border-t border-slate-300/30 pt-4">
              <button
                onClick={() => handleOpenAuth(UserRole.CLIENT)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider cursor-pointer transition shadow-md shadow-blue-500/10"
              >
                {activeLanguage === 'AMH' ? 'ግባ/ተመዝገብ' : 'Access Client Portal'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Core Landings view blocks */}
      <main className="relative z-10">
        <Hero 
          onStart={() => handleOpenAuth(UserRole.CLIENT)} 
          activeTheme={activeTheme} 
          activeLanguage={activeLanguage} 
        />
        <Services 
          activeTheme={activeTheme} 
          activeLanguage={activeLanguage} 
        />
        <Portfolio 
          activeTheme={activeTheme} 
          activeLanguage={activeLanguage} 
        />
        <Team 
          activeTheme={activeTheme} 
          activeLanguage={activeLanguage} 
        />
        <FreelancerApply 
          activeTheme={activeTheme} 
          activeLanguage={activeLanguage} 
        />
        <Contact 
          activeTheme={activeTheme} 
          activeLanguage={activeLanguage} 
        />
      </main>

      {/* Floating Back to Top Anchor */}
      <a
        href="#home"
        className="fixed bottom-6 right-6 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-white/10 text-slate-400 hover:text-white backdrop-blur-md transition-all z-20 cursor-pointer shadow-lg hidden sm:block"
      >
        <ArrowUpCircle className="w-5 h-5" />
      </a>

      {/* User Login Register Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md pb-16 overflow-y-auto">
          {/* Modal Overlay background */}
          <div className="fixed inset-0 cursor-pointer" onClick={() => setShowAuthModal(false)}></div>
          
          <div className="relative z-10 w-full max-w-md my-auto flex flex-col items-center">
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <AuthModule
              initialRole={authFormRole}
              onAuthSuccess={handleAuthSuccess}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
