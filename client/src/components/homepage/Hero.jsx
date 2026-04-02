import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../../styles/homepage/Hero.css';

const avatarUrls = [
  'https://i.pravatar.cc/100?u=11',
  'https://i.pravatar.cc/100?u=22',
  'https://i.pravatar.cc/100?u=33',
];

const PHRASES = [
  'Premium Kids Fashion',
  'Organic Cotton & Linen',
  'Ages 0–12 Essentials',
  'Loved by 2,400+ Parents',
  'Adventure-Ready Styles',
];

const TYPING_SPEED = 60;    // ms per character
const DELETING_SPEED = 35;  // ms per character
const PAUSE_AFTER_TYPE = 1600;  // ms before deleting
const PAUSE_AFTER_DELETE = 400; // ms before next phrase

export default function Hero() {
  const [displayed, setDisplayed] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const currentPhrase = PHRASES[phraseIndex];

    if (!isDeleting && displayed === currentPhrase) {
      // Finished typing — pause then start deleting
      setIsPaused(true);
      setTimeout(() => {
        setIsDeleting(true);
        setIsPaused(false);
      }, PAUSE_AFTER_TYPE);
      return;
    }

    if (isDeleting && displayed === '') {
      // Finished deleting — pause then move to next phrase
      setIsPaused(true);
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        setIsDeleting(false);
        setIsPaused(false);
      }, PAUSE_AFTER_DELETE);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayed((prev) =>
        isDeleting
          ? prev.slice(0, -1)
          : currentPhrase.slice(0, prev.length + 1)
      );
    }, isDeleting ? DELETING_SPEED : TYPING_SPEED);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, isPaused, phraseIndex]);

  return (
    <section className="hero-section">
      <div className="section-inner">
        <div className="hero">

          {/* Left: Content */}
          <div className="hero-content">

            {/* Typewriter tag */}
            <div className="hero-tag">
              <span className="dot" />
              <span className="typewriter-js">{displayed}<span className="cursor">|</span></span>
            </div>

            <h1 className="hero-title">
              <span className="line-1">Modern Style</span>
              <span className="line-2">
                for <span className="accent-inline">Little</span>
              </span>
              <span className="accent">Legends</span>
            </h1>

            <p className="hero-desc">
              Crafted with love using premium organic cotton and linen.
              Designed for comfort, style, and every little adventure from ages 0–12.
            </p>

            <a href="#collections" className="btn-collection">
              View Collection
              <ArrowRight size={18} />
            </a>

            <div className="trust-bar">
              <div className="trust-avatars">
                {avatarUrls.map((url, i) => (
                  <div
                    key={i}
                    className="avatar-pill"
                    style={{ backgroundImage: `url(${url})` }}
                  />
                ))}
              </div>
              <div className="trust-text">
                <span>2,400+</span> Happy parents trust us
              </div>
            </div>
          </div>

          {/* Right: Visuals */}
          <div className="hero-visuals">
            <img
              src="/images/homepage/banner7.png"
              alt="Model"
              className="main-model"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1519234221711-37d353664d92?q=80&w=800&auto=format&fit=crop';
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
