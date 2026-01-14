import React from 'react';
import { ChevronDown } from 'lucide-react';
import { getUniversityName } from '../constants/universities';
import { getStatusLabel } from '../constants/status';

const ReviewBookCard = ({ book, onAccept }) => {
    const [selectedStatus, setSelectedStatus] = React.useState(book.status || 'excellent');
    const [showConditionDropdown, setShowConditionDropdown] = React.useState(false);

    const conditions = ['excellent', 'very good', 'good', 'poor'];

    const handleConditionSelect = (status) => {
        setSelectedStatus(status);
        setShowConditionDropdown(false);
    };

    return (
        <div className="flex flex-col w-full h-full filter drop-shadow-xl">
            {/* Top Half: Book Preview */}
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
                <div className="flex flex-col flex-1 min-w-0 items-center text-center">
                    {/* Header Label (University) */}
                    <span className="text-[11px] text-[#374151] font-medium mb-1 tracking-wide">
                        {getUniversityName(book.university)}
                    </span>

                    {/* Title Badge */}
                    <div className="mb-2">
                        <span className="bg-[#1e40af] text-white text-[15px] font-bold px-3 py-0.5 rounded leading-tight inline-block">
                            {book.title}
                        </span>
                    </div>

                    {/* Description Removed as requested */}

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-[#c8876f]/30 mb-3"></div>

                    {/* Details Stack */}
                    <div className="flex flex-col gap-1.5 text-[13px] w-full">
                        <div className="flex justify-between items-center text-[#4b5563]">
                            <span className="font-bold ml-2">ISBN:</span>
                            <span className="font-mono">{book.isbn}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#4b5563]">
                            <span className="font-bold ml-2">المؤلف:</span>
                            <span className="truncate dir-ltr" dir="ltr">{book.author}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#4b5563]">
                            <span className="font-bold ml-2">الجامعة:</span>
                            <span className="truncate">{getUniversityName(book.university) || book.publisher || 'Unknown'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Half: Action Buttons */}
            <div className="bg-[#e5e7eb] p-4 rounded-b-2xl flex items-center justify-between gap-2 relative z-20">

                {/* 1. Excellent Button (Rightmost) - Display Selected Status */}
                <button className={`flex-1 font-medium text-[16px] py-2 px-2 rounded-lg border border-gray-300 transition-colors text-center whitespace-nowrap overflow-hidden text-ellipsis shadow-sm
                    ${selectedStatus === 'excellent' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        selectedStatus === 'very good' ? 'bg-lime-50 text-lime-600 border-lime-200' :
                            selectedStatus === 'good' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                selectedStatus === 'poor' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                    'bg-white hover:bg-gray-50 text-[#374151]'}`}>
                    {getStatusLabel(selectedStatus)}
                </button>

                {/* 2. Condition Dropdown (Center) */}
                <div className="flex-1 relative mx-1">
                    <button
                        onClick={() => setShowConditionDropdown(!showConditionDropdown)}
                        className="w-full bg-[#c8876f] hover:bg-[#b57b64] text-white font-medium text-[16px] py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md"
                    >
                        <ChevronDown size={18} />
                        <span>الحالة</span>
                    </button>

                    {/* Dropdown Menu */}
                    {showConditionDropdown && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                            {conditions.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleConditionSelect(status)}
                                    className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 transition-colors 
                                        ${selectedStatus === status ?
                                            (status === 'excellent' ? 'bg-emerald-50 text-emerald-600 font-bold' :
                                                status === 'very good' ? 'bg-lime-50 text-lime-600 font-bold' :
                                                    status === 'good' ? 'bg-yellow-50 text-yellow-600 font-bold' :
                                                        'bg-orange-50 text-orange-600 font-bold')
                                            : 'text-gray-700'}`}
                                >
                                    {getStatusLabel(status)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Insert/Accept Button (Leftmost) */}
                <button
                    onClick={() => onAccept && onAccept({ ...book, status: selectedStatus })}
                    className="flex-1 bg-[#c8876f] hover:bg-[#b57b64] text-white font-medium text-[16px] py-2 px-2 rounded-lg transition-colors text-center cursor-pointer shadow-md"
                >
                    إدراج
                </button>
            </div>
        </div>
    );
};

export default ReviewBookCard;
