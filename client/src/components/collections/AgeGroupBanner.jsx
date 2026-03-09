import '../../styles/collections/AgeGroupBanner.css';

export default function AgeGroupBanner({ meta }) {
  return (
    <section className="agb-banner">
      <div className="agb-bg">
        {/* Same image as CollectionsPage banner */}
        <img
          src="/images/poster2.jpg"
          alt={meta.label}
          className="agb-img"
        />
        <div className="agb-overlay" />
      </div>

      <div className="agb-content">
        <p className="agb-tag">{meta.label}</p>
        <h1 className="agb-title">
          Spring/Summer<br />Collection 2024
        </h1>
        <p className="agb-desc">
          Curated seasonal essentials tailored to your child's developmental
          milestones and adventures.
        </p>
        <a href="#age-sections" className="agb-btn">
          Explore Collection
        </a>
      </div>
    </section>
  );
}