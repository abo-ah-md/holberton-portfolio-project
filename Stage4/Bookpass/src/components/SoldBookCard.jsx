import React, { useState } from 'react';
import { CheckCircle, Phone, User, ShoppingBag, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageViewer from './ImageViewer';
import { getUniversityName } from '../constants/universities';

const SoldBookCard = ({ book, onPicked }) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    return (
        <div className="flex flex-col w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-border group hover:shadow-2xl transition-all duration-500">
            {/* Top Section: Image & Basic Info */}
            <div className="p-6 flex gap-6 border-b border-brand-background flex-1">
                {/* Book Image */}
                <div
                    onClick={() => book.image && setIsViewerOpen(true)}
                    className={`w-28 h-36 flex-shrink-0 relative group/image ${book.image ? 'cursor-pointer' : ''}`}
                >
                    <div className="absolute inset-0 bg-brand-primary/10 rounded-xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                    {book.image ? (
                        <>
                            <img
                                src={book.image}
                                alt={book.title}
                                className="w-full h-full object-cover rounded-xl shadow-lg relative z-10 transform group-hover:scale-105 transition-transform"
                            />
                            {/* Zoom Hint */}
                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/30 rounded-xl backdrop-blur-[1px]">
                                <span className="bg-white/90 text-brand-secondary text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <ZoomIn size={12} />
                                    تكبير
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-brand-background rounded-xl flex items-center justify-center text-brand-muted font-bold relative z-10 shadow-md text-xs">
                            لا توجد صورة
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1 text-right">
                    <div className="space-y-1">
                        <div className="inline-flex px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full tracking-widest uppercase">
                            {getUniversityName(book.university)}
                        </div>
                        <h3 className="text-xl font-black text-brand-secondary line-clamp-2 leading-tight group-hover:text-brand-primary transition-colors">
                            {book.title}
                        </h3>
                    </div>

                    {/* Buyer Info Section */}
                    <div className="mt-4 bg-brand-background p-3 rounded-2xl border border-brand-border space-y-2">
                        <div className="flex items-center justify-end gap-2 text-brand-secondary font-black text-xs">
                            <span>المشتري: {book.buyerName || 'غير متوفر'}</span>
                            <User size={14} className="text-brand-primary" />
                        </div>
                        <div className="flex items-center justify-end gap-2 text-brand-muted text-xs font-bold font-mono dir-ltr">
                            <span>{book.buyerPhone || 'N/A'}</span>
                            <Phone size={14} className="text-brand-primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Actions */}
            <div className="p-4 bg-brand-background/50 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-brand-muted font-bold">المبلغ المحصل</span>
                    <span className="text-2xl font-black text-brand-primary">{book.price} ر.س</span>
                </div>

                {onPicked && (
                    <button
                        type="button"
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (isProcessing) return;

                            if (!isConfirming) {
                                setIsConfirming(true);
                                // Auto-reset confirmation after 3 seconds if not clicked
                                setTimeout(() => setIsConfirming(false), 3000);
                                return;
                            }

                            // Second click: Execute
                            setIsProcessing(true);
                            try {
                                await onPicked(book.id);
                            } finally {
                                setIsProcessing(false);
                                setIsConfirming(false);
                            }
                        }}
                        className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 relative z-30 
                            ${isProcessing ? 'bg-brand-muted cursor-not-allowed opacity-75' :
                                isConfirming ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' :
                                    'bg-brand-primary hover:bg-brand-accent text-white hover:shadow-brand-primary/20 active:scale-95 cursor-pointer'}`}
                    >
                        {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : isConfirming ? (
                            <CheckCircle size={20} className="animate-bounce" />
                        ) : (
                            <CheckCircle size={20} />
                        )}
                        <span>
                            {isProcessing ? 'جاري المعالجة...' :
                                isConfirming ? 'اضغط مرة أخرى للتأكيد' :
                                    'تأكيد التسليم للمشتري'}
                        </span>
                    </button>
                )}
            </div>
            {/* Image Viewer */}
            <ImageViewer
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                imageSrc={book.image}
                altText={book.title}
            />
        </div>
    );
};

export default SoldBookCard;
