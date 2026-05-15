import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Utensils, Calendar, Info, Star } from 'lucide-react';
import { dbService } from '../services/db';
import { Meal } from '../types';
import { useAppLanguage } from '../App';
import { formatDate } from '../lib/utils';

export default function HomeView() {
  const { t, lang } = useAppLanguage();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbService.getTodayMeal().then(m => {
      setMeal(m);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-brand-border flex flex-col md:flex-row"
        >
          <div className="flex-1 p-8">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                {t("Daily Meal Update • ಇಂದಿನ ಊಟ", "Daily Meal Update • ಇಂದಿನ ಊಟ")}
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {formatDate(new Date())}
              </span>
            </div>

            {meal ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-bold text-brand-navy mb-2 leading-tight">
                    {t(meal.menuEnglish || meal.menuKannada, meal.menuKannada || meal.menuEnglish)}
                  </h2>
                  <p className="text-2xl text-slate-500 italic">
                    {lang === 'en' ? (meal.menuKannada) : (meal.menuEnglish)}
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <div className="bg-brand-cream p-4 rounded-2xl flex-1 border border-brand-border">
                    <p className="text-[10px] uppercase text-slate-400 font-black mb-1 tracking-widest">Nutrition Score</p>
                    <p className="text-xl font-bold text-emerald-600">High Quality</p>
                  </div>
                  <div className="bg-brand-cream p-4 rounded-2xl flex-1 border border-brand-border">
                    <p className="text-[10px] uppercase text-slate-400 font-black mb-1 tracking-widest">Status</p>
                    <p className="text-xl font-bold text-blue-600">Served Hot</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-slate-400 font-medium italic">
                  {t('Meal details are being prepared...', 'ಊಟದ ಮಾಹಿತಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...')}
                </p>
              </div>
            )}
          </div>

          <div className="w-full md:w-80 h-64 md:h-auto bg-brand-yellow/20 flex-shrink-0 border-t-2 md:border-t-0 md:border-l-2 border-brand-border overflow-hidden relative">
            {meal ? (
              <img 
                src={meal.imageUrl} 
                alt="Today's Meal" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-brand-yellow-dark gap-3">
                <Utensils className="w-16 h-16 opacity-40 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-widest">{t('Freshly Prepared', 'ತಾಜಾ ಆಹಾರ')}</p>
              </div>
            )}
            
            {/* Decoration */}
            <div className="absolute inset-0 border-8 border-white m-4 rounded-2xl shadow-inner pointer-events-none opacity-50" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-brand-navy rounded-3xl p-8 text-white flex items-center justify-between shadow-xl">
          <div className="flex -space-x-3">
            {[1,2,3].map(i => (
              <div key={i} className={`w-12 h-12 rounded-full border-4 border-brand-navy ${i === 1 ? 'bg-blue-400' : i === 2 ? 'bg-emerald-400' : 'bg-orange-400'}`} />
            ))}
          </div>
          <div className="text-right">
            <p className="text-3xl font-black italic">1,240+</p>
            <p className="text-[10px] uppercase opacity-60 font-black tracking-widest">
              {t('Parents Connected', 'ಪೋಷಕರು')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-brand-border p-8 shadow-sm flex items-center justify-between">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <Star className="w-8 h-8" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-brand-navy">100%</p>
            <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">
              {t('Transparency Score', 'ಪಾರದರ್ಶಕತೆ ಸ್ಕೋರ್')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100"
    >
      <div className={`w-8 h-8 ${color} rounded-full mb-3 flex items-center justify-center`}>
        <div className="w-4 h-4 bg-white/30 rounded-full" />
      </div>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}
