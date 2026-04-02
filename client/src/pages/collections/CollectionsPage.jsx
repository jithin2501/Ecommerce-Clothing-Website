import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AgeSection from '../../components/collections/AgeSection';
import '../../styles/collections/CollectionsPage.css';

export default function CollectionsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="collections-page">
      <div className="nav-spacer" />
      <AgeSection />
    </main>
  );
}