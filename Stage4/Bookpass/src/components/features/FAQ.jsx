import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_DATA = [
    {
        question: "ما هي منصة بوك باس؟",
        answer: "بوك باس هي منصة إلكترونية تربط بين الطلاب الجامعيين لبيع وشراء الكتب المستعملة بطريقة آمنة وسهلة، وتضمن حقوق الطرفين من خلال فحص الكتب عبر مكتبات الجامعات."
    },
    {
        question: "هل يمكنني إرجاع الكتاب بعد شرائه؟",
        answer: "كأصل عام، لا تتوفر سياسة إرجاع للكتب المستعملة بعد إتمام الاستلام. ومع ذلك، يتم فحص الكتاب من قبل مكتبة الجامعة للتأكد من مطابقته للوصف قبل تسليمه لك، مما يضمن حقك في استلام كتاب سليم."
    },
    {
        question: "كيف يتم ضمان حالة الكتاب؟",
        answer: "تتميز بوك باس بآلية فحص فريدة، حيث يقوم البائع بتسليم الكتاب لمكتبة الجامعة، وتقوم المكتبة بفحصه ومطابقته مع الوصف المعروض قبل تسليمه للمشتري."
    },
    {
        question: "هل تعمل المنصة في جميع الجامعات؟",
        answer: "نعمل حالياً في عدد مختار من الجامعات السعودية، ونسعى للتوسع لتغطية كافة جامعات المملكة قريباً. يمكنك تصفية الكتب حسب جامعتك لرؤية العروض المتاحة."
    },
    {
        question: "كيف أستلم أموالي كبائع؟",
        answer: "بمجرد تأكيد المشتري لاستلام الكتاب ومطابقته للمواصفات، تقوم المنصة بتحويل المبلغ المستحق إلى حسابك البنكي أو محفظتك الرقمية المسجلة لدينا."
    }
];

const FAQItem = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-brand-border last:border-0">
            <button
                onClick={onClick}
                className="w-full py-6 flex items-center justify-between gap-4 text-right focus:outline-none group"
            >
                <span className={`text-lg md:text-xl font-bold transition-colors ${isOpen ? 'text-brand-primary' : 'text-brand-secondary group-hover:text-brand-primary'}`}>
                    {item.question}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-brand-primary text-white' : 'bg-gray-100 text-brand-secondary group-hover:bg-brand-primary/10'}`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-brand-muted text-base md:text-lg leading-relaxed">
                            {item.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const ReviewConditionsModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-3xl p-6 md:p-8 z-50 shadow-2xl overflow-y-auto max-h-[90vh]"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl md:text-2xl font-black text-brand-secondary">معايير فحص الكتب</h3>
                                <p className="text-sm text-brand-muted">دليل تصنيف حالة الكتب في منصة بوك باس</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start">
                                <Minus size={24} className="rotate-45 text-brand-secondary" />
                            </button>
                        </div>

                        {/* Replicating BookRating Visual Style (Vertical Layout) */}
                        <div className="flex flex-row-reverse justify-center gap-8 min-h-[300px] px-4">

                            {/* Gradient Bar */}
                            <div
                                className="w-3 rounded-full"
                                style={{
                                    background: 'linear-gradient(to top, #d17b6f 0%, #e89a6b 25%, #d4b968 50%, #c5d96b 75%, #7ee87f 100%)'
                                }}
                            />

                            {/* Labels */}
                            <div className="flex flex-col justify-between py-2 text-right flex-1">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="font-bold text-lg text-[#3A4958]">ممتاز</span>
                                    <div className="text-sm text-gray-500 leading-tight">
                                        <span>شبه جديد،</span> <br /> <span>بلا ملاحظات</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <span className="font-bold text-lg text-[#3A4958]">جيد جدًا</span>
                                    <div className="text-sm text-gray-500 leading-tight">
                                        <span>استخدام</span> <br /> <span>خفيف جدًا</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <span className="font-bold text-lg text-[#3A4958]">جيد</span>
                                    <div className="text-sm text-gray-500 leading-tight">
                                        <span>آثار استهلاك</span> <br /> <span>بسيطة</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-1">
                                    <span className="font-bold text-lg text-[#3A4958]">مقبول</span>
                                    <div className="text-sm text-gray-500 leading-tight">
                                        <span>مستهلك</span> <br /> <span>بشكل واضح</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-xs text-brand-muted bg-gray-50 p-4 rounded-xl">
                            يتم فحص جميع الكتب بدقة من قبل مكتبات الجامعات المعتمدة للتأكد من مطابقتها لهذه المعايير قبل التسليم.
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    // Helper to render answer content specifically for the criteria question
    const renderAnswer = (item, index) => {
        // Question index 2 is "كيف يتم ضمان حالة الكتاب؟"
        if (index === 2) {
            return (
                <div className="flex flex-col items-start gap-4">
                    <span>{item.answer}</span>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-brand-primary font-bold text-sm bg-brand-primary/10 px-4 py-2 rounded-xl hover:bg-brand-primary/20 transition-colors"
                    >
                        عرض معايير الفحص
                    </button>
                </div>
            )
        }
        return item.answer;
    };

    return (
        <section className="py-20 bg-brand-primary">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl shadow-sm mb-6 text-white backdrop-blur-sm">
                        <HelpCircle size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        الأسئلة الشائعة
                    </h2>
                    <p className="text-white/80 text-lg">
                        إجابات على أكثر الأسئلة تكراراً حول استخدام منصة بوك باس
                    </p>
                </div>

                {/* FAQ List */}
                <div className="bg-white rounded-3xl shadow-sm border border-brand-border p-6 md:p-10">
                    {FAQ_DATA.map((item, index) => (
                        <FAQItem
                            key={index}
                            item={{ ...item, answer: renderAnswer(item, index) }}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Modal Portal - Rendered at root level ideally, but inline here works for demo */}
            <ReviewConditionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
};

export default FAQ;
