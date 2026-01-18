import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Quote, Star } from 'lucide-react';

const MOCK_TESTIMONIALS = [
    {
        id: 1,
        name: "سارة العنزي",
        role: "جامعة الملك سعود",
        content: "بوك باس سهل عليّ بيع كتبي القديمة بدلاً من رميها. التطبيق سهل الاستخدام جداً والطلاب متجاوبين.",
        rating: 5
    },
    {
        id: 2,
        name: "خالد المطيري",
        role: "جامعة الإمام",
        content: "كنت أبحث عن كتب طبية بأسعار معقولة ووجدتها هنا بنصف السعر. فكرة ممتازة وتوفر علينا الكثير.",
        rating: 5
    },
    {
        id: 3,
        name: "نورة القحطاني",
        role: "جامعة الأميرة نورة",
        content: "تجربة رائعة! اشتريت 3 كتب واستلمتها في نفس اليوم من الجامعة. أنصح كل الطلاب باستخدامه.",
        rating: 4
    },
    {
        id: 4,
        name: "فهد الدوسري",
        role: "جامعة الملك فهد للبترول والمعادن",
        content: "أفضل منصة للكتب الجامعية. التصميم جميل وسلس، والبحث عن الكتب المحددة سريع جداً.",
        rating: 5
    },
    {
        id: 5,
        name: "شهد محمد",
        role: "جامعة الملك عبدالعزيز",
        content: "ساعدني بوك باس في توفير ميزانية الكتب لهذا الفصل. الكتب نظيفة وكأنها جديدة.",
        rating: 5
    }
];

const Testimonials = () => {
    // Embla Carousel with AutoScroll Plugin (Conveyor Belt Effect)
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
        dragFree: true,
        direction: 'rtl',
    }, [
        AutoScroll({
            speed: 0.8, // Slightly slower than books for reading text
            stopOnMouseEnter: true,
            stopOnInteraction: false
        })
    ]);

    // Duplicate arrays to ensure smooth infinite loop logic for all screen sizes
    const testimonials = [...MOCK_TESTIMONIALS, ...MOCK_TESTIMONIALS, ...MOCK_TESTIMONIALS];

    return (
        <section className="py-20 relative w-full overflow-hidden bg-brand-primary">
            <div className="container mx-auto px-4 mb-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full font-bold text-sm mb-4">
                    <Star className="w-4 h-4 fill-white" />
                    <span>آراء الطلاب</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-sm">
                    ماذا يقول الطلاب عنا؟
                </h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                    قصص نجاح وتجارب حقيقية من طلاب استخدموا بوك باس لبيع وشراء كتبهم الجامعية.
                </p>
            </div>

            {/* Carousel Container */}
            <div className="w-full overflow-hidden cursor-grab active:cursor-grabbing pb-10" ref={emblaRef} dir="rtl">
                <div className="flex touch-pan-y -ml-6 py-4 px-0">
                    {testimonials.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex-[0_0_auto] min-w-0 pl-6 basis-[350px] md:basis-[400px]">
                            <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl h-full flex flex-col relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <Quote className="absolute top-6 left-6 text-brand-primary/10 w-12 h-12 rotate-180 group-hover:text-brand-primary/20 transition-colors" />

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-brand-secondary text-lg font-medium leading-relaxed mb-6 flex-1">
                                    "{item.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 rounded-full bg-brand-secondary/5 flex items-center justify-center text-brand-secondary font-bold text-lg">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div className="text-right">
                                        <h4 className="font-bold text-brand-secondary">{item.name}</h4>
                                        <p className="text-sm text-brand-muted">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
