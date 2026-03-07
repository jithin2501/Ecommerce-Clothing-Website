import { useState, useRef } from 'react';
import '../../styles/collectiondetails/ImageZoom.css';

const ZOOM_SIZE  = 200;
const ZOOM_LEVEL = 2.5;
const OFFSET     = 16;

export default function ImageZoom({ src, alt }) {
  const [zoom, setZoom]         = useState(false);
  const [fixedPos, setFixedPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos]       = useState('0% 0%');
  const containerRef            = useRef(null);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Zoom box follows cursor — clamped to always stay inside viewport
    let boxX = e.clientX + OFFSET;
    let boxY = e.clientY + OFFSET;

    // Flip to left if too close to right edge
    if (boxX + ZOOM_SIZE > window.innerWidth - 8) {
      boxX = e.clientX - ZOOM_SIZE - OFFSET;
    }
    // Flip upward if too close to bottom edge
    if (boxY + ZOOM_SIZE > window.innerHeight - 8) {
      boxY = e.clientY - ZOOM_SIZE - OFFSET;
    }

    setFixedPos({ x: boxX, y: boxY });
    setBgPos(`${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`);
  };

  return (
    <div
      className="iz-container"
      ref={containerRef}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img src={src} alt={alt} className="iz-img" />

      {zoom && (
        <div
          className="iz-zoom-box"
          style={{
            position:           'fixed',
            left:               fixedPos.x,
            top:                fixedPos.y,
            width:              ZOOM_SIZE,
            height:             ZOOM_SIZE,
            backgroundImage:    `url(${src})`,
            backgroundSize:     `${ZOOM_LEVEL * 100}%`,
            backgroundPosition: bgPos,
            zIndex:             9999,
          }}
        />
      )}
    </div>
  );
}