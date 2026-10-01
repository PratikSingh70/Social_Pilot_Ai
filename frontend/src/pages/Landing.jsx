import { useState } from 'react';
import { Link } from 'react-router-dom';
import SkipToContent from '../components/SkipToContent';
import ThemeToggle from '../components/ThemeToggle';
import '../landing.css';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-root">
      <SkipToContent targetId="main-content" />
      {/* ================= NAV ================= */}
      <header className="l-nav">
        <div className="l-nav-inner">
          <Link
            to="/"
            className="l-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="l-logo-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
              </svg>
            </div>
            SocialPilot AI
          </Link>
          <nav className="l-nav-menu">
            <a onClick={() => scrollTo('l-features')} role="button" tabIndex={0}>Features</a>
            <a onClick={() => scrollTo('l-app')} role="button" tabIndex={0}>App</a>
            <a onClick={() => scrollTo('l-reviews')} role="button" tabIndex={0}>Reviews</a>
            <Link to="/faq">FAQ</Link>
          </nav>
          <div className="l-nav-cta">
            <ThemeToggle className="mr-1" />
            <Link to="/login" className="l-btn l-btn-dark">Sign In</Link>
            <button
              className="l-mobile-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-bg/95 backdrop-blur-xl px-5 py-4 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-medium">
              <a
                onClick={() => scrollTo('l-features')}
                role="button"
                tabIndex={0}
                className="py-2 text-text-2 hover:text-white transition cursor-pointer"
              >
                Features
              </a>
              <a
                onClick={() => scrollTo('l-app')}
                role="button"
                tabIndex={0}
                className="py-2 text-text-2 hover:text-white transition cursor-pointer"
              >
                App Demo
              </a>
              <a
                onClick={() => scrollTo('l-reviews')}
                role="button"
                tabIndex={0}
                className="py-2 text-text-2 hover:text-white transition cursor-pointer"
              >
                Reviews
              </a>
              <Link
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-text-2 hover:text-white transition"
              >
                FAQ
              </Link>
              <div className="pt-2 border-t border-white/[0.06] flex items-center gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="l-btn l-btn-dark text-xs flex-1 text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="l-btn l-btn-grad text-xs flex-1 text-center"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="main-content" tabIndex={-1} className="focus:outline-none">

      {/* ================= HERO ================= */}
      <section className="l-hero">
        <div className="l-hero-bg" />
        <div className="l-wrap">
          <div className="l-hero-grid">
            <div>
              <div className="l-eyebrow">
                <span className="dot" /> AI-Powered Social Automation
              </div>
              <h1>
                Grow Your Social Presence <em>The Smart Way</em>
              </h1>
              <p className="lead">
                Create better content, automate your workflow, and grow your audience from one intelligent workspace. Powered by AI.
              </p>
              <div className="l-hero-buttons">
                <Link to="/signup" className="l-btn l-btn-grad l-btn-lg">
                  Start Free Trial →
                </Link>
                <button onClick={() => scrollTo('l-app')} className="l-btn l-btn-outline l-btn-lg">
                  Watch Demo
                </button>
              </div>
              <div className="l-hero-stats">
                <div className="l-hero-stat">
                  <div className="n">50K+</div>
                  <div className="l">Active creators</div>
                </div>
                <div className="l-hero-stat">
                  <div className="n">2M+</div>
                  <div className="l">Posts generated</div>
                </div>
                <div className="l-hero-stat">
                  <div className="n">4.9★</div>
                  <div className="l">Average rating</div>
                </div>
              </div>
            </div>

            <div className="l-hero-visual">
              <div className="l-hero-img">
                <img
                  src="https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=900&q=80"
                  alt="Content creator workspace"
                />
                <div className="l-hero-overlay">
                  <div className="title">Your AI Command Center</div>
                  <div className="sub">Create · Automate · Analyze</div>
                </div>
              </div>
              <div className="l-float fb-1">
                <div className="l-float-icon">✨</div>
                <div>AI writing a post…</div>
              </div>
              <div className="l-float fb-2">
                <div className="l-float-icon" style={{ background: '#22C55E' }}>↑</div>
                <div>Reach +24% this week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="l-trust">
        <div className="l-wrap">
          <div className="l-trust-inner">
            <p>Trusted by teams at</p>
            <div className="l-trust-logos">
              {['Instagram', 'LinkedIn', 'X', 'Facebook', 'TikTok', 'YouTube'].map((n) => (
                <span key={n} className="l-trust-logo">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="l-section" id="l-features">
        <div className="l-wrap">
          <div className="l-section-head">
            <div>
              <h2>Tools Built <em>For You</em></h2>
              <p>Everything you need to create, schedule, publish, and analyze social content — powered by AI.</p>
            </div>
            <Link to="/signup" className="l-btn l-btn-outline">
              View All Features
            </Link>
          </div>

          <div className="l-cards">
            {[
              {
                img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
                badge: 'AI',
                t: 'AI Content Studio',
                d: 'Generate posts, captions, and hashtags in seconds.',
                price: 'Included',
                rating: '4.9',
              },
              {
                img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
                badge: 'Popular',
                t: 'Smart Scheduling',
                d: "Auto-publish at your audience's peak activity times.",
                price: 'Included',
                rating: '4.9',
              },
              {
                img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
                badge: 'Real-time',
                t: 'Deep Analytics',
                d: 'Track reach, engagement, and growth across platforms.',
                price: 'Included',
                rating: '4.8',
              },
              {
                img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
                badge: 'New',
                t: 'AI Insights',
                d: 'Personal recommendations to grow faster, every week.',
                price: 'Pro',
                rating: '5.0',
              },
            ].map((f) => (
              <div key={f.t} className="l-card">
                <div className="l-card-img">
                  <img src={f.img} alt={f.t} />
                  <span className="l-card-badge">{f.badge}</span>
                </div>
                <div className="l-card-body">
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                  <div className="l-card-foot">
                    <span className="l-card-price">{f.price}</span>
                    <span className="l-card-rating">
                      <span className="star">★</span> {f.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APP SECTION (dark) ================= */}
      <section className="l-app-section" id="l-app">
        <div className="l-wrap">
          <div className="l-app-grid">
            <div className="l-app-content">
              <h2>
                Manage Everything <em>In Just A Few Clicks</em>
              </h2>
              <p>
                Your entire social-media workflow — from idea to analytics — in one beautiful, intelligent workspace.
              </p>

              <div className="l-app-features">
                <div className="l-app-feature">
                  <div className="l-app-feature-icon">✍️</div>
                  <div>
                    <h4>Generate content instantly</h4>
                    <p>AI writes posts, captions, and hashtags tuned to your voice.</p>
                  </div>
                </div>
                <div className="l-app-feature">
                  <div className="l-app-feature-icon">📅</div>
                  <div>
                    <h4>Schedule across every platform</h4>
                    <p>Instagram, LinkedIn, X, Facebook — publish everywhere at once.</p>
                  </div>
                </div>
                <div className="l-app-feature">
                  <div className="l-app-feature-icon">📈</div>
                  <div>
                    <h4>Track what actually works</h4>
                    <p>See which posts drive engagement and double down on them.</p>
                  </div>
                </div>
              </div>

              <div className="l-app-buttons">
                <Link to="/signup" className="l-btn l-btn-grad l-btn-lg">
                  Get Started Free →
                </Link>
                <a
                  href="https://cal.com/socialpilot-ai"
                  target="_blank"
                  rel="noreferrer"
                  className="l-btn l-btn-outline l-btn-lg inline-flex items-center justify-center"
                  style={{ borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}
                  title="Book a live walkthrough demo"
                >
                  Book a Demo
                </a>
              </div>
            </div>

            <div className="l-phone-wrap">
              <div className="l-phone-bg" />
              <div className="l-phone-float">
                <div className="ic">✨</div> Post generated
              </div>
              <div className="l-phone-float2">
                <div className="ic" style={{ background: '#22C55E' }}>↑</div> +182 followers
              </div>
              <div className="l-phone">
                <div className="l-phone-notch" />
                <div className="l-phone-screen">
                  <div className="l-phone-status">
                    <span>9:41</span>
                    <span>●●●</span>
                  </div>
                  <div className="l-phone-body">
                    <div className="l-phone-greeting">Hi, Alex 👋</div>
                    <div className="l-phone-sub">Here's your performance today</div>
                    <div className="l-phone-stat-grid">
                      <div className="l-phone-stat">
                        <div className="l">Reach</div>
                        <div className="v">24.5K</div>
                        <div className="t">↑ 18.2%</div>
                      </div>
                      <div className="l-phone-stat">
                        <div className="l">Engage</div>
                        <div className="v">8.4%</div>
                        <div className="t">↑ 4.7%</div>
                      </div>
                    </div>
                    <div className="l-phone-chart">
                      {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
                        <div key={i} className="bar" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="l-phone-ai-card">
                      <div className="lbl">✨ AI Recommends</div>
                      <div className="txt">Post between 6–9 PM for 22% more reach.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="l-section l-testimonials" id="l-reviews">
        <div className="l-wrap">
          <div className="l-section-head">
            <div>
              <h2>Loved by <em>Creators</em></h2>
              <p>Join 50,000+ people already growing with SocialPilot AI.</p>
            </div>
          </div>

          <div className="l-testimonial-grid">
            {[
              {
                q: 'SocialPilot AI cut my content creation time by 80%. I went from posting twice a week to every single day.',
                img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                n: 'Sarah Chen',
                r: 'Creator · 220K followers',
              },
              {
                q: 'The AI recommendations alone paid for the whole year. My LinkedIn engagement went up 3x in 6 weeks.',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                n: 'Marcus Rivera',
                r: 'Founder · B2B SaaS',
              },
              {
                q: 'As a freelancer, this is like having a whole marketing team in my pocket. Absolutely game-changing.',
                img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
                n: 'Priya Sharma',
                r: 'Freelance Designer',
              },
            ].map((t) => (
              <div key={t.n} className="l-testimonial">
                <div className="l-testimonial-stars">★★★★★</div>
                <div className="l-testimonial-quote">"{t.q}"</div>
                <div className="l-testimonial-author">
                  <img src={t.img} alt={t.n} />
                  <div>
                    <div className="n">{t.n}</div>
                    <div className="r">{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="l-cta-banner">
        <div className="l-wrap">
          <div className="l-cta-box">
            <h2>Ready to grow on autopilot?</h2>
            <p>Join 50,000+ creators already using SocialPilot AI.</p>
            <Link to="/signup" className="l-btn l-btn-yellow l-btn-lg">
              Start Your Free Trial →
            </Link>
          </div>
        </div>
      </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="l-footer">
        <div className="l-wrap">
          <div className="l-footer-grid">
            <div>
              <div className="l-footer-brand">
                <div className="l-logo-mark" style={{ width: 32, height: 32 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                  </svg>
                </div>
                SocialPilot AI
              </div>
              <p style={{ maxWidth: 320, lineHeight: 1.6 }}>
                The AI command center for your entire social-media presence.
              </p>
            </div>

            <div className="l-footer-col">
              <h5>Product</h5>
              <a onClick={() => scrollTo('l-features')} role="button" tabIndex={0}>Features</a>
              <Link to="/faq">FAQ</Link>
              <Link to="/app/ai-studio">AI Studio</Link>
            </div>

            <div className="l-footer-col">
              <h5>Company</h5>
              <a onClick={() => scrollTo('l-features')} role="button" tabIndex={0}>About</a>
              <a href="mailto:support@socialpilot.ai">Support</a>
              <Link to="/login">Sign In</Link>
            </div>

            <div className="l-footer-col">
              <h5>Legal</h5>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>

          <div className="l-footer-bottom">
            <span>© 2025 SocialPilot AI. All rights reserved.</span>
            <span>Made with ✨ in San Francisco</span>
          </div>
        </div>
      </footer>
    </div>
  );
}