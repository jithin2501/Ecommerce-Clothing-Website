import '../../styles/collectiondetails/ProductReviews.css';

const BARS = [
  { stars: 5, count: 28 },
  { stars: 4, count: 8 },
  { stars: 3, count: 4 },
  { stars: 2, count: 1 },
  { stars: 1, count: 1 },
];
const TOTAL = BARS.reduce((s, b) => s + b.count, 0);

const REVIEWS = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    date: 'Feb 12, 2025',
    avatar: '/images/avatars/sarah.jpg',
    text: 'The quality of this organic cotton is exceptional. It\'s incredibly soft and I know it\'ll be perfect for my 4-year-old. Love that natural botanical print!',
    image: '/images/reviews/review-1.jpg',
  },
  {
    id: 2,
    name: 'Priya K.',
    rating: 4,
    date: 'Jan 28, 2025',
    avatar: '/images/avatars/priya.jpg',
    text: 'Beautiful dress, runs slightly large but the adjustable waist tie helps. My daughter refuses to take it off!',
    image: null,
  },
];

function Stars({ count }) {
  return (
    <span className="pr-stars">
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

export default function ProductReviews() {
  return (
    <section className="pr-wrapper">
      <h2 className="pr-heading">Rating &amp; Reviews</h2>

      <div className="pr-summary">
        <div className="pr-score-block">
          <p className="pr-score">4.5</p>
          <Stars count={4} />
          <p className="pr-total">({TOTAL} reviews)</p>
        </div>

        <div className="pr-bars">
          {BARS.map(b => (
            <div key={b.stars} className="pr-bar-row">
              <span className="pr-bar-label">{b.stars}</span>
              <div className="pr-bar-track">
                <div
                  className="pr-bar-fill"
                  style={{ width: `${(b.count / TOTAL) * 100}%` }}
                />
              </div>
              <span className="pr-bar-count">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pr-list">
        {REVIEWS.map(r => (
          <div key={r.id} className="pr-card">
            <div className="pr-card-header">
              <img src={r.avatar} alt={r.name} className="pr-avatar" />
              <div>
                <p className="pr-name">{r.name}</p>
                <Stars count={r.rating} />
              </div>
              <p className="pr-date">{r.date}</p>
            </div>
            <p className="pr-text">{r.text}</p>
            {r.image && (
              <img src={r.image} alt="Review" className="pr-review-img" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
