import '../../styles/collectiondetails/ProductRelated.css';

const RELATED = [
  {
    id: 1,
    name: 'Floral Midi Skirt',
    price: '$62.00',
    src: '/images/image1.png',
  },
  {
    id: 2,
    name: 'Linen Pinafore Dress',
    price: '$74.00',
    src: '/images/image2.png',
  },
  {
    id: 3,
    name: 'Smocked Sundress',
    price: '$68.00',
    src: '/images/image3.png',
  },
  {
    id: 4,
    name: 'Ruffle Hem Skirt',
    price: '$54.00',
    src: '/images/image1.png',
  },
];

export default function ProductRelated() {
  return (
    <section className="prelat-wrapper">
      <h2 className="prelat-heading">You might also like</h2>
      <div className="prelat-grid">
        {RELATED.map(item => (
          <a key={item.id} href="#" className="prelat-card">
            <div className="prelat-img-wrap">
              <img src={item.src} alt={item.name} className="prelat-img" />
            </div>
            <p className="prelat-name">{item.name}</p>
            <p className="prelat-price">{item.price}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
