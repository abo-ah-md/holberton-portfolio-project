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

// Sub-components
const TabButton = ({ active, onClick, text }) => (
  <button
    onClick={onClick}
    className={`px-8 py-2 rounded-lg font-bold transition-all ${active ? 'bg-brand-orange text-white shadow-lg' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
  >
    {text}
  </button>
);

const StepRow = ({ number, title, description }) => (
  <div className="flex items-start gap-6 group hover:translate-x-2 transition-transform duration-300">
    <div className="w-16 h-16 rounded-full bg-white text-brand-orange font-black text-2xl flex items-center justify-center shadow-lg z-10 border-4 border-brand-slate">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed max-w-xs">{description}</p>
    </div>
  </div>
);

const FeatureItem = ({ icon, title, isSvg }) => (
  <div className="flex flex-col items-center gap-4">
    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isSvg ? '' : 'bg-white text-brand-slate shadow-md'}`}>
      {icon}
    </div>
    <span className="font-bold text-brand-slate">{title}</span>
  </div>
);

export default Home;