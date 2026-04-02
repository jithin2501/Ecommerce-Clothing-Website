import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/changeusername.css';

const API = '/api/users';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});

export default function ChangeUsername() {
  const [form, setForm] = useState({ newUsername: '', currentPassword: '' });
  const [msg, setMsg]   = useState({ text: '', type: '' });
  const navigate        = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch(`${API}/change-username`, {
        method: 'PATCH', headers: authHeaders(), body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: 'Username changed! Signing you out...', type: 'success' });
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }, 2000);
      } else {
        setMsg({ text: data.message, type: 'error' });
      }
    } catch {
      setMsg({ text: 'Server error.', type: 'error' });
    }
  };

  return (
    <div className="cu-page">
      <h1 className="cu-title">Change Username</h1>

      <div className="cu-card">
        <h3 className="cu-card-title">Update Superadmin Username</h3>
        <p className="cu-card-sub">Update your superadmin login username. You'll be signed out after changing.</p>

        {msg.text && (
          <div className={`cu-msg ${msg.type === 'error' ? 'cu-msg-error' : 'cu-msg-success'}`}>
            {msg.text}
          </div>
        )}

        <form className="cu-form" onSubmit={handleSubmit}>
          <div className="cu-form-group">
            <label>New Username</label>
            <input type="text" placeholder="Enter new username" value={form.newUsername}
              onChange={e => setForm(f => ({ ...f, newUsername: e.target.value }))} required />
          </div>
          <div className="cu-form-group">
            <label>Current Password</label>
            <input type="password" placeholder="Confirm with your current password" value={form.currentPassword}
              onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} required />
          </div>
          <div className="cu-form-actions">
            <button type="button" className="cu-back-btn" onClick={() => navigate('/admin/users')}>Back</button>
            <button type="submit" className="cu-submit-btn">Change Username</button>
          </div>
        </form>
      </div>
    </div>
  );
}
