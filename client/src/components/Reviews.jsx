import '../styles/Reviews.css';

export default function Reviews() {
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
              src="images/review.png"
              alt="Happy children"
              className="rv2-img"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop';
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
              <p className="rv2-box-text">
                Sumathi Trends is truly in a league of its own. The quality, the
                care, the packaging — everything felt premium. My son wore his
                outfit to a wedding and received non-stop compliments all evening!
              </p>
              <div className="rv2-box-footer">
                <div className="rv2-box-avatar">
                  <img
                    src="https://i.pravatar.cc/100?u=review99"
                    alt="Meera Suresh"
                  />
                </div>
                <div className="rv2-box-info">
                  <div className="rv2-box-name">Meera Suresh</div>
                  <div className="rv2-box-stars">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
