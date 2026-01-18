import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { usePageLoading } from '../components/ui/PageTransition';
import Logo from '../components/layout/Logo';
import ErrorPopup from '../components/ui/ErrorPopup';
import { Button } from '../components/ui/button';

import usePageTitle from '../hooks/usePageTitle';

const Login = () => {
  usePageTitle('تسجيل الدخول');
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

    if (data.role === 'BOOKSTORE') {
      navigate('/admin/review');
    } else if (data.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col-reverse md:flex-row font-sans">
      <ErrorPopup message={error} onClose={() => setError('')} />

      {/* Right Side - Form (Now First -> Right in RTL) */}
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 md:p-20 relative overflow-hidden" dir="rtl">

        {/* Decorative Bottom Curve */}


        {/* Logo */}
        <div className="absolute top-8 right-8 z-10">
          <Logo />
        </div>

        <div className="w-full max-w-[400px] text-center relative z-10">
          <h1 className="text-3xl font-bold text-brand-secondary mb-10 leading-tight">مرحباً بعودتك</h1>

          <form onSubmit={handleSubmit} className="text-right">
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-bold text-brand-secondary">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني"
                disabled={isLoading}
                className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-bold text-brand-secondary">كلمة المرور</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                disabled={isLoading}
                className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
              />
            </div>

            <div className="flex justify-between items-center mb-8">
              <label className="flex items-center gap-2 text-sm text-brand-text cursor-pointer hover:text-gray-800 transition-colors">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-brand-primary cursor-pointer"
                />
                <span>تذكرني</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-brand-muted hover:text-brand-primary hover:underline font-medium transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              variant="premium"
              size="xl"
              className="w-full rounded-lg font-bold"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <p className="mt-8 text-sm text-brand-muted font-medium">
            ليس لديك حساب؟ <Link to="/register" className="text-brand-primary font-bold hover:underline">سجل الآن</Link>
          </p>
        </div>
      </div>

      {/* Left Side - Background Image (Now Second -> Left in RTL) */}
      <div
        className="block w-full h-64 md:h-auto md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${new URL('../assets/books-bg.png', import.meta.url).href})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    </div >
  );
};

export default Login;
