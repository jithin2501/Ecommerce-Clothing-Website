import { useNavigate } from 'react-router-dom';
import '../../styles/collections/AgeSection.css';

const ageGroups = [
  {
    slug: 'newborn',
    range: '0-2 Years',
    label: 'Infant & Toddler',
    img: '/images/newborn.png',
    colorClass: 'age-card--peach',
  },
  {
    slug: 'toddler',
    range: '3-6 Years',
    label: 'Preschool Era',
    img: '/images/toddler.png',
    colorClass: 'age-card--sage',
  },
  {
    slug: 'junior',
    range: '7-12 Years',
    label: 'Young Explorers',
    img: '/images/junior.png',
    colorClass: 'age-card--sand',
  },
];

export default function AgeSection() {
  const navigate = useNavigate();

  return (
    <section id="age-sections" className="age-section">
      <div className="section-inner">
        <div className="age-grid">
          {ageGroups.map((group) => (
            <div
              key={group.slug}
              className={`age-card ${group.colorClass}`}
              onClick={() => navigate(`/collections/${group.slug}`)}
            >
              <div className="age-img-wrap">
                <img src={group.img} alt={group.range} />
              </div>
              <div className="age-card-info">
                <span className="age-card-label">{group.label}</span>
                <span className="age-card-range">{group.range}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}