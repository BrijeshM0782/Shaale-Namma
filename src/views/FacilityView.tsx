import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Microscope, Droplets, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import { dbService } from '../services/db';
import { Facility } from '../types';
import { useAppLanguage } from '../App';

export default function FacilityView() {
  const { t } = useAppLanguage();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dbService.getFacilities().then(data => {
      setFacilities(data);
      setLoading(false);
    });
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % facilities.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + facilities.length) % facilities.length);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-brand-navy">{t('Facility Tour', 'ಸೌಲಭ್ಯಗಳು')}</h2>
        <button className="text-blue-500 text-xs font-bold uppercase tracking-widest hover:underline">
          {t('View All', 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ')}
        </button>
      </header>

      {loading ? (
        <div className="aspect-[4/5] bg-white rounded-3xl border-2 border-brand-border animate-pulse" />
      ) : facilities.length > 0 ? (
        <div className="relative group">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-sm border-2 border-brand-border"
          >
            <div className="aspect-[4/5] relative">
              <img 
                src={facilities[currentIndex].imageUrl} 
                alt={facilities[currentIndex].category} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent flex flex-col justify-end p-8">
                <div className="flex items-center gap-3 text-white mb-2">
                  <CategoryIcon category={facilities[currentIndex].category} />
                  <p className="text-2xl font-bold">{t(facilities[currentIndex].category, facilities[currentIndex].category)}</p>
                </div>
                <div className="w-12 h-1 bg-brand-yellow rounded-full" />
              </div>
            </div>
            
            <div className="p-8 bg-white">
              <p className="text-xl font-medium leading-relaxed text-slate-700">
                {t(facilities[currentIndex].descriptionEnglish, facilities[currentIndex].descriptionKannada) || 
                 t('High quality facilities for our students.', 'ನಮ್ಮ ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಸೌಲಭ್ಯಗಳು.')}
              </p>
            </div>
          </motion.div>

          {/* Nav Controls */}
          <button 
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg text-slate-800 active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow-lg text-slate-800 active:scale-90 transition-transform"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl text-center shadow-lg border border-orange-100">
          < Microscope className="w-16 h-16 mx-auto text-orange-200 mb-4" />
          <p className="text-slate-500">{t('No facility photos yet.', 'ಇನ್ನೂ ಯಾವುದೇ ಫೋಟೋಗಳಿಲ್ಲ.')}</p>
        </div>
      )}

      {/* Category Icons Bar */}
      <div className="flex justify-center gap-4">
        {['Labs', 'Library', 'Toilets', 'Classroom'].map(cat => (
          <div key={cat} className="flex flex-col items-center gap-2">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
              <CategoryIcon category={cat as any} className="w-6 h-6 text-orange-500" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{t(cat, cat)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryIcon({ category, className = "w-4 h-4" }: { category: Facility['category'], className?: string }) {
  switch (category) {
    case 'Labs': return <Microscope className={className} />;
    case 'Library': return <Book className={className} />;
    case 'Toilets': return <Droplets className={className} />;
    default: return <Book className={className} />;
  }
}
