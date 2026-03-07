import '../../styles/collections/CollectionsBanner.css';

export default function CollectionsBanner() {
  return (
    <section className="col-banner">
      <div className="col-banner-bg">
        <img src="/images/banner.jpg" alt="Collections Banner" className="col-banner-img" />
        <div className="col-banner-overlay" />
      </div>
      <div className="col-banner-content">
        <p className="col-banner-tag">New Season</p>
        <h1 className="col-banner-title">
          Every stage of childhood,<br />
          <span>beautifully dressed.</span>
        </h1>
        <p className="col-banner-desc">
          Curated seasonal essentials tailored to your child's developmental
          milestones and adventures.
        </p>
        <a href="#age-sections" className="col-banner-btn">
          Explore Collection
        </a>
      </div>
    </section>
  );
}