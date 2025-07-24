import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register as apiRegister } from '../api';

const passwordChecks = [
  { label: 'At least 8 characters', test: v => v.length >= 8 },
  { label: 'At least one uppercase letter', test: v => /[A-Z]/.test(v) },
  { label: 'At least one lowercase letter', test: v => /[a-z]/.test(v) },
  { label: 'At least one number', test: v => /[0-9]/.test(v) },
];

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const checks = [
    ...passwordChecks.map(c => c.test(password)),
    password === confirm && password.length > 0
  ];

  const allValid = checks.every(Boolean) && username && email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!allValid) {
      setError('Please fill all fields correctly.');
      return;
    }
    try {
      await apiRegister({ username, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18162a] px-2">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-[#23213a] rounded-xl shadow-lg p-10 w-full max-w-md border border-green-900">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Register</h2>
        <motion.form onSubmit={handleSubmit} className="space-y-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <motion.div className="relative" whileFocus={{ scale: 1.03 }}>
            <input type="text" className="w-full bg-white border border-green-700 rounded-full px-5 py-3 pl-12 text-black placeholder-black focus:outline-none focus:border-green-400" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black"><i className="fas fa-user"></i></span>
          </motion.div>
          <motion.div className="relative" whileFocus={{ scale: 1.03 }}>
            <input type="email" className="w-full bg-white border border-green-700 rounded-full px-5 py-3 pl-12 text-black placeholder-black focus:outline-none focus:border-green-400" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black"><i className="fas fa-envelope"></i></span>
          </motion.div>
          <motion.div className="relative" whileFocus={{ scale: 1.03 }}>
            <input type="password" className="w-full bg-white border border-green-700 rounded-full px-5 py-3 pl-12 text-black placeholder-black focus:outline-none focus:border-green-400" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black"><i className="fas fa-lock"></i></span>
          </motion.div>
          <motion.div className="relative" whileFocus={{ scale: 1.03 }}>
            <input type="password" className="w-full bg-white border border-green-700 rounded-full px-5 py-3 pl-12 text-black placeholder-black focus:outline-none focus:border-green-400" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black"><i className="fas fa-lock"></i></span>
          </motion.div>
          <motion.div className="bg-[#18162a] rounded-lg p-4 mb-2 text-sm text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <ul className="space-y-1">
              {passwordChecks.map((c, i) => (
                <li key={c.label} className={checks[i] ? 'text-green-400' : 'text-white'}>
                  {checks[i] ? '✔' : '✖'} {c.label}
                </li>
              ))}
              <li className={checks[4] ? 'text-green-400' : 'text-white'}>
                {checks[4] ? '✔' : '✖'} Passwords match
              </li>
            </ul>
          </motion.div>
          {error && <motion.div className="text-red-400 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
          {success && <motion.div className="text-green-400 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Registration successful! Redirecting...</motion.div>}
          <motion.button type="submit" disabled={!allValid} className={`w-full py-3 rounded-full font-bold text-lg transition ${allValid ? 'bg-green-400 text-[#18162a] hover:bg-green-500' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`} whileTap={{ scale: 0.97 }}>
            Register
          </motion.button>
        </motion.form>
        <div className="text-center mt-6 text-white">
          Already have an account? <Link to="/login" className="text-green-400 font-semibold">Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register; 