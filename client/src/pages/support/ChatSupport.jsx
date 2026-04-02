import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import '../../styles/support/ChatSupport.css';

const STEP = {
  INIT: 'init',
  WAIT_ISSUE: 'wait_issue',
  WAIT_MEDIA: 'wait_media',
  DONE: 'done',
};

function TypingIndicator() {
  return (
    <div className="cs-msg cs-msg--bot">
      <div className="cs-avatar">ST</div>
      <div className="cs-bubble cs-bubble--typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

export default function ChatSupport() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const order    = location.state?.order || null;

  // ✅ Session key unique per order
  const sessionKey = `chat_ended_${order?.id || 'no-order'}`;

  const [activeNav,    setActiveNav]    = useState('');
  const [activeSubNav, setActiveSubNav] = useState('support');
  const [messages,     setMessages]     = useState([]);
  const [step,         setStep]         = useState(STEP.INIT);
  const [input,        setInput]        = useState('');
  const [typing,       setTyping]       = useState(false);
  const [mediaFiles,   setMediaFiles]   = useState([]);
  const [showEnded,    setShowEnded]    = useState(false);

  const bottomRef  = useRef(null);
  const fileRef    = useRef(null);
  const initiated  = useRef(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, typing, showEnded]);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;

    // ✅ If this order's chat already ended, restore it immediately
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        const { messages: savedMsgs } = JSON.parse(saved);
        setMessages(savedMsgs);
        setStep(STEP.DONE);
        setShowEnded(true);
        return;
      } catch (_) {}
    }

    // Normal intro flow
    const orderMsg = order
      ? `Hi, I need help with my order #${order.id} — ${order.name}`
      : 'Hi, I need help with a recent order.';

    setTimeout(() => {
      setMessages([{ from: 'user', text: orderMsg, time: now() }]);
    }, 400);
    setTimeout(() => setTyping(true), 1000);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        from: 'bot',
        text: `Thanks for reaching out! I can see your order${order ? ` #${order.id} (${order.name})` : ''}. Could you please describe the issue you're facing?`,
        time: now(),
      }]);
      setStep(STEP.WAIT_ISSUE);
    }, 2600);
  }, []);

  function now() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function botReply(text, delay = 1800, onDone) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text, time: now() }]);
      if (onDone) onDone();
    }, delay);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (step === STEP.WAIT_MEDIA) {
      if (mediaFiles.length === 0) return;
      const newMsg = { from: 'user', text: trimmed || '', mediaFiles: [...mediaFiles], time: now() };
      setMessages(prev => [...prev, newMsg]);
      setInput('');
      setMediaFiles([]);
      const ta = document.querySelector('.cs-input');
      if (ta) ta.style.height = 'auto';
      botReply(
        "We've received your details. Our support team will shortly call you to resolve this. Thank you for your patience! 😊",
        2000,
        () => {
          setStep(STEP.DONE);
          setTimeout(() => {
            setShowEnded(true);
            // ✅ Save the full ended conversation to sessionStorage
            setMessages(prev => {
              sessionStorage.setItem(sessionKey, JSON.stringify({ messages: prev }));
              return prev;
            });
          }, 400);
        }
      );
    } else {
      if (!trimmed) return;
      const newMsg = { from: 'user', text: trimmed, time: now() };
      setMessages(prev => [...prev, newMsg]);
      setInput('');
      const ta = document.querySelector('.cs-input');
      if (ta) ta.style.height = 'auto';
      if (step === STEP.WAIT_ISSUE) {
        botReply("Thank you for letting us know. Could you please share any photos or videos related to the issue? This will help us resolve it faster.");
        setStep(STEP.WAIT_MEDIA);
      }
    }
  }

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    setMediaFiles(prev => {
      const images = prev.filter(f => f.type === 'image');
      const videos = prev.filter(f => f.type === 'video');
      const newItems = [];
      files.forEach(f => {
        const isVideo = f.type.startsWith('video/');
        if (isVideo && videos.length + newItems.filter(x => x.type === 'video').length < 2) {
          newItems.push({ url: URL.createObjectURL(f), type: 'video', name: f.name });
        } else if (!isVideo && images.length + newItems.filter(x => x.type === 'image').length < 4) {
          newItems.push({ url: URL.createObjectURL(f), type: 'image', name: f.name });
        }
      });
      return [...prev, ...newItems];
    });
    e.target.value = '';
  }

  function removeMedia(idx) {
    setMediaFiles(prev => prev.filter((_, i) => i !== idx));
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function handleInput(e) {
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    setInput(ta.value);
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const imgCount   = mediaFiles.filter(f => f.type === 'image').length;
  const vidCount   = mediaFiles.filter(f => f.type === 'video').length;
  const canAddMore = imgCount < 4 || vidCount < 2;

  return (
    <div className="sh-page">
      <div className="sh-container">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          activeSubNav={activeSubNav}
          setActiveSubNav={setActiveSubNav}
        />

        <main className="sh-main">

          <div className="cs-breadcrumb">
            <span className="cs-bc-link" onClick={() => navigate('/support')}>Support Hub</span>
            <span className="cs-bc-sep">›</span>
            <span className="cs-bc-link" onClick={() => navigate(-1)}>Order Help</span>
            <span className="cs-bc-sep">›</span>
            <span className="cs-bc-current">Chat</span>
          </div>

          <div className="cs-chat-wrap">

            <div className="cs-chat-header">
              <div className="cs-header-avatar">ST</div>
              <div className="cs-header-info">
                <div className="cs-header-name">Sumathi Trends Support</div>
                <div className="cs-header-status"><span className="cs-online-dot" /> Online</div>
              </div>
              <button className="cs-header-close" onClick={() => navigate(-1)}>✕</button>
            </div>

            <div className="cs-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`cs-msg cs-msg--${msg.from}`}>
                  {msg.from === 'bot' && <div className="cs-avatar">ST</div>}
                  <div className={`cs-bubble cs-bubble--${msg.from}`}>
                    {msg.from === 'bot' && <div className="cs-sender">SUPPORT BOT</div>}
                    {msg.text && <p>{msg.text}</p>}
                    {msg.mediaFiles && msg.mediaFiles.length > 0 && (
                      <div className="cs-media-grid">
                        {msg.mediaFiles.map((mf, mi) => (
                          mf.type === 'video'
                            ? <video key={mi} src={mf.url} className="cs-media-preview" controls />
                            : <img key={mi} src={mf.url} alt="attachment" className="cs-media-preview" />
                        ))}
                      </div>
                    )}
                    <div className="cs-time">{msg.time}</div>
                  </div>
                </div>
              ))}
              {typing && <TypingIndicator />}
              {showEnded && <div className="cs-ended-inline">— Chat Ended —</div>}
              <div ref={bottomRef} />
            </div>

            <div className="cs-input-area">
              {step === STEP.DONE ? null : (
                <>
                  {mediaFiles.length > 0 && (
                    <div className="cs-media-thumbs">
                      {mediaFiles.map((mf, i) => (
                        <div key={i} className="cs-media-thumb-wrap">
                          {mf.type === 'video'
                            ? <div className="cs-media-thumb cs-media-thumb--video">🎬<span>{mf.name}</span></div>
                            : <img src={mf.url} alt="" className="cs-media-thumb" />
                          }
                          <button className="cs-remove-media" onClick={() => removeMedia(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="cs-input-row">
                    <button
                      className={`cs-attach-btn ${step === STEP.WAIT_MEDIA ? 'cs-attach-btn--active' : ''}`}
                      onClick={() => step === STEP.WAIT_MEDIA && canAddMore && fileRef.current?.click()}
                      title={step === STEP.WAIT_MEDIA ? `Add files (${imgCount}/4 images, ${vidCount}/2 videos)` : 'Available after describing your issue'}
                      disabled={step !== STEP.WAIT_MEDIA || !canAddMore}
                    >
                      <img src="/images/chat/attach.png" alt="attach" style={{width:32,height:32,objectFit:"contain"}} />
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFiles}
                      hidden
                    />
                    <textarea
                      className="cs-input"
                      rows={1}
                      placeholder={step === STEP.WAIT_MEDIA ? 'Add files using the button…' : 'Type your message…'}
                      value={input}
                      onChange={handleInput}
                      onKeyDown={handleKey}
                      disabled={step === STEP.WAIT_MEDIA}
                    />
                    <button
                      className="cs-send-btn"
                      onClick={handleSend}
                      disabled={step === STEP.WAIT_MEDIA ? mediaFiles.length === 0 : !input.trim()}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="cs-secure-note">🔒 Secure and encrypted connection</div>
                </>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
