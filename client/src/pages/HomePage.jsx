import React from 'react';
import Hero from '../components/homepage/Hero';
import About from '../components/homepage/About';
import Category from '../components/homepage/Category';
import BestSelling from '../components/homepage/BestSelling';
import NewArrivals from '../components/homepage/NewArrivals';
import WhyUs from '../components/homepage/WhyUs';
import Reviews from '../components/homepage/Reviews';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <About />
      <Category />
      <BestSelling />
      <NewArrivals />
      <WhyUs />
      <Reviews />
    </main>
  );
};

export default HomePage;
