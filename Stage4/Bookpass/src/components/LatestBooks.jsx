import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import BookCard from './BookCard';
import { MOCK_BOOKS_EXTENDED } from '../constants/Books';

const LatestBooks = () => {
    const [visibleCount, setVisibleCount] = useState(15);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 15);
    };

    return (
        <section className="py-20 relative z-10 w-full" style={{ background: 'linear-gradient(180deg, #C17554 0%, #3A4958 100%)' }}>
            <div className="w-full">
                {/* The Container User Requested */}
                <div className="w-full p-8 md:p-12 relative flex flex-col items-center">

                    {/* Grid */}
                    {/* Flex Row Layout */}
                    <div className="flex flex-wrap justify-center gap-6 px-4 mb-12" dir="rtl">
                        {MOCK_BOOKS_EXTENDED.slice(0, visibleCount).map((book) => (
                            <BookCard key={book.id} book={book} darkBackground={true} />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < MOCK_BOOKS_EXTENDED.length && (
                        <button
                            onClick={handleLoadMore}
                            className="bg-[#C17554] hover:bg-[#a05e40] text-white border border-white/20 font-bold py-3 px-12 rounded-full transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                        >
                            <span>المزيد</span>
                            <ChevronDown size={20} />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LatestBooks;
