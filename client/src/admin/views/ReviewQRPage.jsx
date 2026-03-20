import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import '../assets/reviewqrpage.css';

const REVIEW_URL = `${window.location.origin}/review`;

export default function ReviewQRPage() {
  const qrRef = useRef(null);
  const navigate = useNavigate();

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'sumathi-trends-review-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qrp-page">
      <div className="qrp-header">
        <button className="qrp-back" onClick={() => navigate('/admin/reviews')}>← Back</button>
        <h1 className="qrp-title">Review QR Code</h1>
        <p className="qrp-sub">Print and place this at your store or include it in packaging so customers can leave a review.</p>
      </div>

      <div className="qrp-card" id="qrp-print-area">
        <div className="qrp-brand">Sumathi Trends</div>
        <p className="qrp-scan-text">Scan to share your review</p>

        <div className="qrp-qr-wrap" ref={qrRef}>
          <QRCodeCanvas
            value={REVIEW_URL}
            size={240}
            fgColor="#2D3E50"
            bgColor="#FFFFFF"
            level="H"
          />
        </div>

        <p className="qrp-url">{REVIEW_URL}</p>
        <p className="qrp-tagline">We value your feedback!</p>
      </div>

      <div className="qrp-actions no-print">
        <button className="qrp-btn qrp-download" onClick={handleDownload}>
          ↓ Download PNG
        </button>
        <button className="qrp-btn qrp-print" onClick={handlePrint}>
          ⎙ Print QR
        </button>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .qrp-header { display: none !important; }
          body { background: white; }
          .qrp-card {
            box-shadow: none !important;
            border: 2px solid #e5e7eb !important;
            margin: 40px auto !important;
          }
        }
      `}</style>
    </div>
  );
}