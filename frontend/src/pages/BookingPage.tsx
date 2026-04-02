import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin, Building2, Stethoscope,
  ArrowLeft, CheckCircle2, X
} from 'lucide-react';
import client from '../api/client';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';
import type { City, Specialty, Doctor, Paginated, Appointment } from '../types';
import { MOCK_CITIES, MOCK_DISTRICTS, MOCK_HOSPITALS, MOCK_SPECIALTIES, MOCK_DOCTORS_DB } from '../utils/mockData';
import { storage } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

type District = { id: number; name: string; city: number };
type Hospital = { id: number; name: string; city: number; district: number; city_name?: string; district_name?: string };

const TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useSettings();
  const t = translations[language];
  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [note, setNote] = useState('');

  const STEPS = language === 'tr' 
    ? ['Konum', 'Klinik', 'Hekim', 'Tarih & Saat', 'Onay']
    : ['Location', 'Clinic', 'Doctor', 'Date & Time', 'Confirm'];

  // Data
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Selections
  const [selCity, setSelCity] = useState('');
  const [selDistrict, setSelDistrict] = useState('');
  const [selHospital, setSelHospital] = useState('');
  const [selSpecialty, setSelSpecialty] = useState('');
  const [selDoctor, setSelDoctor] = useState<Doctor | null>(null);
  const [selDate, setSelDate] = useState('');
  const [selTime, setSelTime] = useState('');
  const [citySearch, setCitySearch] = useState('');

  useEffect(() => {
    Promise.all([
      client.get<City[]>('/hospitals/cities/').catch(() => ({ data: [] })),
      client.get<Specialty[]>('/hospitals/specialties/').catch(() => ({ data: [] })),
    ]).then(([c, s]) => {
      setCities(Array.isArray(c.data) && c.data.length > 0 ? c.data : MOCK_CITIES as any);
      setSpecialties(Array.isArray(s.data) && s.data.length > 0 ? s.data : MOCK_SPECIALTIES as any);
    });
  }, []);

  useEffect(() => {
    if (!selCity) { setDistricts([]); return; }
    setLoading(true);
    client.get(`/hospitals/districts/?city=${selCity}`)
      .then(r => setDistricts(Array.isArray(r.data) ? r.data : MOCK_DISTRICTS.filter(d => d.city_id === parseInt(selCity)) as any))
      .catch(() => setDistricts(MOCK_DISTRICTS.filter(d => d.city_id === parseInt(selCity)) as any))
      .finally(() => setLoading(false));
  }, [selCity]);

  useEffect(() => {
    if (!selCity) { setHospitals([]); return; }
    setLoading(true);
    client.get(`/hospitals/hospitals/?city=${selCity}${selDistrict ? `&district=${selDistrict}` : ''}`)
      .then(r => setHospitals(Array.isArray(r.data) ? r.data : MOCK_HOSPITALS.filter(h => h.city_id === parseInt(selCity) && (!selDistrict || h.district_id === parseInt(selDistrict))) as any))
      .catch(() => setHospitals(MOCK_HOSPITALS.filter(h => h.city_id === parseInt(selCity) && (!selDistrict || h.district_id === parseInt(selDistrict))) as any))
      .finally(() => setLoading(false));
  }, [selCity, selDistrict]);

  useEffect(() => {
    if (!selHospital || !selSpecialty) { setDoctors([]); return; }
    setLoading(true);
    client.get(`/doctors/?hospital=${selHospital}&specialty=${selSpecialty}`)
      .then(r => setDoctors(Array.isArray(r.data) ? r.data : MOCK_DOCTORS_DB.filter(d => d.hospital === parseInt(selHospital) && d.specialty === parseInt(selSpecialty)) as any))
      .catch(() => setDoctors(MOCK_DOCTORS_DB.filter(d => d.hospital === parseInt(selHospital) && d.specialty === parseInt(selSpecialty)) as any))
      .finally(() => setLoading(false));
  }, [selHospital, selSpecialty]);

  const canNext = () => {
    if (step === 0) return !!selCity;
    if (step === 1) return !!selHospital && !!selSpecialty;
    if (step === 2) return !!selDoctor;
    if (step === 3) return !!selDate && !!selTime;
    return true;
  };

  const handleSubmit = async () => {
    if (!selDoctor || !selDate || !selTime) return;
    setSubmitting(true);
    
    const newAppointment: Omit<Appointment, 'id' | 'status'> = {
      patient: user?.id || 1,
      patient_name: `${user?.first_name} ${user?.last_name}`,
      doctor: selDoctor.id,
      doctor_name: selDoctor.full_name,
      hospital: selDoctor.hospital,
      hospital_name: selDoctor.hospital_name,
      appointment_date: selDate,
      appointment_time: selTime,
      notes: note
    };

    setTimeout(() => { 
      storage.saveAppointment(newAppointment as any);
      setSubmitting(false); 
      setSuccess(true); 
    }, 1000);
  };

  // ROBUST AUTO-ADVANCE LOGIC
  useEffect(() => {
    if (step === 0 && selCity) { setStep(1); }
    if (step === 1 && selHospital && selSpecialty) { setStep(2); }
    if (step === 2 && selDoctor) { setStep(3); }
    if (step === 3 && selDate && selTime) { setStep(4); }
  }, [selCity, selHospital, selSpecialty, selDoctor, selDate, selTime, step]);

  return (
    <div style={{ width: '100%', paddingBottom: '3rem' }}>
      
      {/* Wizard Header - REDESIGNED for MAX CONTRAST */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', background: '#ffffff', padding: '1.5rem 2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(99,102,241,0.1)' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{ 
              width: 42, height: 42, borderRadius: '14px', 
              background: i <= step ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : '#f1f5f9', 
              color: i <= step ? '#ffffff' : '#475569', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 900, fontSize: 18, 
              boxShadow: i === step ? '0 8px 20px rgba(79,70,229,0.3)' : 'none',
              border: i === step ? '2px solid #ffffff' : '1px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}>{i + 1}</div>
            <span style={{ 
              fontSize: 12, fontWeight: 900, 
              color: i <= step ? '#1e293b' : '#94a3b8', 
              textTransform: 'uppercase', letterSpacing: '0.8px'
            }}>{s}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: '2.5rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}><MapPin size={24} color="var(--primary-color)" /> {t.search_city}</h2>
            <div style={{ marginBottom: 20 }}>
              <input value={citySearch} onChange={e => setCitySearch(e.target.value)} placeholder={language === 'tr' ? "Şehir ara..." : "Search city..."} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1.5px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)', fontSize: 16 }} />
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase())).map(c => (
                <button key={c.id} onClick={() => setSelCity(String(c.id))} style={{ padding: '12px', borderRadius: '14px', border: selCity === String(c.id) ? '3px solid #6366f1' : '1px solid #e2e8f0', background: selCity === String(c.id) ? '#eff6ff' : '#ffffff', color: '#1e293b', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>{c.name}</button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}><Building2 size={24} color="var(--primary-color)" /> {t.select_hospital}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 25 }}>
              {hospitals.map(h => (
                <button key={h.id} onClick={() => setSelHospital(String(h.id))} style={{ padding: '16px', borderRadius: '16px', textAlign: 'left', border: selHospital === String(h.id) ? '3px solid #6366f1' : '1px solid #cbd5e1', background: selHospital === String(h.id) ? '#eff6ff' : '#ffffff', color: '#1e293b', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', boxShadow: selHospital === String(h.id) ? '0 4px 12px rgba(99,102,241,0.1)' : 'none' }}>{h.name}</button>
              ))}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 15 }}>{t.select_specialty}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {specialties.map(s => (
                <button key={s.id} onClick={() => setSelSpecialty(String(s.id))} style={{ padding: '10px 20px', borderRadius: '20px', border: selSpecialty === String(s.id) ? '3px solid #6366f1' : '1px solid #cbd5e1', background: selSpecialty === String(s.id) ? '#6366f1' : '#ffffff', color: selSpecialty === String(s.id) ? 'white' : '#1e293b', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>{s.name}</button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>{t.select_doctor}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {doctors.map(d => (
                <div key={d.id} onClick={() => setSelDoctor(d)} style={{ padding: '16px', borderRadius: '20px', border: selDoctor?.id === d.id ? '3px solid #6366f1' : '1px solid #cbd5e1', background: selDoctor?.id === d.id ? '#eff6ff' : '#ffffff', display: 'flex', alignItems: 'center', gap: 15, cursor: 'pointer', transition: 'all 0.2s' }}>
                   <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Stethoscope/></div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: 800 }}>{d.full_name}</div>
                     <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.specialty_name}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>{t.select_date_time}</h2>
            <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1.5px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)', marginBottom: 20 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))', gap: 10 }}>
              {TIMES.map(tm => {
                const isBusy = selDoctor?.busy_slots?.includes(tm);
                return (
                  <button key={tm} onClick={() => { if(!isBusy) setSelTime(tm); }} disabled={isBusy} style={{ padding: '12px', borderRadius: '12px', border: selTime === tm ? '3px solid #6366f1' : '1px solid #cbd5e1', background: selTime === tm ? '#6366f1' : (isBusy ? '#f1f5f9' : '#ffffff'), color: selTime === tm ? 'white' : (isBusy ? '#94a3b8' : '#1e293b'), fontWeight: 800, cursor: isBusy ? 'not-allowed' : 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                    {tm}
                    {isBusy && <X size={14} style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: 'white', borderRadius: '50%', padding: 2 }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && !success && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 24, color: '#0f172a' }}>✅ Randevuyu Onayla</h2>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                   <span style={{ color: '#64748b', fontWeight: 700, fontSize: 15 }}>Hekim</span>
                   <span style={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>{selDoctor?.full_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                   <span style={{ color: '#64748b', fontWeight: 700, fontSize: 15 }}>Hastane</span>
                   <span style={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>{selDoctor?.hospital_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                   <span style={{ color: '#64748b', fontWeight: 700, fontSize: 15 }}>Klinik</span>
                   <span style={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>{selDoctor?.specialty_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                   <span style={{ color: '#64748b', fontWeight: 700, fontSize: 15 }}>Tarih & Saat</span>
                   <span style={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>{selDate} / {selTime}</span>
                </div>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{ 
                width: '100%', 
                padding: '20px', 
                marginTop: '24px', 
                borderRadius: '20px', 
                border: 'none', 
                background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                color: 'white', 
                fontWeight: 900, 
                fontSize: 18, 
                cursor: submitting ? 'wait' : 'pointer',
                boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
            >
              {submitting ? 'Randevu Oluşturuluyor...' : '🎯 Randevuyu Onayla'}
            </button>
          </div>
        )}

        {success && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <CheckCircle2 size={72} color="#10b981" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Randevu Başarıyla Oluşturuldu! 🎉</h2>
            <p style={{ color: '#64748b', fontSize: 16, marginBottom: '2rem' }}>Randevunuz kaydedildi. Randevularım sayfasından takip edebilirsiniz.</p>
            <button 
              onClick={() => navigate('/appointments')} 
              style={{ 
                padding: '16px 40px', 
                borderRadius: '16px', 
                border: 'none', 
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                color: 'white', 
                fontWeight: 900, 
                fontSize: 16, 
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(79,70,229,0.3)'
              }}
            >
              📋 Randevularıma Git
            </button>
          </div>
        )}

        {!success && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0} style={{ padding: '12px 24px', borderRadius: '14px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#1e293b', fontWeight: 700, cursor: 'pointer', opacity: step === 0 ? 0.3 : 1 }}><ArrowLeft size={18} /></button>
            {step < 4 && <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: canNext() ? '#6366f1' : '#e2e8f0', color: canNext() ? 'white' : '#64748b', fontWeight: 900, cursor: canNext() ? 'pointer' : 'not-allowed', boxShadow: canNext() ? '0 8px 16px rgba(99,102,241,0.2)' : 'none', opacity: 1, minWidth: '140px' }}>{language === 'tr' ? 'Devam Et' : 'Continue'}</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;