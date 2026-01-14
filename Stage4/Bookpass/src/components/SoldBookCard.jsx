import React from 'react';
import { CheckCircle, Phone, User, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUniversityName } from '../constants/universities';

const SoldBookCard = ({ book, onPicked }) => {
    return (
        <div className="flex flex-col w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500">
            {/* Top Section: Image & Basic Info */}
            <div className="p-6 flex gap-6 border-b border-gray-50 flex-1">
                {/* Book Image */}
                <div className="w-28 h-36 flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-brand-orange/10 rounded-xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                    {book.image ? (
                        <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-xl shadow-lg relative z-10 transform group-hover:scale-105 transition-transform"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold relative z-10 shadow-md text-xs">
                            لا توجد صورة
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1 text-right">
                    <div className="space-y-1">
                        <div className="inline-flex px-3 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-black rounded-full tracking-widest uppercase">
                            {getUniversityName(book.university)}
                        </div>
                        <h3 className="text-xl font-black text-brand-slate line-clamp-2 leading-tight group-hover:text-brand-orange transition-colors">
                            {book.title}
                        </h3>
                    </div>

                    {/* Buyer Info Section */}
                    <div className="mt-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2">
                        <div className="flex items-center justify-end gap-2 text-brand-slate font-black text-xs">
                            <span>المشتري: {book.buyerName || 'غير متوفر'}</span>
                            <User size={14} className="text-brand-orange" />
                        </div>
                        <div className="flex items-center justify-end gap-2 text-gray-500 text-xs font-bold font-mono dir-ltr">
                            <span>{book.buyerPhone || 'N/A'}</span>
                            <Phone size={14} className="text-brand-orange" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Actions */}
            <div className="p-4 bg-gray-50/50 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-gray-400 font-bold">المبلغ المحصل</span>
                    <span className="text-2xl font-black text-brand-orange">{book.price} ر.س</span>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPicked && onPicked(book.id)}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-3"
                >
                    <CheckCircle size={20} />
                    <span>تأكيد التسليم للمشتري</span>
                </motion.button>
            </div>
        </div>
    );
};

export default SoldBookCard;
