import { useEffect, useState } from 'react';
import '../assets/usermanagement.css';

const API = 'http://localhost:5000/api/users';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});

export default function UserManagement() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ username: '', password: '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [userForm, setUserForm] = useState({ newUsername: '', currentPassword: '' });
  const [msg, setMsg]           = useState({ text: '', type: '' });
  const [passMsg, setPassMsg]   = useState({ text: '', type: '' });
  const [userMsg, setUserMsg]   = useState({ text: '', type: '' });

  const fetchUsers = async () => {
    try {
      const res  = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const flash = (setter, text, type = 'success') => {
    setter({ text, type });
    setTimeout(() => setter({ text: '', type: '' }), 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch(API, { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setUsers(u => [data.data, ...u]);
        setForm({ username: '', password: '' });
        flash(setMsg, 'Admin user created successfully.');
      } else { flash(setMsg, data.message, 'error'); }
    } catch { flash(setMsg, 'Server error.', 'error'); }
  };

  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`${API}/${id}/toggle`, { method: 'PATCH', headers: authHeaders() });
      const data = await res.json();
      if (data.success) setUsers(u => u.map(x => x._id === id ? { ...x, isActive: data.isActive } : x));
    } catch { flash(setMsg, 'Server error.', 'error'); }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try {
      const res  = await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) { setUsers(u => u.filter(x => x._id !== id)); flash(setMsg, 'User deleted.'); }
    } catch { flash(setMsg, 'Server error.', 'error'); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      flash(setPassMsg, 'New passwords do not match.', 'error'); return;
    }
    if (passForm.newPassword.length < 6) {
      flash(setPassMsg, 'New password must be at least 6 characters.', 'error'); return;
    }
    try {
      const res  = await fetch(`${API}/change-password`, {
        method: 'PATCH', headers: authHeaders(),
        body: JSON.stringify({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword }),
      });
      const data = await res.json();
      if (data.success) { setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); flash(setPassMsg, 'Password changed successfully.'); }
      else { flash(setPassMsg, data.message, 'error'); }
    } catch { flash(setPassMsg, 'Server error.', 'error'); }
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch(`${API}/change-username`, {
        method: 'PATCH', headers: authHeaders(),
        body: JSON.stringify(userForm),
      });
      const data = await res.json();
      if (data.success) {
        setUserForm({ newUsername: '', currentPassword: '' });
        flash(setUserMsg, 'Username changed. Please sign out and log in again.');
      } else { flash(setUserMsg, data.message, 'error'); }
    } catch { flash(setUserMsg, 'Server error.', 'error'); }
  };

  return (
    <div className="um-page">
      <h1 className="um-title">User Management</h1>

      {/* ── Create Admin ── */}
      <div className="um-card">
        <h3 className="um-card-title">Create New Admin User</h3>
        <p className="um-card-sub">Create credentials for a new admin user who can access this portal.</p>
        {msg.text && <div className={`um-msg ${msg.type === 'error' ? 'um-msg-error' : 'um-msg-success'}`}>{msg.text}</div>}
        <form className="um-form" onSubmit={handleCreate}>
          <div className="um-form-group">
            <label>Username:</label>
            <input type="text" placeholder="Enter new username" value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
          </div>
          <div className="um-form-group">
            <label>Password:</label>
            <input type="password" placeholder="Enter a strong password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button type="submit" className="um-create-btn">Create Admin Account</button>
        </form>
      </div>

      {/* ── Change Username ── */}
      <div className="um-card">
        <h3 className="um-card-title">Change Your Username</h3>
        <p className="um-card-sub">Update your superadmin login username. You'll need to sign in again after changing.</p>
        {userMsg.text && <div className={`um-msg ${userMsg.type === 'error' ? 'um-msg-error' : 'um-msg-success'}`}>{userMsg.text}</div>}
        <form className="um-form" onSubmit={handleChangeUsername}>
          <div className="um-form-group">
            <label>New Username:</label>
            <input type="text" placeholder="Enter new username" value={userForm.newUsername}
              onChange={e => setUserForm(f => ({ ...f, newUsername: e.target.value }))} required />
          </div>
          <div className="um-form-group">
            <label>Current Password:</label>
            <input type="password" placeholder="Confirm with current password" value={userForm.currentPassword}
              onChange={e => setUserForm(f => ({ ...f, currentPassword: e.target.value }))} required />
          </div>
          <button type="submit" className="um-create-btn um-username-btn">Change Username</button>
        </form>
      </div>

      {/* ── Change Password ── */}
      <div className="um-card">
        <h3 className="um-card-title">Change Your Password</h3>
        <p className="um-card-sub">Update your superadmin login password.</p>
        {passMsg.text && <div className={`um-msg ${passMsg.type === 'error' ? 'um-msg-error' : 'um-msg-success'}`}>{passMsg.text}</div>}
        <form className="um-form" onSubmit={handleChangePassword}>
          <div className="um-form-group">
            <label>Current Password:</label>
            <input type="password" placeholder="Enter current password" value={passForm.currentPassword}
              onChange={e => setPassForm(f => ({ ...f, currentPassword: e.target.value }))} required />
          </div>
          <div className="um-form-group">
            <label>New Password:</label>
            <input type="password" placeholder="Enter new password" value={passForm.newPassword}
              onChange={e => setPassForm(f => ({ ...f, newPassword: e.target.value }))} required />
          </div>
          <div className="um-form-group">
            <label>Confirm New Password:</label>
            <input type="password" placeholder="Re-enter new password" value={passForm.confirmPassword}
              onChange={e => setPassForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
          </div>
          <button type="submit" className="um-create-btn um-change-btn">Change Password</button>
        </form>
      </div>

      {/* ── Existing Users ── */}
      <h2 className="um-section-title">Existing Admin Users</h2>
      <div className="um-table-outer">
        {loading ? <p className="um-empty">Loading...</p> : (
          <table className="um-table">
            <thead>
              <tr>
                <th>USERNAME</th>
                <th>ROLE</th>
                <th>LAST LOGIN</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="um-username">{u.username}</td>
                  <td><span className={`um-role-badge ${u.role}`}>{u.role}</span></td>
                  <td className="um-lastlogin">{u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-IN') : '—'}</td>
                  <td className="um-actions">
                    {u.role !== 'superadmin' ? (
                      <>
                        <button className={`um-toggle-btn ${u.isActive ? 'active' : 'inactive'}`} onClick={() => handleToggle(u._id)}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="um-delete-btn" onClick={() => handleDelete(u._id, u.username)}>Delete</button>
                      </>
                    ) : <span className="um-protected">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}