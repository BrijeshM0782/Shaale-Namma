import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  MapPin, 
  Star, 
  MessageSquare, 
  Plus, 
  Camera, 
  Upload, 
  Trash2, 
  LogOut,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { uploadToCloudinary } from '../lib/cloudinary';
import { dbService } from '../services/db';
import { Meal, Facility, Student, Feedback, Language } from '../types';
import { useAppLanguage } from '../App';
import { formatDate } from '../lib/utils';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function AdminView() {
  const { t } = useAppLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'meal' | 'facilities' | 'students' | 'feedback'>('meal');

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/login'));
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          {t('Dashboard', 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್')}
        </h2>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title={t('Logout', 'ಲಾಗ್ ಔಟ್')}
        >
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <TabButton active={activeTab === 'meal'} onClick={() => setActiveTab('meal')} icon={<Utensils className="w-5 h-5" />} label={t('Meal', 'ಊಟ')} />
        <TabButton active={activeTab === 'facilities'} onClick={() => setActiveTab('facilities')} icon={<MapPin className="w-5 h-5" />} label={t('Facilities', 'ಸೌಲಭ್ಯಗಳು')} />
        <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Star className="w-5 h-5" />} label={t('Students', 'ವಿದ್ಯಾರ್ಥಿಗಳು')} />
        <TabButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={<MessageSquare className="w-5 h-5" />} label={t('Feedback', 'ಪ್ರತಿಕ್ರಿಯೆ')} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100"
        >
          {activeTab === 'meal' && <MealEditor />}
          {activeTab === 'facilities' && <FacilityEditor />}
          {activeTab === 'students' && <StudentEditor />}
          {activeTab === 'feedback' && <FeedbackList />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${active ? 'bg-brand-yellow text-brand-navy shadow-md' : 'bg-brand-cream text-slate-400 border border-brand-border'}`}
    >
      {icon}
      {label}
    </button>
  );
}

// --- Editors ---

function MealEditor() {
  const { t } = useAppLanguage();
  const [meal, setMeal] = useState<Partial<Meal>>({
    menuEnglish: '',
    menuKannada: '',
    imageUrl: '',
    date: formatDate(new Date())
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingMeal, setExistingMeal] = useState<Meal | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dbService.getTodayMeal().then(setExistingMeal);
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    
    try {
      const url = await uploadToCloudinary(file);
      setMeal(prev => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(t('Upload failed: ' + err.message, 'ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ: ' + err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!meal.menuEnglish || !meal.imageUrl) {
      setError(t('Please provide both menu and image', 'ದಯವಿಟ್ಟು ಮೆನು ಮತ್ತು ಚಿತ್ರ ಎರಡನ್ನೂ ಒದಗಿಸಿ'));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await dbService.uploadMeal(meal as Meal);
      setExistingMeal(meal as Meal);
      alert(t('Meal updated!', 'ಊಟವನ್ನು ಅಪ್‌ಡೇಟ್ ಮಾಡಲಾಗಿದೆ!'));
    } catch (err: any) {
      console.error('Save error:', err);
      setError(t('Failed to save: ' + err.message, 'ಉಳಿಸಲು ವಿಫಲವಾಗಿದೆ: ' + err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const targetDate = existingMeal?.date || meal.date;
    if (!targetDate) return;
    
    if (!window.confirm(t('Are you sure you want to delete today\'s meal record?', 'ನೀವು ಖಚಿತವಾಗಿ ಇಂದಿನ ಊಟದ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?'))) return;
    try {
      await dbService.deleteMeal(targetDate);
      setExistingMeal(null);
      setMeal(prev => ({
        ...prev,
        menuEnglish: '',
        menuKannada: '',
        imageUrl: ''
      }));
      alert(t('Meal record deleted', 'ಊಟದ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲಾಗಿದೆ'));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(t('Failed to delete meal: ', 'ಊಟವನ್ನು ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ: ') + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-800">{t('Daily Meal Update', 'ದೈನಂದಿನ ಊಟದ ಅಪ್ಡೇಟ್')}</h3>
        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
          {meal.date}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-xs font-bold text-red-800">{error}</p>
        </div>
      )}

      {existingMeal && (
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-green-800">{t('Meal already uploaded for today', 'ಇಂದಿನ ಊಟವನ್ನು ಈಗಾಗಲೇ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ')}</p>
              <p className="text-[10px] text-green-600 uppercase mt-1 font-bold">{t('Updating will overwrite', 'ನವೀಕರಿಸುವುದು ಹಿಂದಿನದನ್ನು ಅಳಿಸುತ್ತದೆ')}</p>
            </div>
          </div>
          <button 
            onClick={handleDelete}
            className="p-2 text-green-700 hover:text-red-600 transition-colors"
            title={t('Delete Entry', 'ದಾಖಲೆ ಅಳಿಸು')}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}

      <ImageUploader 
        url={meal.imageUrl} 
        onFileSelect={handleUpload} 
        uploading={uploading} 
      />

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">{t('Menu (English)', 'ಮೆನು (ಇಂಗ್ಲಿಷ್)')}</label>
          <input 
            type="text" 
            value={meal.menuEnglish}
            onChange={e => setMeal(prev => ({ ...prev, menuEnglish: e.target.value }))}
            placeholder="e.g. Rice, Sambar and Curds"
            className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">{t('Menu (Kannada)', 'ಮೆನು (ಕನ್ನಡ)')}</label>
          <input 
            type="text" 
            value={meal.menuKannada}
            onChange={e => setMeal(prev => ({ ...prev, menuKannada: e.target.value }))}
            placeholder="ಉದಾಹರಣೆಗೆ: ಅನ್ನ, ಸಾಂಬಾರ್ ಮತ್ತು ಮೊಸರು"
            className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving || uploading || !meal.imageUrl || !meal.menuEnglish}
        className="w-full bg-orange-600 text-white font-bold py-4 rounded-3xl shadow-lg disabled:opacity-50 active:scale-95 transition-all"
      >
        {saving ? t('Saving...', 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...') : t('Publish Update', 'ಅಪ್ಡೇಟ್ ಪ್ರಕಟಿಸಿ')}
      </button>
    </div>
  );
}

function FacilityEditor() {
  const { t } = useAppLanguage();
  const [facility, setFacility] = useState<Omit<Facility, 'id'>>({
    category: 'Labs',
    descriptionEnglish: '',
    descriptionKannada: '',
    imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingFacilities, setExistingFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    dbService.getFacilities().then(setExistingFacilities);
  }, []);

  const handleUpload = async (f: File) => {
    setUploading(true);
    setError(null);
    
    try {
      const url = await uploadToCloudinary(f);
      setFacility(prev => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(t('Upload failed: ' + err.message, 'ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ: ' + err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!facility.imageUrl || !facility.category) {
      setError(t('Please provide both category and image', 'ದಯವಿಟ್ಟು ವರ್ಗ ಮತ್ತು ಚಿತ್ರ ಎರಡನ್ನೂ ಒದಗಿಸಿ'));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await dbService.addFacility(facility);
      setFacility({ category: 'Labs', descriptionEnglish: '', descriptionKannada: '', imageUrl: '' });
      dbService.getFacilities().then(setExistingFacilities);
      alert(t('Facility added!', 'ಸೌಲಭ್ಯವನ್ನು ಸೇರಿಸಲಾಗಿದೆ!'));
    } catch (err: any) {
      console.error('Save error:', err);
      setError(t('Failed to add: ' + err.message, 'ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ: ' + err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('Are you sure you want to delete this facility?', 'ನೀವು ಖಚಿತವಾಗಿ ಈ ಸೌಲಭ್ಯವನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?'))) return;
    try {
      await dbService.deleteFacility(id);
      setExistingFacilities(prev => prev.filter(f => f.id !== id));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(t('Failed to delete facility: ', 'ಸೌಲಭ್ಯವನ್ನು ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ: ') + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-slate-800">{t('Add New Facility', 'ಹೊಸ ಸೌಲಭ್ಯವನ್ನು ಸೇರಿಸಿ')}</h3>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-xs font-bold text-red-800">{error}</p>
        </div>
      )}
      <ImageUploader 
        url={facility.imageUrl} 
        onFileSelect={handleUpload} 
        uploading={uploading} 
      />

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">{t('Category', 'ವರ್ಗ')}</label>
          <select 
            value={facility.category}
            onChange={e => setFacility(prev => ({ ...prev, category: e.target.value as any }))}
            className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-orange-500 transition-colors"
          >
            <option value="Labs">{t('Labs', 'ಪ್ರಯೋಗಾಲಯಗಳು')}</option>
            <option value="Library">{t('Library', 'ಗ್ರಂಥಾಲಯ')}</option>
            <option value="Toilets">{t('Toilets', 'ಶೌಚಾಲಯಗಳು')}</option>
            <option value="Classroom">{t('Classroom', 'ತರಗತಿ ಕೋಣೆ')}</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">{t('Description (English)', 'ವಿವರಣೆ (ಇಂಗ್ಲಿಷ್)')}</label>
          <textarea 
            value={facility.descriptionEnglish}
            onChange={e => setFacility(prev => ({ ...prev, descriptionEnglish: e.target.value }))}
            className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl h-24 resize-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">{t('Description (Kannada)', 'ವಿವರಣೆ (ಕನ್ನಡ)')}</label>
          <textarea 
            value={facility.descriptionKannada}
            onChange={e => setFacility(prev => ({ ...prev, descriptionKannada: e.target.value }))}
            className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl h-24 resize-none"
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving || uploading || !facility.imageUrl}
        className="w-full bg-orange-600 text-white font-bold py-4 rounded-3xl shadow-lg disabled:opacity-50"
      >
        {saving ? t('Adding...', 'ಸೇರಿಸಲಾಗುತ್ತಿದೆ...') : t('Add Facility', 'ಸೌಲಭ್ಯ ಸೇರಿಸಿ')}
      </button>

      {/* List Existing */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">{t('Existing Facilities', 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಸೌಲಭ್ಯಗಳು')}</h4>
        <div className="grid grid-cols-1 gap-4">
          {existingFacilities.map(f => (
            <div key={f.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
              <img src={f.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800">{t(f.category, f.category)}</p>
                <p className="text-[10px] text-slate-400 truncate">{f.descriptionEnglish}</p>
              </div>
              <button 
                onClick={() => handleDelete(f.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                title={t('Delete', 'ಅಳಿಸು')}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentEditor() {
  const { t } = useAppLanguage();
  const [student, setStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    achievementEnglish: '',
    achievementKannada: '',
    imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingStudents, setExistingStudents] = useState<Student[]>([]);

  useEffect(() => {
    dbService.getStudents().then(setExistingStudents);
  }, []);

  const handleUpload = async (f: File) => {
    setUploading(true);
    setError(null);
    
    try {
      const url = await uploadToCloudinary(f);
      setStudent(prev => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(t('Upload failed: ' + err.message, 'ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ: ' + err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!student.imageUrl || !student.name || !student.achievementEnglish) {
      setError(t('Please provide name, achievement and image', 'ದಯವಿಟ್ಟು ಹೆಸರು, ಸಾಧನೆ ಮತ್ತು ಚಿತ್ರವನ್ನು ಒದಗಿಸಿ'));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await dbService.addStudent(student);
      setStudent({ name: '', achievementEnglish: '', achievementKannada: '', imageUrl: '' });
      dbService.getStudents().then(setExistingStudents);
      alert(t('Student Star added!', 'ವಿದ್ಯಾರ್ಥಿ ಸ್ಟಾರ್ ಸೇರಿಸಲಾಗಿದೆ!'));
    } catch (err: any) {
      console.error('Save error:', err);
      setError(t('Failed to add: ' + err.message, 'ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ: ' + err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('Are you sure you want to delete this student entry?', 'ನೀವು ಖಚಿತವಾಗಿ ಈ ವಿದ್ಯಾರ್ಥಿ ನಮೂದನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?'))) return;
    try {
      await dbService.deleteStudent(id);
      setExistingStudents(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(t('Failed to delete student: ', 'ವಿದ್ಯಾರ್ಥಿಯನ್ನು ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ: ') + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-slate-800">{t('Add Student Star', 'ವಿದ್ಯಾರ್ಥಿ ಸ್ಟಾರ್ ಸೇರಿಸಿ')}</h3>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-xs font-bold text-red-800">{error}</p>
        </div>
      )}
      <ImageUploader 
        url={student.imageUrl} 
        onFileSelect={handleUpload} 
        uploading={uploading} 
      />

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">{t('Student Name', 'ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು')}</label>
          <input 
            type="text" 
            value={student.name}
            onChange={e => setStudent(prev => ({ ...prev, name: e.target.value }))}
            className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">{t('Achievement (English)', 'ಸಾಧನೆ (ಇಂಗ್ಲಿಷ್)')}</label>
          <textarea 
            value={student.achievementEnglish}
            onChange={e => setStudent(prev => ({ ...prev, achievementEnglish: e.target.value }))}
            className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl h-24 resize-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">{t('Achievement (Kannada)', 'ಸಾಧನೆ (ಕನ್ನಡ)')}</label>
          <textarea 
            value={student.achievementKannada}
            onChange={e => setStudent(prev => ({ ...prev, achievementKannada: e.target.value }))}
            className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl h-24 resize-none"
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving || uploading || !student.imageUrl || !student.name}
        className="w-full bg-orange-600 text-white font-bold py-4 rounded-3xl shadow-lg disabled:opacity-50"
      >
        {saving ? t('Adding...', 'ಸೇರಿಸಲಾಗುತ್ತಿದೆ...') : t('Add Student', 'ವಿದ್ಯಾರ್ಥಿಯನ್ನು ಸೇರಿಸಿ')}
      </button>

      {/* List Existing */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">{t('Existing Students', 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳು')}</h4>
        <div className="grid grid-cols-1 gap-4">
          {existingStudents.map(s => (
            <div key={s.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
              <img src={s.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800">{s.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{s.achievementEnglish}</p>
              </div>
              <button 
                onClick={() => handleDelete(s.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                title={t('Delete', 'ಅಳಿಸು')}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedbackList() {
  const { t } = useAppLanguage();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    dbService.getFeedback().then(setFeedbacks);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-slate-800">{t('Community Feedback', 'ಸಮುದಾಯದ ಪ್ರತಿಕ್ರಿಯೆ')}</h3>
      {feedbacks.length > 0 ? (
        <div className="space-y-3">
          {feedbacks.map(f => (
            <div key={f.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.isAnonymous ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                  {f.isAnonymous ? t('Anonymous', 'ಅನಾಮಧೇಯ') : t('Parent/User', 'ಪೋಷಕರು/ಬಳಕೆದಾರರು')}
                </span>
                <span className="text-[10px] text-slate-400 italic">
                  {new Date(f.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{f.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 italic text-sm text-center py-10">
          {t('No feedback received yet.', 'ಇಲ್ಲಿಯವರೆಗೆ ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆ ಬಂದಿಲ್ಲ.')}
        </p>
      )}
    </div>
  );
}

function ImageUploader({ url, onFileSelect, uploading }: { url?: string, onFileSelect: (f: File) => void, uploading: boolean }) {
  const { t } = useAppLanguage();
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">{t('Image Upload', 'ಚಿತ್ರ ಅಪ್‌ಲೋಡ್')}</label>
      <div className="relative aspect-video bg-slate-100 rounded-3xl overflow-hidden group border-2 border-dashed border-slate-200">
        {uploading ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 animate-pulse">
              {t('Uploading...', 'ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ...')}
            </p>
          </div>
        ) : null}

        {url ? (
          <img src={url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2">
            <Camera className="w-10 h-10" />
            <p className="text-xs font-bold uppercase tracking-widest text-center px-4">
              {t('Select Photo', 'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ')}
            </p>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={uploading}
        />
        
        {url && !uploading && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white text-xs font-bold uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
              {t('Change Photo', 'ಫೋಟೋ ಬದಲಾಯಿಸಿ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
