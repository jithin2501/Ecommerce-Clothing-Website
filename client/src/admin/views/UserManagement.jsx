import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/usermanagement.css';

const API = '/api/users';
const authHeaders = () => ({
  'Content-Type': 'application/json',
});

const PAGE_OPTIONS = [
  'Contact Messages',
  'Review Management',
  'Product Management',
  'Client Management',
  'Payment Management',
  'Order Management',
  'Support Management'
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', permissions: [] });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [editingPerms, setEditingPerms] = useState(null); // ID of user being edited
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch(API, { 
        headers: authHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
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
    setTimeout(() => setMsg({ text: '', type: '' }), 5000);
  };

  const togglePermissionInForm = (perm) => {
    setForm(f => {
      const updated = f.permissions.includes(perm)
        ? f.permissions.filter(p => p !== perm)
        : [...f.permissions, perm];
      return { ...f, permissions: updated };
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const { password } = form;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#%&*!^$])[A-Za-z\d@#%&*!^$]{8,}$/;
    if (!passwordRegex.test(password)) {
      flash('Password must be at least 8 characters long and include a capital letter, a number, and a special character.', 'error');
      return;
    }

    try {
      const res = await fetch(API, { 
        method: 'POST', 
        headers: authHeaders(), 
        credentials: 'include',
        body: JSON.stringify(form) 
      });
      const data = await res.json();
      if (data.success) {
        setUsers(u => {
          const newList = [data.data, ...u];
          return newList.sort((a, b) => a.role === 'superadmin' ? -1 : b.role === 'superadmin' ? 1 : 0);
        });
        setForm({ username: '', password: '', permissions: [] });
        flash('Admin user created successfully.');
      } else { flash(data.message, 'error'); }
    } catch { flash('Server error.', 'error'); }
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await fetch(`${API}/${id}/toggle`, { 
        method: 'PATCH', 
        headers: authHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) setUsers(u => u.map(x => x._id === id ? { ...x, isActive: data.isActive } : x));
    } catch { flash('Server error.', 'error'); }
  };

  const handleUpdatePermissions = async (userId, perms) => {
    try {
      const res = await fetch(`${API}/${userId}/permissions`, {
        method: 'PATCH',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify({ permissions: perms })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(u => u.map(x => x._id === userId ? { ...x, permissions: perms } : x));
        setEditingPerms(null);
        flash('Permissions updated successfully.');
      } else { flash(data.message, 'error'); }
    } catch { flash('Server error.', 'error'); }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try {
      const res = await fetch(`${API}/${id}`, { 
        method: 'DELETE', 
        headers: authHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) { setUsers(u => u.filter(x => x._id !== id)); flash('User deleted.'); }
    } catch { flash('Server error.', 'error'); }
  };

  return (
    <div className="um-page">
      <h1 className="um-title">User Management</h1>

      <div className="um-card">
        <h3 className="um-card-title">Create New Admin User</h3>
        <p className="um-card-sub">Set credentials and page permissions for new team members.</p>
        
        {msg.text && <div className={`um-msg ${msg.type === 'error' ? 'um-msg-error' : 'um-msg-success'}`}>{msg.text}</div>}
        
        <form className="um-form" onSubmit={handleCreate}>
          <div className="um-form-row">
            <div className="um-form-group">
              <label>Username:</label>
              <input type="text" placeholder="Enter username" value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
            </div>
            <div className="um-form-group">
              <label>Password:</label>
              <div className="um-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Strong password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button" className="um-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <div className="um-perms-section">
            <label className="um-perms-title">Assign Page Access:</label>
            <div className="um-perms-grid">
              {PAGE_OPTIONS.map(opt => (
                <label key={opt} className="um-perm-checkbox">
                  <input 
                    type="checkbox" 
                    checked={form.permissions.includes(opt)} 
                    onChange={() => togglePermissionInForm(opt)} 
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="um-create-btn">Create Admin Account</button>
        </form>
      </div>

      <h2 className="um-section-title">Existing Admin Users</h2>
      <div className="um-table-outer">
        {loading ? <p className="um-empty">Loading...</p> : (
          <table className="um-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>USERNAME</th>
                <th style={{ width: '15%' }}>ROLE</th>
                <th style={{ width: '45%' }}>PERMISSIONS</th>
                <th style={{ width: '20%' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="um-username">{u.username}</td>
                  <td><span className={`um-role-badge ${u.role}`}>{u.role}</span></td>
                  <td>
                    {u.role === 'superadmin' ? (
                      <span className="um-all-access">Full Catalog Access</span>
                    ) : editingPerms === u._id ? (
                      <div className="um-edit-perms-box">
                        <div className="um-perms-inline-grid">
                          {PAGE_OPTIONS.map(opt => (
                            <label key={opt} className="um-perm-mini">
                              <input 
                                type="checkbox" 
                                checked={u.permissions?.includes(opt)} 
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const current = u.permissions || [];
                                  const updated = checked 
                                    ? [...current, opt]
                                    : current.filter(p => p !== opt);
                                  setUsers(prev => prev.map(x => x._id === u._id ? { ...x, permissions: updated } : x));
                                }}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                        <div className="um-edit-actions">
                          <button className="um-save-mini" onClick={() => handleUpdatePermissions(u._id, u.permissions)}>Save</button>
                          <button className="um-cancel-mini" onClick={() => { fetchUsers(); setEditingPerms(null); }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="um-perms-display">
                        {(u.permissions && u.permissions.length > 0) ? (
                          <div className="um-perm-tags">
                            {u.permissions.map(p => <span key={p} className="um-perm-tag">{p}</span>)}
                            <button className="um-edit-perms-btn" onClick={() => setEditingPerms(u._id)}>Edit</button>
                          </div>
                        ) : (
                          <span className="um-no-access">No pages assigned <button className="um-edit-perms-btn" onClick={() => setEditingPerms(u._id)}>Assign</button></span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="um-actions">
                    {u.role === 'superadmin' ? (
                      <div className="um-super-actions">
                        <button className="um-img-btn" onClick={() => navigate('/admin/change-username')} title="Change Username">
                          <img src="/images/usermanagement/Username.png" alt="Change Username" />
                        </button>
                        <button className="um-img-btn" onClick={() => navigate('/admin/change-password')} title="Change Password">
                          <img src="/images/usermanagement/Password.png" alt="Change Password" />
                        </button>
                      </div>
                    ) : (
                      <div className="um-admin-actions">
                        <button className="um-img-btn" onClick={() => handleToggleActive(u._id)} title={u.isActive ? 'Deactivate' : 'Activate'}>
                          <img src={u.isActive ? '/images/usermanagement/Activate.png' : '/images/usermanagement/Deactivate.png'} alt={u.isActive ? 'Deactivate' : 'Activate'} />
                        </button>
                        <button className="um-img-btn" onClick={() => handleDelete(u._id, u.username)} title="Delete">
                          <img src="/images/usermanagement/Delete.png" alt="Delete" />
                        </button>
                      </div>
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
