import React from 'react';
import { X, Copy, Mail, Twitter, Facebook, MessageCircle } from 'lucide-react';
import '../../styles/collectiondetails/ShareModal.css';

export default function ShareModal({ isOpen, onClose, productUrl, productName }) {
  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(productUrl);
  const encodedName = encodeURIComponent(productName);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      color: '#25D366',
      url: `https://wa.me/?text=${encodedName}%20${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Twitter (X)',
      icon: <Twitter size={20} />,
      color: '#000000',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedName}`,
    },
    {
      name: 'Email',
      icon: <Mail size={20} />,
      color: '#EA4335',
      url: `mailto:?subject=${encodedName}&body=Check out this product: ${productUrl}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-content" onClick={(e) => e.stopPropagation()}>
        <div className="sm-header">
          <h3>Share this product</h3>
          <button className="sm-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="sm-grid">
          {shareOptions.map((opt) => (
            <a 
              key={opt.name} 
              href={opt.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sm-option"
            >
              <div className="sm-icon" style={{ backgroundColor: opt.color }}>
                {opt.icon}
              </div>
              <span>{opt.name}</span>
            </a>
          ))}
          <button className="sm-option" onClick={copyToClipboard}>
            <div className="sm-icon" style={{ backgroundColor: '#6c757d' }}>
              <Copy size={20} />
            </div>
            <span>Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}
