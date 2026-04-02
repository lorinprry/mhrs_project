import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, ArrowLeft, GraduationCap, Clock, ShieldCheck, Heart } from 'lucide-react';
import client from '../api/client';
import type { Doctor } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Pill from '../components/Pill';

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // There is no explicit individual doctor endpoint, so we fetch all and find,
    // or just mock it since this is a UI demonstrator. In real app we'd fetch `/doctors/${id}/`
    client.get(`/doctors/`)
      .then(res => {
        const found = res.data.results?.find((d: Doctor) => String(d.id) === id);
        if (found) setDoctor(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="animate-pulse p-8 text-center text-muted">Hekim bilgileri yükleniyor...</div>;
  }

  if (!doctor && !loading) {
    return <div className="p-8 text-center"><h2 className="text-h2">Hekim Bulunamadı</h2></div>;
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-12">
      <button className="btn btn-ghost p-2 mb-6 text-muted hover:text-main" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> <span className="ml-1">Keşfet'e Dön</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Photo & Basic Info */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card padding="xl" className="text-center flex flex-col items-center">
            <div className="relative mb-6">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.full_name || '')}&background=e0e7ff&color=4f46e5&rounded=true&size=200`} 
                alt={doctor?.full_name} 
                className="w-32 h-32 rounded-full border-4 border-white shadow-md relative z-10" 
              />
              <div className="absolute top-2 right-0 bg-mint text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white z-20" title="Doğrulanmış Uzman">
                <ShieldCheck size={16} />
              </div>
            </div>
            
            <h1 className="text-h2 mb-1">{doctor?.full_name}</h1>
            <p className="text-primary font-bold mb-4">{doctor?.specialty_name}</p>
            
            <div className="flex gap-2 w-full mb-6">
              <Button 
                variant="outline" 
                className={`flex-1 ${isFavorite ? 'text-rose border-rose-light bg-rose-light/20' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-rose' : ''} />
              </Button>
              <button className="btn btn-ghost flex-1 text-xs border border-slate-200">
                Profili Paylaş
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 w-full py-4 border-t border-slate-100">
              <div className="flex flex-col items-center">
                <span className="text-h3 font-bold flex items-center gap-1"><Star size={16} className="text-amber-500" fill="currentColor"/> 4.9</span>
                <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Değerlendirme</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-h3 font-bold">12+</span>
                <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Yıllık Tecrübe</span>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">Lokasyon Bilgisi</h3>
            <div className="flex gap-3 items-start">
              <div className="icon-box sm bg-blue-50 text-blue-500 shrink-0 mt-1"><MapPin size={18} /></div>
              <div>
                <h4 className="font-bold mb-1">{doctor?.hospital_name}</h4>
                <p className="text-sm text-medium leading-relaxed">Ana Poliklinik Binası, 2. Kat<br/>Oda Numaranız: <strong className="text-main">{doctor?.room_no}</strong></p>
                <button className="text-primary text-xs font-bold mt-2 hover:underline">Haritada Gör</button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Details & Booking */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card padding="xl">
            <h2 className="text-h3 border-b border-slate-100 pb-4 mb-6">Hakkında</h2>
            <div className="flex flex-col gap-6">
              
              <div className="flex gap-4 items-start">
                <div className="icon-box md bg-slate-50 text-slate-400 shrink-0"><GraduationCap size={24} /></div>
                <div>
                  <h4 className="font-bold mb-1 text-sm">Akademik Geçmiş</h4>
                  <p className="text-sm text-medium leading-relaxed">
                    Hacettepe Üniversitesi Tıp Fakültesi mezunu. Uzmanlık eğitimini Gazi Üniversitesi'nde tamamlamıştır. Sektörde sayısız uluslararası yayına ve referansa sahiptir.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start border-t border-slate-100 pt-6">
                <div className="icon-box md bg-slate-50 text-slate-400 shrink-0"><Clock size={24} /></div>
                <div>
                  <h4 className="font-bold mb-2 text-sm">Çalışma Saatleri</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-muted">Pzt - Cuma</span>
                      <span className="font-bold">09:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-muted">Cumartesi</span>
                      <span className="font-bold">09:00 - 13:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-primary-light/50 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-dark mb-1">Hemen Randevu Alın</h3>
                <p className="text-sm text-primary-dark/80">En yakın müsait tarih: Yarın 09:30</p>
              </div>
              <Button onClick={() => navigate('/booking')} className="shadow-lg px-8 py-3">Randevu Oluştur</Button>
            </div>
          </Card>

          <div className="flexitems-center justify-between mt-4">
            <h3 className="text-h3">Hasta Değerlendirmeleri</h3>
            <Pill variant="amber" icon={<Star size={12} fill="currentColor" />}>124 Yorum</Pill>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="md" className="bg-slate-50 border-none shadow-none">
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
              </div>
              <p className="text-sm text-medium italic">"İlgisi ve bilgisi harika, çok detaylı anlattı."</p>
              <span className="text-xs text-muted block mt-3 font-semibold">— A*** Y.</span>
            </Card>
            <Card padding="md" className="bg-slate-50 border-none shadow-none">
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
              </div>
              <p className="text-sm text-medium italic">"Hastane şartları çok temiz, doktor bey çok nazik."</p>
              <span className="text-xs text-muted block mt-3 font-semibold">— K*** M.</span>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
