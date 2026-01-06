import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, CheckCircle, BookOpen } from 'lucide-react';

const SellBook = () => {
    const [step, setStep] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl">
            <Navbar />

            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
                <main className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">

                    {step === 1 ? (
                        <>
                            <div className="text-center mb-10">
                                <div className="inline-flex p-4 bg-brand-orange/10 rounded-full mb-4 text-brand-orange">
                                    <BookOpen size={48} />
                                </div>
                                <h1 className="text-3xl font-black text-brand-slate mb-3">اعرض كتابك للبيع</h1>
                                <p className="text-gray-500 max-w-md mx-auto">قم بتعبئة بيانات الكتاب بدقة لزيادة فرص بيعه بسرعة. نحن نساعدك في الوصول لآلاف الطلاب.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="font-bold text-gray-700">عنوان الكتاب</label>
                                        <input required type="text" placeholder="مثال: مقدمة في الفيزياء" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-bold text-gray-700">اسم المؤلف</label>
                                        <input required type="text" placeholder="مثال: د. أحمد محمد" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="font-bold text-gray-700">الجامعة / الكلية</label>
                                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition cursor-pointer">
                                            <option>اختر الجامعة</option>
                                            <option>جامعة الملك سعود</option>
                                            <option>جامعة الملك فهد للبترول والمعادن</option>
                                            <option>جامعة الأميرة نورة</option>
                                            <option>جامعة القصيم</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-bold text-gray-700">السعر المطلوب (ر.س)</label>
                                        <input required type="number" placeholder="00" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700">حالة الكتاب</label>
                                    <div className="flex gap-4">
                                        {['جديد', 'ممتاز', 'جيد جداً', 'جيد', 'مقبول'].map((status) => (
                                            <label key={status} className="flex-1 cursor-pointer">
                                                <input type="radio" name="status" className="peer sr-only" />
                                                <div className="text-center py-2 rounded-lg border border-gray-200 peer-checked:bg-brand-slate peer-checked:text-white peer-checked:border-brand-slate hover:bg-gray-50 transition text-sm font-bold">
                                                    {status}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700">صورة الكتاب</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50/50 hover:border-brand-orange/50 transition cursor-pointer group">
                                        <Upload size={32} className="mb-2 group-hover:text-brand-orange transition-colors" />
                                        <span className="font-bold text-sm">اسحب الصورة هنا أو اضغط للرفع</span>
                                        <span className="text-xs mt-1">PNG, JPG حتى 5MB</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-[#C17554] hover:bg-[#a95234] text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all">
                                        نشر الإعلان الآن
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-12 animate-in zoom-in duration-300">
                            <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-full mb-6">
                                <CheckCircle size={64} />
                            </div>
                            <h2 className="text-3xl font-black text-brand-slate mb-4">تم استلام طلبك بنجاح!</h2>
                            <p className="text-gray-600 mb-8 text-lg">سيتم مراجعة إعلانك ونشره خلال 24 ساعة.<br />شكراً لاستخدامك بوك باس.</p>
                            <button onClick={() => setStep(1)} className="text-brand-orange font-bold hover:underline">
                                إضافة كتاب آخر
                            </button>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default SellBook;
