import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, BookOpen, DollarSign, TrendingUp, AlertCircle,
    CheckCircle, Clock, GraduationCap, ArrowUpRight, ShieldCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getDashboardStats } from '../services/adminService';
import { getStorePendingBooks, getStoreSoldBooks } from '../services/bookService';
import { usePageLoading } from '../components/PageTransition';
import { UNIVERSITIES } from '../constants/universities';

// Reusable Stats Card Component
const StatsCard = ({ title, value, subtext, icon: Icon, color, delay, iconPadding = "p-3" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay, duration: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden group"
    >
        {/* Background Decoration */}
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${color} group-hover:scale-150 transition-transform duration-500`}></div>

        <div className="relative z-10 flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-bold mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-gray-800">{value}</h3>
                </div>
                {subtext && <p className="text-xs text-gray-400 mt-2 font-medium">{subtext}</p>}
            </div>
            <div className={`${iconPadding} rounded-xl ${color} bg-opacity-10 text-gray-700 shadow-sm`}>
                <Icon size={24} className={`text-${color.replace('bg-', '')}-600`} />
            </div>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const { setIsLoading, setLoadingMessage } = usePageLoading();
    const [stats, setStats] = useState(null);
    const [pendingCounts, setPendingCounts] = useState({ review: 0, pickup: 0 });

    useEffect(() => {
        const loadStats = async () => {
            setLoadingMessage("جاري تحليل البيانات...");
            setIsLoading(true);
            try {
                const [statsRes, pendingRes, soldRes] = await Promise.all([
                    getDashboardStats(),
                    getStorePendingBooks(),
                    getStoreSoldBooks()
                ]);

                setStats(statsRes.data);

                // Calculate unique counts
                const uniqueReview = pendingRes.data ? new Set(pendingRes.data.map(b => b.id)).size : 0;
                const uniquePickup = soldRes.data ? new Set(soldRes.data.map(b => b.id)).size : 0;

                setPendingCounts({ review: uniqueReview, pickup: uniquePickup });

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, [setIsLoading, setLoadingMessage]);

    if (!stats) return null;

    const { metrics, universityStats, recentUsers, recentBooks } = stats;

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-[#2c3e50] font-sans pt-20" dir="rtl">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center text-white mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
                        <p className="text-gray-300 mt-1 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-brand-orange" />
                            مرحباً بك في لوحة تحكم الإدارة
                        </p>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                        <span className="text-sm">آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}</span>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="إجمالي الكتب"
                        value={metrics.totalBooks}
                        subtext={`${metrics.availableBooks} متاح للبيع`}
                        icon={BookOpen}
                        color="bg-blue-500"
                        delay={0.1}
                    />
                    <StatsCard
                        title="إجمالي المبيعات"
                        value={`${metrics.totalRevenue} ر.س`}
                        subtext={`${metrics.soldBooks} كتاب تم بيعه`}
                        icon={DollarSign}
                        color="bg-green-500"
                        delay={0.2}
                    />
                    <StatsCard
                        title="إجمالي المستخدمين"
                        value={metrics.totalUsers}
                        subtext={`${metrics.activeUsers} مستخدم نشط`}
                        icon={Users}
                        color="bg-purple-500"
                        delay={0.3}
                    />
                    <StatsCard
                        title="المراجعين (السفراء)" //don't edit it
                        value={metrics.universities || metrics.reviewers}
                        subtext={null}
                        icon={() => <img src={new URL('../assets/ribbon-flag.svg', import.meta.url).href} alt="icon" className="w-10 h-10" />}
                        color="bg-brand-orange"
                        delay={0.4}
                        iconPadding="p-1"
                    />
                </div>

                {/* Secondary Grid (Pending & Universities) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Pending Action Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-brand-orange/90 to-orange-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Clock size={24} />
                                </div>
                                <h3 className="font-bold text-lg"> كتب بانتظار المراجعة والتسليم </h3>
                            </div>

                            <div className="flex items-center gap-8 mb-6">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black">{pendingCounts.review}</span>
                                    <span className="text-sm opacity-80 font-bold">بانتظار المراجعة</span>
                                </div>
                                <div className="w-px bg-white/30 h-10 rounded-full"></div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black">{pendingCounts.pickup}</span>
                                    <span className="text-sm opacity-80 font-bold">بانتظار التسليم</span>
                                </div>
                            </div>

                            <button
                                onClick={() => window.location.href = '/admin/review'}
                                className="w-full bg-white text-brand-orange font-bold py-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <span>بدء المراجعة</span>
                                <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </motion.div>

                    {/* University Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-brand-orange" />
                            توزيع الكتب حسب الجامعة
                        </h3>

                        <div className="space-y-4">
                            {universityStats.map((uni, idx) => (
                                <div key={uni.code} className="flex items-center gap-4">
                                    <div className="w-64 flex-shrink-0 text-sm font-bold text-gray-600 truncate">
                                        {UNIVERSITIES[uni.code]?.nameAr || uni.name}
                                    </div>
                                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metrics.totalBooks > 0 ? (uni.count / metrics.totalBooks) * 100 : 0}%` }}
                                            transition={{ duration: 1, delay: 0.8 + (idx * 0.1) }}
                                            className={`h-full ${uni.color || 'bg-brand-orange'} rounded-full`}
                                        ></motion.div>
                                    </div>
                                    <div className="w-12 text-left text-xs font-bold text-gray-400">{uni.count}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Detailed Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">

                    {/* Recent Users */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Users size={20} className="text-blue-500" />
                                آخر المستخدمين المسجلين
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-gray-50 text-xs text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">الاسم</th>
                                        <th className="px-6 py-3 font-medium">الجامعة</th>
                                        <th className="px-6 py-3 font-medium">الدور</th>
                                        <th className="px-6 py-3 font-medium">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800">{user.name}</td>
                                            <td className="px-6 py-4 text-xs text-gray-600">{user.university || user.storeAddress}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-600' :
                                                    user.role === 'BOOKSTORE' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-400 font-mono">{user.joinDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Recent Books */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <BookOpen size={20} className="text-green-500" />
                                آخر الكتب المضافة
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-gray-50 text-xs text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">الكتاب</th>
                                        <th className="px-6 py-3 font-medium">البائع</th>
                                        <th className="px-6 py-3 font-medium">السعر</th>
                                        <th className="px-6 py-3 font-medium">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentBooks.map(book => (
                                        <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{book.title}</div>
                                                <div className="text-xs text-gray-400">{book.author}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-600">{book.seller}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-brand-orange">{book.price} ر.س</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 w-fit ${book.status === 'AVAILABLE' ? 'bg-green-100 text-green-600' :
                                                    book.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {book.status === 'AVAILABLE' ? <CheckCircle size={10} /> :
                                                        book.status === 'PENDING' ? <AlertCircle size={10} /> : null
                                                    }
                                                    {book.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                </div>

            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
