import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, X, Slash, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthRequiredModal from './AuthRequiredModal';
import { getUniversityName } from '../constants/universities';
import { getStatusLabel } from '../constants/status';

const BookCard = ({ book }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const toggleModal = () => {
        if (!book.isSold) {
            setIsModalOpen(!isModalOpen);
        }
    };

    const handleBuyNow = (e) => {
        e.stopPropagation();
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        if (!book.isSold) {
            navigate('/checkout', { state: { book } });
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!user) {
            setShowAuthModal(true);
            return;
        }

        if (!book.isSold) {
            addToCart(book);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
            // No navigation - user stays on page
        }
    };

    return (
        <>
            {/* GRID CARD - Vertical & Compact */}
            <div
                className={`group bg-white rounded-xl pt-3 px-4 pb-4 shadow-sm transition-all duration-300 border border-transparent relative overflow-hidden w-[200px] flex-shrink-0 flex flex-col ${book.isSold ? 'opacity-75 grayscale pointer-events-none' : 'hover:shadow-xl hover:border-brand-orange/20'} `}
            >
                {/* Image - Click triggers modal */}
                <div
                    onClick={toggleModal}
                    className="cursor-pointer aspect-[3/4] bg-gray-50 rounded-lg mb-3 relative overflow-hidden ring-1 ring-black/5"
                >
                    <span className={`absolute top-2 right-2 backdrop-blur-md text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm z-10 ${book.isSold ? 'bg-gray-800 text-white' : 'bg-white/95 text-brand-orange'} `}>
                        {book.isSold ? 'تم البيع' : getStatusLabel(book.status)}
                    </span>

                    {book.image ? (
                        <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <span className="text-[10px] font-bold">PDF</span>
                        </div>
                    )}

                    {/* Sold Out Overlay */}
                    {book.isSold && (
                        <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center z-0">
                            <div className="bg-gray-800/90 text-white text-xs font-bold px-3 py-1 rounded border border-white/20 transform -rotate-12 shadow-lg">
                                تم البيع
                            </div>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    {!book.isSold && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 items-center justify-center z-20">
                            {/* Quick Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className={`text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:scale-105 ${isAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-[#C17554] hover:bg-[#a95234]'} `}
                            >
                                {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                                <span>{isAdded ? 'تمت الإضافة' : 'أضف للسلة'}</span>
                            </button>

                            {/* Quick View Label */}
                            <span className="bg-white/90 backdrop-blur text-brand-slate text-[10px] font-bold px-3 py-1 rounded-full shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                نظرة سريعة
                            </span>
                        </div>
                    )}
                </div>

                {/* Content - Detailed & Exposed */}
                <div className="flex flex-col flex-1 gap-1">
                    <h3 onClick={toggleModal} className="cursor-pointer font-bold text-sm text-brand-slate mb-1 line-clamp-2 leading-tight min-h-[2.5rem] hover:text-brand-orange transition-colors">
                        {book.title}
                    </h3>

                    <div className="text-[10px] text-gray-500 mb-2 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                            <span className="font-bold">الكاتب:</span>
                            <span className="truncate max-w-[100px]">{book.author || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold">الجامعة:</span>
                            <span className="truncate max-w-[100px]">{getUniversityName(book.university)}</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-2 border-t border-dashed border-gray-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className={`font-black text-lg ${book.isSold ? 'text-gray-400 decoration-slate-400' : 'text-brand-orange'} `}>
                                {book.price} <span className="text-[10px] text-gray-400">ر.س</span>
                            </span>
                        </div>

                        {/* Action Buttons - Equal Width */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleBuyNow}
                                disabled={book.isSold}
                                className={`flex-1 text-white text-[10px] font-bold py-2.5 px-0 rounded-xl transition shadow-sm whitespace-nowrap ${book.isSold ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-orange hover:bg-brand-orange/90'} `}
                            >
                                {book.isSold ? 'مباع' : 'شراء'}
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={book.isSold}
                                className={`flex-1 text-[#C17554] text-[10px] font-bold py-2.5 px-0 rounded-xl transition shadow-sm flex items-center justify-center gap-1 whitespace-nowrap ${book.isSold ? 'bg-gray-300 cursor-not-allowed' : (isAdded ? 'bg-[#C17554] text-black hover:bg-[#a95234]' : 'bg-brand-slate hover:bg-brand-slate/90')} `}
                            >
                                {isAdded ? <Check size={14} /> : (book.isSold ? <Slash size={14} /> : <ShoppingCart size={14} />)}
                                <span>{isAdded ? 'تمت' : (book.isSold ? '' : 'أضف للسلة')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* MODAL - Detailed Horizontal View */}
            {isModalOpen && !book.isSold && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" style={{ margin: 0 }}>
                    <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row rtl" dir="rtl">

                        <button
                            onClick={toggleModal}
                            className="absolute top-4 left-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-full md:w-5/12 bg-gray-50 relative p-6 flex items-center justify-center">
                            <div className="aspect-[3/4] w-full max-w-[220px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg overflow-hidden relative">
                                {book.image && <img src={book.image} alt={book.title} className="w-full h-full object-cover" />}
                                <span className="absolute top-4 right-4 bg-brand-orange text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                                    {getStatusLabel(book.status)}
                                </span>
                            </div>
                        </div>

                        <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-brand-slate mb-2 leading-tight">{book.title}</h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold">
                                        <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                                        <span>{getUniversityName(book.university)}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                        <span className="font-bold text-gray-500 text-sm">اسم الكتاب:</span>
                                        <span className="font-bold text-brand-slate text-sm text-left dir-ltr">{book.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                        <span className="font-bold text-gray-500 text-sm">الكاتب:</span>
                                        <span className="font-bold text-brand-slate text-sm text-left dir-ltr">{book.author || 'Unknown'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                                        <span className="font-bold text-gray-500 text-sm">ISBN:</span>
                                        <span className="font-mono font-bold text-brand-slate text-sm">{book.isbn || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-500 text-sm">الحالة:</span>
                                        <span className="font-bold text-green-600 text-sm">{getStatusLabel(book.status)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 font-bold">السعر المطلوب</span>
                                    <span className="text-3xl font-black text-brand-slate flex items-end gap-1">
                                        {book.price} <span className="text-sm font-bold text-gray-500 mb-1">ر.س</span>
                                    </span>
                                </div>
                                <div className="flex gap-3 flex-1 justify-end">
                                    <button
                                        onClick={handleBuyNow}
                                        className="bg-brand-slate hover:bg-brand-slate/90 text-[#C17554] font-bold py-3 px-8 md:px-10 rounded-xl transition-all shadow-lg shadow-brand-slate/20 flex-1 md:flex-none min-w-[140px] whitespace-nowrap"
                                    >
                                        شراء مباشر
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!user) {
                                                setShowAuthModal(true);
                                                return;
                                                // setIsModalOpen(false); // Consider closing detail modal too? Maybe not.
                                            }
                                            addToCart(book);
                                            setIsAdded(true);
                                            setTimeout(() => setIsAdded(false), 2000);
                                        }}
                                        className={`bg-[#cc8c74] hover:bg-[#b07b66] text-white font-bold py-3 px-8 md:px-10 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 min-w-[140px] whitespace-nowrap ${isAdded ? 'bg-green-600! hover:bg-green-600' : ''} `}
                                    >
                                        {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
                                        <span className="hidden sm:inline">{isAdded ? 'تمت الإضافة' : 'الإضافة للسلة'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>,
                document.body
            )}

            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                message="لشراء أو إضافة الكتب للسلة، يرجى تسجيل الدخول أو إنشاء حساب."
            />
        </>
    );
};

export default BookCard;
