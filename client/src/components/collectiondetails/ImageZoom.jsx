import { useState, useRef } from 'react';
import '../../styles/collectiondetails/ImageZoom.css';

const ZOOM_SIZE  = 180;
const ZOOM_LEVEL = 2.5;

export default function ImageZoom({ src, alt }) {
  const [zoom, setZoom]       = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos]     = useState('0% 0%');
  const containerRef          = useRef(null);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPos({ x: x + 20, y: y - ZOOM_SIZE / 2 });
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
  );
}