import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const circleRef = useRef(null);
  const [form, setForm]         = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const container = circleRef.current;
    const numBars   = 64;
    let activeBars  = 0;

    const colorPalette = [
      { c1: '#ffa500', c2: '#ff8c00' },
      { c1: '#00d2ff', c2: '#3a7bd5' },
      { c1: '#9d50bb', c2: '#6e48aa' },
      { c1: '#00f2fe', c2: '#4facfe' },
      { c1: '#a8ff78', c2: '#78ffd6' },
      { c1: '#f093fb', c2: '#f5576c' },
      { c1: '#f6d365', c2: '#fda085' },
      { c1: '#43e97b', c2: '#38f9d7' },
      { c1: '#fa709a', c2: '#fee140' },
      { c1: '#667eea', c2: '#764ba2' },
    ];
    let paletteIndex = 0;

    for (let i = 0; i < numBars; i++) {
      const bar = document.createElement('div');
      bar.className = 'login-bar';
      bar.style.transform = `rotate(${(360 / numBars) * i}deg)`;
      container.appendChild(bar);
    }

    const bars = container.querySelectorAll('.login-bar');

    const interval = setInterval(() => {
      if (activeBars > 0 && activeBars % numBars === 0) {
        paletteIndex = (paletteIndex + 1) % colorPalette.length;
        const t = colorPalette[paletteIndex];
        document.documentElement.style.setProperty('--lc1', t.c1);
        document.documentElement.style.setProperty('--lc2', t.c2);
      }
      bars[activeBars % numBars].classList.add('active');
      if (activeBars > 15) bars[(activeBars - 15) % numBars].classList.remove('active');
      activeBars++;
    }, 80);

    return () => {
      clearInterval(interval);
      container.innerHTML = '';
      document.documentElement.style.removeProperty('--lc1');
      document.documentElement.style.removeProperty('--lc2');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/contact');
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-circle-container" ref={circleRef} />
        <div className="login-box">
          <h2 className="login-heading">Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="login-error">{error}</p>}
            <div className="login-input-group">
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
              />
            </div>
            <div className="login-input-group has-icon">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <span className="login-eye" onClick={() => setShowPass(s => !s)}>
                {showPass
                  ? <img src="/images/login/view.png"   alt="hide" className="login-eye-img" />
                  : <img src="/images/login/hide.png" alt="show" className="login-eye-img" />
                }
              </span>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}