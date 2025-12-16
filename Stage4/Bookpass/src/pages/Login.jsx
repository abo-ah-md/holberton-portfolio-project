import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();
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

        setLoading(true);

        const { data, error: signInError } = await signIn(
            formData.email,
            formData.password
        );

        setLoading(false);

        if (signInError) {
            if (signInError.message.includes('Invalid login credentials')) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            } else if (signInError.message.includes('Email not confirmed')) {
                setError('يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول');
            } else {
                setError(signInError.message);
            }
            return;
        }

        navigate('/');
    };

    return (

    );
};

export default Login;