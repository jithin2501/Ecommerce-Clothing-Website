import '../../styles/collectiondetails/ProductRelated.css';

const RELATED = [
  {
    id: 1,
    name: 'Floral Midi Skirt',
    price: '$62.00',
    src: '/images/products/related-1.jpg',
  },
  {
    id: 2,
    name: 'Linen Pinafore Dress',
    price: '$74.00',
    src: '/images/products/related-2.jpg',
  },
  {
    id: 3,
    name: 'Smocked Sundress',
    price: '$68.00',
    src: '/images/products/related-3.jpg',
  },
  {
    id: 4,
    name: 'Ruffle Hem Skirt',
    price: '$54.00',
    src: '/images/products/related-4.jpg',
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
