import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/changeprofile.css';

const API = 'http://localhost:5000/api/users';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg]   = useState({ text: '', type: '' });
  const navigate        = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMsg({ text: 'New passwords do not match.', type: 'error' }); return;
    }
    if (form.newPassword.length < 6) {
      setMsg({ text: 'Password must be at least 6 characters.', type: 'error' }); return;
    }
    try {
      const res  = await fetch(`${API}/change-password`, {
        method: 'PATCH', headers: authHeaders(),
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ text: 'Password changed successfully!', type: 'success' });
        setTimeout(() => navigate('/admin/users'), 2000);
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
        <h2 className="cp-title">Change Password</h2>
        <p className="cp-sub">Update your superadmin login password.</p>

        {msg.text && (
          <div className={`cp-msg ${msg.type === 'error' ? 'cp-msg-error' : 'cp-msg-success'}`}>
            {msg.text}
          </div>
        )}

        <form className="cp-form" onSubmit={handleSubmit}>
          <div className="cp-group">
            <label>Current Password</label>
            <input type="password" placeholder="Enter current password" value={form.currentPassword}
              onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} required />
          </div>
          <div className="cp-group">
            <label>New Password</label>
            <input type="password" placeholder="Enter new password" value={form.newPassword}
              onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} required />
          </div>
          <div className="cp-group">
            <label>Confirm New Password</label>
            <input type="password" placeholder="Re-enter new password" value={form.confirmPassword}
              onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
          </div>
          <button type="submit" className="cp-btn">Change Password</button>
        </form>
      </div>
    </div>
  );
}