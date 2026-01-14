import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUniversityName } from '../constants/universities';
import { getStatusLabel } from '../constants/status';

const ReviewBookCard = ({ book, onAccept }) => {
    const [selectedStatus, setSelectedStatus] = React.useState(book.status || 'pending');
    const [showConditionDropdown, setShowConditionDropdown] = React.useState(false);

    const conditions = ['excellent', 'very good', 'good', 'poor'];

    const handleConditionSelect = (status) => {
        setSelectedStatus(status);
        setShowConditionDropdown(false);
    };

    return (
        <div className="flex flex-col w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500">
            {/* Top Section: Image & Basic Info */}
            <div className="p-6 flex gap-6 border-b border-gray-50">
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

                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded-lg">
                            <span className="text-gray-400 font-bold ml-2">المؤلف</span>
                            <span className="text-brand-slate font-black truncate max-w-[120px]">{book.author}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded-lg">
                            <span className="text-gray-400 font-bold ml-2">ISBN</span>
                            <span className="text-brand-slate font-mono font-bold text-xs">{book.isbn}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Controls */}
            <div className="p-4 bg-gray-50/50 flex flex-col gap-4">
                {/* Condition Selector */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <button
                            onClick={() => setShowConditionDropdown(!showConditionDropdown)}
                            className={`w-full bg-white border font-black py-3 px-4 rounded-2xl flex items-center justify-between transition-all shadow-sm group/btn ${selectedStatus === 'pending' ? 'border-amber-200 text-amber-600 italic' : 'border-gray-200 text-brand-slate hover:border-brand-orange'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${selectedStatus === 'excellent' ? 'bg-emerald-500' :
                                    selectedStatus === 'very good' ? 'bg-lime-500' :
                                        selectedStatus === 'good' ? 'bg-yellow-500' :
                                            selectedStatus === 'poor' ? 'bg-orange-500' : 'bg-amber-400 animate-pulse'
                                    }`}></div>
                                {selectedStatus === 'pending' ? 'بانتظار التقييم' : getStatusLabel(selectedStatus)}
                            </span>
                            <ChevronDown size={18} className={`transition-transform duration-300 ${showConditionDropdown ? 'rotate-180 text-brand-orange' : 'text-gray-400'}`} />
                        </button>

                        <AnimatePresence>
                            {showConditionDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-2 space-y-1 text-right"
                                >
                                    {conditions.map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleConditionSelect(status)}
                                            className={`w-full text-right px-4 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-between group/item
                                                ${selectedStatus === status
                                                    ? 'bg-brand-orange text-white'
                                                    : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <span>{getStatusLabel(status)}</span>
                                            {selectedStatus === status && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Accept Button */}
                    <motion.button
                        whileHover={selectedStatus !== 'pending' ? { scale: 1.05 } : {}}
                        whileTap={selectedStatus !== 'pending' ? { scale: 0.95 } : {}}
                        disabled={selectedStatus === 'pending'}
                        onClick={() => onAccept && onAccept({ ...book, status: selectedStatus })}
                        className={`font-black px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 ${selectedStatus === 'pending'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-brand-orange text-white hover:shadow-orange-200'
                            }`}
                    >
                        <span>إدراج</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default ReviewBookCard;
