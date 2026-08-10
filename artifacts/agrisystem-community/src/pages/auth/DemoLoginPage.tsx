import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Sprout, ArrowRight, Eye, EyeOff, Users, BarChart3, Leaf, ShieldCheck, Check, Loader2 } from 'lucide-react';
import { useAuth, type UserProfile } from '@/auth/AuthContext';

/* ── Demo accounts ────────────────────────────────────────── */
const DEMO_ACCOUNTS: { role: UserProfile['role']; label: string; name: string; email: string; password: string; color: string; icon: React.ElementType; desc: string }[] = [
  {
    role: 'household',
    label: 'Household Member',
    name: 'Amina Okoro',
    email: 'household@agrosystems.ng',
    password: 'demo1234',
    color: '#4c934e',
    icon: Users,
    desc: 'Browse offers, join groups, track contributions and savings.',
  },
  {
    role: 'leader',
    label: 'Group Leader',
    name: 'Tunde Adeyemi',
    email: 'leader@agrosystems.ng',
    password: 'demo1234',
    color: '#e0a140',
    icon: BarChart3,
    desc: 'Create groups, manage funding progress, authorize payments.',
  },
  {
    role: 'farmer',
    label: 'Farmer / Supplier',
    name: 'Bisi Adewale',
    email: 'farmer@agrosystems.ng',
    password: 'demo1234',
    color: '#3b7ec8',
    icon: Leaf,
    desc: 'List produce, manage offers, view orders and earnings.',
  },
  {
    role: 'admin',
    label: 'Admin / Support',
    name: 'Ngozi Eze',
    email: 'admin@agrosystems.ng',
    password: 'demo1234',
    color: '#c05a3a',
    icon: ShieldCheck,
    desc: 'Full platform access, user management, dispute resolution.',
  },
];

/* ── Role destination map ─────────────────────────────────── */
const ROLE_DESTINATION: Record<string, string> = {
  household: '/groups',
  leader: '/leader',
  farmer: '/browse',
  admin: '/browse',
};

