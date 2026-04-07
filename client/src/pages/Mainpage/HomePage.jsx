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
        description="Welcome to Sumathi Trends, your premium organic cotton and linen clothing store for children aged 0-12 in India."
        keywords="kids clothing home, Sumathi Trends online store, buy kids clothes online India, best premium cloths for childrens in kodigehalli, hebbal"
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
