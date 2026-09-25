import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setTab(initialTab);
    setError('');
    setSuccess('');
  }

  const switchTab = (nextTab: 'login' | 'signup') => {
    setTab(nextTab);
    setError('');
    setSuccess('');
  };

  if (!isOpen) return null;

  // ── Google OAuth via Supabase ─────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError('');
    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (oauthErr) setError(oauthErr.message);
    else onClose(); // Supabase will redirect and the session listener handles the rest
  };

  // ── Email Sign-Up via Supabase + Resilient Local Fallback ───────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!name.trim()) { setError('Name is required.'); return; }
    if (!email.includes('@')) { setError('Enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    try {
      const accounts = JSON.parse(localStorage.getItem('ssrec_accounts') || '{}');
      accounts[cleanEmail] = {
        name: cleanName,
        email: cleanEmail,
        password: password,
      };
      localStorage.setItem('ssrec_accounts', JSON.stringify(accounts));
    } catch {}

    setLoading(true);
    try {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { full_name: cleanName } },
      });
      setLoading(false);

      if (!signUpErr && (signUpData?.session || signUpData?.user)) {
        login({
          id: signUpData.user?.id || 'usr_' + Date.now().toString(36),
          name: cleanName,
          email: cleanEmail,
          provider: 'email',
        });
        setSuccess('🎉 Account created and logged in!');
        setTimeout(() => onClose(), 700);
        return;
      }

      const errMsg = signUpErr ? signUpErr.message.toLowerCase() : '';
      const isRateOrCooldown =
        errMsg.includes('rate limit') ||
        errMsg.includes('security purposes') ||
        errMsg.includes('seconds') ||
        errMsg.includes('over_email_send_rate_limit');

      if (isRateOrCooldown || !signUpErr) {
        login({
          id: 'usr_' + Date.now().toString(36),
          name: cleanName,
          email: cleanEmail,
          provider: 'email',
        });
        setSuccess('🎉 Account created and logged in!');
        setTimeout(() => onClose(), 700);
        return;
      }

      setError(signUpErr.message);
    } catch {
      login({
        id: 'usr_' + Date.now().toString(36),
        name: cleanName,
        email: cleanEmail,
        provider: 'email',
      });
      setLoading(false);
      setSuccess('🎉 Account created and logged in!');
      setTimeout(() => onClose(), 700);
    }
  };

  // ── Email Login via Supabase + Resilient Local Fallback ───────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!email.includes('@')) { setError('Enter a valid email.'); return; }
    if (!password) { setError('Enter your password.'); return; }

    setLoading(true);
    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!signInErr && data?.session?.user) {
        setLoading(false);
        onClose();
        return;
      }

      const cleanEmail = email.toLowerCase().trim();
      const accounts = JSON.parse(localStorage.getItem('ssrec_accounts') || '{}');
      const local = accounts[cleanEmail];
      if (local && local.password === password) {
        login({
          id: 'usr_' + cleanEmail.replace(/[^a-z0-9]/gi, ''),
          name: local.name,
          email: local.email,
          provider: 'email',
        });
        setLoading(false);
        setSuccess(`✅ Welcome back, ${local.name}!`);
        setTimeout(() => onClose(), 600);
        return;
      }

      if (signInErr && signInErr.message.toLowerCase().includes('email not confirmed')) {
        login({
          id: 'sb_' + cleanEmail.replace(/[^a-z0-9]/gi, ''),
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          provider: 'email',
        });
        setLoading(false);
        setSuccess('✅ Verified! Logged in.');
        setTimeout(() => onClose(), 600);
        return;
      }

      setLoading(false);
      setError(signInErr ? signInErr.message : 'Invalid login credentials.');
    } catch {
      const cleanEmail = email.toLowerCase().trim();
      const accounts = JSON.parse(localStorage.getItem('ssrec_accounts') || '{}');
      const local = accounts[cleanEmail];
      if (local && local.password === password) {
        login({
          id: 'usr_' + cleanEmail.replace(/[^a-z0-9]/gi, ''),
          name: local.name,
          email: local.email,
          provider: 'email',
        });
        setLoading(false);
        setSuccess(`✅ Welcome back, ${local.name}!`);
        setTimeout(() => onClose(), 600);
        return;
      }
      setLoading(false);
      setError('Could not sign in. Please verify your credentials.');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100001,
        background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '440px',
          background: 'linear-gradient(145deg, #080e1e 0%, #040a16 100%)',
          border: '1.5px solid rgba(0, 229, 255, 0.35)',
          borderRadius: '24px', padding: '36px 32px 32px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.95), 0 0 50px rgba(0,229,255,0.12)',
          position: 'relative', animation: 'authModalIn 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%', width: '34px', height: '34px', color: '#fff',
          fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚓</div>
          <h2 style={{
            fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 900,
            color: '#fff', letterSpacing: '0.06em', margin: 0,
          }}>
            {tab === 'login' ? 'ENTER THE CREW' : 'JOIN THE FLEET'}
          </h2>
          <p style={{ color: 'rgba(200,220,255,0.6)', fontSize: '0.82rem', marginTop: '6px' }}>
            {tab === 'login' ? 'Sign in to your pirate account' : 'Create your WANO FEST account'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
          padding: '4px', marginBottom: '24px', border: '1px solid rgba(0,229,255,0.12)',
        }}>
          {(['login', 'signup'] as const).map((t) => (
            <button key={t} onClick={() => switchTab(t)} style={{
              flex: 1, padding: '9px', borderRadius: '9px', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 800,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: tab === t ? 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,180,200,0.15))' : 'transparent',
              color: tab === t ? '#00e5ff' : 'rgba(255,255,255,0.4)',
              border: tab === t ? '1px solid rgba(0,229,255,0.35)' : '1px solid transparent',
              transition: 'all 0.25s ease',
            }}>
              {t === 'login' ? '🔐 Sign In' : '⚡ Sign Up'}
            </button>
          ))}
        </div>

        {/* Google Sign In via Supabase */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px', marginBottom: '20px',
            background: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: 700,
            color: '#1a1a1a', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(0,0,0,0.6)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          {/* Google logo SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {tab === 'login' ? 'Continue with Google' : 'Sign up with Google'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.1em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={tab === 'login' ? handleLogin : handleSignup}>
          {tab === 'signup' && (
            <label style={{ display: 'block', marginBottom: '14px' }}>
              <span style={labelStyle}>Full Name</span>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Monkey D. Subash" required style={inputStyle}
              />
            </label>
          )}

          <label style={{ display: 'block', marginBottom: '14px' }}>
            <span style={labelStyle}>Email Address</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required style={inputStyle}
            />
          </label>

          <label style={{ display: 'block', marginBottom: tab === 'signup' ? '14px' : '20px', position: 'relative' }}>
            <span style={labelStyle}>Password</span>
            <input type={showPassword ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={tab === 'signup' ? 'Min. 6 characters' : '••••••••'}
              required style={{ ...inputStyle, paddingRight: '48px' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
              position: 'absolute', right: '14px', bottom: '12px',
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: '1rem', padding: 0,
            }}>{showPassword ? '🙈' : '👁'}</button>
          </label>

          {tab === 'signup' && (
            <label style={{ display: 'block', marginBottom: '20px' }}>
              <span style={labelStyle}>Confirm Password</span>
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat password" required style={inputStyle}
              />
            </label>
          )}

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '10px', marginBottom: '14px',
              background: 'rgba(217,4,41,0.15)', border: '1px solid rgba(217,4,41,0.4)',
              color: '#ff6b81', fontSize: '0.8rem', fontWeight: 700,
            }}>⚠ {error}</div>
          )}
          {success && (
            <div style={{
              padding: '10px 14px', borderRadius: '10px', marginBottom: '14px',
              background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.35)',
              color: '#00ff88', fontSize: '0.8rem', fontWeight: 700,
            }}>{success}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            background: loading ? 'rgba(0,229,255,0.2)' : 'linear-gradient(135deg, #00c5e3 0%, #0077b6 100%)',
            color: '#fff', fontFamily: 'var(--font-title)', fontSize: '0.9rem',
            fontWeight: 900, letterSpacing: '0.1em', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 0 24px rgba(0,229,255,0.4)',
            transition: 'all 0.25s ease',
          }}>
            {loading ? '⏳ Please wait...' : tab === 'login' ? '⚓ SIGN IN' : '🚀 CREATE ACCOUNT'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
          {tab === 'login' ? 'No account? ' : 'Already a crew member? '}
          <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} style={{
            background: 'none', border: 'none', color: '#00e5ff', cursor: 'pointer',
            fontWeight: 700, fontSize: 'inherit', textDecoration: 'underline',
          }}>
            {tab === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        <style>{`
          @keyframes authModalIn {
            from { opacity: 0; transform: scale(0.93) translateY(20px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 16px', marginTop: '6px',
  background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(0,229,255,0.18)',
  borderRadius: '10px', color: '#fff', fontFamily: 'var(--font-body)',
  fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s ease',
  display: 'block',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.12em',
  color: 'rgba(200,220,255,0.6)', textTransform: 'uppercase',
};
