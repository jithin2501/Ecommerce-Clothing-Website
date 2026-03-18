import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../assets/AdminLayout.css';

// Decode JWT role without a library
const getRole = () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1])).role;
  } catch {
    return null;
  }
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const role = getRole();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-brand">Admin Dashboard</div>
        <nav className="admin-nav">
          <NavLink
            to="/admin/contact"
            className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}
          >
            Contact Messages
          </NavLink>
          {role === 'superadmin' && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}
            >
              User Management
            </NavLink>
          )}
        </nav>
        <button className="admin-signout" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}