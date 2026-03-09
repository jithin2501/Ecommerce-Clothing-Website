import { useState } from 'react';
import {
  User, ShoppingBag, Settings, CreditCard,
  Heart, Power, Headphones, ChevronRight,
  ChevronDown, Moon, Sun, Edit2, Check
} from 'lucide-react';
import '../../styles/personinformation/PersonInformation.css';

/* ── Sidebar nav config ── */
const NAV_SECTIONS = [
  { id: 'orders', icon: ShoppingBag, label: 'My Orders' },
  {
    id: 'account-settings', icon: Settings, label: 'Account Settings',
    sub: ['Profile Information', 'Manage Addresses', 'PAN Card Information'],
  },
  { id: 'payments', icon: CreditCard, label: 'Payments', sub: ['Saved Cards'] },
  {
    id: 'mystuff', icon: Heart, label: 'My Stuff',
    sub: ['My Reviews & Ratings', 'My Wishlist'],
  },
];

/* ── FAQ data ── */
const FAQS = [
  {
    q: 'What happens when I update my email address (or mobile number)?',
    a: "Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).",
  },
  {
    q: 'When will my account be updated with the new email address?',
    a: 'It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.',
  },
  {
    q: 'What happens to my existing account when I update?',
    a: "Updating your email address doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.",
  },
  {
    q: 'Does my Seller account get affected when I update my email address?',
    a: "We have a 'single sign-on' policy. Any changes will reflect in your Seller account also.",
  },
];

/* ── Reusable editable field card ── */
function InfoCard({ icon, emoji, title, children }) {
  return (
    <div className="pi-card">
      <div className="pi-card-header">
        <div className="pi-card-title">
          {icon ? <span className="pi-card-icon">{icon}</span> : null}
          {emoji ? <span className="pi-card-emoji">{emoji}</span> : null}
          <span>{title}</span>
        </div>
        <button className="pi-card-cancel">Cancel</button>
      </div>
      <div className="pi-card-body">{children}</div>
    </div>
  );
}

export default function PersonInformation() {
  const [dark, setDark]               = useState(false);
  const [activeNav, setActiveNav]     = useState('account-settings');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [gender, setGender]           = useState('male');

  /* form state */
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [mobile,    setMobile]    = useState('');

  return (
    <div className={`pi-page ${dark ? 'pi-dark' : ''}`}>
      <div className="pi-container">

        {/* ════════════════ LEFT SIDEBAR ════════════════ */}
        <aside className="pi-sidebar">

          {/* Profile pill */}
          <div className="pi-profile">
            <div className="pi-avatar-wrap">
              <img
                className="pi-avatar"
                src="https://i.pravatar.cc/80?u=alex"
                alt="Alex Johnston"
                onError={(e) => {
                  e.target.src =
                    'https://ui-avatars.com/api/?name=Alex+Johnston&background=C07F5E&color=fff&size=80';
                }}
              />
              <span className="pi-avatar-dot" />
            </div>
            <div className="pi-profile-text">
              <p className="pi-hello">Welcome back,</p>
              <p className="pi-name">Alex Johnston</p>
            </div>
          </div>

          <div className="pi-rule" />

          {/* Nav items */}
          <nav className="pi-nav">
            {NAV_SECTIONS.map((sec) => {
              const isOpen = activeNav === sec.id;
              return (
                <div key={sec.id}>
                  <button
                    className={`pi-nav-btn ${isOpen ? 'pi-nav-active' : ''}`}
                    onClick={() => setActiveNav(isOpen ? '' : sec.id)}
                  >
                    <sec.icon size={16} className="pi-nav-icon" />
                    <span className="pi-nav-label">{sec.label}</span>
                    {sec.sub
                      ? <ChevronDown size={13} className={`pi-nav-chevron ${isOpen ? 'pi-nav-chevron-open' : ''}`} />
                      : <ChevronRight size={13} className="pi-nav-chevron" />
                    }
                  </button>

                  {sec.sub && isOpen && (
                    <ul className="pi-subnav">
                      {sec.sub.map((s) => (
                        <li key={s} className={`pi-subnav-item${s === 'PAN Card Information' && sec.id === 'account-settings' ? ' pi-subnav-active' : ''}`}>{s}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            <div className="pi-rule pi-rule-sm" />

            <button className="pi-nav-btn pi-nav-logout">
              <Power size={16} className="pi-nav-icon" />
              <span className="pi-nav-label">Logout</span>
            </button>
          </nav>

          <div className="pi-rule" />

          {/* Support */}
          <div className="pi-support-wrap">
            <button className="pi-support">
              <div className="pi-support-icon-wrap">
                <Headphones size={16} />
              </div>
              <div className="pi-support-text">
                <span className="pi-support-tag">Help Center</span>
                <span className="pi-support-label">Contact Support</span>
              </div>
            </button>
          </div>
        </aside>

        {/* ════════════════ RIGHT CONTENT ════════════════ */}
        <main className="pi-main">

          {/* Page header */}
          <div className="pi-main-header">
            <div>
              <h1 className="pi-main-title">Personal Information</h1>
              <p className="pi-main-sub">Manage your personal information and security settings.</p>
            </div>
            <button
              className="pi-dark-btn"
              onClick={() => setDark(!dark)}
              title="Toggle dark mode"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>

          {/* ── Card 1: Personal Info ── */}
          <InfoCard
            icon={<User size={15} />}
            title="Personal Information"
          >
            <div className="pi-form-row">
              <div className="pi-field">
                <label className="pi-label">First Name</label>
                <input
                  className="pi-input"
                  type="text"
                  placeholder="e.g. Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="pi-field">
                <label className="pi-label">Last Name</label>
                <input
                  className="pi-input"
                  type="text"
                  placeholder="e.g. Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="pi-field pi-field-gender">
              <label className="pi-label">Your Gender</label>
              <div className="pi-radio-group">
                <label className="pi-radio">
                  <input
                    type="radio" name="gender" value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                  />
                  <span className="pi-radio-mark" />
                  Male
                </label>
                <label className="pi-radio">
                  <input
                    type="radio" name="gender" value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                  />
                  <span className="pi-radio-mark" />
                  Female
                </label>
              </div>
            </div>

            <div className="pi-card-foot">
              <button className="pi-btn-save">SAVE</button>
            </div>
          </InfoCard>

          {/* ── Card 2: Email ── */}
          <InfoCard emoji="✉️" title="Email Address">
            <div className="pi-field">
              <input
                className="pi-input"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="pi-card-foot">
              <button className="pi-btn-save">SAVE</button>
            </div>
          </InfoCard>

          {/* ── Card 3: Mobile ── */}
          <InfoCard emoji="📱" title="Mobile Number">
            <div className="pi-field">
              <input
                className="pi-input"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="pi-card-foot">
              <button className="pi-btn-save">SAVE</button>
            </div>
          </InfoCard>

          {/* ── FAQs ── */}
          <div className="pi-faqs">
            <h2 className="pi-faqs-title">FAQs</h2>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`pi-faq ${expandedFaq === i ? 'pi-faq-open' : ''}`}
              >
                <button
                  className="pi-faq-q"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={14} className="pi-faq-arrow" />
                </button>
                {expandedFaq === i && (
                  <p className="pi-faq-a">{faq.a}</p>
                )}
              </div>
            ))}
          </div>

          {/* ── Danger zone ── */}
          <div className="pi-danger">
            <button className="pi-btn-deactivate">Deactivate Account</button>
            <button className="pi-btn-delete">Delete Account</button>
          </div>

        </main>
      </div>
    </div>
  );
}