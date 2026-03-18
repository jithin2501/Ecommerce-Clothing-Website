import { useEffect, useState } from 'react';
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

  const fetchUsers = async () => {
    try {
      const res  = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch(API, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(u => [data.data, ...u]);
        setForm({ username: '', password: '' });
        showMsg('Admin user created successfully.');
      } else {
        showMsg(data.message, 'error');
      }
    } catch {
      showMsg('Server error.', 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`${API}/${id}/toggle`, {
        method:  'PATCH',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(u => u.map(x => x._id === id ? { ...x, isActive: data.isActive } : x));
      }
    } catch {
      showMsg('Server error.', 'error');
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try {
      const res  = await fetch(`${API}/${id}`, {
        method:  'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(u => u.filter(x => x._id !== id));
        showMsg('User deleted.');
      }
    } catch {
      showMsg('Server error.', 'error');
    }
  };

  return (
    <div className="um-page">
      <h1 className="um-title">User Management</h1>

      {/* ── Create form ── */}
      <div className="um-card">
        <h3 className="um-card-title">Create New Admin User</h3>
        <p className="um-card-sub">Create credentials for a new admin user who can access this portal.</p>

        {msg.text && (
          <div className={`um-msg ${msg.type === 'error' ? 'um-msg-error' : 'um-msg-success'}`}>
            {msg.text}
          </div>
        )}

        <form className="um-form" onSubmit={handleCreate}>
          <div className="um-form-group">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter new username (e.g., admin2)"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
            />
          </div>
          <div className="um-form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter a strong password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="um-create-btn">Create Admin Account</button>
        </form>
      </div>

      {/* ── Existing users ── */}
      <h2 className="um-section-title">Existing Admin Users</h2>

      <div className="um-table-outer">
        {loading ? (
          <p className="um-empty">Loading...</p>
        ) : (
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
                  <td>
                    <span className={`um-role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td className="um-lastlogin">
                    {u.lastLogin
                      ? new Date(u.lastLogin).toLocaleString('en-IN')
                      : '—'}
                  </td>
                  <td className="um-actions">
                    {u.role !== 'superadmin' ? (
                      <>
                        <button
                          className={`um-toggle-btn ${u.isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleToggle(u._id)}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="um-delete-btn"
                          onClick={() => handleDelete(u._id, u.username)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="um-protected">—</span>
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