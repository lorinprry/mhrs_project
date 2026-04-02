import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, Stethoscope, Heart, Filter, ChevronDown, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';

type Doctor = {
  id: number;
  full_name: string;
  specialty_name: string;
  hospital_name: string;
  city: string;
  room_no: string;
  rating: number;
  reviews: number;
  available: boolean;
  experience: number;
};

const ALL_DOCTORS: Doctor[] = [
  { id: 1,  full_name: 'Prof. Dr. Ahmet Yılmaz',      specialty_name: 'Kardiyoloji',       hospital_name: 'Ankara Şehir Hastanesi',       city: 'Ankara',    room_no: '301', rating: 4.9, reviews: 312, available: true,  experience: 18 },
  { id: 2,  full_name: 'Uzm. Dr. Ayşe Demir',          specialty_name: 'Cildiye',           hospital_name: 'İstanbul Tıp Merkezi',         city: 'İstanbul',  room_no: '112', rating: 4.8, reviews: 198, available: true,  experience: 11 },
  { id: 3,  full_name: 'Op. Dr. Mehmet Can',            specialty_name: 'Ortopedi',          hospital_name: 'Ege Üniv. Hastanesi',          city: 'İzmir',     room_no: '205', rating: 4.7, reviews: 421, available: false, experience: 14 },
  { id: 4,  full_name: 'Dr. Fatma Kaya',                specialty_name: 'Nöroloji',          hospital_name: 'Çukurova Araştırma Hastanesi',  city: 'Adana',     room_no: '308', rating: 4.6, reviews: 87,  available: true,  experience: 9  },
  { id: 5,  full_name: 'Doç. Dr. Ali Özkan',            specialty_name: 'Dahiliye',          hospital_name: 'Ankara Şehir Hastanesi',       city: 'Ankara',    room_no: '415', rating: 4.9, reviews: 543, available: true,  experience: 22 },
];

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useSettings();
  const t = translations[language];
  const [query, setQuery] = useState('');
  const [specFilter, setSpecFilter] = useState(language === 'tr' ? 'Tümü' : 'All');
  const [showFilters, setShowFilters] = useState(false);

  const SPECIALTIES = language === 'tr' 
    ? ['Tümü','Kardiyoloji','Cildiye','Ortopedi','Nöroloji','Dahiliye']
    : ['All','Cardiology','Dermatology','Orthopedics','Neurology','Internal Medicine'];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_DOCTORS.filter(d => {
      const matchSearch = !q || d.full_name.toLowerCase().includes(q) || d.specialty_name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q);
      const matchSpec = specFilter === 'Tümü' || specFilter === 'All' || d.specialty_name === specFilter;
      return matchSearch && matchSpec;
    });
  }, [query, specFilter]);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{t.doctors}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 6 }}>{language === 'tr' ? `${ALL_DOCTORS.length} uzman hekim arasında arayın ve randevu alın.` : `Search among ${ALL_DOCTORS.length} specialists and book an appointment.`}</p>
      </div>

      {/* Searchbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-card)', border: '1.5px solid var(--border-color)', borderRadius: 18, padding: '0 20px', boxShadow: 'var(--shadow-sm)' }}>
          <Search size={20} color="var(--text-muted)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={language === 'tr' ? "Doktor veya branş ara..." : "Search doctor or specialty..."} style={{ border: 'none', outline: 'none', flex: 1, fontSize: 16, padding: '16px 0', background: 'transparent', color: 'var(--text-main)' }} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} style={{ padding: '0 24px', borderRadius: 16, border: '1.5px solid var(--border-color)', background: showFilters ? 'var(--primary-soft)' : 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: showFilters ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
          <Filter size={18} /> {language === 'tr' ? 'Filtrele' : 'Filter'}
        </button>
      </div>

      {showFilters && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24, background: 'var(--bg-soft)', padding: '1.5rem', borderRadius: '22px' }}>
          {SPECIALTIES.map(s => (
            <button key={s} onClick={() => setSpecFilter(s)}
              style={{
                padding: '10px 20px', borderRadius: 14, border: specFilter === s ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                background: specFilter === s ? 'var(--primary-color)' : 'var(--bg-card)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                color: specFilter === s ? 'white' : 'var(--text-secondary)', transition: 'all 0.2s'
              }}>{s}</button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map(doc => (
          <div key={doc.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: 24, boxShadow: 'var(--shadow-sm)', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.full_name)}&background=e0e7ff&color=4f46e5&rounded=true&size=128`} alt={doc.full_name} style={{ width: 64, height: 64, borderRadius: 18, border: '2px solid var(--border-color)' }} />
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: 18 }}>{doc.full_name}</div>
                <div style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: 14 }}>{doc.specialty_name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 12, marginTop: 4, fontWeight: 600 }}>
                  <MapPin size={12} /> {doc.hospital_name}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-soft)', borderRadius: 16, padding: '12px 16px', marginBottom: 20 }}>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 3 }}><Star size={14} fill="currentColor"/> {doc.rating}</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Exp</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{doc.experience}y</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: doc.available ? '#10b981' : 'var(--text-muted)' }}>{doc.available ? (language === 'tr' ? 'Müsait' : 'Available') : 'Busy'}</div>
               </div>
            </div>

            <button 
              onClick={() => navigate(`/booking?doctor=${doc.id}`)} 
              disabled={!doc.available}
              style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: doc.available ? 'var(--primary-color)' : 'var(--bg-soft)', color: 'white', fontWeight: 800, cursor: doc.available ? 'pointer' : 'not-allowed', fontSize: 15 }}
            >
              {doc.available ? t.booking : (language === 'tr' ? 'Meşgul' : 'Busy')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;