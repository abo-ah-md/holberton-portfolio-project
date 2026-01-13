import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { MOCK_BOOKS_EXTENDED } from '../constants/Books';
import { getAllBooks, searchBooks } from '../services/bookService';
import { UNIVERSITIES, getUniversityName } from '../constants/universities';
import { Search, Filter, SortAsc, SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-react';

const Marketplace = () => {
    const location = useLocation();
    // State for Filter Inputs
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (location.state?.initialQuery) {
            setSearchQuery(location.state.initialQuery);
        }
    }, [location.state]);
    const [searchType, setSearchType] = useState('title'); // title, isbn, author
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // newest, price_low, price_high
    const [showSold, setShowSold] = useState(true);

    // Pagination (load more)
    const [visibleCount, setVisibleCount] = useState(30);

    // Fetch books from API
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, fetchError } = await getAllBooks();
                if (fetchError) {
                    console.error('API error:', fetchError);
                    // setBooks(MOCK_BOOKS_EXTENDED); // Disable mock data fallback to prevent UUID errors
                    setBooks([]);
                } else if (data && data.length > 0) {
                    setBooks(data); // Use ONLY real API data
                } else {
                    setBooks([]);
                }
            } catch (err) {
                console.error('Failed to fetch books:', err);
                setBooks([]);
            } finally {
                setLoading(false);
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
        // if (!showSold) { result = result.filter(book => !book.isSold); }

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
        <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl">
            <Navbar />

            {/* Filter Header Section */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">

                    {/* Top Row: Search & Main Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">

                        {/* Search Group */}
                        <div className="flex w-full md:w-auto flex-1 gap-2">
                            {/* Search Type Propdown */}
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-brand-orange focus:border-brand-orange block p-2.5 outline-none"
                            >
                                <option value="title">اسم الكتاب</option>
                                <option value="author">اسم المؤلف</option>
                                <option value="isbn">ISBN</option>
                            </select>

                            {/* Search Input */}
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <Search className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-orange focus:border-brand-orange block w-full pr-10 p-2.5 outline-none"
                                    placeholder={`بحث بـ ${searchType === 'title' ? 'اسم الكتاب' : searchType === 'author' ? 'اسم المؤلف' : 'ISBN'}...`}
                                />
                            </div>
                        </div>

                        {/* Filters Group (University & Sort) */}
                        <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0">

                            {/* University Filter */}
                            <div className="relative min-w-[150px]">
                                <select
                                    value={selectedUniversity}
                                    onChange={(e) => setSelectedUniversity(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-brand-orange focus:border-brand-orange block w-full p-2.5 pr-8 outline-none cursor-pointer hover:border-brand-orange"
                                >
                                    <option value="">كل الجامعات</option>
                                    {Object.entries(UNIVERSITIES).map(([key, { nameAr }]) => (
                                        <option key={key} value={key}>{nameAr}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-500">
                                    <ChevronDown size={16} />
                                </div>
                            </div>

                            {/* Sort Filter */}
                            <div className="relative min-w-[150px]">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-brand-orange focus:border-brand-orange block w-full p-2.5 pr-8 outline-none cursor-pointer hover:border-brand-orange"
                                >
                                    <option value="newest">الأحدث</option>
                                    <option value="price_low">الأقل سعراً</option>
                                    <option value="price_high">الأعلى سعراً</option>
                                </select>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-500">
                                    <SortAsc size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display (Optional) */}
                    {(searchQuery || selectedUniversity) && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 animate-in fade-in slide-in-from-top-1">
                            <span>نتائج البحث: {filteredBooks.length} كتاب</span>
                            {selectedUniversity && (
                                <span className="bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-red-100 hover:text-red-500 transition" onClick={() => setSelectedUniversity('')}>
                                    {getUniversityName(selectedUniversity)}
                                    <span className="font-bold">×</span>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
                {displayedBooks.length > 0 ? (
                    <>
                        <div className="flex flex-wrap justify-center gap-6 mb-12" dir="rtl">
                            {displayedBooks.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleCount < filteredBooks.length && (
                            <div className="flex justify-center pb-12">
                                <button
                                    onClick={() => setVisibleCount(c => c + 30)}
                                    className="bg-white hover:bg-gray-50 text-brand-slate border border-gray-200 font-bold py-3 px-12 rounded-full transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    <span>عرض المزيد</span>
                                    <ChevronDown size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                        <Search size={64} className="mb-4 opacity-20" />
                        <p className="text-xl font-bold">لا توجد نتائج مطابقة لبحثك</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedUniversity(''); }}
                            className="mt-4 text-brand-orange hover:underline"
                        >
                            مسح جميع الفلاتر
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Marketplace;
