import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, Search, Trash2, Calendar } from 'lucide-react';

type FavDoctor = {
  id: number;
  full_name: string;
  specialty_name: string;
  hospital_name: string;
  rating: number;
  reviews: number;
  experience: number;
};

const INITIAL_FAVS: FavDoctor[] = [
  { id: 1, full_name: 'Prof. Dr. Ahmet Yılmaz', specialty_name: 'Kardiyoloji', hospital_name: 'Ankara Şehir Hastanesi', rating: 4.9, reviews: 312, experience: 18 },
  { id: 5, full_name: 'Doç. Dr. Ali Özkan', specialty_name: 'Dahiliye', hospital_name: 'Ankara Şehir Hastanesi', rating: 4.9, reviews: 543, experience: 22 },
  { id: 9, full_name: 'Dr. Emre Yıldırım', specialty_name: 'Çocuk Sağlığı', hospital_name: 'Dr. Sami Ulus Çocuk H.', rating: 4.9, reviews: 267, experience: 15 },
];

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favs, setFavs] = useState(INITIAL_FAVS);
  const [query, setQuery] = useState('');

  const removeFav = (id: number) => {
    if (window.confirm('Favorilerden çıkarmak istiyor musunuz?')) {
      setFavs(prev => prev.filter(f => f.id !== id));
    }
  };

  const filtered = query.trim()
    ? favs.filter(f => f.full_name.toLowerCase().includes(query.toLowerCase()) || f.specialty_name.toLowerCase().includes(query.toLowerCase()))
    : favs;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Heart size={26} color="#ef4444" fill="#ef4444" /> Favorilerim
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>Favori hekimlerinizi buradan yönetin ve hızla randevu alın.</p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '0 16px', marginBottom: 24, boxShadow: '0 2px 8px rgba(15,23,42,.03)' }}>
        <Search size={18} color="#94a3b8" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Favori hekimlerinizde arayın..."
          style={{ border: 'none', outline: 'none', flex: 1, padding: '14px 0', fontSize: 15, background: 'transparent' }}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: 'white', border: '1.5px dashed #e2e8f0', borderRadius: 22, padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Heart size={28} color="#ef4444" />
          </div>
          <p style={{ fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Henüz favoriniz yok</p>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Hekim keşfi sayfasından hekimleri favorilerinize ekleyebilirsiniz.</p>
          <button onClick={() => navigate('/doctors')} style={{ padding: '12px 24px', borderRadius: 14, border: 'none', background: '#6366f1', color: 'white', fontWeight: 800, cursor: 'pointer' }}>
            <Search size={14} style={{ display: 'inline', marginRight: 6 }} />Hekim Keşfet
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(doc => (
            <div key={doc.id} style={{ background: 'white', border: '1px solid #ececf4', borderRadius: 22, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, boxShadow: '0 4px 16px rgba(15,23,42,.04)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.full_name)}&background=e0e7ff&color=4f46e5&rounded=true&size=96`} alt="" style={{ width: 52, height: 52, borderRadius: 14, border: '2px solid #e0e7ff' }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{doc.full_name}</div>
                  <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 700, marginBottom: 4 }}>{doc.specialty_name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} /> {doc.hospital_name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontWeight: 700, fontSize: 13, marginRight: 8 }}>
                  <Star size={13} fill="currentColor" /> {doc.rating}
                </div>
                <button onClick={() => navigate(`/doctor-detail/${doc.id}`)} style={{ padding: '10px 16px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Detay</button>
                <button onClick={() => navigate(`/booking?doctor=${doc.id}`)} style={{ padding: '10px 16px', borderRadius: 12, border: 'none', background: '#6366f1', color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> Randevu</button>
                <button onClick={() => removeFav(doc.id)} style={{ padding: '10px', borderRadius: 10, border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={14} color="#ef4444" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;