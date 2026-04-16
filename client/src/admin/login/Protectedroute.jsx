import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState({ loading: true, authenticated: false });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        setAuth({ loading: false, authenticated: data.success });
      } catch (err) {
        setAuth({ loading: false, authenticated: false });
      }
    };
    verifyAuth();
  }, []);

  if (auth.loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>
        <p>Verifying Admin Session...</p>
      </div>
    );
  }

  return auth.authenticated ? children : <Navigate to="/admin/login" replace />;
}
