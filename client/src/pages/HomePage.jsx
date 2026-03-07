import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Category from '../components/Category';
import BestSelling from '../components/BestSelling';
import NewArrivals from '../components/NewArrivals';
import WhyUs from '../components/WhyUs';
import Reviews from '../components/Reviews';

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
