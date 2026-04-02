import React, { useState } from 'react';
import { 
  Activity, Heart, Weight, Calendar, CheckCircle2, ChevronRight, ArrowLeft,
  Zap, ShieldCheck, Stethoscope, Plus, X, AlignLeft, TrendingUp, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_HEALTH_VITALS, MOCK_VACCINES } from '../utils/mockData';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';

const HealthTrackingPage: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useSettings();
    const t = translations[language];
    
    const [selectedCategory, setSelectedCategory] = useState<'vitals' | 'vaccines' | 'history'>('vitals');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    // Modal Components
    const AddDataModal = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.add_data}</h2>
                    <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>{t.metric_type}</label>
                        <select style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)', fontWeight: 600 }}>
                            <option>{t.blood_pressure}</option>
                            <option>{t.blood_sugar}</option>
                            <option>{t.weight}</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>{t.value} & {t.unit}</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="120/80" style={{ flex: 2, padding: '14px', borderRadius: '14px', border: '1.5px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)' }} />
                            <input type="text" placeholder="mmHg" style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)' }} />
                        </div>
                    </div>
                    <button onClick={() => setShowAddModal(false)} style={{ width: '100%', padding: '16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', marginTop: '1rem', boxShadow: '0 10px 20px rgba(99,102,241,0.2)' }}>
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );

    const ReportModal = () => (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: '3rem', width: '100%', maxWidth: '850px', height: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{t.detailed_report}</h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>AI-Powered Health Insights & Historical Trends</p>
                    </div>
                    <button onClick={() => setShowReportModal(false)} style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--bg-soft)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X/></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'var(--primary-soft)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}><Zap size={16}/> AI Summary</div>
                        <p style={{ color: 'var(--text-main)', lineHeight: 1.7, fontWeight: 600 }}>Tansiyon değerleriniz son 2 haftadır oldukça stabil. Ancak akşam saatlerinde hafif yükselme gözlemleniyor. Tuz tüketimine dikkat etmeniz önerilir.</p>
                    </div>
                    <div style={{ background: 'var(--bg-soft)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}><TrendingUp size={16}/> Trend Analysis</div>
                        <p style={{ color: 'var(--text-main)', lineHeight: 1.7 }}>Vücut kitle indeksiniz (BMI) geçen aya göre %2 azalmış. Bu gelişim kalp sağlığınız için mükemmel bir sinyal.</p>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Grafiksel Gelişim (30 Gün)</h3>
                <div style={{ height: '300px', width: '100%', background: 'var(--bg-soft)', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '15px' }}>
                    {[40, 55, 30, 80, 65, 45, 90, 70, 50, 85, 60, 40].map((h, i) => (
                        <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary-color)', borderRadius: '10px', opacity: 0.3 + (h/100) }} />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            {showAddModal && <AddDataModal />}
            {showReportModal && <ReportModal />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                   <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-color)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginBottom: '8px' }}>
                       <ArrowLeft size={16}/> {t.back}
                   </button>
                   <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{t.health_tracking}</h1>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  style={{ padding: '14px 28px', background: 'var(--primary-color)', color: 'white', borderRadius: '18px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(99,102,241,0.2)' }}
                >
                    <Plus size={20}/> {t.add_data}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '2.5rem', background: 'var(--bg-soft)', padding: '6px', borderRadius: '18px', width: 'fit-content' }}>
                {(['vitals', 'vaccines', 'history'] as const).map(cat => (
                   <button 
                     key={cat} onClick={() => setSelectedCategory(cat)}
                     style={{ 
                        padding: '12px 28px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontWeight: 800,
                        background: selectedCategory === cat ? 'var(--bg-card)' : 'transparent',
                        color: selectedCategory === cat ? 'var(--primary-color)' : 'var(--text-muted)',
                        boxShadow: selectedCategory === cat ? 'var(--shadow-sm)' : 'none',
                        transition: 'all 0.2s'
                     }}
                   >
                       {t[cat === 'vitals' ? 'vitals' : (cat === 'vaccines' ? 'vaccines' : 'medical_history') as keyof typeof t]}
                   </button>
                ))}
            </div>

            {selectedCategory === 'vitals' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {MOCK_HEALTH_VITALS.map(v => (
                            <div key={v.id} style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: v.type === 'Tansiyon' ? 'var(--primary-soft)' : '#fef2f2', color: v.type === 'Tansiyon' ? 'var(--primary-color)' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {v.type === 'Tansiyon' ? <Heart size={24}/> : <Activity size={24}/>}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>{v.date}</div>
                                </div>
                                <div style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                                    {v.value} <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>{v.unit}</span>
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{v.type}</div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1.25rem', lineHeight: 1.6 }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: '32px', padding: '3.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#818cf8', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1.25rem' }}><Zap size={18}/> AI Health Insight</div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1.5rem', maxWidth: '600px' }}>Yaşam tarzınızdaki değişiklikler sağlığınızı iyileştirebilir.</h2>
                            <button 
                              onClick={() => setShowReportModal(true)}
                              style={{ padding: '16px 32px', background: 'white', color: '#1e1b4b', border: 'none', borderRadius: '18px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                            >
                                {t.detailed_report}
                            </button>
                        </div>
                        <div style={{ position: 'absolute', right: '-50px', bottom: '-50px', opacity: 0.1 }}><Heart size={350}/></div>
                    </div>
                </div>
            )}

            {selectedCategory === 'vaccines' && (
                <div style={{ background: 'var(--bg-card)', borderRadius: '28px', padding: '2.5rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t.vaccines}</h2>
                        <span style={{ padding: '8px 20px', background: '#ecfdf5', color: '#059669', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>{t.verified}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {MOCK_VACCINES.map(vac => (
                            <div key={vac.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.75rem', borderRadius: '20px', border: '1.5px solid var(--border-color)', background: 'var(--bg-soft)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}><ShieldCheck size={24}/></div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{vac.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{vac.date}</div>
                                    </div>
                                </div>
                                <CheckCircle2 size={24} color="#10b981"/>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthTrackingPage;
