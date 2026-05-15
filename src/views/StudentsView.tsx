import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Trophy, Award } from 'lucide-react';
import { dbService } from '../services/db';
import { Student } from '../types';
import { useAppLanguage } from '../App';

export default function StudentsView() {
  const { t } = useAppLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbService.getStudents().then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-orange-900">{t('Student Stars', 'ವಿದ್ಯಾರ್ಥಿ ನಕ್ಷತ್ರಗಳು')}</h2>
        <p className="text-slate-500 text-sm mt-1">
          {t('Celebrating our bright achievers', 'ನಮ್ಮ ಸಾಧಕ ಮಕ್ಕಳನ್ನು ಅಭಿನಂದಿಸುತ್ತಿದ್ದೇವೆ')}
        </p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-3xl border-2 border-brand-border animate-pulse" />)}
        </div>
      ) : students.length > 0 ? (
        <div className="grid gap-6">
          {students.map((student, idx) => (
            <motion.div 
              key={student.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border-2 border-brand-border flex items-center gap-6 group hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden relative">
                  <img 
                    src={student.imageUrl} 
                    alt={student.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-brand-yellow p-1.5 rounded-lg border-2 border-white shadow-sm">
                  <Star className="w-3 h-3 text-brand-navy fill-brand-navy" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-brand-navy">{student.name}</h3>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
                  Grade 7 • ೭ನೇ ತರಗತಿ
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-600">
                  {t(student.achievementEnglish, student.achievementKannada)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl text-center shadow-sm border-2 border-brand-border">
          <Award className="w-16 h-16 mx-auto text-orange-200 mb-4" />
          <p className="text-slate-500">{t('No stars uploaded yet.', 'ಇನ್ನೂ ಯಾವುದೇ ಸಾಧಕರ ಮಾಹಿತಿ ಇಲ್ಲ.')}</p>
        </div>
      )}
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
    </svg>
  );
}
