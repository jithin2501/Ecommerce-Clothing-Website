import { useEffect, useState } from 'react';
import '../../styles/contact/ContactPage.css';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'subject') {
      // Only alphabets and spaces
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setForm(f => ({ ...f, [name]: value }));
      }
    } else if (name === 'phone') {
      // Only numbers, +, spaces, hyphens
      if (/^[0-9+\s-]*$/.test(value)) {
        setForm(f => ({ ...f, [name]: value }));
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">

      {/* ── Banner ── */}
      <section className="contact-banner">
        <div className="contact-banner-bg">
          <img src="/images/banner.jpg" alt="Contact Banner" className="contact-banner-img" />
          <div className="contact-banner-overlay" />
        </div>
        <div className="contact-banner-content">
          <p className="contact-banner-tag">Get In Touch</p>
          <h1 className="contact-banner-title">
            Personal Support,<br />
            <span>just for you.</span>
          </h1>
          <p className="contact-banner-desc">
            Have a question about sizing, shipping, or our collections?<br />
            Our team is ready to assist you and your little ones.
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="contact-body">
        <div className="contact-inner">

          {/* Left */}
          <div className="contact-left">
            <h2 className="contact-heading">
              We are here to help you and your little ones.
            </h2>
            <p className="contact-sub">
              Have a question about sizing, shipping, or our sustainable materials?
              Our team is ready to assist you.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <img src="/images/icons/gmail.png" alt="Email" className="contact-info-img" />
                </div>
                <div>
                  <p className="contact-info-label">Email Us</p>
                  <p className="contact-info-value">sumathitrends.in@gmail.com</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <img src="/images/icons/phone.png" alt="Phone" className="contact-info-img" />
                </div>
                <div>
                  <p className="contact-info-label">Call Us</p>
                  <p className="contact-info-value">+91 87928 88508</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <img src="/images/icons/map.png" alt="Location" className="contact-info-img" />
                </div>
                <div>
                  <p className="contact-info-label">Visit Us</p>
                  <p className="contact-info-value">No.52, Saxena complex, Kodigehalli Main Rd,<br />Defence Layout, Sahakar Nagar,<br />Bengaluru, Karnataka 560092</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="contact-right">
            <h3 className="contact-form-title">Send us a Message</h3>
            {sent ? (
              <div className="contact-success">
                <p>✓ Thank you! We'll get back to you shortly.</p>
              </div>
            ) : (
              <div className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="contact-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="contact-form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Enter your subject"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="contact-form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
                <button className="contact-submit" onClick={handleSubmit}>
                  SEND MESSAGE
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}