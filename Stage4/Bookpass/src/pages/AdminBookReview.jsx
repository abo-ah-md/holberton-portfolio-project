
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReviewBookCard from '../components/ReviewBookCard';
import SoldBookCard from '../components/SoldBookCard';
import { getStorePendingBooks, getStoreSoldBooks, reviewBook, markBookAsPicked } from '../services/bookService';

const AdminBookReview = () => {
    const [booksToReview, setBooksToReview] = React.useState([]);
    const [soldBooks, setSoldBooks] = React.useState([]); // New state for Sold Books
    const [activeTab, setActiveTab] = React.useState('pending'); // 'pending' or 'sold'
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'pending') {
                    const { data } = await getStorePendingBooks();
                    if (data) {
                        // Ensure unique items and strict filtering
                        const uniqueBooks = Array.from(new Map(data.map(book => [book.id, book])).values());
                        setBooksToReview(uniqueBooks);
                    }
                } else {
                    const { data } = await getStoreSoldBooks();
                    if (data) {
                        // Ensure unique items and strict filtering
                        const uniqueBooks = Array.from(new Map(data.map(book => [book.id, book])).values());
                        setSoldBooks(uniqueBooks);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch books", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const handleAccept = async (updatedBook) => {
        try {
            console.log("Accepting book:", updatedBook.title, "Condition:", updatedBook.status);

            const { data, error } = await reviewBook(updatedBook.id, updatedBook.status);

            if (error) {
                console.error("Failed to approve book:", error);
                alert("فشل في قبول الكتاب: " + error);
                return;
            }

            // Remove the accepted book from the list
            setBooksToReview(prev => prev.filter(b => b.id !== updatedBook.id));

        } catch (err) {
            console.error("Error in handleAccept:", err);
            alert("حدث خطأ غير متوقع");
        }
    };

    const handlePicked = async (bookId) => {
        try {
            if (!confirm("هل أنت متأكد من تسليم الكتاب للمشتري؟")) return;

            const { data, error } = await markBookAsPicked(bookId);

            if (error) {
                console.error("Failed to mark book as picked:", error);
                alert("فشل في تحديث حالة الكتاب: " + error);
                return;
            }

            // Remove the picked book from the sold list
            setSoldBooks(prev => prev.filter(b => b.id !== bookId));

        } catch (err) {
            console.error("Error in handlePicked:", err);
            alert("حدث خطأ غير متوقع");
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#3A4958]" dir="rtl">
            <Navbar />

            {/* Header Section */}
            <div className="relative bg-[#2c3e50] h-[220px] flex items-center justify-end px-10 md:px-20 overflow-hidden shadow-xl z-20">
                {/* Banner/Ribbon */}
                <div className="relative z-10 mr-0 md:mr-10">
                    <div
                        className="relative bg-[#c8876f] text-white py-6 px-16 pr-24 shadow-2xl flex items-center"
                        style={{
                            // Arrow shape pointing right (visually left in RTL context if we think about reading direction, but conventionally "pointing right" usually means arrow head on right side >)
                            // The user said "Arrow shape pointing right".
                            // Let's assume standard right-pointing arrow:  |______>
                            clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)'
                        }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
                            تقييم الكتب
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-12">

                {/* Tabs */}
                <div className="flex justify-center mb-8 gap-4">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${activeTab === 'pending'
                            ? 'bg-white text-[#C17554] shadow-lg scale-105'
                            : 'bg-[#C17554]/20 text-white hover:bg-[#C17554]/40'
                            }`}
                    >
                        كتب بانتظار المراجعة ({booksToReview.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('sold')}
                        className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${activeTab === 'sold'
                            ? 'bg-white text-[#C17554] shadow-lg scale-105'
                            : 'bg-[#C17554]/20 text-white hover:bg-[#C17554]/40'
                            }`}
                    >
                        كتب مباعة (بانتظار التسليم) ({soldBooks.length})
                    </button>
                </div>

                {/* Content Container */}
                <div className="bg-gradient-to-b from-[#C17554] to-[#3A4958] p-8 md:p-12 shadow-2xl overflow-hidden"
                    style={{
                        borderTopLeftRadius: '80px',
                        borderBottomLeftRadius: '80px',
                        borderTopRightRadius: '12px',
                        borderBottomRightRadius: '12px',
                    }}
                >
                    {activeTab === 'pending' ? (
                        booksToReview.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {booksToReview.map((book) => (
                                    <ReviewBookCard
                                        key={book.id}
                                        book={book}
                                        onAccept={handleAccept}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-white/80">
                                <span className="text-2xl font-bold mb-2">لا توجد كتب للمراجعة</span>
                                <p>جميع الكتب تمت مراجعتها.</p>
                            </div>
                        )
                    ) : (
                        soldBooks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {soldBooks.map((book) => (
                                    <SoldBookCard
                                        key={book.id}
                                        book={book}
                                        onPicked={handlePicked}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-white/80">
                                <span className="text-2xl font-bold mb-2">لا توجد كتب مباعة بانتظار التسليم</span>
                            </div>
                        )
                    )}
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default AdminBookReview;

