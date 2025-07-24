import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import AddHabit from './pages/AddHabit';
import EditHabit from './pages/EditHabit';
import Login from './pages/Login';
import Register from './pages/Register';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';
import Calendar from './pages/Calendar';

const LS_HABITS = 'habitnest_habits';
const LS_COMPLETIONS = 'habitnest_completions';
const LS_ACHIEVEMENTS = 'habitnest_achievements';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]); // {habitId, date}
  const [achievements, setAchievements] = useState([]); // {title, desc, progress, complete, date}
  const location = useLocation();
  const unauthRoutes = ['/', '/login', '/register'];
  const showNav = !unauthRoutes.includes(location.pathname);
  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    setHabits(JSON.parse(localStorage.getItem(LS_HABITS)) || []);
    const loadedCompletions = JSON.parse(localStorage.getItem(LS_COMPLETIONS));
    if (!Array.isArray(loadedCompletions)) {
      setCompletions([]);
      localStorage.setItem(LS_COMPLETIONS, JSON.stringify([]));
    } else {
      setCompletions(loadedCompletions);
    }
    setAchievements(JSON.parse(localStorage.getItem(LS_ACHIEVEMENTS)) || []);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LS_HABITS, JSON.stringify(habits));
  }, [habits]);
  useEffect(() => {
    localStorage.setItem(LS_COMPLETIONS, JSON.stringify(completions));
  }, [completions]);
  useEffect(() => {
    localStorage.setItem(LS_ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    if (["/dashboard","/analytics","/achievements","/calendar"].includes(location.pathname)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Defensive setter for completions
  const safeSetCompletions = (val) => {
    setCompletions(Array.isArray(val) ? val : []);
  };

  // Provide live data and update functions to all pages
  const pageProps = {
    habits, setHabits, completions, setCompletions: safeSetCompletions, achievements, setAchievements
  };

  return (
    <div className="min-h-screen bg-[#18162a] text-white">
      <nav className="bg-[#18162a] shadow p-4 flex gap-4 items-center border-b border-[#23213a]">
        <Link to="/" className="text-2xl font-bold text-white mr-8">HabitNEST</Link>
        {showNav && isAuthenticated && <>
          <Link to="/dashboard" className="font-semibold text-white hover:text-green-400">Dashboard</Link>
          <Link to="/analytics" className="font-semibold text-white hover:text-green-400">Analytics</Link>
          <Link to="/achievements" className="font-semibold text-white hover:text-green-400">Achievements</Link>
          <Link to="/calendar" className="font-semibold text-white hover:text-green-400">Calendar</Link>
          <button onClick={handleLogout} className="ml-auto bg-transparent border border-green-400 text-green-400 px-4 py-1 rounded hover:bg-green-400 hover:text-[#18162a] transition">Logout</button>
        </>}
        {!showNav && <div className="ml-auto flex gap-2">
          <Link to="/login" className="px-6 py-2 rounded bg-transparent border border-green-400 text-green-400 font-semibold hover:bg-green-400 hover:text-[#18162a] transition">Sign In</Link>
          <Link to="/register" className="px-6 py-2 rounded bg-green-400 text-[#18162a] font-semibold hover:bg-green-500 transition">Sign Up</Link>
        </div>}
      </nav>
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          <Routes location={location}>
            <Route path="/" element={<About />} />
            <Route path="/dashboard" element={<Dashboard {...pageProps} />} />
            <Route path="/history" element={<History {...pageProps} />} />
            <Route path="/add" element={<AddHabit {...pageProps} />} />
            <Route path="/edit/:id" element={<EditHabit {...pageProps} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/analytics" element={<Analytics {...pageProps} />} />
            <Route path="/achievements" element={<Achievements {...pageProps} />} />
            <Route path="/calendar" element={<Calendar {...pageProps} />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
