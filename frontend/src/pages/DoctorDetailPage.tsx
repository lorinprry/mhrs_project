import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Star, Calendar, Clock, ShieldCheck,
  GraduationCap, Heart, MessageCircle, ThumbsUp, Send,
} from 'lucide-react';
import client from '../api/client';
import type { Doctor } from '../types';

type Review = { id: number; author: string; rating: number; text: string; date: string };

const MOCK_REVIEWS: Review[] = [
  { id: 1, author: 'A*** Y.', rating: 5, text: 'Çok detaylı ve ilgili bir hekim. Her şeyi net açıkladı, çok memnunum.', date: '12 Mart 2026' },
  { id: 2, author: 'K*** M.', rating: 5, text: 'Hastane çok temizdi, doktor bey nazik ve profesyoneldi. Kesinlikle öneririm.', date: '5 Mart 2026' },
  { id: 3, author: 'S*** D.', rating: 4, text: 'Genel olarak iyi bir deneyimdi. Bekleme süresi biraz uzundu ama muayene kaliteli.', date: '28 Şubat 2026' },
  { id: 4, author: 'E*** K.', rating: 5, text: 'Teşhis sürecinde çok doğru yönlendirme yaptı. Tedavi planı detaylı hazırlandı.', date: '20 Şubat 2026' },
];

const MOCK_DOCTORS = [
  { id: 1, full_name: 'Prof. Dr. Ahmet Yılmaz', specialty_name: 'Kardiyoloji', hospital_name: 'Ankara Şehir Hastanesi', room_no: '301', hospital: 1, specialty: 1, user: 1, rating: 4.9, reviews: 312, experience: 18, education: 'Hacettepe Üniv. Tıp Fak.' },
  { id: 2, full_name: 'Uzm. Dr. Ayşe Demir', specialty_name: 'Cildiye', hospital_name: 'İstanbul Tıp Merkezi', room_no: '112', hospital: 2, specialty: 2, user: 2, rating: 4.8, reviews: 198, experience: 11, education: 'İstanbul Üniv. Cerrahpaşa' },
  { id: 3, full_name: 'Op. Dr. Mehmet Can', specialty_name: 'Ortopedi', hospital_name: 'Ege Üniv. Hastanesi', room_no: '205', hospital: 3, specialty: 3, user: 3, rating: 4.7, reviews: 421, experience: 14, education: 'Ege Üniv. Tıp Fak.' },
  { id: 4, full_name: 'Dr. Fatma Kaya', specialty_name: 'Nöroloji', hospital_name: 'Çukurova Araştırma Hastanesi', room_no: '308', hospital: 4, specialty: 4, user: 4, rating: 4.6, reviews: 87, experience: 9, education: 'Gazi Üniv. Tıp Fak.' },
  { id: 5, full_name: 'Doç. Dr. Ali Özkan', specialty_name: 'Dahiliye', hospital_name: 'Ankara Şehir Hastanesi', room_no: '415', hospital: 1, specialty: 5, user: 5, rating: 4.9, reviews: 543, experience: 22, education: 'Ankara Üniv. Tıp Fak.' },
  { id: 6, full_name: 'Uzm. Dr. Zeynep Arslan', specialty_name: 'Göz Hastalıkları', hospital_name: 'Anadolu Med Center', room_no: '110', hospital: 5, specialty: 6, user: 6, rating: 4.7, reviews: 156, experience: 8, education: 'ODTÜ Sağlık Bilimleri' },
];

