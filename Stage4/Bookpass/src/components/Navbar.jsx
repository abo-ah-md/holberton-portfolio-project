import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getAllBooks } from '../services/bookService';
import AuthRequiredModal from './AuthRequiredModal';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [books, setBooks] = useState([]);

    // Smart Navbar State
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const navigate = useNavigate();
    const { cartCount } = useCart();
    const { user } = useAuth();
    const isReviewer = user?.role === 'BOOKSTORE';

    // Fetch books on mount
    useEffect(() => {
        if (!isReviewer) { // Don't fetch books for reviewer in Navbar if search is hidden
            const fetchBooks = async () => {
                const { data, error } = await getAllBooks();
                if (!error && data) {
                    setBooks(data);
                }
            };
            fetchBooks();
        }
    }, [isReviewer]);

    // Scroll Handler for Hide/Show Behavior
    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling DOWN -> Hide
                setIsVisible(false);
                setIsMobileMenuOpen(false); // Close mobile menu on scroll down
            } else {
                // Scrolling UP -> Show
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    const handleSellClick = () => {
        if (!user) {
            setShowAuthModal(true);
            setIsMobileMenuOpen(false);
        } else {
            navigate('/sell');
            setIsMobileMenuOpen(false);
        }
    };

    const scrollToSection = (id) => {
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={`w-full bg-[#2c3e50] text-white font-sans fixed top-0 left-0 right-0 z-50 shadow-lg transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
            dir="rtl"
        >
            <div className="w-full mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">

                {/* --- RIGHT SECTION: Logo & Main Navigation --- */}
                <div className="flex items-center gap-8">
                    {/* Logo - Transparent (Light Mode) */}
                    <div onClick={() => navigate(isReviewer ? '/admin/review' : '/')} className="cursor-pointer hover:opacity-90 transition-opacity">
                        <div className="w-6 flex items-center justify-center">
                            <Logo />
                        </div>
                    </div>

                    {/* Desktop Navigation Links - Hidden for Reviewer */}
                    {!isReviewer && (
                        <nav className="hidden md:flex items-center gap-6">
                            {user?.role === 'ADMIN' && (
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="text-brand-orange hover:text-[#a95234] font-bold text-sm lg:text-base transition-colors duration-200"
                                >
                                    لوحة التحكم
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/')}
                                className="text-white hover:text-[#C17554] font-bold text-sm lg:text-base transition-colors duration-200"
                            >
                                الرئيسية
                            </button>
                            <button
                                onClick={() => navigate('/marketplace')}
                                className="text-white hover:text-[#C17554] font-bold text-sm lg:text-base transition-colors duration-200"
                            >
                                الكتب
                            </button>
                            <button
                                onClick={() => scrollToSection('about-us')}
                                className="text-white hover:text-[#C17554] font-bold text-sm lg:text-base transition-colors duration-200"
                            >
                                من نحن
                            </button>
                        </nav>
                    )}
                </div>

                {/* --- CENTER SECTION: Compact Search Bar - Hidden for Reviewer --- */}
                {!isReviewer && (
                    <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
                        <div className="relative flex items-center bg-white rounded-lg overflow-hidden h-10 focus-within:ring-2 focus-within:ring-[#C17554] transition-all">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    const q = e.target.value;
                                    setSearchQuery(q);
                                    if (q.length > 0) {
                                        const filtered = books.filter(b =>
                                            b.title.toLowerCase().includes(q.toLowerCase())
                                        ).slice(0, 5);
                                        setSearchResults(filtered);
                                    } else {
                                        setSearchResults([]);
                                    }
                                }}
                                placeholder="ابحث عن كتاب..."
                                className="flex-1 bg-white border-none outline-none px-4 text-right text-gray-800 placeholder-gray-500 text-sm h-full"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setSearchResults([]);
                                        navigate('/marketplace', { state: { initialQuery: searchQuery } });
                                    }
                                }}
                            />
                            {/* Visual Divider */}
                            <div className="h-6 w-px bg-gray-200 my-auto"></div>

                            <button
                                onClick={() => {
                                    setSearchResults([]);
                                    navigate('/marketplace', { state: { initialQuery: searchQuery } });
                                }}
                                className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 h-full flex items-center justify-center transition-colors"
                            >
                                <Search size={18} />
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden z-40">
                                {searchResults.map((book) => (
                                    <div
                                        key={book.id}
                                        onClick={() => {
                                            setSearchQuery(book.title);
                                            setSearchResults([]);
                                            navigate('/marketplace', { state: { initialQuery: book.title } });
                                        }}
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none flex items-center justify-between transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                {book.image && <img src={book.image} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                            <span className="text-gray-800 font-medium text-sm truncate max-w-[150px]">{book.title}</span>
                                        </div>
                                        <span className="text-[#C17554] font-bold text-xs whitespace-nowrap">{book.price} ر.س</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- LEFT SECTION: User Actions --- */}
                <div className="flex items-center gap-4">

                    {/* Desktop Actions Group - Hidden for Reviewer */}
                    {!isReviewer && (
                        <div className="hidden md:flex items-center gap-3">
                            {/* Sell Button - Defined Primary Action */}
                            <button
                                onClick={handleSellClick}
                                className="bg-[#C17554] hover:bg-[#a95234] text-white font-bold px-5 py-2 rounded-lg transition-colors text-sm shadow-sm"
                            >
                                عرض كتابك
                            </button>

                            {/* My Requests (Link style) */}
                            <button
                                onClick={() => navigate('/cart')}
                                className="flex items-center gap-2 text-white hover:text-[#C17554] transition-colors duration-200 px-2"
                            >
                                <div className="relative">
                                    <ShoppingCart size={22} strokeWidth={2} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#C17554] text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#2c3e50]">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="font-medium text-sm hidden lg:inline">طلباتي</span>
                            </button>
                        </div>
                    )}

                    {/* User Profile / Login - clear label */}
                    {/* User Profile / Login */}
                    {isReviewer ? (
                        <>
                            {/* Static Profile Info for Reviewer */}
                            <div className="flex items-center gap-2 p-1.5 rounded-lg border border-transparent">
                                <div className="w-9 h-9 border border-gray-400 rounded-full flex items-center justify-center bg-[#2c3e50] overflow-hidden shrink-0">
                                    {user?.profilePicture ? (
                                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={18} className="text-gray-300" strokeWidth={2} />
                                    )}
                                </div>
                                <div className="flex flex-col text-right hidden sm:flex">
                                    <span className="text-xs text-gray-400 font-normal leading-tight">مرحباً بك</span>
                                    <span className="text-sm font-bold text-white leading-tight">
                                        {user ? user.firstName || 'المراجع' : 'المراجع'}
                                    </span>
                                </div>
                            </div>

                            {/* Logout Button for Reviewer */}
                            <button
                                onClick={() => navigate('/logout')}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-all border border-red-500/30 flex items-center gap-2"
                            >
                                <span>خروج</span>
                            </button>
                        </>
                    ) : (
                        <div
                            onClick={() => navigate(user ? '/profile' : '/login')}
                            className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1.5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                        >
                            <div className="w-9 h-9 border border-gray-400 rounded-full flex items-center justify-center bg-[#2c3e50] overflow-hidden shrink-0">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={18} className="text-gray-300" strokeWidth={2} />
                                )}
                            </div>
                            <div className="flex flex-col text-right hidden sm:flex">
                                <span className="text-xs text-gray-400 font-normal leading-tight">مرحباً بك</span>
                                <span className="text-sm font-bold text-white leading-tight">
                                    {user ? user.firstName || 'حسابي' : 'تسجيل الدخول'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu Toggle - Hidden for Reviewer (simplified usage) */}
                    {!isReviewer && (
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-white hover:text-[#C17554] transition-colors p-1"
                        >
                            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Only Search Bar (Visible below header on mobile) */}
            {!isReviewer && (
                <div className={`md:hidden px-4 pb-3 w-full transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
                    }`}>
                    <div className="relative flex items-center bg-white rounded-lg overflow-hidden h-10 focus-within:ring-2 focus-within:ring-[#C17554] transition-all shadow-sm">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ابحث عن كتاب..."
                            className="flex-1 bg-white border-none outline-none px-4 text-right text-gray-800 placeholder-gray-500 text-sm h-full w-full"
                        />
                        <button className="bg-gray-100 text-gray-600 px-4 h-full flex items-center justify-center">
                            <Search size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#2c3e50] border-t border-gray-700/50 absolute w-full top-full right-0 shadow-2xl p-4 z-50 text-right animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col gap-2 items-center w-full">
                        {user?.role === 'ADMIN' && (
                            <button onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }} className="w-full text-brand-orange hover:text-[#a95234] hover:bg-white/5 font-bold px-4 py-3 rounded-lg transition-all text-center">
                                لوحة التحكم
                            </button>
                        )}
                        <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="w-full text-white hover:text-[#C17554] hover:bg-white/5 font-bold px-4 py-3 rounded-lg transition-all text-center">
                            الرئيسية
                        </button>
                        <button onClick={() => { navigate('/marketplace'); setIsMobileMenuOpen(false); }} className="w-full text-white hover:text-[#C17554] hover:bg-white/5 font-bold px-4 py-3 rounded-lg transition-all text-center">
                            الكتب
                        </button>
                        <button onClick={() => { scrollToSection('about-us'); setIsMobileMenuOpen(false); }} className="w-full text-white hover:text-[#C17554] hover:bg-white/5 font-bold px-4 py-3 rounded-lg transition-all text-center">
                            من نحن
                        </button>

                        <div className="w-full h-px bg-gray-700 my-2"></div>

                        <button onClick={handleSellClick} className="w-full bg-[#C17554] hover:bg-[#a95234] text-white font-bold px-4 py-3 rounded-lg transition-all text-center shadow-md">
                            عرض كتابك
                        </button>
                        <button onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 text-white hover:text-[#C17554] hover:bg-white/5 font-bold px-4 py-3 rounded-lg transition-all">
                            <span>طلباتي ({cartCount})</span>
                        </button>

                        <div className="w-full h-px bg-gray-700 my-2"></div>

                        <div onClick={() => { navigate(user ? '/profile' : '/login'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                            <div className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center bg-[#2c3e50] overflow-hidden">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={16} className="text-gray-300" strokeWidth={2} />
                                )}
                            </div>
                            <span className="text-white font-bold">{user ? 'حسابي' : 'تسجيل الدخول'}</span>
                        </div>
                    </div>
                </div>
            )}

            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                message="لعرض كتابك للبيع، يرجى تسجيل الدخول أو إنشاء حساب."
            />
        </header>
    );
};

export default Navbar;
