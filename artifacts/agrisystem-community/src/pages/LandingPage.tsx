/* eslint-disable i18next/no-literal-string */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowRight, Leaf, Users, ShieldCheck, Sprout, MapPin,
  Star, ChevronDown, Play, Check, TrendingDown, Package,
  Truck, BarChart3, PhoneCall, Globe
} from 'lucide-react';

/* ── tiny intersection-observer hook ──────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── animated counter ─────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(t); }
      else setCount(start);
    }, 16);
    return () => clearInterval(t);
  }, [visible, to]);
  return <span ref={ref}>{count.toLocaleString('en-NG')}{suffix}</span>;
}

/* ── stat card ────────────────────────────────────────────── */
function StatCard({ value, suffix, label, color }: { value: number; suffix?: string; label: string; color: string }) {
  return (
    <div className="landing-stat-card" style={{ '--accent-col': color } as React.CSSProperties}>
      <div className="landing-stat-value">
        <Counter to={value} suffix={suffix} />
      </div>
      <p className="landing-stat-label">{label}</p>
    </div>
  );
}

/* ── testimonial ──────────────────────────────────────────── */
const testimonials = [
  { name: 'Chioma Eze', role: 'Household member · Enugu', text: 'I saved ₦4,200 on my last rice order. The pickup was smooth and everything was exactly as described. This is what community looks like.', stars: 5, initials: 'CE' },
  { name: 'Musa Abdullahi', role: 'Group leader · Kano', text: 'Running a group for 34 households was chaotic before Agrisystems. Now I just share a link, watch the progress bar fill, and coordinate one pickup.', stars: 5, initials: 'MA' },
  { name: 'Bisi Adewale', role: 'Farmer · Oyo', text: 'Direct orders, zero middlemen. My Ofada Rice sells out every cycle. The verification badge means customers trust me from day one.', stars: 5, initials: 'BA' },
];

/* ── feature item ─────────────────────────────────────────── */
function Feature({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`landing-feature ${visible ? 'in-view' : ''}`}>
      <div className="landing-feature-icon"><Icon size={22} /></div>
      <h3 className="landing-feature-title">{title}</h3>
      <p className="landing-feature-desc">{desc}</p>
    </div>
  );
}

