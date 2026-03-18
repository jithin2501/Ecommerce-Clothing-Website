import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../assets/AdminLayout.css';

export default function AdminLayout() {
  useEffect(() => {
    const prev = document.body.getAttribute('style');
    document.body.setAttribute('style', 'background: #f3f4f6 !important; background-image: none !important;');
    return () => {
      document.body.setAttribute('style', prev || '');
    };
  }, []);

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
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}