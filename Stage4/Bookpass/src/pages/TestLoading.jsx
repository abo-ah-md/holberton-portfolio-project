import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const TestLoading = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const triggerLoading = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-brand-background flex-col font-sans" dir="rtl">
            <Navbar />

            {isLoading && <LoadingSpinner fullScreen={true} />}

            <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center gap-10">
                <h1 className="text-3xl font-bold text-brand-secondary mb-4">صفحة اختبار شاشة التحميل</h1>

                <div className="bg-brand-surface p-8 rounded-2xl shadow-lg max-w-2xl w-full text-center space-y-8">
                    <p className="text-brand-muted text-lg">
                        هذه الصفحة مخصصة لعرض شكل وتفاعل شاشة التحميل الجديدة.
                        <br />
                        التحميل يظهر تلقائياً عند فتح الصفحة لمدة 3 ثواني.
                    </p>

                    <button
                        onClick={triggerLoading}
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl text-xl"
                    >
                        إظهار شاشة التحميل مرة أخرى
                    </button>

                    <div className="pt-8 border-t border-brand-border w-full">
                        <h3 className="text-xl font-bold text-brand-secondary mb-6">أحجام مختلفة (مدمجة في الصفحة)</h3>
                        <div className="flex flex-wrap items-center justify-center gap-12 bg-brand-background p-6 rounded-xl">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-sm font-bold text-brand-muted">صغير (Small)</span>
                                <LoadingSpinner fullScreen={false} size="small" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-sm font-bold text-brand-muted">متوسط (Medium)</span>
                                <LoadingSpinner fullScreen={false} size="medium" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-sm font-bold text-brand-muted">كبير (Large)</span>
                                <LoadingSpinner fullScreen={false} size="large" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TestLoading;
