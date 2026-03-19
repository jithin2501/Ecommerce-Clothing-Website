import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/usermanagement.css';

const API = 'http://localhost:5000/api/users';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});

export default function UserManagement() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ username: '', password: '' });
  const [msg, setMsg]         = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res  = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        // Sort: superadmin always first
        const sorted = [...data.data].sort((a, b) => {
          if (a.role === 'superadmin') return -1;
          if (b.role === 'superadmin') return 1;
          return 0;
        });
        setUsers(sorted);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch(API, { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setUsers(u => {
          const newList = [data.data, ...u];
          return newList.sort((a, b) => a.role === 'superadmin' ? -1 : b.role === 'superadmin' ? 1 : 0);
        });
        setForm({ username: '', password: '' });
        flash('Admin user created successfully.');
      } else { flash(data.message, 'error'); }
    } catch { flash('Server error.', 'error'); }
  };

  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`${API}/${id}/toggle`, { method: 'PATCH', headers: authHeaders() });
      const data = await res.json();
      if (data.success) setUsers(u => u.map(x => x._id === id ? { ...x, isActive: data.isActive } : x));
    } catch { flash('Server error.', 'error'); }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try {
      const res  = await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) { setUsers(u => u.filter(x => x._id !== id)); flash('User deleted.'); }
    } catch { flash('Server error.', 'error'); }
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
                    {u.role === 'superadmin' ? (
                      <>
                        <button className="um-edit-btn username" onClick={() => navigate('/admin/change-username')}>
                          Change Username
                        </button>
                        <button className="um-edit-btn password" onClick={() => navigate('/admin/change-password')}>
                          Change Password
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="um-img-btn" onClick={() => handleToggle(u._id)} title={u.isActive ? 'Deactivate' : 'Activate'}>
                          <img src={u.isActive ? '/images/usermanagement/Activate.png' : '/images/usermanagement/Deactivate.png'} alt={u.isActive ? 'Deactivate' : 'Activate'} />
                        </button>
                        <button className="um-img-btn" onClick={() => handleDelete(u._id, u.username)} title="Delete">
                          <img src="/images/usermanagement/Delete.png" alt="Delete" />
                        </button>
                      </>
                    )}
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