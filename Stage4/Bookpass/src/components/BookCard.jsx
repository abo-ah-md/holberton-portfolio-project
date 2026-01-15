import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, X, Slash, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthRequiredModal from './AuthRequiredModal';
import { getUniversityName } from '../constants/universities';
import { getStatusLabel } from '../constants/status';

import ImageWithLoader from './ImageWithLoader';

const BookCard = ({ book }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const isPending = book.listingStatus === 'PENDING';

    const toggleModal = () => {
        // Allow opening modal for Pending books, but keep Sold books restricted if that was the intent.
        // User asked: "unselectable to buy ... but it can be open in the modal view" for Pending.
        // Existing code blocked Sold. We'll keep Sold blocked for now unless requested otherwise, 
        // but ensure Pending is NOT blocked.
        if (!book.isSold || isPending) {
            setIsModalOpen(!isModalOpen);
        }
    };

    const handleBuyNow = (e) => {
        e.stopPropagation();
        if (isPending || book.isSold) return; // Disable for Pending/Sold

        if (!user) {
            setShowAuthModal(true);
            return;
        }
        navigate('/checkout', { state: { book } });
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isPending || book.isSold) return; // Disable for Pending/Sold

        if (!user) {
            setShowAuthModal(true);
            return;
        }

        addToCart(book);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const getStatusBadge = () => {
        if (book.isSold) return { text: 'تم البيع', color: 'bg-gray-100 text-gray-500 border border-gray-200' };
        if (isPending) return { text: 'قريبا', color: 'bg-blue-50 text-blue-600 border border-blue-100' };

        // Gradient logic for status
        const status = book.status ? book.status.toLowerCase() : '';
        if (status === 'excellent' || status === 'ممتاز') return { text: getStatusLabel(book.status), color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' };
        if (status === 'very good' || status === 'جيد جداً') return { text: getStatusLabel(book.status), color: 'bg-lime-50 text-lime-600 border border-lime-100' };
        if (status === 'good' || status === 'جيد') return { text: getStatusLabel(book.status), color: 'bg-yellow-50 text-yellow-600 border border-yellow-100' };
        if (status === 'poor' || status === 'acceptable' || status === 'مقبول') return { text: getStatusLabel(book.status), color: 'bg-orange-50 text-orange-600 border border-orange-100' };

        return {
            text: getStatusLabel(book.status),
            color: 'bg-gray-50 text-gray-600 border border-gray-100'
        };
    };

    const statusBadge = getStatusBadge();

    return (
        <>
            {/* GRID CARD - Vertical & Compact */}
            <div
                className={`group bg-white rounded-xl pt-4 px-5 pb-5 shadow-sm transition-all duration-300 border border-transparent relative overflow-hidden w-[240px] flex-shrink-0 flex flex-col 
                ${book.isSold ? 'opacity-75 grayscale pointer-events-none' : 'hover:shadow-xl hover:border-brand-orange/20'} 
                ${isPending ? 'opacity-90' : ''}`}
            >
                {/* Image - Click triggers modal */}
                <div
                    onClick={toggleModal}
                    className={`cursor-pointer aspect-[3/4] bg-gray-50 rounded-lg mb-3 relative overflow-hidden ring-1 ring-black/5 ${isPending ? 'cursor-pointer' : ''}`}
                >
                    <span className={`absolute top-2.5 right-2.5 backdrop-blur-md text-xs px-3 py-1.5 rounded-lg font-bold shadow-md z-10 ${statusBadge.color} `}>
                        {statusBadge.text}
                    </span>

                    {book.image ? (
                        <ImageWithLoader
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <span className="text-xs font-bold">PDF</span>
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

                    {/* Pending Overlay */}
                    {isPending && (
                        <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center z-0">
                            <div className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded border border-white/20 shadow-lg">
                                قريبا
                            </div>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    {!book.isSold && !isPending && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 items-center justify-center z-20">
                            {/* Quick Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className={`text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:scale-105 ${isAdded ? 'bg-green-400 hover:bg-green-500' : 'bg-brand-orange hover:bg-brand-orange/90'} `}
                            >
                                {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                                <span>{isAdded ? 'تمت الإضافة' : 'أضف للسلة'}</span>
                            </button>

                            {/* Quick View Label */}
                            <span className="bg-white/90 backdrop-blur text-brand-slate text-xs font-bold px-3 py-1 rounded-full shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                نظرة سريعة
                            </span>
                        </div>
                    )}

                    {/* Hover Overlay for Pending - just View */}
                    {isPending && (
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 items-center justify-center z-20">
                            <span className="bg-white/90 backdrop-blur text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                نظرة سريعة
                            </span>
                        </div>
                    )}
                </div>

                {/* Content - Detailed & Exposed */}
                <div className="flex flex-col flex-1 gap-2 pt-1">
                    <h3 onClick={toggleModal} className="cursor-pointer font-bold text-sm text-brand-slate mb-0.5 line-clamp-2 leading-snug min-h-[2.5rem] hover:text-brand-orange transition-colors">
                        {book.title}
                    </h3>

                    <div className="text-xs text-gray-500 mb-2 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold">الكاتب:</span>
                            <span className="truncate max-w-[160px]">{book.author || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold">الجامعة:</span>
                            <span className="truncate max-w-[160px]">{getUniversityName(book.university)}</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className={`font-black text-lg ${book.isSold || isPending ? 'text-gray-400 decoration-slate-400' : 'text-brand-orange'} `}>
                                {book.price} <span className="text-xs text-gray-400">ر.س</span>
                            </span>
                        </div>

                        {/* Action Buttons - Equal Width */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleBuyNow}
                                disabled={book.isSold || isPending}
                                className={`flex-1 text-white text-sm font-bold py-3.5 px-4 rounded-xl transition shadow-sm whitespace-nowrap min-h-[44px] 
                                    ${book.isSold || isPending ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-orange hover:bg-brand-orange/90'} `}
                            >
                                {book.isSold ? 'مباع' : (isPending ? 'قريبا' : 'شراء')}
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={book.isSold || isPending}
                                className={`flex-1 text-white text-sm font-bold py-3.5 px-4 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[44px] 
                                    ${book.isSold || isPending ? 'bg-gray-300 cursor-not-allowed' : (isAdded ? 'bg-green-400 hover:bg-green-500' : 'bg-brand-orange hover:bg-brand-orange/90')} `}
                            >
                                {isAdded ? <Check size={14} /> : (book.isSold ? <Slash size={14} /> : (isPending ? <Clock size={14} /> : <ShoppingCart size={14} />))}
                                <span>{isAdded ? 'تمت' : (book.isSold ? '' : (isPending ? '' : 'سلة'))}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* MODAL - Detailed Horizontal View */}
            {isModalOpen && (!book.isSold || isPending) && createPortal(
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
                                {book.image && (
                                    <ImageWithLoader
                                        src={book.image}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                        priority={true} // Modal image should load eagerly
                                    />
                                )}
                                <span className={`absolute top-4 right-4 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md ${statusBadge.color}`}>
                                    {statusBadge.text}
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
                                        <span className={`font-bold text-sm px-2 py-0.5 rounded-md ${isPending ? 'text-blue-600 bg-blue-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                            {isPending ? 'قريبا' : getStatusLabel(book.status)}
                                        </span>
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
                                <div className="flex gap-3 flex-1">
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={isPending}
                                        className={`flex-1 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-brand-slate/20 whitespace-nowrap text-center
                                            ${isPending ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-brand-slate hover:bg-brand-slate/90 text-[#C17554]'}`}
                                    >
                                        {isPending ? 'قريبا' : 'شراء مباشر'}
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isPending}
                                        className={`flex-1 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap 
                                            ${isPending ? 'bg-gray-300 cursor-not-allowed' : (isAdded ? 'bg-green-400 hover:bg-green-500' : 'bg-brand-orange hover:bg-brand-orange/90')}`}
                                    >
                                        {isAdded ? <Check size={20} /> : (isPending ? <Clock size={20} /> : <ShoppingCart size={20} />)}
                                        <span>{isAdded ? 'تمت الإضافة' : (isPending ? 'غير متاح' : 'الإضافة للسلة')}</span>
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
