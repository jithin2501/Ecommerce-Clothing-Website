import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import '../../styles/personinformation/PersonInformation.css';

export default function PersonInformation() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const [activeNav, setActiveNav]       = useState('account-settings');
  const [activeSubNav, setActiveSubNav] = useState('profile');

  // Personal Info
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [gender, setGender]       = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [tempPersonal, setTempPersonal] = useState({});
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Email
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail]         = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  // Mobile
  const [editingMobile, setEditingMobile] = useState(false);
  const [mobile, setMobile]       = useState('');
  const [tempMobile, setTempMobile] = useState('');
  const [savingMobile, setSavingMobile] = useState(false);

  const handleEditPersonal = () => {
    setTempPersonal({ firstName, lastName, gender });
    setEditingPersonal(true);
  };
  const handleCancelPersonal = () => {
    setFirstName(tempPersonal.firstName);
    setLastName(tempPersonal.lastName);
    setGender(tempPersonal.gender);
    setEditingPersonal(false);
  };
  const handleSavePersonal = () => {
    setSavingPersonal(true);
    setTimeout(() => { setSavingPersonal(false); setEditingPersonal(false); }, 800);
  };

  const handleEditEmail = () => { setTempEmail(email); setEditingEmail(true); };
  const handleCancelEmail = () => { setEmail(tempEmail); setEditingEmail(false); };
  const handleSaveEmail = () => {
    setSavingEmail(true);
    setTimeout(() => { setSavingEmail(false); setEditingEmail(false); }, 800);
  };

  const handleEditMobile = () => { setTempMobile(mobile); setEditingMobile(true); };
  const handleCancelMobile = () => { setMobile(tempMobile); setEditingMobile(false); };
  const handleSaveMobile = () => {
    setSavingMobile(true);
    setTimeout(() => { setSavingMobile(false); setEditingMobile(false); }, 800);
  };

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
                <img src="images/personalinfor/profile.png" alt="personal" className="card-icon-img" />
                Personal Information
              </div>
              {!editingPersonal
                ? <span className="edit-btn" onClick={handleEditPersonal}>Edit</span>
                : <span className="edit-cancel" onClick={handleCancelPersonal}>Cancel</span>
              }
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  placeholder="e.g. Sumathi"
                  onChange={e => setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  readOnly={!editingPersonal}
                  className={!editingPersonal ? 'input-readonly' : ''}
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  placeholder="e.g. Raj"
                  onChange={e => setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  readOnly={!editingPersonal}
                  className={!editingPersonal ? 'input-readonly' : ''}
                />
              </div>
            </div>

            <div className="gender-section">
              <label>Your Gender</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="gender" value="male"
                    checked={gender === 'male'}
                    onChange={() => editingPersonal && setGender('male')}
                    disabled={!editingPersonal}
                  /> Male
                </label>
                <label className="radio-option">
                  <input type="radio" name="gender" value="female"
                    checked={gender === 'female'}
                    onChange={() => editingPersonal && setGender('female')}
                    disabled={!editingPersonal}
                  /> Female
                </label>
              </div>
            </div>

            {editingPersonal && (
              <div className="save-btn-container">
                <button className="btn-save" onClick={handleSavePersonal} disabled={savingPersonal}>
                  {savingPersonal ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            )}
          </div>

          {/* Email Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="card-title">
                <img src="images/personalinfor/emails.png" alt="email" className="card-icon-img" />
                Email Address
              </div>
              {!editingEmail
                ? <span className="edit-btn" onClick={handleEditEmail}>Edit</span>
                : <span className="edit-cancel" onClick={handleCancelEmail}>Cancel</span>
              }
            </div>
            <div className="form-grid">
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <input
                  type="email"
                  value={email}
                  placeholder="email@example.com"
                  onChange={e => setEmail(e.target.value)}
                  readOnly={!editingEmail}
                  className={!editingEmail ? 'input-readonly' : ''}
                />
              </div>
            </div>
            {editingEmail && (
              <div className="save-btn-container">
                <button className="btn-save" onClick={handleSaveEmail} disabled={savingEmail}>
                  {savingEmail ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="card-title">
                <img src="images/personalinfor/number.png" alt="mobile" className="card-icon-img" />
                Mobile Number
              </div>
              {!editingMobile
                ? <span className="edit-btn" onClick={handleEditMobile}>Edit</span>
                : <span className="edit-cancel" onClick={handleCancelMobile}>Cancel</span>
              }
            </div>
            <div className="form-grid">
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <input
                  type="tel"
                  value={mobile}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  readOnly={!editingMobile}
                  className={!editingMobile ? 'input-readonly' : ''}
                />
              </div>
            </div>
            {editingMobile && (
              <div className="save-btn-container">
                <button className="btn-save" onClick={handleSaveMobile} disabled={savingMobile}>
                  {savingMobile ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            )}
          </div>

          <div className="delete-account-wrapper">
            <span className="delete-account">Delete Account</span>
          </div>

        </main>
      </div>
    </div>
  );
}