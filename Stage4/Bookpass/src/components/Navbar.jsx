import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { MOCK_BOOKS_EXTENDED } from '../constants/Books';
import AuthRequiredModal from './AuthRequiredModal'; // Import Modal

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showAuthModal, setShowAuthModal] = useState(false); // Modal State
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const { user } = useAuth(); // Get user

    const handleSellClick = () => {
        if (!user) {
            setShowAuthModal(true);
            setIsMobileMenuOpen(false); // Close mobile menu if open
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
        <header className="w-full bg-[#2c3e50] text-white font-sans sticky top-0 z-50 shadow-lg" dir="rtl">
            <div className="w-full mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">

                {/* --- RIGHT SECTION: Logo in Gray Box + الرئيسية --- */}
                <div className="flex items-center gap-4">
                    {/* Logo in Gray Box */}
                    <div onClick={() => navigate('/')} className="cursor-pointer bg-[#D9D9D9] px-3 py-2 rounded-lg flex items-center justify-center" style={{ width: '4rem', height: '4rem' }}>
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Logo />
                        </div>
                    </div>

                    {/* الرئيسية Button - Next to Logo */}
                    <div className="navbar-desktop-only items-center gap-3">
                        <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 whitespace-nowrap text-sm" style={{ letterSpacing: '0.5px', padding: '6px' }}>
                            الرئيسية
                        </button>
                        <button onClick={() => scrollToSection('about-us')} className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 whitespace-nowrap text-sm" style={{ letterSpacing: '0.5px', padding: '6px' }}>
                            من نحن
                        </button>
                    </div>
                </div>

                {/* --- CENTER: Bigger Search Bar --- */}
                <div className="flex-1 max-w-3xl relative mx-2">
                    <div className="relative flex items-center bg-[#D9D9D9] overflow-hidden shadow-inner z-50" style={{ borderRadius: '6rem', padding: '6px' }}>
                        {/* Search Input - Bigger */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                const q = e.target.value;
                                setSearchQuery(q);
                                if (q.length > 0) {
                                    const filtered = MOCK_BOOKS_EXTENDED.filter(b =>
                                        b.title.toLowerCase().includes(q.toLowerCase())
                                    ).slice(0, 5);
                                    setSearchResults(filtered);
                                } else {
                                    setSearchResults([]);
                                }
                            }}
                            placeholder="ابحث باسم الكتاب"
                            className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-right text-gray-800 font-semibold placeholder-gray-600 text-sm md:text-base"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchResults([]);
                                    navigate('/marketplace', { state: { initialQuery: searchQuery } });
                                }
                            }}
                        />
                        {/* Orange Search Button */}
                        <button
                            onClick={() => {
                                setSearchResults([]);
                                navigate('/marketplace', { state: { initialQuery: searchQuery } });
                            }}
                            className="bg-[#C17554] hover:bg-[#a95234] h-full px-4 md:px-6 py-4 flex items-center justify-center transition-colors shrink-0"
                            style={{ borderRadius: '16px 16px 16px 16px', padding: '0.4rem' }}
                        >
                            <Search size={20} className="text-white" strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Active Search Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-40">
                            {searchResults.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() => {
                                        setSearchQuery(book.title);
                                        setSearchResults([]);
                                        navigate('/marketplace', { state: { initialQuery: book.title } });
                                    }}
                                    className="px-6 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none flex items-center justify-between transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                            {book.image && <img src={book.image} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-gray-800 font-bold text-sm">{book.title}</span>
                                            <span className="text-gray-500 text-xs">{book.author}</span>
                                        </div>
                                    </div>
                                    <span className="text-brand-orange font-bold text-sm">{book.price} ر.س</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- LEFT SECTION: Action Buttons & User --- */}
                <div className="flex items-center gap-3">
                    {/* Navigation Buttons - Desktop */}
                    <div className="navbar-desktop-only items-center gap-3">
                        {/* عرض كتابك Button - UPDATED */}
                        <button onClick={handleSellClick} className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 whitespace-nowrap text-sm" style={{ padding: '6px', letterSpacing: '0.5px' }}>
                            عرض كتابك
                        </button>

                        {/* طلباتي Button with Cart Icon */}
                        <button onClick={() => navigate('/cart')} className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 whitespace-nowrap text-sm" style={{ padding: '6px', letterSpacing: '0.5px' }}>
                            <span>طلباتي</span>
                            <div className="relative">
                                <ShoppingCart size={18} strokeWidth={2.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* User Profile Icon */}
                    <div onClick={() => navigate('/login')} className="navbar-desktop-user items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 md:w-11 md:h-11 border-2 border-white rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-lg" style={{ margin: '6px' }}>
                            <User size={22} className="text-white" strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="navbar-mobile-only items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white hover:text-[#C17554] transition-colors p-2"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="navbar-mobile-only bg-[#2c3e50] border-t border-gray-700 absolute w-full top-full right-0 shadow-2xl p-6 z-50 text-right animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col gap-6 items-center w-full">
                        {/* Mobile Navigation Links */}
                        <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-4 rounded-xl transition-all text-center text-xl" style={{ letterSpacing: '0.5px' }}>
                            الرئيسية
                        </button>
                        <button onClick={() => { scrollToSection('about-us'); setIsMobileMenuOpen(false); }} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-4 rounded-xl transition-all text-center text-xl" style={{ letterSpacing: '0.5px' }}>
                            من نحن
                        </button>
                        {/* عرض كتابك - UPDATED */}
                        <button onClick={handleSellClick} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-4 rounded-xl transition-all text-center text-xl" style={{ letterSpacing: '0.5px' }}>
                            عرض كتابك
                        </button>
                        <button onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-4 rounded-xl transition-all text-xl" style={{ letterSpacing: '0.5px' }}>
                            <span>طلباتي</span>
                            <div className="relative">
                                <ShoppingCart size={24} strokeWidth={2.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </button>

                        {/* User Profile */}
                        <div onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 p-4 bg-white/5 rounded-xl mt-2 cursor-pointer border border-white/10">
                            <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center bg-white/10">
                                <User size={20} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-xl">ملفي الشخصي</span>
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
