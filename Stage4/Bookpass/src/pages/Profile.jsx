import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, CreditCard, ChevronLeft, Camera, Phone, Edit2, Save, X, AlertCircle, PackageCheck, ShoppingBag, DollarSign, BookOpen, TrendingUp, LogOut, Plus, Store, FileText, CheckCircle, ZoomIn, Clock, Book, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePageLoading } from '../components/ui/PageTransition';
import { updateUserProfile } from '../services/authService';
import { uploadFile } from '../services/fileService';
import { getMyPurchases, getMySales, getMyBooks, markBookAsPicked } from '../services/bookService';
import { UNIVERSITIES } from '../constants/universities';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ImageViewer from '../components/ui/ImageViewer';
import SoldBookCard from '../components/features/SoldBookCard';
import SaudiRiyalIcon from '../components/icons/SaudiRiyalIcon';



const OrderBookCard = ({ book }) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const isUnpicked = book.listingStatus === 'SOLD'; // SOLD implies purchased but not picked yet (once picked it becomes PICKED)

    return (
        <div className={`flex bg-white rounded-xl overflow-hidden shadow-lg h-[160px] w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border ${isUnpicked ? 'border-brand-primary' : 'border-brand-border'}`}>
            {/* Image */}
            <div
                onClick={() => book.image && setIsViewerOpen(true)}
                className={`w-[120px] min-w-[120px] bg-brand-background flex-shrink-0 relative group/image ${book.image ? 'cursor-pointer' : ''}`}
            >
                {book.image ? (
                    <>
                        <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                        {/* Zoom Hint */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="text-white" size={24} />
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-muted">
                        <BookOpen size={32} />
                    </div>
                )}

                {/* Unpicked Overlay on Image */}
                {isUnpicked && (
                    <div className="absolute inset-x-0 bottom-0 bg-brand-primary text-white text-[10px] font-bold py-1 text-center backdrop-blur-sm">
                        بانتظار الاستلام
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0 relative">
                {/* Unpicked Badge - Inside Content */}
                {isUnpicked && (
                    <div className="mb-2">
                        <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-1 rounded-full border border-brand-primary/20 flex items-center gap-1 w-fit">
                            <Clock size={12} />
                            بانتظار الاستلام من مكتبة {UNIVERSITIES[book.university]?.nameAr || book.university}
                        </span>
                    </div>
                )}

                <div className={`mt-0`}>
                    {/* Title & University */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-brand-secondary text-sm leading-tight line-clamp-2 flex-1">
                            {book.title}
                        </h4>
                        <span className="text-[10px] text-white font-bold bg-brand-secondary px-2 py-1 rounded flex-shrink-0">
                            {book.university || 'جامعة'}
                        </span>
                    </div>
                    {/* Author */}
                    <p className="text-xs text-brand-muted font-medium truncate">
                        {book.author || 'غير معروف'}
                    </p>
                </div>

                {/* Footer: ISBN & Price */}
                <div className="flex items-center justify-between text-xs text-brand-muted border-t border-brand-border pt-2 mt-2">
                    <div className="flex items-center gap-1">
                        <span className="font-bold">رقم ISBN:</span>
                        <span className="font-mono">{book.isbn || 'غير متوفر'}</span>
                    </div>
                    <span className="text-brand-primary font-black text-base flex items-center gap-1">
                        {book.price} <SaudiRiyalIcon size={14} />
                    </span>
                </div>
            </div>

            <ImageViewer
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                imageSrc={book.image}
                altText={book.title}
            />
        </div>
    );
};

const PendingBookCard = ({ book }) => (
    <div className="bg-white rounded-xl p-4 border border-brand-primary h-full flex flex-col relative overflow-hidden group hover:border-brand-primary/30 transition-colors">
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
            <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-1 rounded-full border border-brand-primary/20 flex items-center gap-1">
                <Clock size={12} />
                بانتظار التسليم
            </span>
        </div>

        <div className="flex gap-4 mb-3">
            <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-black/5 relative">
                {book.image ? (
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-muted/20">
                        <Book size={24} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 pt-1">
                <h4 className="font-bold text-brand-secondary text-base leading-tight mb-1 truncate" title={book.title}>
                    {book.title}
                </h4>
                <p className="text-xs text-brand-muted mb-3 line-clamp-1">{book.author}</p>

                <div className="flex items-center gap-1.5 text-xs text-brand-secondary bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <MapPin size={14} className="text-brand-primary flex-shrink-0" />
                    <span className="truncate">
                        مكتبة {UNIVERSITIES[book.university]?.nameAr || book.university || 'الجامعة'}
                    </span>
                </div>
            </div>
        </div>

        {/* Footer/Progress Note */}
        <div className="mt-auto pt-3 border-t border-dashed border-gray-100">
            <p className="text-[10px] text-brand-muted flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></div>
                يرجى تسليم الكتاب للمكتبة للمراجعة
            </p>
        </div>
    </div>
);

import usePageTitle from '../hooks/usePageTitle';

const Profile = () => {
    usePageTitle('ملفي الشخصي');
    const { user, updateUserState, signOut } = useAuth();
    const { isLoading, setIsLoading, setLoadingMessage } = usePageLoading();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        profilePicture: '',
        iban: ''
    });

    // Orders state//
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);
    const [activeListings, setActiveListings] = useState([]);
    const [pendingListings, setPendingListings] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('purchases'); // 'purchases', 'sales', 'active'


    useEffect(() => {
        setLoadingMessage("جاري تحميل ملفك الشخصي");
        return () => setLoadingMessage("جاري التحميل...");
    }, [setLoadingMessage]);

    useEffect(() => {
        if (user) {
            setEditData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || '',
                profilePicture: user.profilePicture || '',
                iban: user.iban || ''
            });
        }
    }, [user]);

    // Fetch user orders on mount
    useEffect(() => {
        const fetchOrders = async () => {
            setOrdersLoading(true);

            const [purchasesResult, salesResult, myBooksResult] = await Promise.all([
                getMyPurchases(),
                getMySales(),
                getMyBooks()
            ]);

            if (!purchasesResult.error) {
                // Sort purchases: Unpicked (SOLD) first
                const sortedPurchases = purchasesResult.data.sort((a, b) => {
                    const aUnpicked = a.listingStatus === 'SOLD';
                    const bUnpicked = b.listingStatus === 'SOLD';
                    if (aUnpicked && !bUnpicked) return -1;
                    if (!aUnpicked && bUnpicked) return 1;
                    return 0;
                });
                setPurchases(sortedPurchases);
            }

            if (!salesResult.error) {
                setSales(salesResult.data);
            }

            if (!myBooksResult.error) {
                const allBooks = myBooksResult.data;

                const isPending = (b) => {
                    const s = (b.listingStatus || b.status || '').toUpperCase();
                    return s.includes('PENDING') || s === 'REVIEW' || s === 'WAITING';
                };

                // Active: Not sold AND Not pending
                setActiveListings(allBooks.filter(b => !b.isSold && !isPending(b)));

                // Pending: Not sold AND Pending
                setPendingListings(allBooks.filter(b => !b.isSold && isPending(b)));
            }

            setOrdersLoading(false);
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoadingMessage("جاري رفع الصورة...");
        setIsLoading(true);

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setEditData(prev => ({
            ...prev,
            profilePicture: objectUrl
        }));

        const { url, error } = await uploadFile(file);
        setIsLoading(false);

        if (error) {
            alert('فشل رفع الصورة: ' + error);
            // Revert to old picture if upload fails
            setEditData(prev => ({
                ...prev,
                profilePicture: user?.profilePicture || ''
            }));
        } else {
            setEditData(prev => ({
                ...prev,
                profilePicture: url
            }));
        }
    };

    const handleSave = async () => {
        setLoadingMessage("جاري حفظ التغييرات...");
        setIsLoading(true);
        const { data, error } = await updateUserProfile(editData);
        setIsLoading(false);

        if (error) {
            alert('فشل تحديث الملف الشخصي: ' + error);
        } else {
            setIsEditing(false);
            // Update global auth state with new data
            if (data) {
                updateUserState(data);
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset data to original
        if (user) {
            setEditData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || '',
                profilePicture: user.profilePicture || '',
                iban: user.iban || ''
            });
        }
    };

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const stats = [
        {
            id: 'purchases',
            label: 'إجمالي المشتريات',
            value: purchases.length,
            sublabel: 'كتاب',
            icon: ShoppingBag,
            color: 'from-brand-primary to-brand-primary/80',
            bgColor: 'bg-brand-primary',
            textColor: 'text-brand-primary'
        },
        {
            id: 'sales',
            label: 'إجمالي المبيعات',
            value: sales.length,
            sublabel: 'كتاب',
            icon: DollarSign,
            color: 'from-brand-primary to-brand-primary/80',
            bgColor: 'bg-brand-primary',
            textColor: 'text-brand-primary'
        },
        {
            id: 'listings',
            label: 'الكتب المعروضة',
            value: activeListings.length,
            sublabel: 'كتاب نشط',
            icon: BookOpen,
            color: 'from-brand-primary to-brand-primary/80',
            bgColor: 'bg-brand-primary',
            textColor: 'text-brand-primary'
        },
        {
            id: 'spending',
            label: 'إجمالي الإنفاق',
            value: (
                <span className="flex items-center gap-1">
                    {purchases.reduce((sum, book) => sum + (book.price || 0), 0)} <SaudiRiyalIcon size={28} />
                </span>
            ),
            sublabel: 'هذا الشهر',
            icon: TrendingUp,
            color: 'from-brand-primary to-brand-primary/80',
            bgColor: 'bg-brand-primary',
            textColor: 'text-brand-primary'
        }
    ];

    const unpickedCount = purchases.filter(b => b.listingStatus === 'SOLD').length;

    const tabs = [
        {
            id: 'purchases',
            label: 'مشترياتي',
            count: purchases.length,
            badge: unpickedCount > 0 ? unpickedCount : null
        },
        {
            id: 'sales',
            label: 'مبيعاتي',
            count: sales.length + pendingListings.length,
            badge: pendingListings.length > 0 ? pendingListings.length : null
        },
        { id: 'active', label: 'كتبي المعروضة', count: activeListings.length },
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans bg-brand-secondary pt-20 relative" dir="rtl">
            {/* Subtle background pattern - extends across entire page */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>
            <Navbar />

            <motion.main
                variants={container}
                initial="hidden"
                animate="show"
                className="flex-1 w-full"
            >
                {/* Dark Navy Hero Section */}
                <motion.section
                    variants={fadeInUp}
                    className="bg-brand-secondary py-12 px-4 md:px-8 relative"
                >
                    {/* Orange Pill Card */}
                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="bg-brand-primary rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                            style={{
                                clipPath: 'polygon(0 0, 98% 0, 100% 50%, 98% 100%, 0 100%)'
                            }}
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>

                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                                {/* Avatar */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    <motion.div
                                        onClick={isEditing ? handleFileClick : undefined}
                                        whileHover={isEditing ? { scale: 1.05 } : {}}
                                        className={`w-28 h-28 rounded-full border-4 border-white bg-white/20 overflow-hidden shadow-xl flex items-center justify-center relative group ${isEditing ? 'cursor-pointer' : ''}`}
                                    >
                                        {editData.profilePicture || user?.photoURL ? (
                                            <img src={editData.profilePicture || user?.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={56} className="text-white" />
                                        )}

                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="text-white" size={28} />
                                            </div>
                                        )}

                                    </motion.div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center md:text-right space-y-3">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={editData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="الاسم الأول"
                                                    className="flex-1 px-4 py-2 border-2 border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={editData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="اسم العائلة"
                                                    className="flex-1 px-4 py-2 border-2 border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none"
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={editData.phoneNumber}
                                                onChange={handleInputChange}
                                                placeholder="رقم الهاتف"
                                                className="w-full px-4 py-2 border-2 border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none text-right"
                                            />
                                            <input
                                                type="text"
                                                name="iban"
                                                value={editData.iban}
                                                onChange={handleInputChange}
                                                placeholder="رقم الآيبان (IBAN)"
                                                className="w-full px-4 py-2 border-2 border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-transparent outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                                                {user?.firstName} {user?.lastName}
                                            </h1>
                                            <div className="space-y-2 text-lg text-white/90">
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    <Mail size={20} />
                                                    <span>{user?.email}</span>
                                                </div>
                                                {user?.phoneNumber && (
                                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                                        <Phone size={20} />
                                                        <span>{user.phoneNumber}</span>
                                                    </div>
                                                )}
                                                {user?.iban && (
                                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                                        <CreditCard size={20} />
                                                        <span dir="ltr">{user.iban}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Edit/Save Buttons */}
                                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                                    {!isEditing ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsEditing(true)}
                                            className="bg-white text-brand-primary px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg hover:bg-gray-50 w-full md:w-auto"
                                        >
                                            <Edit2 size={18} />
                                            <span>تعديل الملف</span>
                                        </motion.button>
                                    ) : (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleSave}
                                                disabled={isLoading}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 flex-1"
                                            >
                                                <Save size={18} />
                                                <span>حفظ</span>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleCancel}
                                                disabled={isLoading}
                                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 flex-1"
                                            >
                                                <X size={18} />
                                                <span>إلغاء</span>
                                            </motion.button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section >

                {/* Main Content */}
                < div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-8" >
                    {/* Stats Dashboard - Diagonal Split Design */}
                    < motion.section
                        variants={fadeInUp}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {
                            stats.map((stat, index) => (
                                <motion.div
                                    key={stat.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                                        transition: { type: "spring", stiffness: 300, damping: 20 }
                                    }}
                                    className="relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                                >
                                    {/* Diagonal Split */}
                                    <div className="flex h-full min-h-[110px] md:min-h-[140px]">
                                        {/* Content - Renders on Right in RTL */}
                                        <div className="flex-1 p-6 flex flex-col justify-center">
                                            <p className="text-sm text-brand-secondary font-bold mb-2">{stat.label}</p>
                                            <motion.p
                                                whileHover={{
                                                    scale: 1.05,
                                                    transition: { type: "spring", stiffness: 500, damping: 15 }
                                                }}
                                                className={`text-4xl font-black ${stat.textColor} leading-none mb-1`}
                                            >
                                                {stat.value}
                                            </motion.p>
                                            <p className="text-xs text-brand-muted">{stat.sublabel}</p>
                                        </div>

                                        {/* Icon Section - Renders on Left in RTL (2nd child) */}
                                        <motion.div
                                            whileHover={{ x: -4 }}
                                            className={`w-[25%] bg-gradient-to-br ${stat.color} flex items-center justify-center relative z-10 shadow-lg`}
                                        >
                                            <motion.div
                                                whileHover={{
                                                    rotate: [0, -10, 10, -10, 0],
                                                    transition: { duration: 0.5 }
                                                }}
                                                className={stat.id === 'spending' ? 'transform -scale-x-100' : ''}
                                            >
                                                <stat.icon className="text-white" size={32} />
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </motion.section >

                    {/* Quick Actions with Gradient Buttons (Moved Here) */}
                    <motion.section
                        variants={fadeInUp}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/sell')}
                            className="bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-accent hover:to-brand-primary text-white px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                        >
                            <Plus size={24} />
                            <span>عرض كتاب للبيع</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/marketplace')}
                            className="bg-white hover:bg-brand-background text-brand-secondary border-2 border-brand-primary/20 hover:border-brand-primary/40 px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                        >
                            <Store size={24} />
                            <span>تصفح السوق</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="bg-white hover:bg-brand-error/10 text-brand-error border-2 border-brand-error/20 hover:border-brand-error/40 px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                        >
                            <LogOut size={24} />
                            <span>تسجيل الخروج</span>
                        </motion.button>
                    </motion.section>

                    {/* Activity Section with Animated Tabs */}
                    < motion.section
                        variants={fadeInUp}
                        className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                    >
                        {/* Tabs Header with Animated Underline */}
                        < div className="border-b border-brand-border px-4 md:px-6 overflow-x-auto" >
                            <div className="flex gap-4 md:gap-8 relative min-w-max">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative py-4 px-1 md:px-2 font-bold text-sm md:text-base transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                            ? 'text-brand-primary'
                                            : 'text-brand-muted hover:text-brand-secondary'
                                            }`}
                                    >
                                        <span>{tab.label} ({tab.count})</span>

                                        {/* Red Notification Badge for Unpicked Items */}
                                        {tab.badge && (
                                            <span className="bg-brand-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                                                {tab.badge}
                                            </span>
                                        )}

                                        {/* Animated Underline */}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="underline"
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div >

                        {/* Tab Content */}
                        < div className="p-8" >
                            {
                                ordersLoading ? (
                                    <div className="flex items-center justify-center py-20" >
                                        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        {/* Purchases Tab */}
                                        {activeTab === 'purchases' && (
                                            <motion.div
                                                key="purchases"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {purchases.length > 0 ? (
                                                    <div className="space-y-8">
                                                        {/* Section 1: Waiting for Pickup */}
                                                        {purchases.filter(b => b.listingStatus === 'SOLD').length > 0 && (
                                                            <div className="space-y-4">
                                                                <div className="bg-brand-primary/10 rounded-xl p-4 border border-brand-primary/20">
                                                                    <div className="flex items-center gap-2 text-brand-primary font-bold mb-2">
                                                                        <PackageCheck size={20} />
                                                                        <h3>كتب بانتظار الاستلام ({purchases.filter(b => b.listingStatus === 'SOLD').length})</h3>
                                                                    </div>
                                                                    <p className="text-sm text-brand-secondary">يرجى الذهاب إلى المكتبة المحددة لاستلام هذه الكتب.</p>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                    {purchases.filter(b => b.listingStatus === 'SOLD').map((book, index) => (
                                                                        <motion.div
                                                                            key={book.id}
                                                                            initial={{ opacity: 0, y: 20 }}
                                                                            whileInView={{ opacity: 1, y: 0 }}
                                                                            viewport={{ once: true }}
                                                                            transition={{ delay: index * 0.1 }}
                                                                        >
                                                                            <OrderBookCard book={book} />
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Section 2: Purchase History */}
                                                        {purchases.filter(b => b.listingStatus !== 'SOLD').length > 0 && (
                                                            <div className="space-y-4">
                                                                {purchases.some(b => b.listingStatus === 'SOLD') && (
                                                                    <div className="flex items-center gap-2 text-brand-secondary font-bold pt-4 border-t border-gray-100">
                                                                        <ShoppingBag size={20} />
                                                                        <h3>سجل المشتريات</h3>
                                                                    </div>
                                                                )}

                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                    {purchases.filter(b => b.listingStatus !== 'SOLD').map((book, index) => (
                                                                        <motion.div
                                                                            key={book.id}
                                                                            initial={{ opacity: 0, y: 20 }}
                                                                            whileInView={{ opacity: 1, y: 0 }}
                                                                            viewport={{ once: true }}
                                                                            transition={{ delay: index * 0.1 }}
                                                                        >
                                                                            <OrderBookCard book={book} />
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-20 text-brand-muted">
                                                        <ShoppingBag size={64} className="mb-4 opacity-20" />
                                                        <p className="text-xl font-bold mb-2">لا توجد مشتريات بعد</p>
                                                        <p className="text-sm mb-6">ابدأ بتصفح الكتب المتاحة</p>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => navigate('/marketplace')}
                                                            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                                                        >
                                                            تصفح السوق
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {/* Sales Tab (Consolidated with Pending) */}
                                        {activeTab === 'sales' && (
                                            <motion.div
                                                key="sales"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {(sales.length > 0 || pendingListings.length > 0) ? (
                                                    <div className="space-y-8">
                                                        {/* Optional: Header for Pending if present */}
                                                        {pendingListings.length > 0 && (
                                                            <div className="bg-brand-primary/10 rounded-xl p-4 border border-brand-primary/20 mb-4">
                                                                <div className="flex items-center gap-2 text-brand-primary font-bold mb-2">
                                                                    <Clock size={20} />
                                                                    <h3>كتب بانتظار التسليم ({pendingListings.length})</h3>
                                                                </div>
                                                                <p className="text-sm text-brand-secondary">يرجى تسليم هذه الكتب إلى المكتبة المحددة لتبدأ عملية المراجعة والعرض في المتجر.</p>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            {/* Render Pending Items First */}
                                                            {pendingListings.map((book, index) => (
                                                                <motion.div
                                                                    key={`pending-${book.id}`}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    whileInView={{ opacity: 1, y: 0 }}
                                                                    viewport={{ once: true, margin: "-50px" }}
                                                                    transition={{ delay: index * 0.1 }}
                                                                    whileHover={{
                                                                        y: -8,
                                                                        rotateZ: 0,
                                                                        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                                                                        transition: { type: "spring", stiffness: 400, damping: 25 }
                                                                    }}
                                                                >
                                                                    <PendingBookCard book={book} />
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                        {/* Section 2: Sold History */}
                                                        {sales.length > 0 && (
                                                            <div className="space-y-4">
                                                                {pendingListings.length > 0 && (
                                                                    <div className="flex items-center gap-2 text-brand-secondary font-bold pt-4 border-t border-gray-100">
                                                                        <DollarSign size={20} />
                                                                        <h3>سجل المبيعات</h3>
                                                                    </div>
                                                                )}

                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                    {sales.map((book, index) => (
                                                                        <motion.div
                                                                            key={book.id}
                                                                            initial={{ opacity: 0, y: 20 }}
                                                                            whileInView={{ opacity: 1, y: 0 }}
                                                                            viewport={{ once: true }}
                                                                            transition={{ delay: index * 0.1 }}
                                                                        >
                                                                            <SoldBookCard
                                                                                book={book}
                                                                            />
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-20 text-brand-muted">
                                                        <DollarSign size={64} className="mb-4 opacity-20" />
                                                        <p className="text-xl font-bold mb-2">لا توجد مبيعات بعد</p>
                                                        <p className="text-sm mb-6">قم بعرض كتبك للبيع</p>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => navigate('/sell')}
                                                            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                                                        >
                                                            <Plus size={20} />
                                                            <span>عرض كتاب للبيع</span>
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {/* Active Listings Tab */}
                                        {activeTab === 'active' && (
                                            <motion.div
                                                key="active"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {activeListings.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {activeListings.map((book, index) => (
                                                            <motion.div
                                                                key={book.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                viewport={{ once: true, margin: "-50px" }}
                                                                transition={{ delay: index * 0.1 }}
                                                                whileHover={{
                                                                    y: -8,
                                                                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                                                                    transition: { type: "spring", stiffness: 400, damping: 25 }
                                                                }}
                                                                className="bg-white rounded-xl p-6 border-2 border-brand-border"
                                                            >
                                                                <div className="flex gap-4">
                                                                    <div className="w-20 h-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                                        {book.image && <img src={book.image} alt={book.title} className="w-full h-full object-cover" />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-bold text-brand-secondary text-base mb-1 truncate">
                                                                            {book.title}
                                                                        </h4>
                                                                        <p className="text-sm text-brand-muted">{book.author}</p>
                                                                        <div className="bg-brand-success/10 border border-brand-success/20 rounded-lg p-2 mt-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <CheckCircle size={16} className="text-brand-success" />
                                                                                <p className="text-xs font-bold text-brand-success">الكتاب معروض حالياً في المتجر</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-20 text-brand-muted">
                                                        <BookOpen size={64} className="mb-4 opacity-20" />
                                                        <p className="text-xl font-bold mb-2">لا توجد كتب معروضة</p>
                                                        <p className="text-sm mb-6">كتبك النشطة ستظهر هنا</p>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => navigate('/sell')}
                                                            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                                                        >
                                                            <Plus size={20} />
                                                            <span>عرض كتاب للبيع</span>
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                        </div >
                    </motion.section >


                </div >
            </motion.main >

            <Footer />
        </div >
    );




};

export default Profile;
