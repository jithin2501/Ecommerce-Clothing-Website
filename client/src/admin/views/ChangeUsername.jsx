import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/changeprofile.css';

const API = 'http://localhost:5000/api/users';
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
    <div className="cp-page">
      <div className="cp-card">
        <button className="cp-back" onClick={() => navigate('/admin/users')}>← Back</button>
        <h2 className="cp-title">Change Username</h2>
        <p className="cp-sub">Update your superadmin login username. You'll be signed out after changing.</p>

        {msg.text && (
          <div className={`cp-msg ${msg.type === 'error' ? 'cp-msg-error' : 'cp-msg-success'}`}>
            {msg.text}
          </div>
        )}

        <form className="cp-form" onSubmit={handleSubmit}>
          <div className="cp-group">
            <label>New Username</label>
            <input type="text" placeholder="Enter new username" value={form.newUsername}
              onChange={e => setForm(f => ({ ...f, newUsername: e.target.value }))} required />
          </div>
          <div className="cp-group">
            <label>Current Password</label>
            <input type="password" placeholder="Confirm with your current password" value={form.currentPassword}
              onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} required />
          </div>
          <button type="submit" className="cp-btn">Change Username</button>
        </form>
      </div>
    </div>
  );
}