import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PassList from './components/PassList';
import PassForm from './components/PassForm';
import { INITIAL_PASSES } from './data/initialPasses';

const STORAGE_KEY = 'mumbai_bus_passes_roll14';

export default function App() {
  // Initialize state from localStorage or seed data
  const [passes, setPasses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed reading from localStorage:', err);
    }
    return INITIAL_PASSES;
  });

  // Sync to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
    } catch (err) {
      console.error('Failed writing to localStorage:', err);
    }
  }, [passes]);

  // Handler to add a new pass
  const handleAddPass = (newPass) => {
    setPasses((prev) => [newPass, ...prev]);
  };

  // Handler to delete/revoke a pass
  const handleDeletePass = (id) => {
    const target = passes.find((p) => p.id === id);
    if (!target) return;

    if (window.confirm(`Revoke bus pass ${id} for ${target.passengerName}?`)) {
      setPasses((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Handler to restore initial seed data
  const handleResetSeed = () => {
    if (window.confirm('Reset all passes back to initial Mumbai sample data?')) {
      setPasses(INITIAL_PASSES);
    }
  };

  return (
    <div className="app-shell">
      <Navbar passCount={passes.length} />

      <main className="main-content-area">
        <Routes>
          <Route
            path="/"
            element={
              <PassList
                passes={passes}
                onDelete={handleDeletePass}
                onResetSeed={handleResetSeed}
              />
            }
          />
          <Route
            path="/apply"
            element={<PassForm onAddPass={handleAddPass} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer-strip">
        <div className="footer-inner">
          <p>
            <strong>Program 2: React Component Hierarchy & Client Routing</strong> | B.Tech (AI & DS), Semester V
          </p>
          <p className="credit">
            Developed by <strong>Puneet Dhongade (Roll No. 14)</strong> &copy; 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

