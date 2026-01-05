import React, { useState } from 'react';
import { Search, ShoppingCart, CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { MiddleLogoComplex, Step } from '../components/BookPassUI';
import { MOCK_BOOKS } from '../constants/Books';



const Home = () => {
  const [activeTab, setActiveTab] = useState('buy');

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl scroll-smooth">
      {/* NAVBAR */}
      <Navbar />
      {/* HERO SECTION */}
      <Hero/>

      {/* ABOUT SECTION - Organic Look */}
      <div className="relative z-30 -mt-20">
       
        <section className="bg-brand-orange py-16 text-white text-center relative px-6">
          <div className="absolute top-0 left-0 w-32 h-32 opacity-10 bg-[url('/assets/shape-1.png')] bg-contain bg-no-repeat" />
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-md">ما هو بوك باس ؟</h2>
            <p className="text-xl md:text-2xl leading-loose font-medium opacity-95 max-w-3xl mx-auto">
              بوك باس هي منصة صممت من أجل الطلاب، لربط الطلاب الراغبين في شراء وبيع الكتب الجامعية المستعملة بطريقة آمنة وسهلة وبصفقات عادلة.
            </p>
          </div>
        </section>
 
      </div>

      {/* STEPS SECTION - Vertical Layout with Ribbon */}
      <div className="relative z-20 bg-brand-slate py-24 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Ribbon/Graphic */}
          <div className="hidden md:flex justify-center relative">
            <img src="/assets/ribbon-flag.png" alt="How it works" className="max-w-sm drop-shadow-2xl transform hover:scale-105 transition duration-500" />
            {/* Floating circular text or badge could go here */}
          </div>

          {/* Right Side: Vertical Steps */}
          <div className="flex flex-col gap-10">
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold mb-4">
                كيفية <span className="text-brand-orange">الشراء / البيع</span>
              </h2>
              <div className="flex gap-4">
                <TabButton active={activeTab === 'buy'} onClick={() => setActiveTab('buy')} text="الشراء" />
                <TabButton active={activeTab === 'sell'} onClick={() => setActiveTab('sell')} text="البيع" />
              </div>
            </div>

            <div className="space-y-8 relative">
              {/* Vertical connecting line */}
              <div className="absolute top-8 bottom-8 right-[2.8rem] w-1 bg-dashed bg-brand-orange/30 -z-10" />

              <StepRow number="1" title="البحث عن الكتاب" description="ابحث عن الكتاب الذي تحتاجه بسهولة باستخدام البحث المتقدم." />
              <StepRow number="2" title="السداد الآمن" description="ادفع بأمان واضمن حقك في استلام الكتاب." />
              <StepRow number="3" title="استلام الكتاب" description="تواصل مع البائع واستلم كتابك في الجامعة." />
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION - Light Gray */}
      <section className="py-20 bg-brand-lightGray relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-16 text-brand-slate">لماذا بوك باس؟</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <FeatureItem icon={<Zap className="w-8 h-8" />} title="سهولة العثور" />
            <FeatureItem icon={<MiddleLogoComplex />} title="نقل المعرفة" isSvg />
            <FeatureItem icon={<ShieldCheck className="w-8 h-8" />} title="حماية البيئة" />
            <FeatureItem icon={<ShoppingCart className="w-8 h-8" />} title="أسعار مناسبة" />
            <FeatureItem icon={<CheckCircle className="w-8 h-8" />} title="فحص الجودة" />
          </div>
        </div>
      </section>

      {/* MARKETPLACE GRID - Enclosed Container */}
      <section className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          {/* The Container User Requested */}
          <div className="bg-brand-slate rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Header inside container */}
            <div className="flex justify-between items-center mb-10 text-white border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="w-3 h-10 bg-brand-orange rounded-full block"></span>
                آخر الكتب المضافة
              </h2>
              <button className="text-brand-orange hover:text-white transition font-bold flex items-center gap-2">
                عرض الكل <Search size={18} className="rotate-90" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 justify-items-center">
              {MOCK_BOOKS.map((book) => (
                <BookCard key={book.id} book={book} darkBackground={true} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RATING & FOOTER */}
      <section className="bg-brand-slate text-white pt-20 relative">
        
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold mb-8">كيف يتم تقييم الكتب؟</h2>
          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="h-2 w-full max-w-md bg-gradient-to-l from-green-500 via-yellow-400 to-red-500 rounded-full" />
          </div>
          <div className="flex justify-between max-w-lg mx-auto text-sm font-bold opacity-80">
            <span>ممتاز</span>
            <span>جيد جداً</span>
            <span>جيد</span>
            <span>مقبول</span>
          </div>
        </div>
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