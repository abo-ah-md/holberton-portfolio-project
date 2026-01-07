import React from 'react';
import { getUniversityName } from '../constants/universities';
import { CheckCircle, Phone, User } from 'lucide-react';

const SoldBookCard = ({ book, onPicked }) => {
    return (
        <div className="flex flex-col w-full h-full filter drop-shadow-xl">
            {/* Top Half: Book & Buyer Info */}
            <div className="bg-white p-5 rounded-t-2xl flex flex-row gap-4 h-full relative z-10">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                    {book.image ? (
                        <img
                            src={book.image}
                            alt={book.title}
                            className="w-[110px] h-[150px] object-cover rounded-md shadow-md"
                        />
                    ) : (
                        <div className="w-[110px] h-[150px] bg-gray-200 rounded-md flex items-center justify-center text-gray-400 font-bold shadow-md">
                            No Img
                        </div>
                    )}
                </div>

                {/* Info Stack */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Header Label (University) */}
                    <span className="text-[11px] text-[#374151] font-medium mb-1 tracking-wide">
                        {getUniversityName(book.university)}
                    </span>

                    {/* Title Badge */}
                    <div className="self-start mb-1">
                        <span className="bg-[#1e40af] text-white text-[15px] font-bold px-2 py-0.5 rounded leading-tight inline-block">
                            {book.title}
                        </span>
                    </div>

                    {/* Buyer Info Section */}
                    <div className="mt-2 bg-green-50 p-2 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-1 text-green-800 font-bold text-sm">
                            <User size={14} />
                            <span>المشتري: {book.buyerName || 'غير متوفر'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-700 text-sm font-mono dir-ltr">
                            <Phone size={14} />
                            <span>{book.buyerPhone || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="mt-auto text-left pt-2">
                        <span className="text-xl font-bold text-gray-800">{book.price} ر.س</span>
                    </div>
                </div>
            </div>

            {/* Bottom Half: Action Buttons */}
            <div className="bg-[#e5e7eb] p-4 rounded-b-2xl flex items-center justify-between gap-2 relative z-20">
                <button
                    onClick={() => onPicked && onPicked(book.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-[16px] py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                    <CheckCircle size={20} />
                    <span>تأكيد التسليم (تم الإستلام)</span>
                </button>
            </div>
        </div>
    );
};

export default SoldBookCard;
