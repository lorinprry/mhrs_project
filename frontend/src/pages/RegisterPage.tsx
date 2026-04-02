import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, ShieldCheck, CreditCard, Mail, User, Phone, Lock, HeartPulse } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import client from '../api/client';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .reg-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 2rem 1rem;
    color: var(--text-main);
  }

  .reg-container {
    width: 100%;
    max-width: 600px;
    z-index: 10;
    position: relative;
  }

  .reg-card {
    background: var(--bg-card);
    border-radius: 28px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    padding: 3rem 2.5rem;
  }

  .field-input {
    width: 100%; padding: 0.95rem 1rem 0.95rem 2.8rem; border: 1.5px solid var(--border-color);
    border-radius: 12px; font-size: 0.92rem; font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--text-main); background: var(--bg-soft); outline: none; transition: all 0.2s; box-sizing: border-box;
  }
  
  .btn-submit {
    width: 100%; padding: 1rem 1.5rem; background: var(--primary-color);
    color: white; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; 
    justify-content: center; gap: 8px; transition: all 0.25s ease; box-shadow: 0 4px 16px rgba(20,184,166,0.2);
    margin-top: 1rem;
  }
`;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useSettings();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [registerForm, setRegisterForm] = useState({
        tc_no: '', first_name: '', last_name: '', password: '', email: '', phone: '',
    });

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await client.post('/users/register/patient/', { ...registerForm, username: registerForm.tc_no });
            navigate('/login?registered=true');
        } catch (err: any) {
            setError(language === 'tr' ? 'Kayıt başarısız.' : 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="reg-root">
                <div className="reg-container">
                    <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', marginBottom: '1.5rem', width: 'fit-content', margin: '0 auto 1.5rem' }}>
                        <ArrowLeft size={16} /> {language === 'tr' ? 'Giriş Ekranına Dön' : 'Back to Login'}
                    </Link>

                    <div className="reg-card">
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: 44, height: 44, background: 'var(--primary-color)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><HeartPulse color="white" size={24} /></div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{language === 'tr' ? 'Kayıt Ol' : 'Register'}</h2>
                        </div>

                        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="field-group">
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>T.C. No</label>
                                    <div className="field-wrap">
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><CreditCard size={18} /></div>
                                        <input className="field-input" placeholder="11 haneli T.C. No" value={registerForm.tc_no} onChange={e => setRegisterForm({...registerForm, tc_no: e.target.value})} maxLength={11} required />
                                    </div>
                                </div>
                                <div className="field-group">
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>Password</label>
                                    <div className="field-wrap">
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18} /></div>
                                        <input className="field-input" type="password" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} required />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="field-group">
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>Name</label>
                                    <div className="field-wrap">
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={18} /></div>
                                        <input className="field-input" value={registerForm.first_name} onChange={e => setRegisterForm({...registerForm, first_name: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="field-group">
                                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>Surname</label>
                                    <div className="field-wrap">
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><User size={18} /></div>
                                        <input className="field-input" value={registerForm.last_name} onChange={e => setRegisterForm({...registerForm, last_name: e.target.value})} required />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-submit" disabled={loading}>
                                <UserPlus size={18} /> {loading ? '...' : (language === 'tr' ? 'Hesabımı Oluştur' : 'Create My Account')}
                            </button>
                        </form>

                        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {language === 'tr' ? 'Zaten hesabınız var mı?' : "Already have an account?"} <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 800 }}>{language === 'tr' ? 'Giriş Yap' : 'Login'}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