/* ─────────────────────────────── MAIN ─────────────────────── */
export default function LandingPage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // parallax scroll
  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.setProperty('--scroll-y', `${window.scrollY * 0.4}px`);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing-root">

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <a href="#" className="landing-nav-logo">
            <div className="landing-logo-mark"><Sprout size={18} /></div>
            <div>
              <div className="landing-logo-name">AGRISYSTEMS</div>
              <div className="landing-logo-sub">Community Food Access</div>
            </div>
          </a>
          <div className="landing-nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#testimonials">Stories</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="landing-nav-actions">
            <Link href="/login" className="landing-btn-ghost">Sign in</Link>
            <Link href="/login?demo=true" className="landing-btn-primary">
              Try the demo <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="landing-hero" ref={heroRef}>
        <div className="landing-hero-bg" style={{ backgroundImage: 'url(/hero-farm.png)' }} />
        <div className="landing-hero-overlay" />
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <span className="landing-badge-dot" />
            Community buying, made transparent
          </div>
          <h1 className="landing-hero-h1">
            Better food.<br />
            <span className="landing-hero-h1-accent">Together.</span>
          </h1>
          <p className="landing-hero-sub">
            Agrisystems connects Nigerian households into buying groups that unlock farm-direct prices. 
            See exactly what you pay, watch the group fill in real time, and collect your order nearby.
          </p>
          <div className="landing-hero-cta">
            <Link href="/login?demo=true" className="landing-cta-primary">
              Start the demo <ArrowRight size={17} />
            </Link>
            <button className="landing-cta-video" onClick={() => setVideoOpen(true)}>
              <div className="landing-play-btn"><Play size={14} fill="currentColor" /></div>
              See how it works
            </button>
          </div>
          <div className="landing-hero-proof">
            {['No credit card needed', 'All demo data', 'All roles available'].map(t => (
              <span key={t} className="landing-proof-item"><Check size={13} />{t}</span>
            ))}
          </div>
        </div>
        <a href="#stats" className="landing-hero-scroll">
          <ChevronDown size={20} />
        </a>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section id="stats" className="landing-stats-section">
        <div className="landing-stats-grid">
          <StatCard value={2400000} suffix="+" label="Naira saved by communities" color="#4c934e" />
          <StatCard value={31}      suffix="+"  label="Active group buys"          color="#e0a140" />
          <StatCard value={1284}    suffix=""   label="Households reached"         color="#3b7ec8" />
          <StatCard value={18}      suffix="+"  label="Verified farm partners"     color="#c05a3a" />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-tag">Simple by design</div>
          <h2 className="landing-section-h2">A little coordination<br />goes a long way.</h2>
          <p className="landing-section-sub">
            We make the invisible work of community buying visible — so every household knows exactly what happens next.
          </p>

          <div className="landing-steps">
            {[
              { n: '01', icon: Package,    title: 'Choose a group',     desc: 'Browse farm offers with live funding progress. Pick what your household needs and see the exact farm-direct price before you commit.', color: '#e8d7ae' },
              { n: '02', icon: Users,      title: 'Build it together',  desc: 'Your contribution adds to a shared group pot. Watch real-time as neighbours join and the group progresses toward its funding target.', color: '#cbd3ad' },
              { n: '03', icon: Truck,      title: 'Collect nearby',     desc: 'When the group funds, we coordinate delivery to a single community pickup point. Collect fresh produce on a Saturday morning.', color: '#d7c0a4' },
            ].map(({ n, icon: Icon, title, desc, color }) => {
              const { ref, visible } = useInView();
              return (
                <div key={n} ref={ref} className={`landing-step ${visible ? 'in-view' : ''}`} style={{ '--step-color': color } as React.CSSProperties}>
                  <div className="landing-step-icon"><Icon size={24} /></div>
                  <div className="landing-step-num">{n}</div>
                  <h3 className="landing-step-title">{title}</h3>
                  <p className="landing-step-desc">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY PHOTO ───────────────────────────────────── */}
      <section className="landing-photo-section">
        <div className="landing-photo-left">
          <img src="/community-market.png" alt="Nigerian community market" className="landing-photo-img" />
        </div>
        <div className="landing-photo-right">
          <div className="landing-section-tag">Real impact</div>
          <h2 className="landing-photo-h2">Food is stronger<br />when we grow it<br /><span className="landing-accent-green">together.</span></h2>
          <p className="landing-photo-sub">Every successful group buy means direct income for farmers, fresh produce for families, and stronger community bonds. No middlemen. No hidden markup.</p>
          <div className="landing-photo-points">
            {[
              'Farm-verified prices published upfront',
              'Escrow-style group wallet — refunded if target fails',
              'Pickup schedules confirmed by SMS and email',
              'Farmer trust scores from real buyer reviews',
            ].map(p => (
              <div key={p} className="landing-photo-point">
                <ShieldCheck size={16} className="landing-check-icon" />
                {p}
              </div>
            ))}
          </div>
          <Link href="/login?demo=true" className="landing-btn-primary landing-photo-cta">
            Explore the platform <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-section-tag">Everything you need</div>
          <h2 className="landing-section-h2">Built for every role<br />in the food chain.</h2>
          <p className="landing-section-sub">From household members to group leaders, farmers to admins — every user gets tools designed for their specific role.</p>
          <div className="landing-features-grid">
            <Feature icon={Users}      title="Role-based accounts"     desc="Household member, group leader, farmer, or admin — each role unlocks a tailored dashboard and permissions." />
            <Feature icon={BarChart3}  title="Live funding dashboard"  desc="Watch group progress update in real time. Know exactly how many households have joined and how close you are to the target." />
            <Feature icon={TrendingDown} title="Farm-direct savings"   desc="Skip wholesalers and supermarket markup. Every group buy delivers measurable savings per household, shown upfront." />
            <Feature icon={ShieldCheck} title="Verified farmers"       desc="Every supplier is reviewed, verified, and rated by community members. Trust scores are publicly visible and earned over time." />
            <Feature icon={MapPin}     title="Community pickup"        desc="One delivery point per group, scheduled in advance. No individual deliveries, no confusion, no missed orders." />
            <Feature icon={Globe}      title="Payment-ready"           desc="Architecture built for Paystack and Flutterwave integration. Group wallets, automatic refunds, and digital receipts." />
            <Feature icon={PhoneCall}  title="SMS notifications"       desc="Get alerts for group status, funding milestones, and pickup schedules — even without a smartphone." />
            <Feature icon={Leaf}       title="Dispute resolution"      desc="Built-in system for handling quality disputes. Farmers and households can raise issues that admins resolve fairly." />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section id="testimonials" className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-tag">Community voices</div>
          <h2 className="landing-section-h2">Real people.<br />Real savings.</h2>
          <div className="landing-testimonials-grid">
            {testimonials.map(({ name, role, text, stars, initials }) => (
              <div key={name} className="landing-testimonial">
                <div className="landing-testimonial-stars">
                  {Array.from({ length: stars }).map((_, i) => <Star key={i} size={14} fill="#e0a140" color="#e0a140" />)}
                </div>
                <p className="landing-testimonial-text">"{text}"</p>
                <div className="landing-testimonial-author">
                  <div className="landing-testimonial-avatar">{initials}</div>
                  <div>
                    <div className="landing-testimonial-name">{name}</div>
                    <div className="landing-testimonial-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-section-tag">Clear and fair</div>
          <h2 className="landing-section-h2">No hidden fees.<br />Ever.</h2>
          <p className="landing-section-sub">Agrisystems charges a small platform fee only when a group successfully funds. If your group doesn't reach target, everyone gets a full refund.</p>
          <div className="landing-pricing-grid">
            {[
              { title: 'Household', price: 'Free', note: 'Always free', features: ['Browse all offers', 'Join unlimited groups', 'Track contributions', 'Pickup notifications', 'Contribution history'] },
              { title: 'Group Leader', price: '3%', note: 'of group value when funded', features: ['Everything in Household', 'Create and manage groups', 'Payment authorization', 'Member management', 'Leader analytics'], highlight: true },
              { title: 'Farmer / Supplier', price: '5%', note: 'of order value on success', features: ['Verified farm profile', 'List unlimited offers', 'Receive group orders', 'Trust & reputation system', 'Direct dashboard support'] },
            ].map(({ title, price, note, features, highlight }) => (
              <div key={title} className={`landing-price-card ${highlight ? 'landing-price-highlight' : ''}`}>
                {highlight && <div className="landing-price-badge">Most popular</div>}
                <div className="landing-price-title">{title}</div>
                <div className="landing-price-amount">{price}</div>
                <div className="landing-price-note">{note}</div>
                <div className="landing-price-divider" />
                <ul className="landing-price-features">
                  {features.map(f => (
                    <li key={f}><Check size={14} className="landing-check-icon" />{f}</li>
                  ))}
                </ul>
                <Link href="/login?demo=true" className={`landing-price-cta ${highlight ? 'landing-price-cta-highlight' : ''}`}>
                  Try {title} demo
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="landing-final-cta">
        <div className="landing-final-inner">
          <div className="landing-final-badge"><Leaf size={14} /> Launching across Nigeria</div>
          <h2 className="landing-final-h2">Your next pantry run<br />starts here.</h2>
          <p className="landing-final-sub">Join thousands of households already buying smarter, together.</p>
          <div className="landing-final-actions">
            <Link href="/login?demo=true" className="landing-cta-primary landing-cta-large">
              Enter the demo <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="landing-cta-outline">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <div className="landing-logo-mark small"><Sprout size={15} /></div>
            <div>
              <div className="landing-logo-name small">AGRISYSTEMS</div>
              <p className="landing-footer-tagline">Food is stronger when we grow it together.</p>
            </div>
          </div>
          <div className="landing-footer-links">
            <div className="landing-footer-col">
              <div className="landing-footer-col-title">Platform</div>
              <a href="#how-it-works">How it works</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <Link href="/login?demo=true">Live demo</Link>
            </div>
            <div className="landing-footer-col">
              <div className="landing-footer-col-title">Roles</div>
              <a href="#">Households</a>
              <a href="#">Group leaders</a>
              <a href="#">Farmers</a>
              <a href="#">Admins</a>
            </div>
            <div className="landing-footer-col">
              <div className="landing-footer-col-title">Company</div>
              <a href="#">About us</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span>© 2025 Agrisystems Development. All rights reserved.</span>
          <span className="landing-footer-demo-note">Demo environment · No real payments</span>
        </div>
      </footer>

      {/* ── VIDEO MODAL ───────────────────────────────────────── */}
      {videoOpen && (
        <div className="landing-modal-overlay" onClick={() => setVideoOpen(false)}>
          <div className="landing-modal-box" onClick={e => e.stopPropagation()}>
            <button className="landing-modal-close" onClick={() => setVideoOpen(false)}>✕</button>
            <div className="landing-modal-placeholder">
              <Sprout size={48} className="landing-modal-icon" />
              <p>Product walkthrough video coming soon.</p>
              <Link href="/login?demo=true" className="landing-btn-primary" onClick={() => setVideoOpen(false)}>
                Try the live demo instead <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
