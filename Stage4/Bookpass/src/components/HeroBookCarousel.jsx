import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAllBooks } from '../services/bookService';
import { MOCK_BOOKS } from '../constants/Books';
import ImageWithLoader from './ImageWithLoader';

// A continuously scrolling vertical marquee of books for the Hero section
const HeroBookCarousel = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await getAllBooks();
                let bookList = data && data.length > 0 ? data : MOCK_BOOKS;

                // Sort by newest and take top 10
                bookList = [...bookList].reverse().slice(0, 10);

                // Ensure we have enough items for the loop, but don't over-duplicate
                // 15 items is usually enough for a vertical screen column
                if (bookList.length < 15) {
                    bookList = [...bookList, ...bookList];
                    if (bookList.length < 15) {
                        bookList = [...bookList, ...bookList];
                    }
                }

                // Cap at 20 to prevent rendering hundreds of images
                if (bookList.length > 20) {
                    bookList = bookList.slice(0, 20);
                }

                setBooks(bookList);
            } catch (err) {
                console.error("Hero fetch failed", err);
                setBooks([...MOCK_BOOKS, ...MOCK_BOOKS].slice(0, 20));
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden flex justify-center items-center">
            {/* Gradient Overlay for Fade Effect at Top/Bottom */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#C17554]/10 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#C17554]/10 to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Container - Diagonally Rotated & Increased Grid Density */}
            <div className="w-[200%] -ml-[50%] h-[150%] -mt-[10%] flex gap-6 rotate-12 justify-center items-center">

                {/* Column 1 - Downward */}
                <motion.div
                    className="flex flex-col gap-6"
                    animate={{ y: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 40, // Slower for smoother feel
                        ease: "linear",
                    }}
                >
                    {books.map((book, index) => (
                        <BookSlot key={`col1-${index}`} book={book} index={index} priority={index < 4} />
                    ))}
                </motion.div>

                {/* Column 2 - Upward (Reverse flow) */}
                <motion.div
                    className="flex flex-col gap-6 mt-12"
                    animate={{ y: [-1000, 0] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 45,
                        ease: "linear",
                    }}
                >
                    {books.map((book, index) => (
                        <BookSlot key={`col2-${index}`} book={book} index={index} priority={index < 4} />
                    ))}
                </motion.div>

                {/* Column 3 - Downward */}
                <motion.div
                    className="flex flex-col gap-6"
                    animate={{ y: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 38,
                        ease: "linear",
                    }}
                >
                    {books.map((book, index) => (
                        <BookSlot key={`col3-${index}`} book={book} index={index} priority={index < 4} />
                    ))}
                </motion.div>

                {/* Column 4 - Upward */}
                <motion.div className="flex flex-col gap-6 mt-24" animate={{ y: [-1000, 0] }} transition={{ repeat: Infinity, repeatType: "loop", duration: 42, ease: "linear" }}>
                    {books.map((book, index) => <BookSlot key={`col4-${index}`} book={book} index={index} priority={false} />)}
                </motion.div>

                {/* Column 5 - Downward */}
                <motion.div className="flex flex-col gap-6" animate={{ y: [0, -1000] }} transition={{ repeat: Infinity, repeatType: "loop", duration: 35, ease: "linear" }}>
                    {books.map((book, index) => <BookSlot key={`col5-${index}`} book={book} index={index} priority={false} />)}
                </motion.div>
            </div>
        </div>
    );
};

// Sub-component for the "Slot" effect
const BookSlot = ({ book, index, priority }) => (
    <div className="relative group bg-black/5 p-2 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] backdrop-blur-sm overflow-hidden transform transition-transform hover:scale-105">



        <div className="w-[120px] md:w-[140px] aspect-[2/3] relative rounded-xl overflow-hidden shadow-lg bg-gray-100">
            <ImageWithLoader
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
                priority={priority}
            />
        </div>
    </div>
);

export default HeroBookCarousel;

