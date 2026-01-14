import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhatIsBookPass from '../components/WhatIsBookPass';
import HowTo from '../components/HowTo';
import CurvedSection from '../components/WhyBookPass';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import BookRating from '../components/BookRating';
import whiteBookmark from '../components/white-bookmark';
import { MiddleLogoComplex, Step } from '../components/BookPassUI';
import { MOCK_BOOKS } from '../constants/Books';
import LatestBooks from '../components/LatestBooks';
import { usePageLoading } from '../components/PageTransition';



const Home = () => {
  const { setLoadingMessage } = usePageLoading();
  const [activeTab, setActiveTab] = useState('buy');

  useEffect(() => {
    setLoadingMessage("");
    return () => setLoadingMessage("جاري التحميل...");
  }, [setLoadingMessage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl scroll-smooth pt-20">
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

