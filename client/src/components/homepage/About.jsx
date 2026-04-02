import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import '../../styles/homepage/About.css';

export default function About() {
  useEffect(() => {
    const handleAboutLink = (e) => {
      e.preventDefault();
      const section = document.getElementById('about');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const links = document.querySelectorAll('a[href="#about"]');
    links.forEach((link) => link.addEventListener('click', handleAboutLink));
    return () => {
      links.forEach((link) => link.removeEventListener('click', handleAboutLink));
    };
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="section-inner">
        <h2 className="about-top-label">
          About <span>Us</span>
        </h2>
        <div className="about">
          <div className="about-visuals">
            <img
              src="./about.png"
              alt="About Sumathi Trends"
              className="about-img"
              onError={(e) => {
                e.target.src = 'images/homepage/about.png';
              }}
            />
          </div>

          <div className="about-content">
            <h3 className="about-sub">
              Crafted with Love,
              <span className="accent-text">Worn with Pride.</span>
            </h3>
            <p className="about-desc">
              At Sumathi Trends, we believe every child deserves to feel
              extraordinary. Founded in 2012, we blend timeless design with
              premium materials to create clothing that grows with your little
              ones — from their first steps to their biggest milestones.
            </p>
            <p className="about-desc">
              Our collections are thoughtfully designed to balance playful
              aesthetics with everyday comfort, ensuring your children can
              move, explore, and express themselves freely.
            </p>
            <a href="#" className="btn-about">
              Learn More <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
