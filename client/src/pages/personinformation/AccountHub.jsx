import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../../styles/personinformation/PersonInformation.css'; // Reuse existing layout CSS

export default function AccountHub() {
  const navigate = useNavigate();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(`/api/client-auth/profile/${user.uid}`);
          const data = await res.json();
          if (data.success) {
            setDbUser(data.user);
          }
        } catch (err) {
          console.error("AccountHub: Failed to fetch profile", err);
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  if (loading) {
    return (
      <div className="account-loading-wrapper">
        <div className="account-loading-spinner"></div>
        <p>Opening your Account...</p>
      </div>
    );
  }

  return (
    <div className="pi-page is-hub">
      <div className="pi-container">
        <Sidebar
          activeNav=""
          setActiveNav={() => {}}
          activeSubNav=""
          setActiveSubNav={() => {}}
          user={dbUser}
        />
        <main className="main-content">
          {/* On desktop, this will show as empty/header. 
              But on mobile it's hidden by .is-hub .main-content { display: none } */}
          <div className="content-header">
            <h1>Welcome to Your Account</h1>
            <p>Please select an option from the menu on the left to manage your profile, orders, and settings.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
