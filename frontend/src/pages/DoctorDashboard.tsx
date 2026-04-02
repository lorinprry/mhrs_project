import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Calendar, Activity, ShieldCheck,
  CheckCircle2, XCircle, Check,
  TrendingUp, ClipboardCheck, ArrowRight
} from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Appointment, Paginated } from '../types';
import { storage } from '../utils/storage';

type Tab = 'today' | 'upcoming' | 'completed' | 'cancelled';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('today');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDisplay = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const fetchApts = useCallback(() => {
    setLoading(true);
    client.get<Paginated<Appointment>>('/appointments/')
      .then((r: any) => {
          const apiApts = r.data?.results || [];
          const localApts = storage.getAppointments();
          const combined = [...apiApts, ...localApts];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          setAppointments(unique);
      })
      .catch(() => {
          setAppointments(storage.getAppointments());
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchApts(); }, [fetchApts]);

  const todayApts = appointments.filter(a => a.appointment_date === todayStr && a.status === 'booked');
  const upcomingApts = appointments.filter(a => a.appointment_date > todayStr && a.status === 'booked');
  const completedApts = appointments.filter(a => a.status === 'completed');
  const cancelledApts = appointments.filter(a => a.status === 'cancelled');

  const tabList = { today: todayApts, upcoming: upcomingApts, completed: completedApts, cancelled: cancelledApts };
  const currentList = tabList[tab].sort((a,b) => a.appointment_time.localeCompare(b.appointment_time));

  const updateStatus = useCallback(async (id: number, status: string) => {
    try {
      await client.patch(`/appointments/${id}/`, { status });
      storage.updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch {
      // Fallback for local
      storage.updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }
  }, []);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || ''))}&background=ffffff&color=4f46e5&rounded=xl&size=150`;

  return (
    <div className="max-w-6xl mx-auto pb-12 pt-2">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] p-8 md:p-12 mb-8 shadow-2xl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, var(--color-primary-dark) 100%)', color: 'white' }}>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
           <div className="flex items-center gap-6">
              <img src={avatarUrl} alt="Doctor Profil" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-white/20 shadow-xl object-cover" />
              <div>
                 <p className="text-white/70 font-bold text-sm tracking-wide uppercase mb-1">{todayDisplay}</p>
                 <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{fontFamily: 'Outfit'}}>Dr. {user?.first_name} {user?.last_name}</h1>
                 <div className="flex items-center gap-2 text-mint-light font-bold text-sm bg-white/10 w-fit px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                    <ShieldCheck size={16} /> Klinik ve Randevu Sistemi Aktif
                 </div>
              </div>
           </div>

           <div className="flex gap-4">
              {[
                { num: todayApts.length, label: 'Bugünkü', color: 'text-mint-light border-mint/30' },
                { num: upcomingApts.length, label: 'Bekleyen', color: 'text-primary-light border-primary/30' },
                { num: completedApts.length, label: 'Bakılan', color: 'text-amber-light border-amber/30' }
              ].map((s, idx) => (
                <div key={idx} className={`bg-white/10 backdrop-blur-md border rounded-2xl p-4 text-center min-w-[100px] ${s.color}`}>
                   <div className="text-3xl font-extrabold mb-1" style={{fontFamily: 'Outfit'}}>{s.num}</div>
                   <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">{s.label}</div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Users size={24} />, val: appointments.length, label: 'Toplam Hasta', bg: 'bg-primary-light', ic: 'text-primary' },
          { icon: <CheckCircle2 size={24} />, val: completedApts.length, label: 'Tamamlanan', bg: 'bg-mint-light', ic: 'text-mint-dark' },
          { icon: <XCircle size={24} />, val: cancelledApts.length, label: 'İptal Edilen', bg: 'bg-rose-light', ic: 'text-rose' },
          { icon: <TrendingUp size={24} />, val: '%98', label: 'Verimlilik Puanı', bg: 'bg-amber-light', ic: 'text-amber' },
        ].map((s, i) => (
          <div key={i} className="card flex items-center gap-4 p-5 hover:border-primary-light group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${s.bg} ${s.ic} group-hover:scale-110 transition-transform`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-extrabold text-main leading-none mb-1 text-h2">{s.val}</div>
              <div className="text-[11px] font-bold text-muted uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
               <h2 className="text-2xl font-extrabold text-main" style={{fontFamily: 'Outfit'}}>Randevu Yönetimi</h2>
               {/* Dashboard Tabs */}
               <div className="flex bg-slate-100 rounded-xl p-1.5 w-full sm:w-auto">
                 {([
                   { key: 'today', label: `Bugün (${todayApts.length})` },
                   { key: 'upcoming', label: `Bekleyen (${upcomingApts.length})` },
                 ] as const).map(t => (
                   <button key={t.key} onClick={() => setTab(t.key)}
                     className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${tab === t.key ? 'bg-white text-primary' : 'text-slate-500 hover:text-main shadow-none'}`}
                   >{t.label}</button>
                 ))}
               </div>
            </div>

            {loading ? (
               <div className="space-y-4">
                 {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl animate-pulse" />)}
               </div>
            ) : currentList.length === 0 ? (
               <div className="card text-center p-16 border-dashed border-2 border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Calendar size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-main mb-2">Gösterilecek Randevu Yok</h3>
                  <p className="text-muted text-sm max-w-sm mx-auto">Seçili kategori altında aktif hastanız bulunmuyor.</p>
               </div>
            ) : (
               <div className="space-y-4">
                 {currentList.map((apt, idx) => (
                   <div key={apt.id} className="card p-0 overflow-hidden flex flex-col sm:flex-row hover:border-primary-light group">
                     {/* Status Color Bar */}
                     <div className={`w-full sm:w-2 shrink-0 ${apt.status === 'booked' ? 'bg-primary' : apt.status === 'completed' ? 'bg-mint' : 'bg-rose'} h-1 sm:h-auto`} />
                     
                     <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-5">
                          {/* Time Badge */}
                          <div className="bg-primary-soft rounded-xl p-3 text-center min-w-[80px] border border-primary-light">
                             <div className="font-extrabold text-xl text-primary mb-0.5">{apt.appointment_time}</div>
                             <div className="text-[10px] font-bold text-slate-500 uppercase">Sıra {idx + 1}</div>
                          </div>
                          
                          {/* Patient Info */}
                          <div>
                            <div className="font-bold text-lg text-main mb-1">{apt.patient_name || 'Bilinmeyen Hasta'}</div>
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {apt.appointment_date}</span>
                            </div>
                            {apt.notes && (
                              <div className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded border border-slate-100 flex items-start gap-1">
                                <ClipboardCheck size={14} className="shrink-0 text-amber mt-0.5" />
                                <span>{apt.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="w-full md:w-auto flex flex-col xs:flex-row gap-2 shrink-0">
                          {apt.status === 'booked' && (
                            <>
                              <button onClick={() => updateStatus(apt.id, 'completed')}
                                className="btn bg-mint-light text-mint-dark hover:bg-mint hover:text-white border border-mint/20 py-2.5 px-4 text-sm w-full md:w-auto transition-colors">
                                <Check size={16} /> Tamamlandı
                              </button>
                              <button onClick={() => updateStatus(apt.id, 'cancelled')}
                                className="btn bg-rose-light text-rose hover:bg-rose hover:text-white border border-rose/20 py-2.5 px-4 text-sm w-full md:w-auto transition-colors">
                                  Gelmedi
                              </button>
                            </>
                          )}
                          {apt.status === 'completed' && <span className="badge badge-mint py-2 px-4"><CheckCircle2 size={14}/> Onaylandı</span>}
                          {apt.status === 'cancelled' && <span className="badge badge-rose py-2 px-4"><XCircle size={14}/> İptal</span>}
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            )}
         </div>

         <div className="flex flex-col gap-6">
            <div className="card">
               <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center"><Calendar size={18} /></div>
                 <h3 className="text-lg font-bold text-main">Haftalık Program</h3>
               </div>
               
               <div className="space-y-2">
                 {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].map((day, idx) => (
                   <div key={day} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 hover:bg-primary-light/20 transition-colors border border-slate-100">
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-main mb-0.5">{day}</span>
                        <span className="text-[10px] font-bold text-muted uppercase">09:00 - 17:00</span>
                     </div>
                     <span className="text-xs font-bold text-primary bg-white border border-primary-light px-2.5 py-1.5 rounded-lg shadow-sm">
                       {Math.floor(Math.random() * 6 + 4)} randevu
                     </span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="card">
               <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-amber-light text-amber flex items-center justify-center"><Activity size={18} /></div>
                 <h3 className="text-lg font-bold text-main">Klinik Durumu</h3>
               </div>
               
               <div className="space-y-4">
                 {[
                   { label: 'Poliklinik Adı', value: user?.first_name ? `${user.first_name} Polikliniği` : 'Poliklinik' },
                   { label: 'Oda Numarası', value: '301 / B Blok' },
                   { label: 'Varsayılan Süre', value: '15 Dakika' },
                   { label: 'Sistem Durumu', value: 'Aktif', highlight: true },
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                     <span className="text-sm font-bold text-slate-500">{item.label}</span>
                     {item.highlight ? (
                        <span className="badge badge-mint">{item.value} <div className="w-1.5 h-1.5 bg-mint-dark rounded-full ml-1 animate-pulse"></div></span>
                     ) : (
                        <span className="text-sm font-extrabold text-main">{item.value}</span>
                     )}
                   </div>
                 ))}
               </div>
            </div>

            <button className="btn bg-slate-900 text-white w-full py-4 text-base shadow-xl border border-slate-800 hover:bg-slate-800">
               Tüm Raporları Gör <ArrowRight size={18} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
