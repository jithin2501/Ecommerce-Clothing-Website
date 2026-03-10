import { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import '../../styles/personinformation/PersonInformation.css';

function SaveButton({ section, onValidate }) {
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');

  const handleClick = () => {
    if (onValidate && !onValidate()) {
      setError('Please fill in all fields.');
      setTimeout(() => setError(''), 2500);
      return;
    }
    setError('');
    setState('saving');
    setTimeout(() => {
      setState('saved');
      setTimeout(() => setState('idle'), 1500);
    }, 800);
  };

  const label = state === 'saving' ? 'SAVING...' : state === 'saved' ? 'SAVED!' : 'SAVE';
  const bg = state === 'saved' ? '#4caf50' : '';
  const opacity = state === 'saving' ? 0.7 : 1;

  return (
    <div className="save-btn-container">
      {error && <span className="save-error">{error}</span>}
      <button
        className="btn-save"
        onClick={handleClick}
        disabled={state !== 'idle'}
        style={{ backgroundColor: bg, opacity }}
      >
        {label}
      </button>
    </div>
  );
}

export default function PersonInformation() {
  const [activeNav, setActiveNav]       = useState('account-settings');
  const [activeSubNav, setActiveSubNav] = useState('profile');
  const [gender, setGender]             = useState('');
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [email, setEmail]               = useState('');
  const [mobile, setMobile]             = useState('');

  return (
    <div className="pi-page">
      <div className="pi-container">

        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          activeSubNav={activeSubNav}
          setActiveSubNav={setActiveSubNav}
        />

        <main className="main-content">

          {/* Header */}
          <div className="content-header">
            <h1>Personal Information</h1>
            <p>Manage your personal information and security settings</p>
          </div>

          {/* Personal Info Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="card-title">
                <img src="images/personalinfor/profile.png" alt="personal" className="card-icon-img" /> Personal Information
              </div>
              <span className="edit-cancel">Cancel</span>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>First Name</label>
                <input type="text" value={firstName} placeholder="e.g. Sumathi" onChange={e => setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} required />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input type="text" value={lastName} placeholder="e.g." onChange={e => setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} required />
              </div>
            </div>

            <div className="gender-section">
              <label>Your Gender</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="gender" value="male" checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    onClick={() => { if (gender === 'male') setGender(''); }} />
                  Male
                </label>
                <label className="radio-option">
                  <input type="radio" name="gender" value="female" checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    onClick={() => { if (gender === 'female') setGender(''); }} />
                  Female
                </label>
              </div>
            </div>

            <SaveButton section="Personal Information" onValidate={() => firstName.trim() !== '' && lastName.trim() !== '' && gender !== ''} />
          </div>

          {/* Email Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="card-title">
                <img src="images/personalinfor/emails.png" alt="email" className="card-icon-img" /> Email Address
              </div>
              <span className="edit-cancel">Cancel</span>
            </div>
            <div className="form-grid">
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <input type="email" value={email} placeholder="email@example.com" onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <SaveButton section="Email Address" onValidate={() => email.trim() !== ''} />
          </div>

          {/* Mobile Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="card-title">
                <img src="images/personalinfor/number.png" alt="mobile" className="card-icon-img" /> Mobile Number
              </div>
              <span className="edit-cancel">Cancel</span>
            </div>
            <div className="form-grid">
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <input
                  type="tel"
                  value={mobile}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                />
              </div>
            </div>
            <SaveButton section="Mobile Number" onValidate={() => mobile.trim().length >= 10} />
          </div>

          <div className="delete-account-wrapper">
            <span className="delete-account">Delete Account</span>
          </div>

        </main>
      </div>
    </div>
  );
}