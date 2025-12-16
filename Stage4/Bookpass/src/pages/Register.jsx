import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        iban: '',
        agreeTerms: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { signUp } = useAuth();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.fullName || !formData.email || !formData.password) {
            setError('جميع الحقول مطلوبة');
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

        const { data, error: signUpError } = await signUp(
            formData.email,
            formData.password,
            formData.fullName
        );

        setLoading(false);

        if (signUpError) {
            setError(signUpError.message);
            return;
        }

        setSuccess('تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني');
    };

    return (

    );
};

export default Register;