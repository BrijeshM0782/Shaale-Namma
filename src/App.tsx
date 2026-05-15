import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Star, 
  MessageCircle, 
  User, 
  Menu,
  ChevronRight,
  ChevronLeft,
  Plus,
  LogOut,
  Camera,
  Globe
} from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Language } from './types';

// Contexts
const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (en: string, kn: string) => string;
}>({ lang: 'en', setLang: () => {}, t: (en) => en });

// Components
import HomeView from './views/HomeView';
import FacilityView from './views/FacilityView';
import StudentsView from './views/StudentsView';
import FeedbackView from './views/FeedbackView';
import AdminView from './views/AdminView';
import LoginView from './views/LoginView';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    // Language detection
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'kn') {
      setLang('kn');
    }

    return unsubscribe;
  }, []);

  const t = (en: string, kn: string) => (lang === 'en' ? en : kn);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-orange-50">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-orange-500 font-bold text-2xl"
        >
          Shale-Namma...
        </motion.div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <Router>
        <div className="min-h-screen bg-brand-cream text-brand-navy font-sans pb-20">
          {/* Header */}
          <header className="bg-white border-b-2 border-brand-border sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-sm">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-brand-navy leading-none mb-1">
                  {t('Shale-Namma', 'ಶಾಲಾ-ನಮ್ಮ')}
                </h1>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none">
                  {t('School Portal', 'ಶಾಲಾ ಪೋರ್ಟಲ್')}
                </p>
              </div>
            </Link>
            
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex bg-slate-100 rounded-full p-1">
                <button 
                  onClick={() => setLang('en')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLang('kn')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'kn' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400'}`}
                >
                  ಕನ್ನಡ
                </button>
              </div>

              {/* Mobile toggle only */}
              <button 
                onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
                className="sm:hidden flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full text-brand-navy font-bold text-xs"
              >
                {lang === 'en' ? 'KN' : 'EN'}
              </button>
              
              {user ? (
                <Link to="/admin" className="p-2 hover:bg-slate-50 rounded-xl bg-brand-navy text-white transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link to="/login" className="bg-brand-navy text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">
                  {t('Admin', 'ನಿರ್ವಾಹಕ')}
                </Link>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-4xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/facilities" element={<FacilityView />} />
              <Route path="/students" element={<StudentsView />} />
              <Route path="/feedback" element={<FeedbackView />} />
              <Route path="/admin" element={user ? <AdminView /> : <LoginView />} />
              <Route path="/login" element={<LoginView />} />
            </Routes>
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-6 py-2 flex items-center justify-between z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <NavItem to="/" icon={<Home className="w-6 h-6" />} label={t('Home', 'ಮನೆ')} />
            <NavItem to="/facilities" icon={<BookOpen className="w-6 h-6" />} label={t('Tour', 'ಪ್ರವಾಸ')} />
            <NavItem to="/students" icon={<Star className="w-6 h-6" />} label={t('Stars', 'ನಕ್ಷತ್ರ')} />
            <NavItem to="/feedback" icon={<MessageCircle className="w-6 h-6" />} label={t('Talk', 'ಮಾತು')} />
          </nav>
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="flex flex-col items-center gap-1 group relative">
      <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-brand-yellow text-brand-navy shadow-sm' : 'text-slate-400 group-hover:text-brand-navy'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      <span className={`text-[10px] font-black tracking-[0.1em] uppercase transition-colors ${isActive ? 'text-brand-navy' : 'text-slate-400'}`}>
        {label}
      </span>
    </Link>
  );
}

export function useAppLanguage() {
  return useContext(LanguageContext);
}
