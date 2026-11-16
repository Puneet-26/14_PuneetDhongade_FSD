import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PassList from './components/PassList';
import PassForm from './components/PassForm';
import AuthModal from './components/AuthModal';
import {
  api,
  getStoredUser,
  getStoredToken,
  removeStoredToken
} from './services/api';

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Fetch passes from backend
  const fetchPasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPasses();
      setPasses(res.data || []);
      setDataSource(res.source === 'MongoDB' ? 'MongoDB Atlas / Local' : 'In-Memory Fallback');
    } catch (err) {
      console.error('Failed to fetch passes:', err);
      setError(`Cannot reach API at ${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}. Ensure Program 5 backend is running.`);
      setDataSource('Disconnected');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);

  // Handle Logout
  const handleLogout = () => {
    removeStoredToken();
    setUser(null);
  };

  // Handle Delete Pass
  const handleDeletePass = async (id) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    if (!window.confirm(`Revoke and delete bus pass ${id}?`)) return;

    try {
      await api.deletePass(id);
      setPasses((prev) => prev.filter((p) => p.passId !== id && p._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
      if (err.status === 401) {
        setIsAuthOpen(true);
      }
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        passCount={passes.length}
      />

      <main className="main-content-area">
        <Routes>
          <Route
            path="/"
            element={
              <PassList
                passes={passes}
                loading={loading}
                error={error}
                onDelete={handleDeletePass}
                onRefresh={fetchPasses}
                dataSource={dataSource}
                user={user}
                onRequireAuth={() => setIsAuthOpen(true)}
              />
            }
          />
          <Route
            path="/apply"
            element={
              <PassForm
                user={user}
                onRequireAuth={() => setIsAuthOpen(true)}
                onPassCreated={fetchPasses}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          fetchPasses();
        }}
      />

      <footer className="footer-strip">
        <div className="footer-inner">
          <p>
            <strong>Program 5: Full-Stack MERN Bus Pass System</strong> | B.Tech (AI & DS), Semester V
          </p>
          <p className="credit">
            Developed by <strong>Puneet Dhongade (Roll No. 14)</strong> &copy; 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

