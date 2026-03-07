import { useEffect } from 'react';
import CollectionsBanner from '../../components/collections/CollectionsBanner';
import AgeSection from '../../components/collections/AgeSection';
import YouMightAlsoLike from '../../components/collections/YouMightAlsoLike';
import '../../styles/collections/CollectionsPage.css';

export default function CollectionsPage() {
  // Scroll to very top on mount so banner is visible from the start
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="collections-page">
      <CollectionsBanner />
      <AgeSection />
      <YouMightAlsoLike />
    </main>
  );
}