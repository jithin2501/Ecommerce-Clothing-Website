import '../../styles/sidebar/Sidebar.css';

export default function Sidebar({ activeNav, setActiveNav, activeSubNav, setActiveSubNav }) {
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
        <div className="nav-item" onClick={() => setActiveNav('orders')}>
          <img src="" alt="orders" className="nav-icon-img" /> MY ORDERS
          <span className="nav-arrow">›</span>
        </div>
      </div>

      {/* Account Settings */}
      <div className="nav-section">
        <div
          className={`nav-item ${activeNav === 'account-settings' ? 'active' : ''}`}
          onClick={() => setActiveNav('account-settings')}
        >
          <img src="" alt="account" className="nav-icon-img" /> ACCOUNT SETTINGS
        </div>
        <div
          className={`nav-sub-item ${activeSubNav === 'profile' ? 'sub-active' : ''}`}
          onClick={() => setActiveSubNav('profile')}
        >
          Profile Information
        </div>
        <div
          className={`nav-sub-item ${activeSubNav === 'address' ? 'sub-active' : ''}`}
          onClick={() => setActiveSubNav('address')}
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
          <img src="" alt="stuff" className="nav-icon-img" /> MY STUFF
        </div>
        <div
          className={`nav-sub-item ${activeSubNav === 'reviews' ? 'sub-active' : ''}`}
          onClick={() => setActiveSubNav('reviews')}
        >
          My Reviews &amp; Ratings
        </div>
        <div
          className={`nav-sub-item ${activeSubNav === 'wishlist' ? 'sub-active' : ''}`}
          onClick={() => setActiveSubNav('wishlist')}
        >
          My Wishlist
        </div>
      </div>

      <div className="sidebar-spacer" />

      {/* Logout */}
      <div className="logout-wrap">
        <button className="logout-card">
          <div className="logout-icon-wrap"><img src="" alt="logout" className="nav-icon-img" /></div>
          <div className="logout-text">
            <span className="logout-label">LOGOUT</span>
          </div>
        </button>
      </div>

      {/* Help Center */}
      <div className="help-center-card">
        <div className="help-icon"><img src="" alt="help" className="nav-icon-img" /></div>
        <div>
          <div className="help-label">HELP CENTER</div>
          <div className="help-title">Contact Support</div>
        </div>
      </div>

    </aside>
  );
}