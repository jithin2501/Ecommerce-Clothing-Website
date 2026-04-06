import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../assets/AdminLayout.css';

const getRole = () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1])).role;
  } catch { return null; }
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className={`admin-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* ── Mobile Top Bar ── */}
      <header className="admin-mobile-header">
        <button 
          className="admin-hamburger" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* ── Mobile Overlay ── */}
      {isSidebarOpen && (
        <div className="admin-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">Admin Dashboard</div>
        <nav className="admin-nav">
          <NavLink to="/admin/contact"  className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Contact Messages</NavLink>
          <NavLink to="/admin/reviews"  className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Review Management</NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Product Management</NavLink>
          <NavLink to="/admin/clients" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Client Management</NavLink>
          <NavLink to="/admin/payments" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Payment Management</NavLink>
          {role === 'superadmin' && (
            <NavLink to="/admin/users"  className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>User Management</NavLink>
          )}
          <button className="admin-signout-inline" onClick={handleSignOut}>
            Sign Out
          </button>
        </nav>
        <button className="admin-signout" onClick={handleSignOut}>Sign Out</button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
