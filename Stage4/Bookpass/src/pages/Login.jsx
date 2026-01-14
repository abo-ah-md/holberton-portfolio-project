import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { usePageLoading } from '../components/PageTransition';
import Logo from '../components/Logo';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const { isLoading, setIsLoading, setLoadingMessage } = usePageLoading();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoadingMessage("جاري تسجيل الدخول...");
    setIsLoading(true);

    const { data, error: signInError } = await signIn(
      formData.email,
      formData.password
    );

    setIsLoading(false);

    if (signInError) {
      setError(signInError || 'فشل تسجيل الدخول');
      return;
    }

    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row font-sans">
      {/* Left Side - Image */}
      <div
        className="hidden md:block md:w-[45%] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${new URL('../assets/books-bg.png', import.meta.url).href})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 md:p-20 relative overflow-hidden" dir="rtl">

        {/* Decorative Bottom Curve */}
        <div className="absolute -bottom-1/2 -left-[20%] -right-[20%] h-[70%] bg-[#1a2634] rounded-[50%_50%_0_0] z-0 pointer-events-none opacity-90"></div>

        {/* Logo */}
        <div className="absolute top-8 right-8 z-10">
          <Logo />
        </div>

        <div className="w-full max-w-[400px] text-center relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-10 leading-tight">مرحباً بعودتك</h1>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg mb-6 text-sm text-right">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-right">
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">البريد الإلكتروني</label>
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

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-bold text-gray-700">كلمة المرور</label>
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

            <div className="flex justify-between items-center mb-8">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#2D3D4D] cursor-pointer"
                />
                <span>تذكرني</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-[#2D3D4D] hover:underline font-medium transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              className="w-full p-3.5 bg-[#2D3D4D] hover:bg-[#3a4f63] text-white rounded-lg font-bold text-base transition-all shadow-lg shadow-[#2D3D4D]/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-500 font-medium">
            ليس لديك حساب؟ <Link to="/register" className="text-[#2D3D4D] font-bold hover:underline">سجل الآن</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
