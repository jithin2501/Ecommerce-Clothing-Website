import { useNavigate } from 'react-router-dom';
import '../../styles/sidebar/Sidebar.css';

export default function Sidebar({ activeNav, setActiveNav, activeSubNav, setActiveSubNav }) {
  const navigate = useNavigate();

  const handleSubNav = (key, path) => {
    setActiveSubNav(key);
    if (path) navigate(path);
  };

  return (
    <aside className="sidebar">

      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-container">
          <img
            src="https://ui-avatars.com/api/?name=Alex+Johnston&background=0D8ABC&color=fff"
            alt="Profile"
            className="avatar"
          />
          <div className="status-dot" />
        </div>
        <div className="welcome-text">Welcome back,</div>
        <div className="user-name">Alex Johnston</div>
      </div>

      {/* My Orders */}
      <div className="nav-section">
        <div
          className="nav-item"
          onClick={() => { setActiveNav('orders'); navigate('/account/orders'); }}
        >
          <img src="/images/sidebar/logistics.png" alt="orders" className="nav-icon-img" /> MY ORDERS
          <span className="nav-arrow">›</span>
        </div>
      </div>

      {/* Account Settings */}
      <div className="nav-section">
        <div
          className={`nav-item ${activeNav === 'account-settings' ? 'active' : ''}`}
          onClick={() => setActiveNav('account-settings')}
        >
          <img src="/images/sidebar/user.png" alt="account" className="nav-icon-img" /> ACCOUNT SETTINGS
        </div>
        <div
          className={`nav-sub-item ${activeSubNav === 'profile' ? 'sub-active' : ''}`}
          onClick={() => handleSubNav('profile', '/account')}
        >
          Profile Information
        </div>
        <div
          className={`nav-sub-item ${activeSubNav === 'address' ? 'sub-active' : ''}`}
          onClick={() => handleSubNav('address', '/account/addresses')}
        >
          Manage Addresses
        </div>
      </div>

      {/* My Stuff */}
      <div className="nav-section">
        <div
          className={`nav-item ${activeNav === 'mystuff' ? 'active' : ''}`}
          onClick={() => setActiveNav('mystuff')}
        >
          <img src="/images/sidebar/box.png" alt="stuff" className="nav-icon-img" /> MY STUFF
        </div>
        <div
          className={`nav-sub-item ${activeSubNav === 'reviews' ? 'sub-active' : ''}`}
          onClick={() => handleSubNav('reviews', '/account/reviews')}
        >
          My Reviews &amp; Ratings
        </div>
        <div
          className={`nav-sub-item ${activeSubNav === 'wishlist' ? 'sub-active' : ''}`}
          onClick={() => handleSubNav('wishlist', '/account/wishlist')}
        >
          My Wishlist
        </div>
      </div>

      <div className="sidebar-spacer" />

      {/* Logout */}
      <div className="logout-wrap">
        <button className="logout-card">
          <div className="logout-icon-wrap">
            <img src="/images/sidebar/switch.png" alt="logout" className="nav-icon-img" />
          </div>
          <div>
            <div className="logout-label-small">LOGOUT</div>
            <div className="logout-title">Sign Out</div>
          </div>
        </button>
      </div>

      {/* Help Center */}
      <div className="help-center-wrap">
        <div className="help-center-card">
          <div className="help-icon">
            <img src="/images/sidebar/customer-support.png" alt="help" className="nav-icon-img" />
          </div>
          <div>
            <div className="help-label">HELP CENTER</div>
            <div className="help-title">Contact Support</div>
          </div>
        </div>
      </div>

    </aside>
  );
}