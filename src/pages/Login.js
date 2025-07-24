import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login as apiLogin } from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!username || !password) {
      setError('Please fill all fields.');
      return;
    }
    try {
      const res = await apiLogin({ username, password });
      // Store user_id and username in localStorage for now (replace with context later)
      localStorage.setItem('user_id', res.data.user_id);
      localStorage.setItem('username', username);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18162a] px-2">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-[#23213a] rounded-xl shadow-lg p-10 w-full max-w-md border border-green-900">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Login</h2>
        <motion.form onSubmit={handleSubmit} className="space-y-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <motion.div className="relative" whileFocus={{ scale: 1.03 }}>
            <input type="text" className="w-full bg-white border border-green-700 rounded-full px-5 py-3 pl-12 text-black placeholder-black focus:outline-none focus:border-green-400" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black"><i className="fas fa-user"></i></span>
          </motion.div>
          <motion.div className="relative" whileFocus={{ scale: 1.03 }}>
            <input type="password" className="w-full bg-white border border-green-700 rounded-full px-5 py-3 pl-12 text-black placeholder-black focus:outline-none focus:border-green-400" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black"><i className="fas fa-lock"></i></span>
          </motion.div>
          {error && <motion.div className="text-red-400 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
          {success && <motion.div className="text-green-400 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Login successful! Redirecting...</motion.div>}
          <motion.button type="submit" className="w-full py-3 rounded-full font-bold text-lg bg-green-400 text-[#18162a] hover:bg-green-500 transition" whileTap={{ scale: 0.97 }}>
            Login
          </motion.button>
        </motion.form>
        <div className="text-center mt-6 text-white">
          Don't have an account? <Link to="/register" className="text-green-400 font-semibold">Register here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 