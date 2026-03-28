import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone]       = useState('');
  const [message, setMessage]   = useState({ text: '', type: '' });
  const [loading, setLoading]   = useState(false);
  const [verified, setVerified] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user   = result.user;

      await fetch('http://localhost:5000/api/auth/google', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:  user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid:   user.uid,
        }),
      }).catch(() => {});

      navigate('/');
    } catch (error) {
      setMessage({ text: 'Google Sign-In failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange  = (e) => setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, ''));
  const handlePhoneChange = (e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10));

  return (
    <div className="ul-page">
      <div className={`ul-container${verified ? ' ul-verified' : ''}`}>

        {/* ── Left: Image ── */}
        <div className="ul-image-section">

          {/* Back button — top left INSIDE the card, no box */}
          <button className="ul-back-btn" onClick={() => navigate('/')} title="Back to Home">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <img
            src="/images/login/client_login.png"
            alt="Login Illustration"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* ── Right: Form ── */}
        <div className="ul-form-section">

          {message.text && (
            <div className={`ul-message ${message.type === 'success' ? 'ul-msg-success' : 'ul-msg-error'}`}>
              {message.text}
            </div>
          )}

          <div className="ul-header">
            <h1>Welcome back</h1>
            <p>Please log into your account</p>
          </div>

          <div className="ul-form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your name"
              value={fullName}
              onChange={handleNameChange}
            />
          </div>

          <div className="ul-form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              placeholder="9876543210"
              maxLength={10}
              inputMode="numeric"
              value={phone}
              onChange={handlePhoneChange}
            />
          </div>
          <button className="ul-btn-signin">
                Sign In
            </button>

          <div className="ul-divider">or</div>
          

          <button
            className="ul-btn-google"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <svg viewBox="0 0 48 48" width="18" height="18">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}