import { useEffect, useState } from 'react';
import '../../styles/homepage/Reviews.css';

const API = 'http://localhost:5000/api/reviews/approved';

// Fallback static review shown when no approved reviews yet
const FALLBACK = [{
  _id: 'fallback',
  name: 'Meera Suresh',
  rating: 5,
  message: "Sumathi Trends is truly in a league of its own. The quality, the care, the packaging — everything felt premium. My son wore his outfit to a wedding and received non-stop compliments all evening!",
}];

export default function Reviews() {
  const [reviews, setReviews] = useState(FALLBACK);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleReviewLink = (e) => {
      e.preventDefault();
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const links = document.querySelectorAll('a[href="#reviews"]');
    links.forEach(l => l.addEventListener('click', handleReviewLink));
    return () => links.forEach(l => l.removeEventListener('click', handleReviewLink));
  }, []);

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => { if (data.success && data.data.length > 0) setReviews(data.data); })
      .catch(() => { });
  }, []);

  // Auto-rotate reviews every 5s if more than one
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, [reviews]);

  const review = reviews[current];

  return (
    <section id="reviews" className="rv2-section">
      <div className="section-inner">
        <h2 className="rv-title-label">
          Our <span>Reviews</span>
        </h2>

        <div className="rv2-layout">
          <div className="rv2-left">
            <div className="rv2-blobs">
              <div className="blob blob-1" />
              <div className="blob blob-2" />
              <div className="blob blob-3" />
              <div className="blob blob-4" />
            </div>
            <img
              src="images/homepage/review.png"
              alt="Happy children"
              className="rv2-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop';
              }}
            />
          </div>

          <div className="rv2-right">
            <h2 className="rv2-heading">
              Loved by <span>Thousands</span>
              <br />of Happy Parents
            </h2>

            <div className="rv2-box">
              <div className="rv2-box-quote">"</div>
              <p className="rv2-box-text">{review.message}</p>
              <div className="rv2-box-footer">
                <div className="rv2-box-avatar rv2-box-avatar-initials">
                  {review.name
                    .split(' ')
                    .slice(0, 2)
                    .map(w => w[0]?.toUpperCase())
                    .join('')}
                </div>
                <div className="rv2-box-info">
                  <div className="rv2-box-name">{review.name}</div>
                  <div className="rv2-box-stars">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
              </div>
            </div>

            {/* Dots navigation if multiple reviews */}
            {reviews.length > 1 && (
              <div className="rv2-dots">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    className={`rv2-dot${i === current ? ' active' : ''}`}
                    onClick={() => setCurrent(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}