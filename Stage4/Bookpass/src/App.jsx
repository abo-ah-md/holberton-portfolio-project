import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import ProtectedRoute from './components/features/ProtectedRoute';
import PageTransition from './components/ui/PageTransition';
import ReviewerGuard from './components/features/ReviewerGuard';

// Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Terms from './pages/Terms';
import Cart from './pages/Cart';
import CheckoutPayment from './pages/CheckoutPayment';
import PaymentSuccess from './pages/PaymentSuccess';
import SellBook from './pages/SellBook';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import AdminBookReview from './pages/AdminBookReview';
import AdminDashboard from './pages/AdminDashboard';
import ComponentTest from './pages/ComponentTest';
import TestLoading from './pages/TestLoading';
import ErrorPage from './pages/ErrorPage';


function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <PageTransition>
                        <ReviewerGuard>
                            <Routes>
                                <Route path="/loading-test" element={<TestLoading />} />
                                <Route path="/component-test" element={<ComponentTest />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password" element={<ResetPassword />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/logout" element={<Logout />} />

                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/marketplace" element={<Marketplace />} />
                                <Route path="/terms" element={<Terms />} />

                                {/* Protected Routes */}
                                <Route
                                    path="/cart"
                                    element={
                                        <ProtectedRoute>
                                            <Cart />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/checkout"
                                    element={
                                        <ProtectedRoute>
                                            <CheckoutPayment />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/payment-success"
                                    element={
                                        <ProtectedRoute>
                                            <PaymentSuccess />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/sell"
                                    element={
                                        <ProtectedRoute>
                                            <SellBook />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/review"
                                    element={
                                        <ProtectedRoute allowedRoles={['ADMIN', 'BOOKSTORE']}>
                                            <AdminBookReview />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/dashboard"
                                    element={
                                        <ProtectedRoute allowedRoles={['ADMIN']}>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* 404 Page */}
                                <Route path="*" element={<ErrorPage type="404" />} />
                            </Routes>
                        </ReviewerGuard>
                    </PageTransition>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;