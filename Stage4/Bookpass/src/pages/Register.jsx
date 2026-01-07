import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { uploadFile } from '../services/fileService';
import { updateUserProfile } from '../services/authService'; // Import update function
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
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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

    setLoading(true);

    // 1. Register User first (to get Token)
    // We send empty profilePicture initially
    const { data: userData, error: signUpError } = await signUp(
      formData.email,
      formData.password,
      formData.fullName,
      formData.phoneNumber,
      ''
    );

    if (signUpError) {
      setLoading(false);
      setError(signUpError || 'فشل التسجيل');
      return;
    }

    // 2. If registration success AND file selected -> Upload & Update
    if (userData && selectedFile) {
      // Now we have a token in localStorage (handled by authService/AuthContext)
      const { url: imageUrl, error: uploadError } = await uploadFile(selectedFile);

      if (!uploadError && imageUrl) {
        // 3. Update Profile with the new image URL
        await updateUserProfile({ profilePicture: imageUrl });
        // IMPORTANT: Update local Auth Context so Navbar reflects change immediately
        updateUserState({ profilePicture: imageUrl });
      } else {
        // Optional: Notify user that image upload failed but account is created
        console.error('Image upload failed during registration:', uploadError);
      }
    }

    setLoading(false);
    setSuccess('تم التسجيل بنجاح! تم تسجيل دخولك تلقائياً');

    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-image"></div>

      <div className="auth-form-container">
        <div className="auth-logo">
          <Logo />
        </div>

        <div className="auth-form-wrapper">
          <h1>انضم إلينا الآن وابدأ تسوقك</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>

            {/* Profile Picture Upload - Optional */}
            <div className="flex flex-col items-center mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-brand-orange hover:bg-orange-50 transition-colors overflow-hidden relative group"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-brand-orange">
                    <Camera size={24} />
                    <span className="text-[10px] mt-1 text-center">صورة شخصية <br />(إختياري)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="fullName">
                اسم المستخدم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل اسمك"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل بريدك الإلكتروني"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">رقم الجوال (إختياري)</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="05xxxxxxxx"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="iban">رقم حساب البنكي للبائع IBAN (إختياري)</label>
              <input
                type="text"
                id="iban"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="SA00 0000 0000 0000 0000 0000"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span>أقبل سياسة الخصوصية والشروط <span className="text-red-500">*</span></span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري التسجيل...' : 'التسجيل'}
            </button>
          </form>

          <p className="auth-footer">
            لديك حساب مسجل ؟ <Link to="/login">سجل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
