import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Shield, ShieldOff, CheckCircle2 } from 'lucide-react';
import { dbService } from '../services/db';
import { useAppLanguage } from '../App';

export default function FeedbackView() {
  const { t } = useAppLanguage();
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await dbService.submitFeedback(message, isAnonymous);
      setSubmitted(true);
      setMessage('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-100 text-green-600 p-6 rounded-full"
        >
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-800">
          {t('Thank You!', 'ಧನ್ಯವಾದಗಳು!')}
        </h2>
        <p className="text-slate-500 max-w-[200px]">
          {t('Your feedback helps us make our school better.', 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯವು ನಮ್ಮ ಶಾಲೆಯನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.')}
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-orange-500 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-orange-200 active:scale-95 transition-transform"
        >
          {t('Send Another', 'ಮತ್ತೆ ಕಳುಹಿಸಿ')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-orange-900">{t('Feedback Box', 'ಅಭಿಪ್ರಾಯ ಪೆಟ್ಟಿಗೆ')}</h2>
        <p className="text-slate-500 text-sm mt-1">
          {t('Tell us how we are doing', 'ನಾವು ಹೇಗೆ ಮಾಡುತ್ತಿದ್ದೇವೆ ಎಂದು ನಮಗೆ ತಿಳಿಸಿ')}
        </p>
      </header>

      <div className="bg-white rounded-3xl border-2 border-brand-border p-8 shadow-sm flex flex-col relative overflow-hidden">
        <h3 className="font-bold text-xl mb-2 text-brand-navy">{t('Feedback Box', 'ಅಭಿಪ್ರಾಯ ಪೆಟ್ಟಿಗೆ')}</h3>
        <p className="text-xs text-slate-400 mb-8 font-medium">
          {t('Your thoughts help us improve our school environment.', 'ನಿಮ್ಮ ಆಲೋಚನೆಗಳು ನಮ್ಮ ಶಾಲಾ ಪರಿಸರವನ್ನು ಸುಧಾರಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತವೆ.')}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('Write your feedback here...', 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...')}
            className="w-full h-48 p-6 bg-brand-cream rounded-2xl text-lg border-none focus:ring-2 focus:ring-brand-yellow transition-all resize-none font-medium"
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                className={`w-12 h-6 rounded-full relative p-1 transition-colors ${isAnonymous ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <motion.div 
                  animate={{ x: isAnonymous ? 24 : 0 }}
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isAnonymous} 
                onChange={() => setIsAnonymous(!isAnonymous)} 
              />
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter group-hover:text-brand-navy transition-colors">
                {t('Post Anonymously', 'ಅನಾಮಧೇಯವಾಗಿ ಪೋಸ್ಟ್ ಮಾಡಿ')}
              </span>
            </label>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-yellow hover:bg-brand-yellow-dark text-brand-navy font-bold py-5 rounded-2xl transition-all shadow-xl shadow-yellow-100 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-6 h-6 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('Submit Feedback', 'ಅಭಿಪ್ರಾಯ ಸಲ್ಲಿಸಿ')}
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex items-start gap-3">
        <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-700 leading-relaxed">
          {t(
            'We value your privacy. Anonymous feedback is never tracked to your personal identity.',
            'ನಾವು ನಿಮ್ಮ ಗೌಪ್ಯತೆಯನ್ನು ಗೌರವಿಸುತ್ತೇವೆ. ಅನಾಮಧೇಯ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಎಂದಿಗೂ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಗುರುತಿಗೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗುವುದಿಲ್ಲ.'
          )}
        </p>
      </div>
    </div>
  );
}
