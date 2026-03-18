import { useEffect, useState } from 'react';
import '../assets/contactmessage.css';

const API = 'http://localhost:5000/api/contact';

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchAll = async () => {
    try {
      const res  = await fetch(`${API}/admin`);
      const data = await res.json();
      if (data.success) setContacts(data.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleView = async (id) => {
    try {
      const res  = await fetch(`${API}/admin/${id}`);
      const data = await res.json();
      if (data.success) setSelected(data.data);
    } catch (err) {
      console.error('View error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res  = await fetch(`${API}/admin/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setContacts(c => c.filter(x => x._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Messages</h1>

      {loading ? (
        <div className="contact-outer">
          <p className="contact-empty">Loading...</p>
        </div>
      ) : contacts.length === 0 ? (
        /* ── Empty: single box ── */
        <div className="contact-outer empty">
          <p className="contact-empty">No contact submissions yet.</p>
        </div>
      ) : (
        /* ── Has data: outer box wrapping inner table box ── */
        <div className="contact-outer">
          <div className="contact-card">
            <table className="contact-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TYPE</th>
                  <th>APPLICANT</th>
                  <th>CONTACT</th>
                  <th>MESSAGE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id}>
                    <td>{formatDate(c.createdAt)}</td>
                    <td><span className="type-badge">{c.type}</span></td>
                    <td className="td-name">{c.name}</td>
                    <td className="td-contact">
                      <span>{c.phone}</span>
                      {c.email && <span className="td-email">{c.email}</span>}
                    </td>
                    <td className="td-msg">
                      {c.subject
                        ? `Subj: ${c.subject}`
                        : `Msg: ${c.message.slice(0, 45)}...`}
                    </td>
                    <td className="td-action">
                      <button className="btn-view"   onClick={() => handleView(c._id)}>View</button>
                      <button className="btn-delete" onClick={() => handleDelete(c._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            <h3 className="modal-title">Contact Message Details</h3>
            <hr className="modal-divider" />
            <div className="modal-fields">
              <p><strong>Date:</strong> {new Date(selected.createdAt).toLocaleString('en-IN')}</p>
              <p><strong>Name:</strong> {selected.name}</p>
              {selected.email && (
                <p><strong>Email:</strong>{' '}
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </p>
              )}
              <p><strong>Mobile:</strong> {selected.phone}</p>
              {selected.subject && <p><strong>Subject:</strong> {selected.subject}</p>}
            </div>
            <div className="modal-msg-section">
              <h4>Message Content</h4>
              <div className="modal-msg-box">{selected.message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}