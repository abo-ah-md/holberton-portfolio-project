import './BookRating.css';

const BookRating = () => {
    return (
        <section className="book-rating">
            {/* Decorative wave top edge */}
            <div className="rating-wave-top">
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,40 C150,80 350,0 500,40 C650,80 800,20 1000,50 C1150,75 1300,30 1440,60 L1440,0 L0,0 Z" fill="#ffffff" />
                </svg>
            </div>

            {/* Left decorative elements */}
            <div className="rating-decorations">
                <div className="decoration-bookmark"></div>
                <div className="decoration-triangle"></div>
            </div>

            {/* Main content */}
            <div className="rating-content">
                {/* Header with badge */}
                <div className="rating-header">
                    <h2 className="rating-title">كيف يتم تقييم الكتب؟</h2>
                    <div className="rating-badge">
                        <svg className="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Gradient rating bar */}
                <div className="rating-bar"></div>

                {/* Rating labels */}
                <div className="rating-labels">
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
        </section>
    );
};

export default BookRating;
