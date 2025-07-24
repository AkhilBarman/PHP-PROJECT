import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getHabits,
  addHabit,
  deleteHabit,
  getCompletions,
  addCompletion,
  deleteCompletion
} from '../api';

const Dashboard = () => {
  const user_id = localStorage.getItem('user_id');
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('');
  const [color, setColor] = useState('#22c55e');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch habits and completions on mount
  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    Promise.all([
      getHabits(user_id),
      getCompletions(user_id)
    ]).then(([habitsRes, completionsRes]) => {
      setHabits(habitsRes.data);
      setCompletions(completionsRes.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load data');
      setLoading(false);
    });
  }, [user_id]);

  // Add Habit
  const handleAddHabit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !category || !frequency) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      await addHabit({ user_id, name, category, description, frequency, color });
      const habitsRes = await getHabits(user_id);
      setHabits(habitsRes.data);
      setShowModal(false);
      setName('');
      setCategory('');
      setDescription('');
      setFrequency('');
      setColor('#22c55e');
    } catch {
      setError('Failed to add habit');
    }
  };

  // Delete Habit
  const handleDeleteHabit = async (habit_id) => {
    setError('');
    try {
      await deleteHabit(user_id, habit_id);
      const habitsRes = await getHabits(user_id);
      setHabits(habitsRes.data);
    } catch {
      setError('Failed to delete habit');
    }
  };

  // Complete Today
  const handleComplete = async (habit) => {
    setError('');
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    // Prevent duplicate completions for the same habit on the same day
    if (completions.some(c => c.habit_id === habit.id && c.date === dateStr)) return;
    try {
      await addCompletion({ user_id, habit_id: habit.id, date: dateStr });
      const completionsRes = await getCompletions(user_id);
      setCompletions(completionsRes.data);
    } catch {
      setError('Failed to complete habit');
    }
  };

  // Calculate streak and total completions for a habit
  const getHabitStats = (habit) => {
    const habitCompletions = completions.filter(c => c.habit_id === habit.id).map(c => c.date).sort();
    let streak = 0;
    let prev = null;
    for (let i = habitCompletions.length - 1; i >= 0; i--) {
      const d = new Date(habitCompletions[i]);
      if (!prev) {
        prev = d;
        streak = 1;
      } else {
        const diff = (prev - d) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
          prev = d;
        } else {
          break;
        }
      }
    }
    return {
      streak,
      total: habitCompletions.length
    };
  };

  // Returns the number of completions in the current week
  const getWeeklyCompletionCount = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    return completions.filter(c => {
      const compDate = new Date(c.date);
      return compDate >= startOfWeek && compDate <= now;
    }).length;
  };

  // Optionally, calculate the expected completions for the week
  const expectedCompletions = habits.length * 7; // if all habits are daily
  const weeklyCompletions = getWeeklyCompletionCount();
  const weeklyRate = expectedCompletions > 0 ? Math.round((weeklyCompletions / expectedCompletions) * 100) : 0;

  if (!user_id) {
    return <div className="text-center text-red-400 mt-12">You must be logged in to view the dashboard.</div>;
  }

  if (loading) {
    return <div className="text-center text-green-400 mt-12">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#18162a] text-white p-8">
      <h1 className="text-4xl font-bold text-green-400 mb-2">Welcome, {localStorage.getItem('username') || 'User'}!</h1>
      <p className="text-lg text-green-200 mb-8">Track your habits and build a better you.</p>
      <div className="bg-[#23213a] rounded-xl p-8 mb-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#23213a] rounded-lg p-6 text-center shadow-lg">
            <span className="text-3xl text-green-400 font-bold">{habits.length}</span>
            <div className="text-green-200">Total Habits</div>
          </div>
          <div className="bg-[#23213a] rounded-lg p-6 text-center shadow-lg">
            <span className="text-3xl text-green-400 font-bold">{completions.length}</span>
            <div className="text-green-200">Total Completions</div>
          </div>
          <div className="bg-[#23213a] rounded-lg p-6 text-center shadow-lg">
            <span className="text-3xl text-green-400 font-bold">{weeklyRate}%</span>
            <div className="text-green-200">Weekly Completion Rate</div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowModal(true)} className="bg-green-400 text-[#18162a] font-bold rounded px-6 py-3 hover:bg-green-500 transition">+ Add New Habit</button>
      </div>
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#23213a] rounded-xl shadow-lg p-8 w-full max-w-lg relative animate-fadeIn">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-green-400 text-2xl font-bold hover:text-green-300">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Add New Habit</h2>
            {error && <div className="mb-4 text-red-400 text-center">{error}</div>}
            <form onSubmit={handleAddHabit}>
              <div className="mb-4 flex gap-4">
                <div className="w-1/2">
                  <label className="block mb-1 font-semibold text-green-300">Habit Name</label>
                  <input type="text" className="w-full border border-green-700 bg-[#18162a] rounded px-3 py-2 text-white focus:outline-none focus:border-green-400" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 font-semibold text-green-300">Category</label>
                  <select className="w-full border border-green-700 bg-[#18162a] rounded px-3 py-2 text-white focus:outline-none focus:border-green-400" value={category} onChange={e => setCategory(e.target.value)} required>
                    <option value="" disabled>Select Category</option>
                    <option value="Health">Health</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Learning">Learning</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Mindfulness">Mindfulness</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-green-300">Description (optional)</label>
                <textarea className="w-full border border-green-700 bg-[#18162a] rounded px-3 py-2 text-white focus:outline-none focus:border-green-400" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-green-300">Frequency</label>
                <select className="w-full border border-green-700 bg-[#18162a] rounded px-3 py-2 text-white focus:outline-none focus:border-green-400" value={frequency} onChange={e => setFrequency(e.target.value)} required>
                  <option value="" disabled>Select Frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-semibold text-green-300">Color (optional)</label>
                <input type="color" className="w-12 h-8 p-0 border border-green-700 bg-[#18162a] rounded" value={color} onChange={e => setColor(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-green-400 text-[#18162a] py-2 rounded font-semibold hover:bg-green-500 transition">Add Habit</button>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {habits.length === 0 ? (
          <div className="col-span-3 text-center text-green-200 text-lg">No habits yet. Click "Add New Habit" to get started!</div>
        ) : habits.map((habit, idx) => {
          const stats = getHabitStats(habit);
          return (
            <div key={habit.id} className="bg-[#23213a] rounded-xl p-6 shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-green-400">{habit.name}</span>
                <span className="bg-green-900 text-green-400 px-4 py-1 rounded-full text-sm font-semibold ml-2">{habit.category}</span>
              </div>
              <div className="mb-2 text-green-200">{habit.description}</div>
              <div className="mb-2">
                <span className="bg-[#18162a] text-green-300 px-3 py-1 rounded-full text-xs font-semibold">{habit.frequency}</span>
              </div>
              <div className="flex gap-8 mt-4 mb-2">
                <div className="text-green-300 text-lg font-bold">{stats.streak}</div>
                <div className="text-green-300 text-lg font-bold">{stats.total}</div>
              </div>
              <div className="flex gap-8 mb-2">
                <div className="text-green-200 text-xs">Current Streak</div>
                <div className="text-green-200 text-xs">Total Completions</div>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleComplete(habit)} className="flex-1 bg-green-400 text-[#18162a] font-bold rounded px-4 py-2 hover:bg-green-500 transition">✓ Complete Today</button>
                <button onClick={() => handleDeleteHabit(habit.id)} className="flex-1 bg-red-700 text-white font-bold rounded px-4 py-2 hover:bg-red-800 transition">🗑 Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard; 