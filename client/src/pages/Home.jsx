import Hero from '../components/Hero';
import About from '../components/About';
import Category from '../components/Category';
import NewArrivals from '../components/NewArrivals';
import BestSelling from '../components/BestSelling';
import WhyUs from '../components/WhyUs';
import Reviews from '../components/Reviews';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Category />
      <NewArrivals />
      <BestSelling />
      <WhyUs />
      <Reviews />
    </main>
  );
}
