import React from 'react';
import { ShoppingCart } from 'lucide-react';

const BookCard = ({ book }) => {
    return (
        <div className="group bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-brand-orange/20 relative overflow-hidden w-full max-w-[180px]">

            {/* Image Container - Smaller */}
            <div className="aspect-[3/4] bg-gray-50 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden ring-1 ring-black/5 group-hover:ring-brand-orange/20 transition-all">

                {/* Status Badge - Floating */}
                <span className="absolute top-2 right-2 bg-white/95 backdrop-blur-md text-[9px] text-brand-orange px-2 py-0.5 rounded-full font-bold shadow-sm border border-brand-orange/10 z-10">
                    {book.status}
                </span>

                {/* Book Image or Placeholder */}
                {book.image ? (
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-gray-300">
                        <div className="w-10 h-14 border-2 border-dashed border-gray-200 rounded flex items-center justify-center group-hover:border-brand-orange/30 transition-colors">
                            <span className="text-[10px] font-bold">PDF</span>
                        </div>
                        <div className="text-[8px] font-bold uppercase tracking-wider opacity-50">No Preview</div>
                    </div>
                )}

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                    <button className="bg-white text-brand-orange text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg hover:bg-brand-orange hover:text-white transition-colors">
                        نظرة سريعة
                    </button>
                </div>
            </div>

            {/* Content - More Compact */}
            <div className="px-0.5">
                <h3 className="font-bold text-sm text-brand-slate mb-1 line-clamp-2 min-h-[2.5rem] leading-tight group-hover:text-brand-orange transition-colors">
                    {book.title}
                </h3>
                <p className="text-[10px] text-gray-400 mb-2 font-semibold flex items-center gap-1">
                    <span className="w-1 h-1 bg-brand-orange rounded-full"></span>
                    {book.university}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100">
                    <span className="text-brand-orange font-black text-base">{book.price} <span className="text-[10px] font-bold text-gray-400">ر.س</span></span>
                    <button className="w-8 h-8 rounded-full bg-brand-slate text-white flex items-center justify-center hover:bg-brand-orange hover:scale-110 transition-all shadow-md">
                        <ShoppingCart size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
