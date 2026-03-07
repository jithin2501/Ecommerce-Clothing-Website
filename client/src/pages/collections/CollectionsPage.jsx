import CollectionsBanner from '../../components/collections/CollectionsBanner';
import AgeSection from '../../components/collections/AgeSection';
import YouMightAlsoLike from '../../components/collections/YouMightAlsoLike';
import '../../styles/collections/CollectionsPage.css';

export default function CollectionsPage() {
  return (
    <main className="collections-page">
      <CollectionsBanner />
      <AgeSection />
      <YouMightAlsoLike />
    </main>
  );
}
