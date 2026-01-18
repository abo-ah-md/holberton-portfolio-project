import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, BookOpen, Info, LayoutDashboard, Plus, LogOut, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import SaudiRiyalIcon from "../icons/SaudiRiyalIcon";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getAllBooks } from "../../services/bookService";
import AuthRequiredModal from '../features/AuthRequiredModal';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [books, setBooks] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    // Smart Navbar State
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();
    const { user, signOut } = useAuth();
    const isReviewer = user?.role === 'BOOKSTORE';
    const [isProfileOpen, setIsProfileOpen] = useState(false);

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

    const handleSellClick = (e) => {
        if (!user) {
            e.preventDefault(); // Prevent navigation if not logged in
            setShowAuthModal(true);
            setIsMobileMenuOpen(false);
        } else {
            // Let the Link handle navigation
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
        <>
            {/* Screen Dimming Overlay - appears when search is focused */}
            {isSearchFocused && !isReviewer && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
                    onClick={() => setIsSearchFocused(false)}
                />
            )}

            <header
                className={`w-full bg-brand-secondary text-white font-sans fixed top-0 left-0 right-0 z-50 shadow-lg transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
                    }`}
                dir="rtl"
            >
                <div className="w-full mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">

                    {/* --- RIGHT SECTION: Logo & Compact Search --- */}
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <Link to={isReviewer ? '/admin/review' : '/'} className="cursor-pointer hover:opacity-90 transition-opacity">
                            <div className="w-6 flex items-center justify-center">
                                <Logo />
                            </div>
                        </Link>

                        {/* Compact Search Bar - Hidden for Reviewer */}
                        {!isReviewer && (
                            <div className={`relative hidden md:block transition-all duration-300 ${isSearchFocused ? 'w-96' : 'w-64'}`}>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => {
                                        // Delay blur to allow clicking on search results
                                        setTimeout(() => setIsSearchFocused(false), 200);
                                    }}
                                    onChange={(e) => {
                                        const q = e.target.value;
                                        setSearchQuery(q);
                                        if (q.length > 0) {
                                            const filtered = books.filter(b =>
                                                b.title.toLowerCase().includes(q.toLowerCase()) &&
                                                !b.isSold &&
                                                b.listingStatus !== 'PENDING' &&
                                                b.status !== 'PENDING' &&
                                                b.status !== 'pending'
                                            ).slice(0, 5);
                                            setSearchResults(filtered);
                                        } else {
                                            setSearchResults([]);
                                        }
                                    }}
                                    placeholder="ابحث عن كتاب..."
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-right text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white/15 transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setSearchResults([]);
                                            setIsSearchFocused(false);
                                            navigate('/marketplace', { state: { initialQuery: searchQuery } });
                                        }
                                    }}
                                />
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                {/* Search Results Dropdown */}
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden z-40">
                                        {searchResults.map((book) => (
                                            <Link
                                                key={book.id}
                                                to="/marketplace"
                                                state={{ initialQuery: book.title }}
                                                onClick={() => {
                                                    setSearchQuery(book.title);
                                                    setSearchResults([]);
                                                    setIsSearchFocused(false);
                                                }}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none flex items-center justify-between transition-colors block"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                        {book.image && <img src={book.image} alt="" className="w-full h-full object-cover" />}
                                                    </div>
                                                    <span className="text-gray-800 font-medium text-sm truncate max-w-[150px]">{book.title}</span>
                                                </div>
                                                <span className="text-brand-primary font-bold text-xs whitespace-nowrap flex items-center gap-1">
                                                    {book.price} <SaudiRiyalIcon size={12} />
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* --- CENTER SECTION: Icon Navigation Items - Hidden for Reviewer --- */}
                    {!isReviewer && (
                        <nav className="hidden md:flex items-center gap-1">
                            {/* Home */}


                            {/* Books */}
                            <Link
                                to="/marketplace"
                                className={`group flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/marketplace' ? 'border-b-2 border-brand-primary' : ''
                                    }`}
                            >
                                <BookOpen size={20} className="text-white group-hover:text-brand-primary transition-colors" />
                                <span className="text-xs text-white group-hover:text-brand-primary transition-colors">الكتب</span>
                            </Link>

                            {/* About */}
                            <button
                                onClick={() => scrollToSection('about-us')}
                                className="group flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200"
                            >
                                <Info size={20} className="text-white group-hover:text-brand-primary transition-colors" />
                                <span className="text-xs text-white group-hover:text-brand-primary transition-colors">من نحن</span>
                            </button>
                        </nav>
                    )}

                    {/* --- LEFT SECTION: Action Buttons & Profile --- */}
                    <div className="flex items-center gap-1">

                        {/* Desktop Actions Group - Hidden for Reviewer */}
                        {!isReviewer && (
                            <div className="hidden md:flex items-center gap-1">


                                {/* Sell Button */}
                                <Link
                                    to="/sell"
                                    onClick={handleSellClick}
                                    className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-brand-primary/20 hover:bg-brand-primary/30 transition-all duration-200"
                                >
                                    <Plus size={20} className="text-brand-primary" />
                                    <span className="text-xs text-brand-primary font-medium">عرض كتابك</span>
                                </Link>

                                {/* Cart */}
                                <Link
                                    to="/cart"
                                    className={`group flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 relative ${location.pathname === '/cart' ? 'border-b-2 border-brand-primary' : ''
                                        }`}
                                >
                                    <div className="relative">
                                        <ShoppingCart size={20} className="text-white group-hover:text-brand-primary transition-colors" strokeWidth={2} />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full border border-brand-secondary">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-white group-hover:text-brand-primary transition-colors">السلة</span>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Search Toggle */}
                        {!isReviewer && (
                            <button
                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                className="md:hidden text-white hover:text-brand-primary transition-colors p-2"
                            >
                                <Search size={22} />
                            </button>
                        )}

                        {/* User Profile / Login - HIDDEN ON MOBILE */}
                        <div className="hidden md:flex items-center">
                            {isReviewer ? (
                                <>
                                    {/* Static Profile Info for Reviewer */}
                                    <div className="flex items-center gap-2 p-1.5 rounded-lg border border-transparent">
                                        <div className="w-9 h-9 border border-gray-400 rounded-full flex items-center justify-center bg-brand-secondary overflow-hidden shrink-0">
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
                                    <Link
                                        to="/logout"
                                        className="bg-red-500/20 hover:bg-red-500/30 text-red-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-all border border-red-500/30 flex items-center gap-2"
                                    >
                                        <span>خروج</span>
                                    </Link>
                                </>
                            ) : (
                                user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 ${location.pathname.startsWith('/profile') ? 'border-b-2 border-brand-primary' : ''}`}
                                        >
                                            <div className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center bg-brand-secondary overflow-hidden">
                                                {user?.profilePicture ? (
                                                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={16} className="text-gray-300" strokeWidth={2} />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-white">
                                                <span>{user.firstName || 'حسابي'}</span>
                                                <ChevronDown size={10} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isProfileOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                                                    <div className="p-2 space-y-1">
                                                        <Link
                                                            to="/profile"
                                                            onClick={() => setIsProfileOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                        >
                                                            <User size={16} />
                                                            <span>الملف الشخصي</span>
                                                        </Link>

                                                        {user?.role === 'ADMIN' && (
                                                            <Link
                                                                to="/admin/dashboard"
                                                                onClick={() => setIsProfileOpen(false)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-brand-primary hover:bg-brand-primary/5 font-bold rounded-lg transition-colors"
                                                            >
                                                                <LayoutDashboard size={16} />
                                                                <span>لوحة التحكم</span>
                                                            </Link>
                                                        )}

                                                        <div className="h-px bg-gray-100 my-1"></div>

                                                        <button
                                                            onClick={async () => {
                                                                setIsProfileOpen(false);
                                                                await signOut();
                                                                navigate('/');
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <LogOut size={16} />
                                                            <span>تسجيل الخروج</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        to="/login"
                                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 ${location.pathname === '/login' ? 'border-b-2 border-brand-primary' : ''}`}
                                    >
                                        <div className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center bg-brand-secondary overflow-hidden">
                                            <User size={16} className="text-gray-300" strokeWidth={2} />
                                        </div>
                                        <span className="text-xs text-white">تسجيل</span>
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Mobile Menu Toggle - Hidden for Reviewer */}
                        {!isReviewer && (
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden text-white hover:text-brand-primary transition-colors p-1"
                            >
                                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Only Search Bar (Expandable) */}
                {!isReviewer && (
                    <div className={`md:hidden px-4 overflow-hidden transition-all duration-300 ease-in-out ${isMobileSearchOpen ? 'max-h-16 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
                        }`}>
                        <div className="relative flex items-center bg-white rounded-lg overflow-hidden h-10 focus-within:ring-2 focus-within:ring-brand-primary transition-all shadow-sm">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث عن كتاب..."
                                className="flex-1 bg-white border-none outline-none px-4 text-right text-gray-800 placeholder-gray-500 text-sm h-full w-full"
                            />
                            <button className="bg-gray-100 text-gray-600 px-5 h-full flex items-center justify-center">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>
                )}


                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-brand-secondary border-t border-gray-700/50 absolute w-full top-full right-0 shadow-2xl p-4 z-50 text-right animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col gap-2 items-center w-full">
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-3 text-brand-primary hover:bg-white/5 font-bold px-4 py-3 rounded-lg transition-all block">
                                    <LayoutDashboard size={20} />
                                    <span>لوحة التحكم</span>
                                </Link>
                            )}

                            <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-3 text-white hover:text-brand-primary hover:bg-white/5 font-bold px-4 py-3 rounded-lg transition-all block">
                                <BookOpen size={20} />
                                <span>الكتب</span>
                            </Link>
                            <button onClick={() => { scrollToSection('about-us'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 text-white hover:text-brand-primary hover:bg-white/5 font-bold px-4 py-3 rounded-lg transition-all">
                                <Info size={20} />
                                <span>من نحن</span>
                            </button>

                            <div className="w-full h-px bg-gray-700 my-2"></div>

                            <Link to="/sell" onClick={handleSellClick} className="w-full flex items-center justify-center gap-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-4 py-3 rounded-lg transition-all shadow-md block">
                                <Plus size={20} />
                                <span>عرض كتابك</span>
                            </Link>
                            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-3 text-white hover:text-brand-primary hover:bg-white/5 font-bold px-4 py-3 rounded-lg transition-all block">
                                <div className="relative">
                                    <ShoppingCart size={20} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span>السلة</span>
                            </Link>

                            <div className="w-full h-px bg-gray-700 my-2"></div>

                            <Link to={user ? '/profile' : '/login'} onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors block">
                                <div className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center bg-brand-secondary overflow-hidden">
                                    {user?.profilePicture ? (
                                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={16} className="text-gray-300" strokeWidth={2} />
                                    )}
                                </div>
                                <span className="text-white font-bold">{user ? 'حسابي' : 'تسجيل الدخول'}</span>
                            </Link>
                        </div>
                    </div>
                )}

                <AuthRequiredModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    message="لعرض كتابك للبيع، يرجى تسجيل الدخول أو إنشاء حساب."
                />
            </header>
        </>
    );
};

export default Navbar;