export default function DemoLoginPage() {
  const [, navigate] = useLocation();
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState<'demo' | 'login'>('demo');
  const [selectedRole, setSelectedRole] = useState<string>('household');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [entering, setEntering] = useState(false);

  // Check if ?demo=true in URL and auto-select demo tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') setTab('demo');
  }, []);

  // If already logged in, redirect
  useEffect(() => {
    if (user && !entering) {
      const dest = ROLE_DESTINATION[user.role] ?? '/';
      navigate(dest);
    }
  }, [user, entering, navigate]);

  const selectedAccount = DEMO_ACCOUNTS.find(a => a.role === selectedRole)!;

  const handleDemoEnter = () => {
    setEntering(true);
    setLoading(true);
    setTimeout(() => {
      setUser({
        id: `demo-${selectedRole}-001`,
        email: selectedAccount.email,
        fullName: selectedAccount.name,
        role: selectedAccount.role,
        phone: '+234 802 345 6789',
        location: 'Lagos, Nigeria',
        trustScore: 95,
      });
      setLoading(false);
      navigate(ROLE_DESTINATION[selectedRole] ?? '/');
    }, 900);
  };

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      // Try real login — if API is offline, fall back gracefully
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Login failed');
      const data = await res.json();
      localStorage.setItem('agrosystem_token', data.token);
      setUser(data.user);
      navigate(ROLE_DESTINATION[data.user.role] ?? '/');
    } catch (err) {
      setLoginError((err as Error).message || 'Login failed. Check your credentials or use a demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">

      {/* ── LEFT PANEL ──────────────────────────────────────── */}
      <div className="login-left">
        <div className="login-left-bg" style={{ backgroundImage: 'url(/hero-farm.png)' }} />
        <div className="login-left-overlay" />
        <div className="login-left-content">
          <Link href="/" className="login-brand">
            <div className="login-logo-mark"><Sprout size={18} /></div>
            <div>
              <div className="login-logo-name">AGRISYSTEMS</div>
              <div className="login-logo-sub">Community Food Access</div>
            </div>
          </Link>

          <div className="login-left-body">
            <h2 className="login-left-h2">Better food.<br /><span className="login-accent">Together.</span></h2>
            <p className="login-left-p">Join thousands of Nigerian households pooling together to buy farm-fresh produce at direct prices.</p>

            <div className="login-trust-cards">
              {[
                { icon: '₦', value: '2.4M+', label: 'Saved by communities' },
                { icon: '🌾', value: '18+',   label: 'Verified farm partners' },
                { icon: '👨‍👩‍👧', value: '1,284', label: 'Households reached' },
              ].map(({ icon, value, label }) => (
                <div key={label} className="login-trust-card">
                  <div className="login-trust-icon">{icon}</div>
                  <div className="login-trust-value">{value}</div>
                  <div className="login-trust-label">{label}</div>
                </div>
              ))}
            </div>

            <div className="login-left-quote">
              <p>"I saved ₦4,200 on my last rice order. This is what community looks like."</p>
              <div className="login-quote-author">
                <div className="login-quote-avatar">CE</div>
                Chioma Eze · Household member, Enugu
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <div className="login-right">
        <Link href="/" className="login-back-link">← Back to homepage</Link>

        <div className="login-form-wrap">
          <div className="login-form-header">
            <h1 className="login-form-title">
              {tab === 'demo' ? 'Choose a demo account' : 'Sign in to Agrisystems'}
            </h1>
            <p className="login-form-subtitle">
              {tab === 'demo'
                ? 'Explore the platform from any role — no setup required.'
                : 'Enter your credentials to access your account.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="login-tabs">
            <button
              className={`login-tab ${tab === 'demo' ? 'active' : ''}`}
              onClick={() => setTab('demo')}
            >
              🎭 Demo mode
            </button>
            <button
              className={`login-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => setTab('login')}
            >
              🔐 Real login
            </button>
          </div>

          {/* ── DEMO TAB ────────────────────────────────────── */}
          {tab === 'demo' && (
            <div className="login-demo-panel">
              <div className="login-demo-roles">
                {DEMO_ACCOUNTS.map(({ role, label, desc, color, icon: Icon }) => (
                  <button
                    key={role}
                    className={`login-role-card ${selectedRole === role ? 'selected' : ''}`}
                    style={{ '--role-color': color } as React.CSSProperties}
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="login-role-icon" style={{ background: `${color}18`, color }}>
                      <Icon size={18} />
                    </div>
                    <div className="login-role-info">
                      <div className="login-role-label">{label}</div>
                      <div className="login-role-desc">{desc}</div>
                    </div>
                    {selectedRole === role && (
                      <div className="login-role-check" style={{ background: color }}>
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="login-demo-selected-info">
                <div className="login-demo-selected-avatar" style={{ background: `${selectedAccount.color}22`, color: selectedAccount.color }}>
                  {selectedAccount.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div className="login-demo-selected-name">{selectedAccount.name}</div>
                  <div className="login-demo-selected-email">{selectedAccount.email}</div>
                </div>
              </div>

              <button
                className="login-enter-btn"
                style={{ '--btn-color': selectedAccount.color } as React.CSSProperties}
                onClick={handleDemoEnter}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 size={17} className="login-spinner" /> Entering platform…</>
                  : <>Enter as {selectedAccount.label} <ArrowRight size={17} /></>
                }
              </button>

              <p className="login-demo-disclaimer">
                Demo accounts use local data only. No real payments are processed.
              </p>
            </div>
          )}

          {/* ── REAL LOGIN TAB ──────────────────────────────── */}
          {tab === 'login' && (
            <form className="login-real-form" onSubmit={handleRealLogin} noValidate>
              <div className="login-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="login-password">
                  Password
                  <a href="#" className="login-forgot">Forgot password?</a>
                </label>
                <div className="login-pw-wrap">
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="login-pw-toggle" onClick={() => setShowPw(v => !v)}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="login-error-msg">{loginError}</div>
              )}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading
                  ? <><Loader2 size={17} className="login-spinner" /> Signing in…</>
                  : <>Sign in <ArrowRight size={17} /></>
                }
              </button>

              <p className="login-register-link">
                Don't have an account?{' '}
                <Link href="/register" className="login-link-accent">Create one free</Link>
              </p>

              <div className="login-real-hint">
                <div className="login-hint-divider"><span>or use a demo</span></div>
                <button type="button" className="login-use-demo" onClick={() => setTab('demo')}>
                  🎭 Switch to demo mode
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="login-right-footer">
          <span>© 2025 Agrisystems Development</span>
          <span>·</span>
          <a href="#">Privacy</a>
          <span>·</span>
          <a href="#">Terms</a>
        </div>
      </div>
    </div>
  );
}
