// This is the new return statement for Profile.jsx (lines 187-530)
// Copy this entire content to replace the old return statement

return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 pt-20" dir="rtl">
        <Navbar />

        {/* Main Container */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-8">

            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar Section */}
                    <div className="relative">
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />

                        {/* Avatar */}
                        <div
                            onClick={isEditing ? handleFileClick : undefined}
                            className={`w-24 h-24 rounded-full border-4 border-brand-orange bg-gray-100 overflow-hidden shadow-lg flex items-center justify-center relative group ${isEditing ? 'cursor-pointer hover:border-orange-600 transition-colors' : ''}`}
                        >
                            {editData.profilePicture || user?.photoURL ? (
                                <img src={editData.profilePicture || user?.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-gray-400" />
                            )}

                            {/* Edit Overlay */}
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                            )}

                            {/* Upload Loader */}
                            {isUploadingImage && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-right space-y-3">
                        {isEditing ? (
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="الاسم الأول"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="اسم العائلة"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                                    />
                                </div>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={editData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="رقم الهاتف"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                                />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user?.firstName} {user?.lastName}
                                </h1>
                                <div className="space-y-2 text-base text-gray-600">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Mail size={18} />
                                        <span>{user?.email}</span>
                                    </div>
                                    {user?.phoneNumber && (
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <Phone size={18} />
                                            <span>{user.phoneNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Edit/Save Buttons */}
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-md"
                            >
                                <Edit2 size={18} />
                                <span>تعديل الملف</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    <span>حفظ</span>
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                                >
                                    <X size={18} />
                                    <span>إلغاء</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Purchases */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">إجمالي المشتريات</p>
                            <p className="text-3xl font-bold text-gray-900">{purchases.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Sales */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">إجمالي المبيعات</p>
                            <p className="text-3xl font-bold text-gray-900">{sales.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Active Listings */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">الكتب المعروضة</p>
                            <p className="text-3xl font-bold text-gray-900">{myListedBooks.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="text-brand-orange" size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Spent */}
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">إجمالي الإنفاق</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {purchases.reduce((sum, book) => sum + (book.price || 0), 0)} ر.س
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Section with Tabs */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Tabs Header */}
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('purchases')}
                            className={`flex-1 px-6 py-4 font-bold text-base transition-colors ${activeTab === 'purchases'
                                    ? 'bg-brand-orange text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            مشترياتي ({purchases.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('sales')}
                            className={`flex-1 px-6 py-4 font-bold text-base transition-colors ${activeTab === 'sales'
                                    ? 'bg-brand-orange text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            مبيعاتي ({sales.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`flex-1 px-6 py-4 font-bold text-base transition-colors ${activeTab === 'listings'
                                    ? 'bg-brand-orange text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            كتبي المعروضة ({myListedBooks.length})
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    {ordersLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {/* Purchases Tab */}
                            {activeTab === 'purchases' && (
                                <div>
                                    {purchases.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {purchases.map(book => (
                                                <OrderBookCard key={book.id} book={book} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                            <ShoppingBag size={64} className="mb-4 opacity-20" />
                                            <p className="text-xl font-bold mb-2">لا توجد مشتريات بعد</p>
                                            <p className="text-sm mb-6">ابدأ بتصفح الكتب المتاحة</p>
                                            <button
                                                onClick={() => navigate('/marketplace')}
                                                className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                                            >
                                                تصفح السوق
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Sales Tab */}
                            {activeTab === 'sales' && (
                                <div>
                                    {sales.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {sales.map(book => (
                                                <OrderBookCard key={`sold-${book.id}`} book={book} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                            <DollarSign size={64} className="mb-4 opacity-20" />
                                            <p className="text-xl font-bold mb-2">لا توجد مبيعات بعد</p>
                                            <p className="text-sm mb-6">قم بعرض كتبك للبيع</p>
                                            <button
                                                onClick={() => navigate('/sell')}
                                                className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                                            >
                                                <Plus size={20} />
                                                <span>عرض كتاب للبيع</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Listings Tab */}
                            {activeTab === 'listings' && (
                                <div>
                                    {myListedBooks.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {myListedBooks.map((book, index) => (
                                                    <div key={book.id} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                                                        <div className="flex gap-4">
                                                            <div className="w-20 h-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                                {book.image && <img src={book.image} alt={book.title} className="w-full h-full object-cover" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-gray-900 text-base mb-1 truncate">
                                                                    {book.title}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
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
                                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <p className="text-yellow-900 text-sm flex items-start gap-2">
                                                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                                    <span>بعد التسليم والمراجعة، سيتم عرض كتبك في المتجر ليراها آلاف الطلاب.</span>
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                            <BookOpen size={64} className="mb-4 opacity-20" />
                                            <p className="text-xl font-bold mb-2">لا توجد كتب معروضة</p>
                                            <p className="text-sm mb-6">ابدأ ببيع كتبك الآن</p>
                                            <button
                                                onClick={() => navigate('/sell')}
                                                className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                                            >
                                                <Plus size={20} />
                                                <span>عرض كتاب للبيع</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => navigate('/sell')}
                    className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-md"
                >
                    <Plus size={24} />
                    <span>عرض كتاب للبيع</span>
                </button>
                <button
                    onClick={() => navigate('/marketplace')}
                    className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-6 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-md"
                >
                    <Store size={24} />
                    <span>تصفح السوق</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 px-6 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-md"
                >
                    <LogOut size={24} />
                    <span>تسجيل الخروج</span>
                </button>
            </div>

        </main>

        <Footer />
    </div>
);
