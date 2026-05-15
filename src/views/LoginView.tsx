import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import { useAppLanguage } from '../App';

export default function LoginView() {
  const { t } = useAppLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-block bg-orange-100 p-4 rounded-[2rem] text-orange-600 mb-2">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-orange-900">{t('Admin Portal', 'ನಿರ್ವಾಹಕ ಪ್ರದೇಶ')}</h2>
        <p className="text-slate-500 font-medium">
          {t('Sign in to manage school content', 'ವಿಷಯ ನಿರ್ವಹಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ')}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[3rem] shadow-sm border-2 border-brand-border"
      >
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-4">
              {t('Email Address', 'ಇಮೇಲ್ ವಿಳಾಸ')}
            </label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.com"
                className="w-full pl-16 pr-6 py-5 bg-brand-cream border-2 border-brand-border rounded-[2rem] focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all placeholder:text-slate-300 font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-4">
              {t('Password', 'ಪಾಸ್‌ವರ್ಡ್')}
            </label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-16 pr-6 py-5 bg-brand-cream border-2 border-brand-border rounded-[2rem] focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all placeholder:text-slate-300 font-medium"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-navy text-white font-bold py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {t('Login to Admin', 'ಪ್ರವೇಶಿಸಿ')}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      <div className="text-center px-6">
        <p className="text-xs text-slate-400 leading-relaxed italic">
          {t(
            'This area is for school staff only. Parents do not need an account to view school activities.',
            'ಈ ಪ್ರದೇಶವು ಶಾಲಾ ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ. ಪೋಷಕರು ಶಾಲಾ ಚಟುವಟಿಕೆಗಳನ್ನು ನೋಡಲು ಖಾತೆಯ ಅಗತ್ಯವಿಲ್ಲ.'
          )}
        </p>
      </div>
    </div>
  );
}
