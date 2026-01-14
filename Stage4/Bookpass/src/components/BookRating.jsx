import './BookRating.css';

const BookRating = () => {
    return (
        <section className="book-rating border-b-[30px] border-[#c8876f]">
            <style>{`
                .rating-container {
                    display: flex;
                    flex-direction: row-reverse; /* Labels right, bar left */
                    gap: 50px; /* Minimal gap */
                    align-items: stretch;
                    justify-content: center; /* Center horizontally */
                }
                .rating-bar-custom {
                    width: 12px;
                    height: auto;
                    min-height: 250px;
                    background: linear-gradient(to top, #d17b6f 0%, #e89a6b 25%, #d4b968 50%, #c5d96b 75%, #7ee87f 100%);
                    border-radius: 6px;
                }
                .rating-labels-custom {
                    flex: initial; /* Don't stretch, stay close to bar */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 1.5rem;
                    text-align: right;
                    align-items: flex-start;
                }
                .rating-label {
                   display: flex;
                   flex-direction: column;
                   align-items: flex-start;
                }

                @media (min-width: 768px) {
                    .rating-container {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 0;
                    }
                    .rating-bar-custom {
                        width: 100%;
                        height: 24px;
                        min-height: auto;
                        background: linear-gradient(to right, #d17b6f 0%, #e89a6b 25%, #d4b968 50%, #c5d96b 75%, #7ee87f 100%);
                        border-radius: 12px;
                        margin-bottom: 40px;
                    }
                    .rating-labels-custom {
                        flex: 1;
                        flex-direction: row;
                        justify-content: space-between;
                        text-align: center;
                        align-items: center;
                        gap: 20px;
                    }
                    .rating-label {
                       align-items: center;
                    }
                }
            `}</style>

            {/* Main content */}
            <div className="rating-content">
                {/* Header with badge */}
                <div className="rating-header flex flex-col items-center justify-center gap-4 text-center">
                    <div className="">
                        <img src={new URL('../assets/ribbon-flag.svg', import.meta.url).href} alt="ribbon-flag" className="w-[100px] h-[100px]" />
                    </div>
                    <h2 className="rating-title">كيف يتم تقييم الكتب؟</h2>
                </div>

                <div className="rating-container">
                    {/* Gradient rating bar */}
                    <div className="rating-bar-custom"></div>

                    {/* Rating labels */}
                    <div className="rating-labels-custom">
                        <div className="rating-label">
                            <span className="label-main">ممتاز</span>
                            <span className="label-sub">شبه جديد،</span>
                            <span className="label-sub">بلا ملاحظات</span>
                        </div>
                        <div className="rating-label">
                            <span className="label-main">جيد جدًا</span>
                            <span className="label-sub">استخدام</span>
                            <span className="label-sub">خفيف جدًا</span>
                        </div>
                        <div className="rating-label">
                            <span className="label-main">جيد</span>
                            <span className="label-sub">آثار استهلاك</span>
                            <span className="label-sub">بسيطة</span>
                        </div>
                        <div className="rating-label">
                            <span className="label-main">مقبول</span>
                            <span className="label-sub">مستهلك</span>
                            <span className="label-sub">بشكل واضح</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookRating;
