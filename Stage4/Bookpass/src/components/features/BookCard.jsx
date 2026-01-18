import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, X, Slash, Check, Clock, ZoomIn, Plus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AuthRequiredModal from './AuthRequiredModal';
import ImageViewer from '../ui/ImageViewer';
import { getUniversityName } from '../../constants/universities';
import { getStatusLabel } from '../../constants/status';

import ImageWithLoader from '../ui/ImageWithLoader';
import SaudiRiyalIcon from "../icons/SaudiRiyalIcon";

const BookCard = ({ book }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();



    // Check both listingStatus and status for "PENDING" to ensure we catch all cases
    // Also ensure not sold - Sold takes precedence
    const isPending = !book.isSold && (book.listingStatus === 'PENDING' || book.status === 'PENDING' || book.status === 'pending');

    const toggleModal = () => {
        // Allow opening modal for Pending books, but keep Sold books restricted if that was the intent.
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
        if (book.isSold) return { text: 'تم البيع', color: 'bg-brand-background text-brand-muted border border-brand-border' };
        // Changed Pending color to Amber/Yellow for "Coming Soon" vibe
        if (isPending) return { text: 'قريبا', color: 'bg-yellow-50 text-yellow-600 border border-yellow-100' };

        // Gradient logic for status
        const status = book.status ? book.status.toLowerCase() : '';
        if (status === 'excellent' || status === 'ممتاز') return { text: getStatusLabel(book.status), color: 'bg-emerald-50 text-emerald-600 border border-emerald-100' };
        if (status === 'very good' || status === 'جيد جداً') return { text: getStatusLabel(book.status), color: 'bg-lime-50 text-lime-600 border border-lime-100' };
        if (status === 'good' || status === 'جيد') return { text: getStatusLabel(book.status), color: 'bg-yellow-50 text-yellow-600 border border-yellow-100' };
        if (status === 'poor' || status === 'acceptable' || status === 'مقبول') return { text: getStatusLabel(book.status), color: 'bg-orange-50 text-orange-600 border border-orange-100' };

        return {
            text: getStatusLabel(book.status),
            color: 'bg-brand-background text-brand-muted border border-brand-border'
        };
    };

    const statusBadge = getStatusBadge();

    return (
        <>
            {/* GRID CARD - Vertical & Compact */}
            <div
                className={`group bg-white rounded-xl pt-4 px-5 pb-5 shadow-sm transition-all duration-300 border border-transparent relative overflow-hidden w-full h-[520px] flex-shrink-0 flex flex-col 
                ${book.isSold ? 'opacity-75 grayscale pointer-events-none' : 'hover:shadow-xl hover:border-brand-primary/20'} 
                ${isPending ? 'relative' : ''} `}
            >
                {/* Image - Click triggers modal */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (book.image) {
                            setIsViewerOpen(true);
                        } else {
                            toggleModal();
                        }
                    }}
                    className={`cursor-pointer flex-1 min-h-0 basis-0 bg-brand-background rounded-lg mb-3 relative overflow-hidden ring-1 ring-black/5 ${isPending ? 'cursor-pointer' : ''} `}
                >
                    <span className={`absolute top-2.5 right-2.5 backdrop-blur-md text-xs px-3 py-1.5 rounded-lg font-bold shadow-md z-10 ${statusBadge.color} `}>
                        {statusBadge.text}
                    </span>

                    {book.image ? (
                        <ImageWithLoader
                            src={book.image}
                            alt={book.title}
                            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPending ? 'grayscale' : ''} `}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-brand-muted">
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

                    {/* Shimmer Overlay for Pending - Locked look */}
                    {isPending && (
                        <>
                            <style>{`
@keyframes gradient-xy {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.shimmer-bg {
    background: linear-gradient(135deg, #3A4958, #8FA2B2, #C17554, #3A4958);
    background-size: 400% 400%;
    animation: gradient-xy 8s ease infinite;
}
`}</style>
                            <div className="absolute inset-0 shimmer-bg opacity-90 flex flex-col items-center justify-center z-10 transition-all duration-500">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full mb-2 shadow-xl">
                                    <Clock size={24} className="text-white" />
                                </div>
                                <span className="text-white font-bold text-lg drop-shadow-md tracking-wide">قريبا</span>
                            </div>
                        </>
                    )}




                    {/* Zoom Hint Overlay */}
                    {!book.isSold && !isPending && book.image && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex flex-col gap-2 items-center justify-center z-20 pointer-events-none">
                            <span className="bg-white/90 backdrop-blur text-brand-secondary text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <ZoomIn size={14} />
                                عرض الصورة
                            </span>
                        </div>
                    )}



                    {/* Hover Overlay for Pending - just View */}
                    {/* This overlay is now redundant as the shimmer overlay covers it and the CTA buttons are removed */}
                    {/* {isPending && (
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 items-center justify-center z-20">
                            <span className="bg-white/90 backdrop-blur text-[#D97706] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                نظرة سريعة
                            </span>
                        </div>
                    )} */}
                </div>

                {/* Content - Detailed & Exposed */}
                <div
                    onClick={toggleModal}
                    className="flex flex-col flex-1 gap-2 pt-1 cursor-pointer"
                >
                    <h3 className="font-bold text-sm text-brand-slate mb-0.5 leading-snug hover:text-brand-orange transition-colors">
                        {book.title}
                    </h3>

                    <div className="text-xs text-gray-500 mb-2 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold">الكاتب:</span>
                            <span>{book.author || "غير معروف"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold">الجامعة:</span>
                            <span>{getUniversityName(book.university)}</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className={`font-black text-lg ${book.isSold || isPending ? 'text-brand-muted decoration-slate-400' : 'text-brand-primary'} flex items-center gap-1`}>
                                {book.price} <SaudiRiyalIcon size={14} className={book.isSold || isPending ? 'text-brand-muted' : 'text-brand-primary'} />
                            </span>
                        </div>

                        {/* Action Buttons - Equal Width */}
                        {isPending ? (
                            <div className="w-full bg-gray-100 text-gray-400 font-bold text-sm py-3 rounded-xl text-center flex items-center justify-center gap-2 border border-gray-200">
                                <Clock size={16} />
                                <span>قريبا في المتجر</span>
                            </div>
                        ) : book.isSold ? (
                            <div className="w-full bg-gray-100 text-gray-400 font-bold text-sm py-3 rounded-xl text-center flex items-center justify-center gap-2 border border-gray-200">
                                <Slash size={16} />
                                <span>مباع</span>
                            </div>
                        ) : (user && (user.email === book.sellerId || user.id === book.sellerId)) ? (
                            <div className="w-full relative overflow-hidden text-white font-bold text-sm py-3 rounded-xl text-center flex items-center justify-center gap-2 shadow-md">
                                <style>{`
@keyframes gradient-xy {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.shimmer-btn {
    background: linear-gradient(135deg, #C17554, #E09F85, #C17554);
    background-size: 200% 200%;
    animation: gradient-xy 3s ease infinite;
}
`}</style>
                                <div className="absolute inset-0 shimmer-btn"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    <Check size={18} />
                                    تم عرض الكتاب
                                </span>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    to={`/checkout?bookId=${book.id}`}
                                    state={{ book }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!user) {
                                            e.preventDefault();
                                            setShowAuthModal(true);
                                        }
                                    }}
                                    className={`flex-1 text-white text-sm font-bold py-3.5 px-4 rounded-xl transition shadow-sm whitespace-nowrap min-h-[44px] bg-brand-primary hover:bg-brand-primary/90 flex items-center justify-center`}
                                >
                                    شراء
                                </Link>
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-[50px] text-sm font-bold py-3.5 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[44px] border-2 ${isAdded ? 'bg-brand-primary border-brand-primary text-white hover:bg-brand-primary/90' : 'bg-transparent border-brand-primary text-brand-primary hover:bg-brand-primary/5'} `}
                                    title={isAdded ? "تمت الإضافة للسلة" : "أضف للسلة"}
                                >
                                    {isAdded ? (
                                        <Check size={18} />
                                    ) : (
                                        <div className="relative">
                                            <ShoppingCart size={18} />
                                            <Plus size={10} strokeWidth={4} className="absolute -top-1.5 -right-1.5" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* MODAL - Detailed Horizontal View */}
            {
                isModalOpen && (!book.isSold || isPending) && createPortal(
                    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" style={{ margin: 0 }}>
                        <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row rtl max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible" dir="rtl">

                            <button
                                onClick={toggleModal}
                                className="absolute top-4 left-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-full md:w-5/12 bg-brand-background relative p-4 md:p-6 flex items-center justify-center shrink-0">
                                <div className="aspect-[3/4] w-[160px] md:w-full md:max-w-[220px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg overflow-hidden relative">
                                    {book.image && (
                                        <ImageWithLoader
                                            src={book.image}
                                            alt={book.title}
                                            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPending ? 'grayscale' : ''} `}
                                            priority={true} // Modal image should load eagerly
                                        />
                                    )}
                                    <span className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-bold shadow-md ${statusBadge.color} `}>
                                        {statusBadge.text}
                                    </span>

                                    {/* Shimmer Overlay for Pending - Locked look */}
                                    {isPending && (
                                        <div className="absolute inset-0 shimmer-bg opacity-90 flex flex-col items-center justify-center z-10 transition-all duration-500">
                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full mb-2 shadow-xl">
                                                <Clock size={24} className="text-white" />
                                            </div>
                                            <span className="text-white font-bold text-lg drop-shadow-md tracking-wide">قريبا</span>
                                        </div>
                                    )}


                                </div>
                            </div>

                            <div className="w-full md:w-7/12 p-5 md:p-8 flex flex-col justify-between">
                                <div className="space-y-4 md:space-y-6">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black text-brand-secondary mb-2 leading-tight">{book.title}</h2>
                                        <div className="flex items-center gap-2 text-sm text-brand-muted font-semibold">
                                            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                            <span>{getUniversityName(book.university)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex justify-between items-center pb-2 border-b border-brand-border/60">
                                            <span className="font-bold text-brand-muted text-sm">اسم الكتاب:</span>
                                            <span className="font-bold text-brand-secondary text-sm text-left dir-ltr">{book.title}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-brand-border/60">
                                            <span className="font-bold text-brand-muted text-sm">الكاتب:</span>
                                            <span className="font-bold text-brand-secondary text-sm text-left dir-ltr">{book.author || 'غير معروف'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-brand-border/60">
                                            <span className="font-bold text-brand-muted text-sm">رقم ISBN:</span>
                                            <span className="font-mono font-bold text-brand-secondary text-sm">{book.isbn || 'غير متوفر'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-brand-muted text-sm">الحالة:</span>
                                            <span className={`font-bold text-sm px-2 py-0.5 rounded-md ${isPending ? 'text-[#D97706] bg-[#FEF3C7]' : 'text-emerald-600 bg-emerald-50'} `}>
                                                {isPending ? 'قريبا' : getStatusLabel(book.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 md:mt-8 flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-brand-muted font-bold">السعر المطلوب</span>
                                        <span className="text-2xl md:text-3xl font-black text-brand-secondary flex items-center gap-1">
                                            {book.price} <SaudiRiyalIcon size={20} className="text-brand-secondary" />
                                        </span>
                                    </div>

                                    {isPending ? (
                                        <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-center justify-center gap-3">
                                            <Clock className="text-gray-400" size={24} />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-600">هذا الكتاب غير متاح حالياً</span>
                                                <span className="text-xs text-gray-400">سيتم توفيره قريباً في المتجر</span>
                                            </div>
                                        </div>
                                    ) : book.isSold ? (
                                        <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-center justify-center gap-3">
                                            <Slash className="text-gray-400" size={24} />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-600">هذا الكتاب مباع</span>
                                                <span className="text-xs text-gray-400">نأسف، هذا الكتاب لم يعد متاحاً</span>
                                            </div>
                                        </div>
                                    ) : (user && (user.email === book.sellerId || user.id === book.sellerId)) ? (
                                        <div className="flex-1 relative overflow-hidden text-white font-bold py-3.5 px-6 rounded-xl text-center flex items-center justify-center gap-3 shadow-lg">
                                            <div className="absolute inset-0 shimmer-btn"></div>
                                            <span className="relative z-10 flex items-center gap-2 text-lg">
                                                <Check size={24} />
                                                تم عرض الكتاب
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 md:gap-3 flex-1">
                                            <Link
                                                to={`/checkout?bookId=${book.id}`}
                                                state={{ book }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!user) {
                                                        e.preventDefault();
                                                        setShowAuthModal(true);
                                                    }
                                                }}
                                                className={`flex-1 font-bold py-3 px-4 md:py-3.5 md:px-6 rounded-xl transition-all shadow-lg shadow-brand-secondary/20 whitespace-nowrap text-center text-sm md:text-base bg-brand-secondary hover:bg-brand-secondary/90 text-white flex items-center justify-center`}
                                            >
                                                شراء مباشر
                                            </Link>
                                            <button
                                                onClick={handleAddToCart}
                                                className={`flex-1 font-bold py-3 px-4 md:py-3.5 md:px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base ${isAdded ? 'bg-brand-primary hover:bg-brand-primary/90 text-white' : 'bg-brand-primary hover:bg-brand-primary/90 text-white'} `}
                                            >
                                                {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
                                                <span className="hidden md:inline">{isAdded ? 'تمت الإضافة' : 'الإضافة للسلة'}</span>
                                                <span className="md:hidden">{isAdded ? 'تمت' : 'سلة'}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>,
                    document.body
                )
            }

            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                message="لشراء أو إضافة الكتب للسلة، يرجى تسجيل الدخول أو إنشاء حساب."
            />

            <ImageViewer
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                imageSrc={book.image}
                altText={book.title}
            />
        </>
    );
};

export default BookCard;
