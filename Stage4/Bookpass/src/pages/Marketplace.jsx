import React, { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BookCard from '../components/features/BookCard';
import { MOCK_BOOKS_EXTENDED } from '../constants/Books';
import { getAllBooks, searchBooks } from '../services/bookService';
import { UNIVERSITIES, getUniversityName } from '../constants/universities';
import { Search, Filter, SortAsc, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { usePageLoading } from '../components/ui/PageTransition';
import { Button } from '../components/ui/button';

import usePageTitle from '../hooks/usePageTitle';

const ScrollCard = ({ children, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", "1 0"] // Start tracking when card enters bottom, end when it leaves top
    });

    // Bottom Entry (0 -> 0.2)
    const scaleBottom = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
    const opacityBottom = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
    const yBottom = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

    // Top Exit "ATM Slot" (0.8 -> 1)
    const rotateX = useTransform(scrollYProgress, [0.8, 1], [0, -45]);
    const scaleTop = useTransform(scrollYProgress, [0.8, 1], [1, 0.8]);
    const opacityTop = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
    const yTop = useTransform(scrollYProgress, [0.8, 1], [0, -50]);

    // Combine transforms
    const scale = useTransform(scrollYProgress, (pos) => pos < 0.2 ? scaleBottom.get() : (pos > 0.8 ? scaleTop.get() : 1));
    const opacity = useTransform(scrollYProgress, (pos) => pos < 0.2 ? opacityBottom.get() : (pos > 0.8 ? opacityTop.get() : 1));
    const y = useTransform(scrollYProgress, (pos) => pos < 0.2 ? yBottom.get() : (pos > 0.8 ? yTop.get() : 0));
    const rotate = useTransform(scrollYProgress, (pos) => pos > 0.8 ? rotateX.get() : 0);

    return (
        <motion.div
            ref={ref}
            style={{
                scale,
                opacity,
                y,
                rotateX: rotate,
                transformPerspective: 1000,
            }}
            className="origin-top my-4"
        >
            {children}
        </motion.div>
    );
};

const Marketplace = () => {
    usePageTitle('المتجر');

    const location = useLocation();
    // Navbar visibility tracking (mirrors navbar logic)
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const lastScrollY = useRef(0);
    // State for Filter Inputs
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const { setIsLoading, setLoadingMessage } = usePageLoading();

    const [searchParams] = useSearchParams(); // Use URL params for auto-sync

    // Sync with URL params or Location State
    useEffect(() => {
        const queryFromUrl = searchParams.get('q');
        if (queryFromUrl) {
            setSearchQuery(queryFromUrl);
        } else if (location.state?.initialQuery) {
            setSearchQuery(location.state.initialQuery);
        }
    }, [searchParams, location.state]);

    // Listen for Navbar Filter Button Event
    useEffect(() => {
        const openModal = () => setIsMobileFilterOpen(true);
        window.addEventListener('open-filter-modal', openModal);
        return () => window.removeEventListener('open-filter-modal', openModal);
    }, []);
    const [searchType, setSearchType] = useState('title'); // title, isbn, author
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // newest, price_low, price_high
    const [showSold, setShowSold] = useState(false);

    // Pagination (load more)
    const [visibleCount, setVisibleCount] = useState(30);

    // Scroll detection to mirror navbar visibility (same logic as Navbar.jsx)
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                // Scrolling DOWN -> Navbar hides
                setIsNavbarVisible(false);
            } else {
                // Scrolling UP -> Navbar shows
                setIsNavbarVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch books from API
    useLayoutEffect(() => {
        const fetchBooks = async () => {
            setLoadingMessage("جاري البحث في المكتبة...");
            setIsLoading(true);
            setError(null);
            try {
                const { data, fetchError } = await getAllBooks();
                if (fetchError) {
                    console.error('API error:', fetchError);
                    setBooks([]);
                } else if (data && data.length > 0) {
                    setBooks(data);
                } else {
                    setBooks([]);
                }
            } catch (err) {
                console.error('Failed to fetch books:', err);
                setBooks([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Filter Logic
    const filteredBooks = useMemo(() => {
        // Filter out Pending books (only show Available or Sold)
        // UPDATE: User wants Pending books to be shown.
        let result = books; // Show all states passed from backend logic (Available, Pending, Sold)

        // 1. Text Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(book => {
                if (searchType === 'title') return book.title.toLowerCase().includes(query);
                if (searchType === 'author') return book.author?.toLowerCase().includes(query);
                if (searchType === 'isbn') return book.isbn?.includes(query);
                return book.title.toLowerCase().includes(query); // default
            });
        }

        // 2. University Filter
        if (selectedUniversity) {
            result = result.filter(book => book.university === selectedUniversity);
        }

        // 3. Hide Sold Out (Optional, but user didn't ask to hide, just mark. We keep them visible for now)
        if (!showSold) { result = result.filter(book => !book.isSold); }

        // 4. Sorting
        result.sort((a, b) => {
            if (sortBy === 'price_low') return a.price - b.price;
            if (sortBy === 'price_high') return b.price - a.price;
            // 'newest' logic would typically use a date field, but we'll assume ID order or randomness for mock
            if (sortBy === 'newest') return b.id - a.id;
            return 0;
        });

        return result;
    }, [books, searchQuery, searchType, selectedUniversity, sortBy]);

    const displayedBooks = filteredBooks.slice(0, visibleCount);

    // Unique Universities for Dropdown
    const universities = [...new Set(books.map(b => b.university).filter(Boolean))];

    return (
        <div className="min-h-screen flex flex-col font-sans bg-brand-secondary pt-20 relative" dir="rtl">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            {/* Animated Orbs - NOW VISIBLE (Moved outside opacity-5 container) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.15, 0.25, 0.15]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] bg-brand-primary rounded-full blur-[100px]"
                />

                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 50, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] bg-brand-accent rounded-full blur-[90px]"
                />

                <motion.div
                    animate={{
                        scale: [1, 1.4, 1],
                        y: [0, -50, 0],
                        opacity: [0.05, 0.15, 0.05]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[-10%] right-[20%] w-[700px] h-[700px] bg-brand-secondary rounded-full blur-[110px] mix-blend-overlay"
                />
            </div>
            <Navbar />

            {/* Filter Header Section - Glassmorphism */}
            {/* HIDDEN ON MOBILE: Now handled by Navbar + Modal */}
            <div className={`hidden md:block sticky z-40 transition-all duration-300 ${isNavbarVisible ? 'top-20' : 'top-0'} backdrop-blur-xl bg-brand-secondary/60 border-b border-white/10 shadow-2xl`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">

                    {/* Top Row: Search & Main Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">

                        {/* Search Group */}
                        <div className="flex w-full md:w-auto flex-1 gap-2 items-center">
                            {/* Mobile Filter Trigger - REMOVED (Moved to Navbar) */}
                            {/* <button className="md:hidden ...">...</button> */}

                            {/* Search Type Propdown - Hidden on Mobile */}
                            <div className="relative hidden md:block">
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary block p-3 pr-8 outline-none backdrop-blur-md cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                    <option className="bg-brand-secondary text-white" value="title">اسم الكتاب</option>
                                    <option className="bg-brand-secondary text-white" value="author">اسم المؤلف</option>
                                    <option className="bg-brand-secondary text-white" value="isbn">ISBN</option>
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-white/50">
                                    <ChevronDown size={14} />
                                </div>
                            </div>

                            {/* Search Input */}
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <Search className="w-5 h-5 text-brand-primary" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary block w-full pr-10 p-3 outline-none placeholder:text-white/30 backdrop-blur-md transition-all hover:bg-white/10 focus:bg-white/10"
                                    placeholder={`بحث بـ ${searchType === 'title' ? 'اسم الكتاب' : searchType === 'author' ? 'اسم المؤلف' : 'ISBN'}...`}
                                />
                            </div>
                        </div>

                        {/* Filters Group (University & Sort) - Hidden on Mobile */}
                        <div className="hidden md:flex w-full md:w-auto gap-3">

                            {/* University Filter */}
                            <div className="relative flex-1 min-w-[140px]">
                                <select
                                    value={selectedUniversity}
                                    onChange={(e) => setSelectedUniversity(e.target.value)}
                                    className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary block w-full p-3 pr-4 pl-8 outline-none cursor-pointer hover:bg-white/10 transition-colors backdrop-blur-md"
                                >
                                    <option className="bg-brand-secondary text-white" value="">كل الجامعات</option>
                                    {Object.entries(UNIVERSITIES).map(([key, { nameAr }]) => (
                                        <option className="bg-brand-secondary text-white" key={key} value={key}>{nameAr}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-primary">
                                    <ChevronDown size={16} />
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div className="relative flex-1 min-w-[140px]">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary block w-full p-3 pr-4 pl-8 outline-none cursor-pointer hover:bg-white/10 transition-colors backdrop-blur-md"
                                >
                                    <option className="bg-brand-secondary text-white" value="newest">الأحدث</option>
                                    <option className="bg-brand-secondary text-white" value="price_low">الأقل سعراً</option>
                                    <option className="bg-brand-secondary text-white" value="price_high">الأعلى سعراً</option>
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-primary">
                                    <SortAsc size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(searchQuery || selectedUniversity) && (
                        <div className="flex items-center gap-2 text-xs text-brand-muted animate-in fade-in slide-in-from-top-1 px-1">
                            <span className="text-white/60">نتائج البحث: <span className="text-white font-bold">{filteredBooks.length}</span> كتاب</span>
                            {selectedUniversity && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-brand-primary/20 hover:bg-red-500/20 text-brand-primary hover:text-red-400 border border-brand-primary/30 hover:border-red-500/30 px-3 py-1 rounded-full h-auto gap-2 group transition-all"
                                    onClick={() => setSelectedUniversity('')}
                                >
                                    {getUniversityName(selectedUniversity)}
                                    <X size={12} className="group-hover:scale-110" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-8">
                {displayedBooks.length > 0 ? (
                    <>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 md:gap-6 mb-12 justify-items-center" dir="rtl">
                            {displayedBooks.map((book, index) => (
                                <ScrollCard key={book.id} index={index}>
                                    <BookCard book={book} />
                                </ScrollCard>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleCount < filteredBooks.length && (
                            <div className="flex justify-center pb-12">
                                <Button
                                    variant="secondary"
                                    size="xl"
                                    onClick={() => setVisibleCount(c => c + 30)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-12 rounded-full shadow-sm hover:shadow-md h-auto py-3"
                                >
                                    <span>عرض المزيد</span>
                                    <ChevronDown size={20} />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-brand-muted">
                        <Search size={64} className="mb-4 opacity-20" />
                        <p className="text-xl font-bold">لا توجد نتائج مطابقة لبحثك</p>
                        <Button
                            variant="link"
                            onClick={() => { setSearchQuery(''); setSelectedUniversity(''); }}
                            className="mt-4 text-brand-primary hover:underline font-normal"
                        >
                            مسح جميع الفلاتر
                        </Button>
                    </div>
                )}
            </div>

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 bg-brand-secondary/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 flex flex-col">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Filter size={20} className="text-brand-primary" />
                            تصفية متقدمة
                        </h2>
                        <button
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* 1. Search Scope */}
                        <div className="space-y-3">
                            <label className="text-brand-primary font-bold text-sm block">البحث في</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'title', label: 'العنوان' },
                                    { id: 'author', label: 'المؤلف' },
                                    { id: 'isbn', label: 'ISBN' }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSearchType(type.id)}
                                        className={`py-3 px-2 rounded-lg text-sm font-bold transition-all ${searchType === type.id
                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. University */}
                        <div className="space-y-3">
                            <label className="text-brand-primary font-bold text-sm block">الجامعة</label>
                            <select
                                value={selectedUniversity}
                                onChange={(e) => setSelectedUniversity(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-primary/50 text-right appearance-none"
                            >
                                <option className="bg-brand-secondary text-gray-400" value="">كل الجامعات</option>
                                {Object.entries(UNIVERSITIES).map(([key, { nameAr }]) => (
                                    <option className="bg-brand-secondary text-white" key={key} value={key}>{nameAr}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Sort */}
                        <div className="space-y-3">
                            <label className="text-brand-primary font-bold text-sm block">الترتيب</label>
                            <div className="space-y-2">
                                {[
                                    { id: 'newest', label: 'الأحدث' },
                                    { id: 'price_low', label: 'الأقل سعراً' },
                                    { id: 'price_high', label: 'الأعلى سعراً' }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSortBy(option.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${sortBy === option.id
                                            ? 'bg-brand-primary/10 border border-brand-primary text-brand-primary'
                                            : 'bg-white/5 border border-transparent text-gray-400'
                                            }`}
                                    >
                                        <span className="font-bold">{option.label}</span>
                                        {sortBy === option.id && <div className="w-3 h-3 rounded-full bg-brand-primary shadow-sm" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-white/10 bg-brand-secondary/50 backdrop-blur-xl">
                        <Button
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-4 rounded-xl font-bold custom-shadow text-lg"
                        >
                            إظهار النتائج ({filteredBooks.length})
                        </Button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Marketplace;
