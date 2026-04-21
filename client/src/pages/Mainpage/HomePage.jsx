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
        title="Home"
        description="Welcome to Sumathi Trends, your premium organic cotton and linen clothing store for children aged 0-12 in Bengaluru. Discover handpicked, high-quality kids fashion near you."
        keywords="kids clothing, children fashion, Sumathi Trends, premium kids boutique Bengaluru, organic cotton baby wear, kids party wear Bengaluru, Kodigehalli kids store, Hebbal children clothing"
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
