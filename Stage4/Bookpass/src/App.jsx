import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './pages/Cart';
import CheckoutPayment from './pages/CheckoutPayment';
import PaymentSuccess from './pages/PaymentSuccess';
import SellBook from './pages/SellBook';
import Marketplace from './pages/Marketplace';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ComponentTest from './pages/ComponentTest';
import TestLoading from './pages/TestLoading';
import './App.css';
import './index.css';

import { CartProvider } from './context/CartContext';

import PageTransition from './components/PageTransition';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <PageTransition>
                        <Routes>
                            <Route path="/loading-test" element={<TestLoading />} />
                            <Route path="/component-test" element={<ComponentTest />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<CheckoutPayment />} />
                            <Route path="/payment-success" element={<PaymentSuccess />} />
                            <Route path="/sell" element={<SellBook />} />
                            <Route path="/marketplace" element={<Marketplace />} />
                            <Route path="/" element={<Home />} />
                            {/* <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Home />
                                    </ProtectedRoute>
                                }
                            /> */}
                        </Routes>
                    </PageTransition>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;                  