import React from 'react';
import { User, Bell, Shield, ChevronRight, LogOut, Globe, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme, language, setLanguage } = useSettings();
    const t = translations[language];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2rem' }}>{t.settings}</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Theme & Language */}
                <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Globe size={20} className="text-indigo-500"/> {t.language} & {t.dark_mode}
                    </h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-soft)', borderRadius: '16px' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.language}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{language === 'tr' ? 'Uygulama dilini seçin.' : 'Select application language.'}</div>
                            </div>
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value as 'tr' | 'en')}
                                style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 700 }}
                            >
                                <option value="tr">Türkçe (TR)</option>
                                <option value="en">English (EN)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-soft)', borderRadius: '16px' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.dark_mode}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{language === 'tr' ? 'Göz yorgunluğunu azaltmak için karanlık mod.' : 'Dark mode to reduce eye strain.'}</div>
                            </div>
                            <button 
                                onClick={toggleTheme}
                                style={{ 
                                    width: '48px', height: '24px', borderRadius: '12px', 
                                    background: theme === 'dark' ? '#6366f1' : '#cbd5e1',
                                    border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.3s'
                                }}
                            >
                                <div style={{ 
                                    width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                                    position: 'absolute', top: '3px', left: theme === 'dark' ? '26px' : '4px',
                                    transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {theme === 'dark' ? <Moon size={10} color="#6366f1"/> : <Sun size={10} color="#94a3b8"/>}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div style={{ background: 'var(--bg-card)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} className="text-indigo-500"/> {t.profile}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>{language === 'tr' ? 'Adınız' : 'First Name'}</label>
                            <input value={user?.first_name} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)', boxSizing: 'border-box' }} readOnly />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>{language === 'tr' ? 'Soyadınız' : 'Last Name'}</label>
                            <input value={user?.last_name} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-soft)', color: 'var(--text-main)', boxSizing: 'border-box' }} readOnly />
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button onClick={logout} style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid #fee2e2', background: '#fff1f2', color: '#f43f5e', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <LogOut size={20}/> {t.logout}
                </button>

            </div>
        </div>
    );
};

export default SettingsPage;
