import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, CalendarDays, Search, Star, MapPin, Activity, Heart, Stethoscope,
  Building2, Plus, Pill, FileText, ArrowRight, Zap, ShieldCheck, Sparkles,
  X, ClipboardList, Bell, HeartPulse, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';
import client from '../api/client';
import type { Appointment, Paginated } from '../types';
import { MOCK_SPECIALTIES, MOCK_TAHLILLER, MOCK_RECETELER } from '../utils/mockData';

const CSS = `
  .pd-root { display: flex; flex-direction: column; gap: 2rem; padding-bottom: 3rem; background: var(--bg-primary); }
  .pd-welcome { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 24px; padding: 3rem; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(99,102,241,0.2); }
  .pd-welcome-content { position: relative; z-index: 10; max-width: 700px; }
  .pd-welcome-title { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
  .pd-welcome-sub { font-size: 1.1rem; opacity: 0.9; line-height: 1.6; }
  .pd-stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
  .pd-stat-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; box-shadow: var(--shadow-sm); transition: all 0.3s ease; }
  .pd-stat-card:hover { transform: translateY(-3px); }
  .pd-section-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 2rem; box-shadow: var(--shadow-sm); height: 100%; box-sizing: border-box; }
  .pd-section-title { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; }
  .pd-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
  @media (max-width: 1024px) { .pd-main-grid { grid-template-columns: 1fr; } }
  .pd-action-btn { background: var(--bg-soft); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.25rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s; font-weight: 700; }
  .pd-action-btn:hover { background: var(--primary-soft); color: var(--primary-color); border-color: var(--primary-color); }
`;

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useSettings();
  const t = translations[language];
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get<Paginated<Appointment>>('/appointments/')
      .then(r => setAppointments(r.data.results || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pd-root">
      <style>{CSS}</style>
      
      <div className="pd-welcome">
        <div className="pd-welcome-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 999, width: 'fit-content' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{language === 'tr' ? 'Sağlık Asistanınız' : 'Your Health Assistant'}</span>
          </div>
          <h1 className="pd-welcome-title">{language === 'tr' ? 'Merhaba,' : 'Hello,'} {user?.first_name}!</h1>
          <p className="pd-welcome-sub">{language === 'tr' ? 'Bugün kendini nasıl hissediyorsun? Sağlık verilerini takip edebilir veya hızlıca randevu alabilirsin.' : 'How do you feel today? You can track your health data or quickly book an appointment.'}</p>
        </div>
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1 }}><HeartPulse size={300} color="white" /></div>
      </div>

      <div className="pd-stats-row">
        <div className="pd-stat-card" onClick={() => navigate('/health-tracking')} style={{ cursor: 'pointer' }}>
             <div className="pd-stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}><Activity size={24}/></div>
             <div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{t.blood_pressure}</div>
                 <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>120/80</div>
             </div>
        </div>
        <div className="pd-stat-card" onClick={() => navigate('/health-tracking')} style={{ cursor: 'pointer' }}>
             <div className="pd-stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><Heart size={24}/></div>
             <div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{language === 'tr' ? 'Nabız' : 'Pulse'}</div>
                 <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>72 BPM</div>
             </div>
        </div>
        <div className="pd-stat-card" onClick={() => navigate('/booking')} style={{ cursor: 'pointer', border: '2px solid var(--primary-color)' }}>
             <div className="pd-stat-icon" style={{ background: 'var(--primary-soft)', color: 'var(--primary-color)' }}><CalendarDays size={24}/></div>
             <div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)' }}>{t.booking}</div>
                 <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{language === 'tr' ? 'Şimdi Al' : 'Book Now'}</div>
             </div>
        </div>
      </div>

      <div className="pd-main-grid">
         <div className="pd-section-card">
            <h2 className="pd-section-title"><Calendar size={20} className="text-indigo-500" /> {language === 'tr' ? 'Yaklaşan Randevular' : 'Upcoming Appointments'}</h2>
            {loading ? <p>{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</p> : appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.5 }}>
                   <Calendar size={48} style={{ margin: '0 auto 1rem' }} />
                   <p>{language === 'tr' ? 'Aktif randevunuz bulunmuyor.' : 'No active appointments found.'}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {appointments.slice(0, 3).map(app => (
                        <div key={app.id} style={{ padding: '1rem', background: 'var(--bg-soft)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 700 }}>{app.doctor_name || 'Doktor'}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.appointment_date} - {app.appointment_time}</div>
                            </div>
                            <ChevronRight size={18} />
                        </div>
                    ))}
                </div>
            )}
         </div>

         <div className="pd-section-card" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: 'white', border: 'none' }}>
            <h2 className="pd-section-title" style={{ color: 'white' }}><Zap size={20} className="text-indigo-300" /> {t.health_tracking}</h2>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{language === 'tr' ? 'Verileriniz güncel. Bir sonraki check-up zamanınızı kontrol edin.' : 'Your data is up to date. Check your next check-up time.'}</p>
            <button onClick={() => navigate('/health-tracking')} style={{ width: '100%', padding: '1rem', background: 'white', color: '#1e1b4b', border: 'none', borderRadius: '16px', fontWeight: 800, cursor: 'pointer' }}>{t.detailed_report}</button>
         </div>
      </div>
    </div>
  );
};

export default PatientDashboard;