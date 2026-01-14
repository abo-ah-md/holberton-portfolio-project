import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, CreditCard, ChevronLeft, Camera, Phone, Edit2, Save, X, AlertCircle, PackageCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';
import { uploadFile } from '../services/fileService';
import { getMyPurchases, getMySales, getMyBooks } from '../services/bookService';
import { UNIVERSITIES } from '../constants/universities';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';



const OrderBookCard = ({ book }) => (
    <div className="flex bg-white rounded-xl overflow-hidden shadow-lg h-[140px] w-[280px] shrink-0 transform transition-transform hover:scale-105 border border-gray-100">
        {/* Image - Left (in RTL) / Right (in structure) -> Visually Right in RTL */}
        <div className="w-[100px] bg-gray-200 shrink-0">
            {book.image && <img src={book.image} alt={book.title} className="w-full h-full object-cover" />}
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-500 font-bold">{book.university || 'جامعة'}</span>
                    <div className="bg-[#1e40af] text-white text-[11px] font-bold px-2 py-1 rounded leading-tight truncate max-w-[140px]">
                        {book.title}
                    </div>
                </div>
                <h4 className="text-sm text-gray-600 font-bold leading-tight mb-2 truncate">
                    {book.author}
                </h4>
            </div>

            <div className="flex flex-col gap-1.5 text-xs text-gray-500 border-t border-gray-100 pt-2">
                <div className="flex justify-between">
                    <span className="font-bold">ISBN:</span>
                    <span className="font-mono text-[11px]">{book.isbn ? book.isbn.slice(-4) + '..' : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">السعر:</span>
                    <span className="text-brand-orange font-bold">{book.price} ر.س</span>
                </div>
            </div>
        </div>
    </div>
);

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        profilePicture: ''
    });

    // Orders state
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);
    const [myListedBooks, setMyListedBooks] = useState([]); // Books I've listed for sale
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setEditData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || '',
                profilePicture: user.profilePicture || ''
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
                setPurchases(purchasesResult.data);
            }

            if (!salesResult.error) {
                setSales(salesResult.data);
            }

            if (!myBooksResult.error) {
                setMyListedBooks(myBooksResult.data);
            }

            setOrdersLoading(false);
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const handleLogout = async () => {
        await signOut();
        navigate('/logout');
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

        setIsUploadingImage(true); // Use specific loading state

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setEditData(prev => ({
            ...prev,
            profilePicture: objectUrl
        }));

        const { url, error } = await uploadFile(file);
        setIsUploadingImage(false);

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
        setIsLoading(true);
        const { data, error } = await updateUserProfile(editData);
        setIsLoading(false);

        if (error) {
            alert('فشل تحديث الملف الشخصي: ' + error);
        } else {
            setIsEditing(false);
            // user context should be updated automatically via authService
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
                profilePicture: user.profilePicture || ''
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#3A4958]" dir="rtl">
            <Navbar />

            {/* --- HEADER --- */}
            {/* Visual Right (Start) Alignment */}
            <div className="relative bg-[#2c3e50] h-[220px] flex items-center justify-start px-10 md:px-20 mb-8 overflow-hidden shadow-xl z-20">
                <div className="flex flex-col items-center relative z-30 translate-y-8 mr-10">

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />

                    {/* Avatar Circle */}
                    <div
                        onClick={handleFileClick}
                        className={`w-32 h-32 rounded-full border-[6px] border-[#C17554] bg-[#222] overflow-hidden shadow-2xl z-20 flex items-center justify-center relative group ${isEditing ? 'cursor-pointer hover:border-white transition-colors' : ''}`}
                    >
                        {editData.profilePicture || user?.photoURL ? (
                            <img src={editData.profilePicture || user?.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-gray-400" />
                        )}

                        {/* Edit Overlay */}
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={32} />
                            </div>
                        )}

                        {/* Upload Loader - Shows while image is uploading */}
                        {isUploadingImage && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                                <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Ribbon */}
                    <div className="relative -mt-6 z-10 w-[240px]">
                        <div className="bg-[#C17554] text-white text-center font-bold text-2xl py-2 px-4 shadow-lg relative"
                            style={{
                                // Pointing Right
                                clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)'
                            }}>
                            الملف الشخصي
                        </div>
                    </div>
                </div>
                {/* Visual decoration */}
                <div className="absolute left-[-100px] top-0 bottom-0 w-[400px] bg-white/5 skew-x-[-20deg]"></div>
            </div>

            <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 md:px-12 pb-20 flex flex-col gap-12 -mt-10 relative z-30">

                {/* --- SECTION 1: Personal Data --- */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-4 border-b border-gray-500/50 pb-2 text-right">
                        البيانات الشخصية
                    </h2>

                    {/* Data Card */}
                    <div className="relative overflow-hidden rounded-[20px] p-[12px] border-[4px] border-white/10 shadow-2xl min-h-[340px]"
                        style={{
                            background: 'linear-gradient(105deg, #cc8c74 42%, #354250 42.1%)'
                        }}
                    >
                        {/* Edit/Save Buttons */}
                        <div className="absolute top-0 left-0 p-0 z-20 flex">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-[#a66a53] text-white px-8 py-2 rounded-br-2xl shadow-lg text-lg font-bold hover:bg-[#8f5a44] transition-colors flex items-center gap-2"
                                >
                                    <Edit2 size={18} />
                                    <span>تعديل</span>
                                </button>
                            ) : (
                                <div className="flex">
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="bg-green-500 text-white px-6 py-2 shadow-lg text-lg font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                                    >
                                        <Save size={18} />
                                        <span>حفظ</span>
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="bg-red-600 text-white px-6 py-2 rounded-br-2xl shadow-lg text-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                                    >
                                        <X size={18} />
                                        <span>إلغاء</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Flex Container for Rows - Ensures perfect horizontal alignment */}
                        {/* padding px-12 py-16 to give breathing room */}
                        <div className="flex flex-col justify-center h-full text-white px-8 md:px-16 py-16 gap-8 relative min-h-[340px]">

                            {/* Row 1: Full Name */}
                            <div className="flex justify-between items-center w-full">
                                {/* Value (Left / End) */}
                                <div className="text-xl font-medium text-white z-10 drop-shadow-md text-left flex-1 pl-4">
                                    {isEditing ? (
                                        <div className="flex gap-2 justify-end">
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={editData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="الاسم الأخير"
                                                className="bg-white/10 border border-white/30 rounded px-2 py-1 text-white text-right w-32 focus:outline-none focus:border-white"
                                            />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={editData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="الاسم الأول"
                                                className="bg-white/10 border border-white/30 rounded px-2 py-1 text-white text-right w-32 focus:outline-none focus:border-white"
                                            />
                                        </div>
                                    ) : (
                                        <span>اسم المستخدم</span>
                                    )}
                                </div>
                                {/* Label (Right / Start) */}
                                <div className="text-gray-300 font-bold text-lg text-right w-40">
                                    <span dir="rtl">{isEditing ? 'الاسم الكامل' : (user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.email?.split('@')[0] || 'User'))}</span>
                                </div>
                            </div>

                            {/* Row 2: Phone Number (New) */}
                            <div className="flex justify-between items-center w-full">
                                <div className="text-xl font-medium text-white z-10 drop-shadow-md text-left flex-1 pl-4">
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={editData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="05xxxxxxxx"
                                            className="bg-white/10 border border-white/30 rounded px-2 py-1 text-white text-right w-full max-w-[200px] focus:outline-none focus:border-white dir-ltr"
                                        />
                                    ) : (
                                        <span>رقم الهاتف</span>
                                    )}
                                </div>
                                <div className="text-gray-300 font-bold text-lg text-right w-40">
                                    <span dir="ltr">{!isEditing ? (user?.phoneNumber || 'غير مدخل') : 'رقم الجوال'}</span>
                                </div>
                            </div>

                            {/* Row 3: Email */}
                            <div className="flex justify-between items-center w-full">
                                <div className="text-lg font-medium text-white z-10 drop-shadow-md opacity-90 text-left flex-1 pl-4">
                                    <span>البريد الإلكتروني</span>
                                </div>
                                <div className="text-gray-300 font-bold text-lg text-right w-40">
                                    <span dir="ltr">{user?.email || 'email@example.com'}</span>
                                </div>
                            </div>

                            {/* Row 4: IBAN */}
                            <div className="flex justify-between items-center w-full">
                                <div className="text-lg font-mono font-medium text-white z-10 drop-shadow-md text-left flex-1 pl-4">
                                    <span>الحساب البنكي IBAN</span>
                                </div>
                                <div className="text-gray-300 font-bold text-lg text-right w-40">
                                    <span dir="rtl">{user?.uid ? `SA${user.uid.slice(0, 10).toUpperCase()}` : 'SA...'}</span>
                                </div>
                            </div>

                        </div>

                        {/* Save Button (Bottom) removed in favor of top logic */}
                    </div>
                </div>

                {/* --- SECTION 2: Pending Books for Delivery --- */}
                {!ordersLoading && myListedBooks.filter(book => book.listingStatus === 'PENDING').length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4 border-b border-yellow-500/50 pb-2 text-right">
                            كتب بانتظار التسليم
                        </h2>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-xl border-2 border-yellow-400">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-yellow-500 text-white p-3 rounded-full">
                                    <AlertCircle size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-yellow-900 mb-2">
                                        تذكير مهم! لديك كتب بانتظار التسليم 📚
                                    </h3>
                                    <p className="text-yellow-800 mb-4">
                                        يرجى إحضار الكتب التالية إلى مواقع التسليم المحددة لمراجعتها وعرضها للبيع:
                                    </p>

                                    <div className="space-y-3">
                                        {myListedBooks.filter(book => book.listingStatus === 'PENDING').map((book, index) => (
                                            <div key={book.id} className="bg-white rounded-xl p-4 shadow-md border border-yellow-200">
                                                <div className="flex items-start gap-4">
                                                    {/* Book Image */}
                                                    <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                        {book.image && <img src={book.image} alt={book.title} className="w-full h-full object-cover" />}
                                                    </div>

                                                    {/* Book Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-brand-slate text-sm mb-1 truncate">
                                                            {index + 1}. {book.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-600 mb-2">{book.author}</p>

                                                        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-2 mt-2">
                                                            <div className="flex items-center gap-2">
                                                                <PackageCheck size={16} className="text-yellow-700" />
                                                                <div className="text-xs">
                                                                    <p className="font-bold text-yellow-900">📍 موقع التسليم:</p>
                                                                    <p className="text-yellow-800">
                                                                        مكتبة {UNIVERSITIES[book.university]?.nameAr || book.university || 'الجامعة'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 p-3 bg-yellow-200/50 rounded-lg">
                                        <p className="text-yellow-900 text-sm flex items-start gap-2">
                                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                            <span>بعد التسليم والمراجعة، سيتم عرض كتبك في المتجر ليراها آلاف الطلاب.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* --- SECTION 3: Orders --- */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-500/50 pb-4 text-right">
                        الطلبات
                    </h2>

                    {/* Bought Books */}
                    <div className="mb-12">
                        <h3 className="text-gray-300 text-right font-bold text-lg mb-4 pr-2">
                            آخر كتبك المشتراة
                        </h3>
                        <div className="relative overflow-hidden shadow-xl p-10 min-h-[200px]"
                            style={{
                                background: 'linear-gradient(105deg, #cc8c74 35%, #354250 35.1%)',
                                borderTopLeftRadius: '100px',
                                borderBottomLeftRadius: '100px',
                                borderTopRightRadius: '24px',
                                borderBottomRightRadius: '24px',
                                border: '3px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            {ordersLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : purchases.length > 0 ? (
                                <div className="flex flex-row flex-wrap gap-4 justify-center">
                                    {purchases.map(book => (
                                        <OrderBookCard key={book.id} book={book} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-white/60">
                                    <p className="text-lg">لا توجد مشتريات بعد</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sold Books */}
                    <div>
                        <h3 className="text-gray-300 text-right font-bold text-lg mb-4 pr-2">
                            آخر كتبك المباعة
                        </h3>
                        <div className="relative overflow-hidden shadow-xl p-10 min-h-[200px]"
                            style={{
                                background: 'linear-gradient(105deg, #cc8c74 35%, #354250 35.1%)',
                                borderTopLeftRadius: '100px',
                                borderBottomLeftRadius: '100px',
                                borderTopRightRadius: '24px',
                                borderBottomRightRadius: '24px',
                                border: '3px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            {ordersLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : sales.length > 0 ? (
                                <div className="flex flex-row flex-wrap gap-4 justify-center">
                                    {sales.map(book => (
                                        <OrderBookCard key={`sold-${book.id}`} book={book} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-white/60">
                                    <p className="text-lg">لا توجد مبيعات بعد</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-red-200 font-bold px-10 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 transition-colors"
                    >
                        تسجيل الخروج
                    </button>
                </div>

            </main>
            <footer >
                <Footer className="footer-top-orange-line" />
            </footer>
        </div>
    );
};

export default Profile;