const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try API first, fallback to mock
    client.get('/doctors/')
      .then(r => {
        const list = r.data?.results ?? r.data ?? [];
        const found = list.find((d: any) => String(d.id) === id);
        if (found) { setDoctor(found); setLoading(false); return; }
        const mock = MOCK_DOCTORS.find(d => String(d.id) === id);
        setDoctor(mock || null);
        setLoading(false);
      })
      .catch(() => {
        const mock = MOCK_DOCTORS.find(d => String(d.id) === id);
        setDoctor(mock || null);
        setLoading(false);
      });
  }, [id]);

  const handleSubmitReview = () => {
    if (!newReview.trim()) return;
    const r: Review = { id: Date.now(), author: 'Siz', rating: newRating, text: newReview, date: 'Az önce' };
    setReviews(prev => [r, ...prev]);
    setNewReview('');
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Hekim bilgileri yükleniyor...</div>;
  if (!doctor) return <div style={{ padding: 40, textAlign: 'center' }}><h2 style={{ fontWeight: 800 }}>Hekim bulunamadı</h2></div>;

  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', marginBottom: 20, fontWeight: 600, fontSize: 14 }}>
        <ArrowLeft size={18} /> Geri Dön
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>

        {/* LEFT: Profile card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'white', border: '1px solid #ececf4', borderRadius: 24, padding: 28, textAlign: 'center', boxShadow: '0 6px 24px rgba(15,23,42,.05)' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=e0e7ff&color=4f46e5&rounded=true&size=200`} alt="" style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid white', boxShadow: '0 4px 16px rgba(99,102,241,.2)' }} />
              <div style={{ position: 'absolute', bottom: 2, right: 2, background: '#10b981', width: 24, height: 24, borderRadius: '50%', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={12} color="white" />
              </div>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{doctor.full_name}</h2>
            <p style={{ color: '#6366f1', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{doctor.specialty_name}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', color: '#f59e0b', fontWeight: 800 }}>
                  <Star size={14} fill="currentColor" /> {doctor.rating || avgRating}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Puan</div>
              </div>
              <div style={{ width: 1, background: '#e2e8f0' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>{doctor.experience || 12}+</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Yıl Tecrübe</div>
              </div>
              <div style={{ width: 1, background: '#e2e8f0' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>{doctor.reviews || reviews.length}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Yorum</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setIsFav(!isFav)} style={{ flex: 1, padding: 10, borderRadius: 12, border: '1px solid #e2e8f0', background: isFav ? '#fef2f2' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: isFav ? '#ef4444' : '#475569' }}>
                <Heart size={16} fill={isFav ? 'currentColor' : 'none'} /> {isFav ? 'Favoride' : 'Favori'}
              </button>
              <button onClick={() => navigate(`/booking?doctor=${doctor.id}`)} style={{ flex: 2, padding: 10, borderRadius: 12, border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>
                Randevu Al
              </button>
            </div>
          </div>

          {/* Location card */}
          <div style={{ background: 'white', border: '1px solid #ececf4', borderRadius: 20, padding: 20, boxShadow: '0 4px 12px rgba(15,23,42,.03)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Lokasyon</h3>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={16} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{doctor.hospital_name}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Oda: <strong>{doctor.room_no}</strong></div>
              </div>
            </div>
          </div>

          {/* Work hours */}
          <div style={{ background: 'white', border: '1px solid #ececf4', borderRadius: 20, padding: 20, boxShadow: '0 4px 12px rgba(15,23,42,.03)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Çalışma Saatleri</h3>
            {[{ day: 'Pazartesi - Cuma', hours: '09:00 — 17:00' }, { day: 'Cumartesi', hours: '09:00 — 13:00' }, { day: 'Pazar', hours: 'Kapalı' }].map((w, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', fontSize: 13 }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>{w.day}</span>
                <span style={{ fontWeight: 700, color: w.hours === 'Kapalı' ? '#ef4444' : '#0f172a' }}>{w.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: About + Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* About */}
          <div style={{ background: 'white', border: '1px solid #ececf4', borderRadius: 24, padding: 28, boxShadow: '0 6px 24px rgba(15,23,42,.05)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Hakkında</h3>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f8f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><GraduationCap size={20} color="#6366f1" /></div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, marginBottom: 4 }}>Akademik Geçmiş</div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{doctor.education || 'Hacettepe Üniversitesi'} mezunu. Uzmanlık eğitimini tamamlayarak {doctor.experience || 12} yılı aşkın klinik tecrübeye sahiptir.</p>
              </div>
            </div>

            {/* Quick booking CTA */}
            <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)', borderRadius: 18, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <div>
                <div style={{ fontWeight: 800, color: '#4f46e5', marginBottom: 4 }}>Hemen Randevu Alın</div>
                <div style={{ fontSize: 13, color: '#6366f1' }}>En yakın müsait tarih: Yarın 09:30</div>
              </div>
              <button onClick={() => navigate(`/booking?doctor=${doctor.id}`)} style={{ padding: '12px 24px', borderRadius: 14, border: 'none', background: '#6366f1', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,.3)' }}>
                Randevu Al
              </button>
            </div>
          </div>

          {/* Reviews section */}
          <div style={{ background: 'white', border: '1px solid #ececf4', borderRadius: 24, padding: 28, boxShadow: '0 6px 24px rgba(15,23,42,.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageCircle size={20} color="#6366f1" /> Hasta Değerlendirmeleri
              </h3>
              <span style={{ background: '#fff7ed', color: '#f59e0b', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 800 }}>
                ★ {avgRating} ({reviews.length})
              </span>
            </div>

            {/* Write review */}
            <div style={{ background: '#f8f7ff', borderRadius: 18, padding: 18, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 10, fontSize: 14 }}>Değerlendirme Yazın</div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setNewRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <Star size={20} fill={n <= newRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={newReview} onChange={e => setNewReview(e.target.value)} placeholder="Deneyiminizi paylaşın..."
                  style={{ flex: 1, padding: '12px 14px', border: '1.5px solid #e0e7ff', borderRadius: 12, fontSize: 14, outline: 'none' }}
                />
                <button onClick={handleSubmitReview} style={{ padding: '12px 18px', borderRadius: 12, border: 'none', background: '#6366f1', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Send size={14} /> Gönder
                </button>
              </div>
            </div>

            {/* Reviews list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: '#fafafa', borderRadius: 16, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[1,2,3,4,5].map(n => <Star key={n} size={12} fill={n <= r.rating ? '#f59e0b' : '#e2e8f0'} color={n <= r.rating ? '#f59e0b' : '#e2e8f0'} />)}
                    </div>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.text}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>— {r.author}</span>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                      <ThumbsUp size={12} /> Faydalı
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;