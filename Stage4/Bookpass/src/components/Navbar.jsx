import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import Logo from '../components/Logo';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="w-full bg-[#2c3e50] text-white font-sans sticky top-0 z-50 shadow-lg" dir="rtl">
            <div className="w-full mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">

                {/* --- RIGHT SECTION: Logo in Gray Box + الرئيسية --- */}
                <div className="flex items-center gap-4">
                    {/* Logo in Gray Box */}
                    <div className="bg-[#D9D9D9] px-3 py-2 rounded-lg flex items-center justify-center" style={{ width: '4rem', height: '4rem' }}>
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Logo />
                        </div>
                    </div>

                    {/* الرئيسية Button - Next to Logo */}
                    <div className="navbar-desktop-only items-center">
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 whitespace-nowrap text-sm" style={{ letterSpacing: '0.5px', padding: '6px' }}>
                            الرئيسية
                        </button>
                    </div>
                </div>

                {/* --- CENTER: Bigger Search Bar --- */}
                <div className="flex-1 max-w-3xl navbar-search-bar">
                    <div className="relative flex items-center bg-[#D9D9D9] overflow-hidden shadow-inner" style={{ borderRadius: '6rem', padding: '6px' }}>
                        {/* Search Input - Bigger */}
                        <input
                            type="text"
                            placeholder="ابحث باسم الكتاب"
                            className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-right text-gray-800 font-semibold placeholder-gray-600 text-base"
                        />
                        {/* Orange Search Button */}
                        <button className="bg-[#C17554] hover:bg-[#a95234] h-full px-6 py-4 flex items-center justify-center transition-colors shrink-0" style={{ borderRadius: '16px 16px 16px 16px', padding: '0.4rem' }}>
                            <Search size={20} className="text-white" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* --- LEFT SECTION: Action Buttons & User --- */}
                <div className="flex items-center gap-3">
                    {/* Navigation Buttons - Desktop */}
                    <div className="navbar-desktop-only items-center gap-3">
                        {/* عرض كتابك Button */}
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 whitespace-nowrap text-sm" style={{ padding: '6px', letterSpacing: '0.5px' }}>
                            عرض كتابك
                        </button>

                        {/* طلباتي Button with Cart Icon */}
                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 whitespace-nowrap text-sm" style={{ padding: '6px', letterSpacing: '0.5px' }}>
                            <span>طلباتي</span>
                            <ShoppingCart size={18} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* User Profile Icon */}
                    <div className="navbar-desktop-user items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
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
                    <div className="flex flex-col gap-4">
                        {/* Mobile Search Bar */}
                        <div className="flex items-center w-full bg-[#D9D9D9] rounded-2xl overflow-hidden shadow-inner mb-2">
                            <input
                                type="text"
                                placeholder="ابحث باسم الكتاب"
                                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-right text-gray-800 font-semibold placeholder-gray-600 text-sm"
                            />
                            <button className="bg-[#C17554] h-full px-4 py-3 flex items-center justify-center rounded-l-2xl">
                                <Search size={18} className="text-white" strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Mobile Navigation Links */}
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-lg transition-all text-right" style={{ letterSpacing: '0.5px' }}>
                            الرئيسية
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-lg transition-all text-right" style={{ letterSpacing: '0.5px' }}>
                            عرض كتابك
                        </button>
                        <button className="flex items-center justify-end gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-lg transition-all" style={{ letterSpacing: '0.5px' }}>
                            <span>طلباتي</span>
                            <ShoppingCart size={18} strokeWidth={2.5} />
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg mt-2">
                            <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center bg-white/10">
                                <User size={20} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold">ملفي الشخصي</span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
