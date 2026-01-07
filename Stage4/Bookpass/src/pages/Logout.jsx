import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import WhiteLogo from '../components/WhiteLogo';

const Logout = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Perform the sign out action
        const performLogout = async () => {
            await signOut();
            // Optional: Redirect after a few seconds or let them stay
            setTimeout(() => {
                navigate('/');
            }, 6000);
        };
        performLogout();
    }, [signOut, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark relative overflow-hidden text-center p-4">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.1, scale: 1.2 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-orange blur-3xl"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.1, scale: 1.2 }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 2 }}
                    className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-400 blur-3xl opacity-10"
                />
            </div>

            <div className="z-10 bg-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="bg-brand-orange p-4 rounded-full shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    تم تسجيل الخروج بنجاح
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-300 mb-8"
                >
                    نأمل أن نراك قريبًا في بوك باس!
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full flex justify-center"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="bg-brand-orange hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        العودة للرئيسية
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="mr-4 bg-transparent border border-white/30 hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
                    >
                        تسجيل الدخول
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-8 pt-6 border-t border-white/10 flex justify-center"
                >
                    <div className="scale-75 origin-center opacity-70">
                        <WhiteLogo />
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default Logout;
