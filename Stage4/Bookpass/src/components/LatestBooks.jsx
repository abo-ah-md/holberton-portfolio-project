import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import BookCard from './BookCard';
import { getAllBooks } from '../services/bookService';
import { MOCK_BOOKS } from '../constants/Books';

// Timeout helper for fetch
const timeoutPromise = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));

const LatestBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Embla Carousel with Autoplay Plugin
    // Added restartDelay to keep it going smoothly
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
        dragFree: true
    }, [Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })]);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                // Race between fetch and 5s timeout
                const { data, error } = await Promise.race([
                    getAllBooks(),
                    timeoutPromise(5000)
                ]).catch((e) => ({ error: e.message || 'Timeout' }));

                if (error || !data || data.length === 0) {
                    console.warn("Using mock data due to API error or empty data");
                    setBooks(MOCK_BOOKS || []);
                } else {
                    let sorted = [...data].reverse().slice(0, 10);
                    // Ensure enough items for smooth looping by duplicating if needed
                    if (sorted.length > 0 && sorted.length < 8) {
                        sorted = [...sorted, ...sorted, ...sorted]; // Triple it if very few
                    } else if (sorted.length < 12) {
                        sorted = [...sorted, ...sorted]; // Double it if medium few
                    }
                    setBooks(sorted);
                }
            } catch (err) {
                console.error("Fetch failed, using mock data", err);
                setBooks(MOCK_BOOKS || []);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleNavigateToMarketplace = () => {
        navigate('/marketplace');
    };

    return (
        <section className="py-20 relative z-10 w-full overflow-hidden" style={{ background: 'linear-gradient(180deg, #C17554 0%, #3A4958 100%)', marginTop: '-1px' }}>
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">

                <div className="flex flex-col items-center mb-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-md">
                        أحدث الكتب المضافة
                    </h2>
                    <p className="text-white/80 max-w-xl text-sm md:text-base">
                        تصفح أحدث الكتب التي تم إضافتها إلى مكتبتنا. كتب مميزة بانتظارك.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-white" size={48} />
                    </div>
                ) : (
                    <div className="relative">
                        {/* Carousel Container */}
                        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef} dir="rtl">
                            <div className="flex -ml-4 py-8">
                                {books.map((book, index) => (
                                    // Using index in key because we might have duplicates for looping
                                    <div key={`${book.id}-${index}`} className="flex-[0_0_auto] min-w-0 pl-4 basis-[260px] md:basis-[280px]">
                                        <div className="transform transition-transform duration-300 hover:-translate-y-2">
                                            <BookCard book={book} darkBackground={true} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* More Button */}
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={handleNavigateToMarketplace}
                                className="bg-[#C17554] hover:bg-[#a05e40] text-white border border-white/20 font-bold py-3 px-12 rounded-full transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 group"
                            >
                                <span>المزيد من الكتب</span>
                                <ChevronLeft size={20} className="transform transition-transform group-hover:-translate-x-1" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestBooks;
