import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Stethoscope
} from 'lucide-react';
import client from '../api/client';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';
import type { Appointment, Paginated } from '../types';
import { storage } from '../utils/storage';

type Tab = 'booked' | 'completed' | 'cancelled' | 'all';

const AppointmentsPage: React.FC = () => {
    const { language } = useSettings();
    const t = translations[language];
    
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>('booked');

    const fetchAppointments = useCallback(() => {
        setLoading(true);
        client.get<Paginated<Appointment>>('/appointments/')
            .then(r => {
                const apiApts = r.data?.results || [];
                const localApts = storage.getAppointments();
                // Merge and filter by ID to avoid duplicates
                const combined = [...apiApts, ...localApts];
                const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                setAppointments(unique);
            })
            .catch(() => {
                setAppointments(storage.getAppointments());
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    const filtered = tab === 'all' ? appointments : appointments.filter(a => a.status === tab);

    const counts = {
        all: appointments.length,
        booked: appointments.filter(a => a.status === 'booked').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
    };

    const statusBadge = (s: string) => {
        const tr: Record<string, string> = {
            booked: language === 'tr' ? 'Onaylı' : 'Confirmed',
            completed: language === 'tr' ? 'Tamamlandı' : 'Completed',
            cancelled: language === 'tr' ? 'İptal Edildi' : 'Cancelled'
        };
        const color = s === 'booked' ? 'var(--primary-color)' : (s === 'completed' ? '#10b981' : '#ef4444');
        return <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, background: 'var(--bg-soft)', color }}>{tr[s] || s}</span>;
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>{t.appointments}</h1>
                <p style={{ color: 'var(--text-muted)' }}>{language === 'tr' ? 'Tüm randevularınızı buradan takip edebilirsiniz.' : 'Track all your appointments here.'}</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '6px', borderRadius: '18px', marginBottom: '2rem', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                {(['booked', 'completed', 'cancelled', 'all'] as const).map(k => (
                    <button key={k} onClick={() => setTab(k)}
                        style={{ 
                            flex: 1, padding: '12px 20px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '13px',
                            background: tab === k ? 'var(--primary-color)' : 'transparent',
                            color: tab === k ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s', whiteSpace: 'nowrap'
                        }}
                    >
                        {k === 'booked' && (language === 'tr' ? 'Yaklaşan' : 'Upcoming')}
                        {k === 'completed' && (language === 'tr' ? 'Geçmiş' : 'Past')}
                        {k === 'cancelled' && (language === 'tr' ? 'İptaller' : 'Cancelled')}
                        {k === 'all' && (language === 'tr' ? 'Tümü' : 'All')} ({counts[k]})
                    </button>
                ))}
            </div>

            {loading ? <p>...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filtered.map(app => (
                        <div key={app.id} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-soft)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Stethoscope size={28}/>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{app.doctor_name || 'Doktor'}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> {app.appointment_date}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {app.appointment_time}</span>
                                    </div>
                                </div>
                            </div>
                            <div>{statusBadge(app.status)}</div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                            <Calendar size={48} style={{ margin: '0 auto 1rem' }} />
                            <p>{language === 'tr' ? 'Randevu bulunamadı.' : 'No appointments found.'}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppointmentsPage;
