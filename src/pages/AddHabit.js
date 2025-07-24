import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AddHabit = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Add category, description, frequency to the habit object
      await api.post('/habits', { name, category, description, frequency, color });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add habit');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Habit</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Habit Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Category</label>
            <select className="w-full border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)} required>
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
          <label className="block mb-1 font-semibold">Description (optional)</label>
          <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Frequency</label>
          <select className="w-full border rounded px-3 py-2" value={frequency} onChange={e => setFrequency(e.target.value)} required>
            <option value="" disabled>Select Frequency</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Color (optional)</label>
          <input type="color" className="w-12 h-8 p-0 border rounded" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Add Habit</button>
      </form>
    </div>
  );
};

export default AddHabit; 