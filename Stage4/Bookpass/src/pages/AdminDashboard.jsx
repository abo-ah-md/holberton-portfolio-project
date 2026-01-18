import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, BookOpen, DollarSign, TrendingUp, AlertCircle,
    CheckCircle, Clock, GraduationCap, ArrowUpRight, ShieldCheck
} from 'lucide-react';
import SaudiRiyalIcon from '../components/icons/SaudiRiyalIcon';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getDashboardStats } from '../services/adminService';
import { getStorePendingBooks, getStoreSoldBooks } from '../services/bookService';
import { usePageLoading } from '../components/ui/PageTransition';
import { UNIVERSITIES } from '../constants/universities';

// Reusable Stats Card Component
const StatsCard = ({ title, value, subtext, icon: Icon, delay, iconPadding = "p-3" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay, duration: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden group cursor-pointer"
        whileHover={{
            scale: 1.03,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
    >
        {/* Diagonal Split Layout */}
        <div className="flex h-full min-h-[110px]">
            {/* Content - Right */}
            <div className="flex-1 flex flex-col justify-center">
                <p className="text-brand-secondary text-sm font-bold mb-2">{title}</p>
                <div className="flex items-baseline gap-2">
                    <motion.h3
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-black text-brand-primary"
                    >
                        {value}
                    </motion.h3>
                </div>
                {subtext && <p className="text-xs text-brand-muted mt-2 font-medium">{subtext}</p>}
            </div>

            {/* Icon - Left (Brand Primary) */}
            <motion.div
                whileHover={{ x: -4 }}
                className="w-[35%] bg-gradient-to-br from-brand-primary to-brand-primary/80 flex items-center justify-center relative z-10 shadow-lg rounded-xl -ml-6 -my-6 mr-4"
                style={{ clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)' }}
            >
                <motion.div
                    whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                    }}
                >
                    <Icon size={32} className="text-white" />
                </motion.div>
            </motion.div>
        </div>
    </motion.div>
);

import usePageTitle from '../hooks/usePageTitle';

const AdminDashboard = () => {
    usePageTitle('لوحة التحكم');
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

                // Check for errors in individual responses
                if (statsRes.error || pendingRes.error || soldRes.error) {
                    const errorMsg = statsRes.error || pendingRes.error || soldRes.error;
                    if (errorMsg.includes('403') || errorMsg.includes('Not authenticated')) {
                        setStats('ACCESS_DENIED');
                        return; // Stop processing
                    }
                }

                setStats(statsRes.data);

                // Calculate unique counts
                const uniqueReview = pendingRes.data ? new Set(pendingRes.data.map(b => b.id)).size : 0;
                // Only count books that are SOLD but not yet PICKED
                const uniquePickup = soldRes.data ? new Set(soldRes.data.filter(b => b.listingStatus === 'SOLD').map(b => b.id)).size : 0;

                setPendingCounts({ review: uniqueReview, pickup: uniquePickup });

            } catch (error) {
                console.error("Failed to load dashboard data", error);
                setStats(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, [setIsLoading, setLoadingMessage]);

    if (!stats) return null;

    if (stats === 'ACCESS_DENIED') {
        return (
            <div className="min-h-screen bg-brand-secondary pt-20 flex items-center justify-center text-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                    <ShieldCheck size={64} className="mx-auto text-brand-error mb-4" />
                    <h1 className="text-2xl font-bold text-brand-secondary mb-2">تم رفض الوصول</h1>
                    <p className="text-brand-muted mb-6">ليس لديك الصلاحيات الكافية لعرض هذه الصفحة أو انتهت جلسة تسجيل الدخول.</p>
                    <Link to="/login" className="block w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-primary/90 transition">
                        تسجيل الدخول مجدداً
                    </Link>
                    <Link to="/" className="block mt-4 text-brand-muted hover:text-brand-secondary text-sm font-bold">
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        );
    }

    const { metrics, universityStats, recentUsers, recentBooks } = stats;

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-brand-secondary font-sans pt-20" dir="rtl">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center text-white mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
                        <p className="text-brand-muted mt-1 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-brand-primary" />
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
                        delay={0.1}
                    />
                    <StatsCard
                        title="إجمالي المبيعات"
                        value={
                            <div className="flex items-center gap-1">
                                {metrics.totalRevenue} <SaudiRiyalIcon size={30} />
                            </div>
                        }
                        subtext={`${metrics.soldBooks} كتاب تم بيعه`}
                        icon={DollarSign}

                        delay={0.2}
                    />
                    <StatsCard
                        title="إجمالي المستخدمين"
                        value={metrics.totalUsers}
                        subtext={`${metrics.activeUsers} مستخدم نشط`}
                        icon={Users}
                        delay={0.3}
                    />
                    <StatsCard
                        title="المراجعين (السفراء)" //don't edit it
                        value={metrics.universities || metrics.reviewers}
                        subtext={null}
                        icon={() => <img src={new URL('../assets/ribbon-flag.svg', import.meta.url).href} alt="icon" className="w-10 h-10" />}
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
                        className="bg-gradient-to-br from-brand-primary/90 to-brand-accent rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
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

                            <Link
                                to="/admin/review"
                                className="w-full bg-white text-brand-primary font-bold py-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <span>بدء المراجعة</span>
                                <ArrowUpRight size={18} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* University Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-brand-border"
                    >
                        <h3 className="font-bold text-brand-secondary mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-brand-primary" />
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
                                            className={`h-full ${uni.color || 'bg-brand-primary'} rounded-full`}
                                        ></motion.div>
                                    </div>
                                    <div className="w-12 text-left text-xs font-bold text-brand-muted">{uni.count}</div>
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
                        <div className="p-6 border-b border-brand-border flex justify-between items-center">
                            <h3 className="font-bold text-brand-secondary flex items-center gap-2">
                                <Users size={20} className="text-brand-primary" />
                                آخر المستخدمين المسجلين
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-brand-background text-xs text-brand-muted">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">الاسم</th>
                                        <th className="px-6 py-3 font-medium">الجامعة</th>
                                        <th className="px-6 py-3 font-medium">الدور</th>
                                        <th className="px-6 py-3 font-medium">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border">
                                    {recentUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-brand-background/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-brand-secondary">{user.name}</td>
                                            <td className="px-6 py-4 text-xs text-brand-muted">{user.university || user.storeAddress}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${user.role === 'ADMIN' ? 'bg-brand-error/10 text-brand-error' :
                                                    user.role === 'BOOKSTORE' ? 'bg-brand-accent/10 text-brand-accent' :
                                                        'bg-brand-primary/10 text-brand-primary'
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
                        <div className="p-6 border-b border-brand-border flex justify-between items-center">
                            <h3 className="font-bold text-brand-secondary flex items-center gap-2">
                                <BookOpen size={20} className="text-brand-success" />
                                آخر الكتب المضافة
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-brand-background text-xs text-brand-muted">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">الكتاب</th>
                                        <th className="px-6 py-3 font-medium">البائع</th>
                                        <th className="px-6 py-3 font-medium">السعر</th>
                                        <th className="px-6 py-3 font-medium">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border">
                                    {recentBooks.map(book => (
                                        <tr key={book.id} className="hover:bg-brand-background/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-brand-secondary truncate max-w-[150px]">{book.title}</div>
                                                <div className="text-xs text-brand-muted">{book.author}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-brand-muted">{book.seller}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-brand-primary flex items-center gap-1">
                                                {book.price} <SaudiRiyalIcon size={14} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 w-fit ${book.status === 'AVAILABLE' ? 'bg-brand-success/10 text-brand-success' :
                                                    book.status === 'PENDING' ? 'bg-brand-primary/10 text-brand-primary' :
                                                        'bg-brand-muted/10 text-brand-muted'
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
