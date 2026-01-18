import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import { motion } from 'framer-motion';
import Hero from '../components/features/Hero';
import WhatIsBookPass from '../components/features/WhatIsBookPass';
import Testimonials from '../components/features/Testimonials';
import FAQ from '../components/features/FAQ';
import CurvedSection from '../components/features/WhyBookPass';
import Footer from '../components/layout/Footer.jsx';
import BookRating from '../components/features/BookRating';
import whiteBookmark from '../components/layout/white-bookmark';
import { MiddleLogoComplex, Step } from '../components/features/BookPassUI';
import { MOCK_BOOKS } from '../constants/Books';
import LatestBooks from '../components/features/LatestBooks';
import { usePageLoading } from '../components/ui/PageTransition';
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
