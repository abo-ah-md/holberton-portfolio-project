import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { uploadFile } from '../services/fileService';
import { updateUserProfile } from '../services/authService';
import { usePageLoading } from '../components/PageTransition';
import { Camera } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    iban: '',
    phoneNumber: '',
    // profilePicture starts empty; we'll manage the file separately
    profilePicture: '',
    agreeTerms: false,
  });
  const [selectedFile, setSelectedFile] = useState(null); // Store file object
  const [previewUrl, setPreviewUrl] = useState(''); // Local preview URL
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const { isLoading, setIsLoading, setLoadingMessage } = usePageLoading();

  const { signUp, updateUserState } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (!/[A-Z]/.test(password)) return 'كلمة المرور يجب أن تحتوي على حرف كبير';
    if (!/[a-z]/.test(password)) return 'كلمة المرور يجب أن تحتوي على حرف صغير';
    if (!/[0-9]/.test(password)) return 'كلمة المرور يجب أن تحتوي على رقم';
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create local preview and store file
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
    setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('جميع الحقول المطلوبة يجب تعبئتها');
      return;
    }

    if (!formData.agreeTerms) {
      setError('يجب الموافقة على سياسة الخصوصية والشروط');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoadingMessage("جاري إنشاء حسابك...");
    setIsLoading(true);

    try {
      // 1. Register User first
      const { data: userData, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phoneNumber,
        ''
      );

      if (signUpError) {
        setIsLoading(false);
        setError(signUpError || 'فشل التسجيل');
        return;
      }

      // 2. If registration success AND (file selected OR iban entered) -> Update Profile
      if (userData && (selectedFile || formData.iban)) {
        setLoadingMessage("جاري إكمال ملفك الشخصي...");
        let profilePicture = '';
        if (selectedFile) {
          const { url: imageUrl, error: uploadError } = await uploadFile(selectedFile);
          if (!uploadError && imageUrl) {
            profilePicture = imageUrl;
          }
        }

        const { data: updatedData, error: updateError } = await updateUserProfile({
          iban: formData.iban,
          profilePicture: profilePicture || undefined
        });

        if (!updateError && updatedData) {
          updateUserState(updatedData);
        }
      }

      setIsLoading(false);
      setSuccess('تم التسجيل بنجاح! تم تسجيل دخولك تلقائياً');

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      setError('حدث خطأ غير متوقع');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row font-sans overflow-x-hidden">
      {/* Left Side - Image */}
      <div
        className="hidden md:block md:w-[45%] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${new URL('../assets/books-bg.png', import.meta.url).href})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden" dir="rtl">


        {/* Logo */}
        <div className="absolute top-8 right-8 z-10">
          <Logo />
        </div>

        <div className="w-full max-w-[400px] text-center relative z-10 my-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">انضم إلينا الآن وابدأ تسوقك</h1>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg mb-6 text-sm text-right">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 border border-green-100 p-3 rounded-lg mb-6 text-sm text-right">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-right">

            {/* Profile Picture Upload - Optional */}
            <div className="flex flex-col items-center mb-8">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50 transition-colors overflow-hidden relative group bg-white"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-[#F97316]">
                    <Camera size={24} />
                    <span className="text-xs mt-1 text-center font-medium">صورة شخصية <br />(إختياري)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="fullName" className="block mb-2 text-sm font-bold text-gray-700">
                اسم المستخدم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل اسمك"
                disabled={isLoading}
                className="w-full p-3.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#2D3D4D] focus:bg-white focus:ring-4 focus:ring-[#2D3D4D]/10 transition-all text-right placeholder-gray-400"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني"
                disabled={isLoading}
                className="w-full p-3.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#2D3D4D] focus:bg-white focus:ring-4 focus:ring-[#2D3D4D]/10 transition-all text-right placeholder-gray-400"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-bold text-gray-700">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                disabled={isLoading}
                className="w-full p-3.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#2D3D4D] focus:bg-white focus:ring-4 focus:ring-[#2D3D4D]/10 transition-all text-right placeholder-gray-400"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-2 text-sm font-bold text-gray-700">رقم الجوال (إختياري)</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="05xxxxxxxx"
                disabled={isLoading}
                className="w-full p-3.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#2D3D4D] focus:bg-white focus:ring-4 focus:ring-[#2D3D4D]/10 transition-all text-right placeholder-gray-400"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="iban" className="block mb-2 text-sm font-bold text-gray-700">رقم حساب البنكي للبائع IBAN (إختياري)</label>
              <input
                type="text"
                id="iban"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="SA00 0000 0000 0000 0000 0000"
                disabled={isLoading}
                className="w-full p-3.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#2D3D4D] focus:bg-white focus:ring-4 focus:ring-[#2D3D4D]/10 transition-all text-right placeholder-gray-400"
              />
            </div>

            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#2D3D4D] cursor-pointer"
                />
                <span>أقبل سياسة الخصوصية والشروط <span className="text-red-500">*</span></span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full p-3.5 bg-[#2D3D4D] hover:bg-[#3a4f63] text-white rounded-lg font-bold text-base transition-all shadow-lg shadow-[#2D3D4D]/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? 'جاري التسجيل...' : 'التسجيل'}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-500 font-medium">
            لديك حساب مسجل ؟ <Link to="/login" className="text-[#2D3D4D] font-bold hover:underline">سجل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
