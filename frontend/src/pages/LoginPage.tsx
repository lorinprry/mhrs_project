import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck, Stethoscope, User, Lock, HeartPulse, CheckCircle2, ArrowRight,
  Building2, Users, Calendar, Star, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .login-root {
    min-height: 100vh;
    display: flex;
    background: var(--bg-primary);
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow: hidden;
    color: var(--text-main);
  }

  .login-blob-1 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
    top: -200px; left: -150px; pointer-events: none;
  }
  .login-blob-2 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
    bottom: -180px; right: -100px; pointer-events: none;
  }

  .login-grid {
    position: relative; z-index: 10; width: 100%; max-width: 1280px;
    margin: 0 auto; padding: 0 2rem; display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; gap: 4rem; min-height: 100vh;
  }

  .login-left {
    display: flex; flex-direction: column; gap: 2.5rem;
  }

  .login-headline {
    font-family: 'Outfit', sans-serif; font-size: 3.5rem; font-weight: 800; line-height: 1.15; letter-spacing: -2px;
  }
  .login-headline span {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .login-card {
    width: 100%; max-width: 520px; background: var(--bg-card); border-radius: 32px;
    border: 1px solid var(--border-color); box-shadow: var(--shadow-md); padding: 3rem;
  }

  .tab-switcher {
    display: grid; grid-template-columns: 1fr 1fr; background: var(--bg-soft); border-radius: 16px; padding: 6px; margin-bottom: 2rem;
  }
  .tab-btn {
    padding: 0.75rem; border: none; border-radius: 12px; background: transparent;
    font-weight: 700; color: var(--text-muted); cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .tab-btn.active {
    background: var(--bg-card); color: var(--primary-color); box-shadow: var(--shadow-sm);
  }

  .field-input {
    width: 100%; padding: 1rem 1rem 1rem 3rem; border: 1.5px solid var(--border-color);
    border-radius: 14px; font-size: 0.95rem; color: var(--text-main); background: var(--bg-soft);
    box-sizing: border-box; outline: none; transition: all 0.2s;
  }
  .field-input:focus { border-color: var(--primary-color); background: var(--bg-card); box-shadow: 0 0 0 4px var(--primary-soft); }

  .btn-submit {
    width: 100%; padding: 1.1rem; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
    color: white; border: none; border-radius: 16px; font-weight: 800; font-size: 1rem;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
    box-shadow: 0 10px 20px rgba(99,102,241,0.2); transition: all 0.2s;
  }
  .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(99,102,241,0.3); }

  @media (max-width: 1024px) {
    .login-grid { grid-template-columns: 1fr; padding: 2rem 1rem; }
    .login-left { display: none; }
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading } = useAuth();
  const { language, setLanguage } = useSettings();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    if (user) navigate(user.role === 'doctor' ? '/doctor' : '/patient', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
    } catch (err: any) {
      setError(language === 'tr' ? 'Hatalı bilgiler.' : 'Invalid credentials.');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-blob-1" />
        <div className="login-blob-2" />

        <div className="login-grid">
          <div className="login-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #6366f1, #7c3aed)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(99,102,241,0.3)' }}>
                <HeartPulse color="white" size={32} style={{ margin: 'auto' }} />
              </div>
              <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit' }}>MedPilot <span style={{ color: 'var(--primary-color)' }}>PRO</span></span>
            </div>

            <div>
              <h1 className="login-headline">
                {language === 'tr' ? 'Geleceğin' : 'Future of'}<br />
                <span>{language === 'tr' ? 'Dijital Sağlık' : 'Digital Health'}</span><br />
                {language === 'tr' ? 'Deneyimi.' : 'Experience.'}
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 480, marginTop: '1.5rem' }}>
                {language === 'tr' ? 'Türkiye\'nin en kapsamlı sağlık yönetim platformuna hoş geldiniz. Randevularınızı yönetin, sağlık verilerinizi takip edin.' : 'Welcome to Turkey\'s most comprehensive health management platform. Manage appointments, track your health data.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Users color="#6366f1" size={20}/>
                  <div><div style={{ fontWeight: 800 }}>81 {language === 'tr' ? 'İl' : 'Cities'}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{language === 'tr' ? 'Hizmet Noktası' : 'Service Points'}</div></div>
               </div>
               <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ShieldCheck color="#10b981" size={20}/>
                  <div><div style={{ fontWeight: 800 }}>SSL</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{language === 'tr' ? 'Güvenli Altyapı' : 'Secure Infrastructure'}</div></div>
               </div>
            </div>
          </div>

          <div className="login-right">
             <div className="login-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                   <div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{language === 'tr' ? 'Hoş Geldiniz' : 'Welcome'}</h2>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>{language === 'tr' ? 'Devam etmek için giriş yapın' : 'Login to continue'}</p>
                   </div>
                   <button onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')} style={{ padding: '8px 14px', borderRadius: 12, background: 'var(--bg-soft)', border: 'none', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Globe size={16}/> {language.toUpperCase()}
                   </button>
                </div>

                <div className="tab-switcher">
                   <button className={`tab-btn ${activeTab === 'patient' ? 'active' : ''}`} onClick={() => setActiveTab('patient')}><User size={16}/> {language === 'tr' ? 'Hasta' : 'Patient'}</button>
                   <button className={`tab-btn ${activeTab === 'doctor' ? 'active' : ''}`} onClick={() => setActiveTab('doctor')}><Stethoscope size={16}/> {language === 'tr' ? 'Hekim' : 'Doctor'}</button>
                </div>

                {error && <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: 12, fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 700 }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={18}/></div>
                      <input className="field-input" placeholder={activeTab === 'patient' ? "T.C. Kimlik No" : "Kullanıcı Adı / Sicil No"} value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                   </div>
                   <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18}/></div>
                      <input className="field-input" type="password" placeholder="********" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                   </div>
                   <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? '...' : (language === 'tr' ? 'Giriş Yap' : 'Sign In')} <ArrowRight size={20}/>
                   </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                   {language === 'tr' ? 'Hesabınız yok mu?' : "Don't have an account?"} <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 800, textDecoration: 'none' }}>{language === 'tr' ? 'Hemen Kayıt Ol' : 'Register Now'}</Link>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;