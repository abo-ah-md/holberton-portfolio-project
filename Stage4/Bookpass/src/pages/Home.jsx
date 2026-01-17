import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import WhatIsBookPass from '../components/WhatIsBookPass';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CurvedSection from '../components/WhyBookPass';
import Footer from '../components/Footer';
import BookRating from '../components/BookRating';
import whiteBookmark from '../components/white-bookmark';
import { MiddleLogoComplex, Step } from '../components/BookPassUI';
import { MOCK_BOOKS } from '../constants/Books';
import LatestBooks from '../components/LatestBooks';
import { usePageLoading } from '../components/PageTransition';
import usePageTitle from '../hooks/usePageTitle';


const Home = () => {
  usePageTitle('الرئيسية');
  const { setLoadingMessage } = usePageLoading();
  const [activeTab, setActiveTab] = useState('buy');

  useEffect(() => {
    setLoadingMessage("");
    return () => setLoadingMessage("جاري التحميل...");
  }, [setLoadingMessage]);

  // Animation Variants matching RegistrationWizard feel
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="font-sans text-right relative overflow-x-hidden">
      {" "}
      {/* Added overflow-x-hidden to prevent scrollbar during animations */}
      <Navbar />
      {/* HERO SECTION */}
      {/* HERO SECTION - No external animation to prevent layout shifts/double scrollbars */}
      <section>
        <Hero />
      </section>

      {/* LATEST BOOKS */}
      {/* LATEST BOOKS */}
      <section>
        <LatestBooks />
      </section>

      {/* ABOUT US (WHAT IS BOOKPASS) */}
      <section>
        <WhatIsBookPass />
      </section>

      {/* TESTIMONIALS */}
      <section>
        <Testimonials />
      </section>


      {/* WHY BOOKPASS (CURVED SECTION REPLACEMENT) */}
      <section>
        <CurvedSection />
      </section>

      {/* FAQ & FOOTER */}
      <section>
        <div>
          <FAQ />
        </div>
        <div className="relative z-10">
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default Home;
