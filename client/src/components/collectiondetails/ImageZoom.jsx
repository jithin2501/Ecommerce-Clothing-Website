import { useState, useRef } from 'react';
import '../../styles/collectiondetails/ImageZoom.css';

const ZOOM_SIZE  = 180;
const ZOOM_LEVEL = 2.5;

export default function ImageZoom({ src, alt }) {
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [zoom, setZoom]               = useState(false);
  const [zoomPos, setZoomPos]         = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos]             = useState('0% 0%');
  const containerRef                  = useRef(null);

  const handleMouseMove = (e) => {
    if (!zoomEnabled) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPos({ x: x - ZOOM_SIZE / 2, y: y - ZOOM_SIZE / 2 });
    setBgPos(`${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`);
  };

  const toggleZoom = (e) => {
    e.stopPropagation();
    setZoomEnabled(prev => !prev);
    setZoom(false);
  };

  return (
    <div className="iz-outer">
      {/* Magnifier toggle button */}
      <button
        className={`iz-mag-btn${zoomEnabled ? ' iz-mag-active' : ''}`}
        onClick={toggleZoom}
        title={zoomEnabled ? 'Disable zoom' : 'Enable zoom'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <div
        className="iz-container"
        ref={containerRef}
        style={{ cursor: zoomEnabled ? 'crosshair' : 'default' }}
        onMouseEnter={() => { if (zoomEnabled) setZoom(true); }}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <img src={src} alt={alt} className="iz-img" />

        {zoomEnabled && zoom && (
          <div
            className="iz-zoom-box"
            style={{
              left:               zoomPos.x,
              top:                zoomPos.y,
              width:              ZOOM_SIZE,
              height:             ZOOM_SIZE,
              backgroundImage:    `url(${src})`,
              backgroundSize:     `${ZOOM_LEVEL * 100}%`,
              backgroundPosition: bgPos,
            }}
          />
        )}
      </div>
    </div>
  );
}