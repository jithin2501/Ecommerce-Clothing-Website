import React from 'react';
import Hero from '../../components/homepage/Hero';
import About from '../../components/homepage/About';
import Category from '../../components/homepage/Category';
import BestSelling from '../../components/homepage/BestSelling';
import NewArrivals from '../../components/homepage/NewArrivals';
import WhyUs from '../../components/homepage/WhyUs';
import Reviews from '../../components/homepage/Reviews';
import SEO from '../../components/SEO';

const HomePage = () => {
  return (
    <>
      <SEO 
        title="Best Kids Clothes Store in Bengaluru | Premium Children's Fashion"
        description="Shop the most exclusive collection of kids cloths in Bengaluru. From designer frocks to ethnic wear, Sumathi Trends offers premium handcrafted fashion for children aged 0-12. Visit our Kodigehalli boutique today!"
        keywords="kids cloths Bengaluru, children's clothing store, designer frocks for girls, ethnic wear for boys, kids boutique Kodigehalli, premium kidswear Hebbal, branded kids clothing, baby clothes shopping, school party wear frocks"
        url="https://sumathitrends.com/"
      />
      <main>
        <Hero />
        <About />
        <Category />
        <BestSelling />
        <NewArrivals />
        <WhyUs />
        <Reviews />
      </main>
    </>
  );
};

export default HomePage;
