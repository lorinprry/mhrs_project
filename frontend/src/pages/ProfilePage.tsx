import React, { useState } from 'react';
import { User, Bell, Shield, LogOut, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();
    const { language } = useSettings();
    const t = translations[language];
    const [activeTab, setActiveTab] = useState<'info' | 'notifications' | 'security'>('info');

    const menuItems = [
        { id: 'info', label: language === 'tr' ? 'Kişisel Bilgiler' : 'Personal Info', icon: User },
        { id: 'notifications', label: language === 'tr' ? 'Bildirimler' : 'Notifications', icon: Bell },
        { id: 'security', label: language === 'tr' ? 'Güvenlik' : 'Security', icon: Shield },
    ];

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || ''))}&background=e0e7ff&color=4f46e5&rounded=true&size=128`;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>{t.profile}</h1>
                <p style={{ color: 'var(--text-muted)' }}>{language === 'tr' ? 'Hesap bilgilerinizi ve tercihlerinizi yönetin.' : 'Manage your account info and preferences.'}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                
                {/* Sidebar Nav */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {menuItems.map(item => (
                        <button 
                            key={item.id} onClick={() => setActiveTab(item.id as any)}
                            style={{ 
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                background: activeTab === item.id ? 'var(--primary-color)' : 'var(--bg-card)',
                                color: activeTab === item.id ? 'white' : 'var(--text-main)',
                                fontWeight: 700, boxShadow: activeTab === item.id ? '0 10px 20px rgba(99,102,241,0.2)' : 'var(--shadow-sm)'
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><item.icon size={18}/> {item.label}</span>
                            <ChevronRight size={16} style={{ opacity: activeTab === item.id ? 1 : 0.3 }}/>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    
                    {activeTab === 'info' && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)' }}>
                                <img src={avatarUrl} alt="Avatar" style={{ width: 80, height: 80, borderRadius: '24px', border: '3px solid var(--primary-soft)' }} />
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{user?.first_name} {user?.last_name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)', textTransform: 'uppercase' }}>{user?.role}</span>
                                        <span style={{ padding: '4px 10px', background: '#ecfdf5', color: '#10b981', borderRadius: '8px', fontSize: '10px', fontWeight: 800 }}>ACTIVE</span>
                                    </div>
                                </div>
                            </div>

                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>{language === 'tr' ? 'Adınız' : 'First Name'}</label>
                                        <input value={user?.first_name} readOnly style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)', boxSizing: 'border-box' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>{language === 'tr' ? 'Soyadınız' : 'Last Name'}</label>
                                        <input value={user?.last_name} readOnly style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)', boxSizing: 'border-box' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>{language === 'tr' ? 'T.C. Kimlik No' : 'Identity ID'}</label>
                                    <input value={user?.username} readOnly style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)', boxSizing: 'border-box' }} />
                                </div>
                                <button type="button" style={{ width: '100%', padding: '16px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, cursor: 'pointer', marginTop: '1rem' }}>
                                    {language === 'tr' ? 'Bilgileri Güncelle' : 'Update Info'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>{language === 'tr' ? 'Son Bildirimler' : 'Recent Notifications'}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '16px', padding: '1.5rem', background: 'var(--bg-soft)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={20}/></div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{language === 'tr' ? 'Randevunuz Onaylandı' : 'Appointment Confirmed'}</div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Dr. Ahmet Yılmaz ile olan randevunuz başarıyla oluşturuldu.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', color: '#ef4444' }}>{language === 'tr' ? 'Güvenlik' : 'Security'}</h3>
                            <div style={{ padding: '1.5rem', borderRadius: '20px', border: '1.5px solid #fee2e2', background: '#fff1f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 800, color: '#f43f5e' }}>{t.logout}</div>
                                    <p style={{ fontSize: '0.75rem', color: '#f43f5e', opacity: 0.7 }}>{language === 'tr' ? 'Oturumu güvenli bir şekilde kapatın.' : 'Securely log out from this session.'}</p>
                                </div>
                                <button onClick={logout} style={{ padding: '10px 20px', background: '#f43f5e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>{t.logout}</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
