import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../assets/AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Lock scroll for admin
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';

    return () => {
      // Fully restore scroll when leaving admin
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
            className={({ isActive }) =>
              'admin-nav-link' + (isActive ? ' active' : '')
            }
          >
            Contact Messages
          </NavLink>
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