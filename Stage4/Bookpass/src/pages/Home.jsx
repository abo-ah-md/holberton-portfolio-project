import React, { useState } from 'react';
import { Search, ShoppingCart, CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhatIsBookPass from '../components/WhatIsBookPass';
import HowTo from '../components/HowTo';
import CurvedSection from '../components/CurvedSection';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import BookRating from '../components/BookRating';
import RibbonLogo from '../components/ribbon-logo';
import whiteBookmark from '../components/white-bookmark';
import { MiddleLogoComplex, Step } from '../components/BookPassUI';
import { MOCK_BOOKS } from '../constants/Books';
import LatestBooks from '../components/LatestBooks';



const Home = () => {
  const [activeTab, setActiveTab] = useState('buy');

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl scroll-smooth">
      {/* NAVBAR */}
      <Navbar />
      {/* HERO SECTION */}
      <Hero />

      {/* WHAT IS BOOK PASS SECTION */}
      <WhatIsBookPass />

      {/* HOW TO SECTION */}
      <HowTo />

      {/* CURVED SHAPE SECTION */}
      <CurvedSection />




      {/* MARKETPLACE GRID - Enclosed Container */}
      {/* MARKETPLACE GRID - Enclosed Container */}
      <LatestBooks />


      {/* RATING & FOOTER */}
      <section>
        <BookRating />
        <Footer />
      </section>
    </div>
  );
};

export default Home;

