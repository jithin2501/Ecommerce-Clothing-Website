import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../assets/AdminLayout.css';


export default function AdminLayout() {
  useEffect(() => {
    document.body.style.cssText = 'background: #f3f4f6 !important; background-image: none !important; overflow: hidden !important; height: 100% !important;';
    document.documentElement.style.cssText = 'overflow: hidden !important; height: 100% !important;';
    return () => {
      document.body.style.cssText = '';
      document.documentElement.style.cssText = '';
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