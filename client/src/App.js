import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Search from './pages/Search';
import AddMovie from './pages/AddMovie';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />

            <Route path="/search" element={
                <ProtectedRoute>
                    <Search />
                </ProtectedRoute>
            } />

            <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                    <Admin />
                </ProtectedRoute>
            } />

            <Route path="/admin/add" element={
                <ProtectedRoute requireAdmin>
                    <AddMovie />
                </ProtectedRoute>
            } />

            <Route path="/admin/edit/:id" element={
                <ProtectedRoute requireAdmin>
                    <AddMovie />
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
