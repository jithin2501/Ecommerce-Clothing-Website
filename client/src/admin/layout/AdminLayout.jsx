import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../assets/AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch actual role from the server
    const fetchRole = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setRole(data.user.role);
        }
      } catch (err) {
        console.error("Failed to fetch role", err);
      }
    };
    fetchRole();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      navigate('/admin/login');
    } catch {
      navigate('/admin/login');
    }
  };

  return (
    <div className={`admin-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <header className="admin-mobile-header">
        <button 
          className="admin-hamburger" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isSidebarOpen && <div className="admin-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">Admin Dashboard</div>
        <nav className="admin-nav">
          <NavLink to="/admin/contact"  className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Contact Messages</NavLink>
          <NavLink to="/admin/reviews"  className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Review Management</NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Product Management</NavLink>
          <NavLink to="/admin/clients" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Client Management</NavLink>
          <NavLink to="/admin/payments" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Payment Management</NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Order Management</NavLink>
          <NavLink to="/admin/support" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Support Management</NavLink>
          
          {/* User Management only visible for Superadmin */}
          {role === 'superadmin' && (
            <NavLink to="/admin/users" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>User Management</NavLink>
          )}

          <button className="admin-signout-inline" onClick={handleSignOut}>Sign Out</button>
        </nav>
        <button className="admin-signout" onClick={handleSignOut}>Sign Out</button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
