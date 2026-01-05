import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ComponentTest from './pages/ComponentTest';
import './App.css';
import './index.css' //

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/component-test" element={<ComponentTest />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
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
            </Router>
        </AuthProvider>
    );
}

export default App;