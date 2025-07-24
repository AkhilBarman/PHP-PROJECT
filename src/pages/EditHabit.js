import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const EditHabit = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const res = await api.get('/habits');
        const habit = res.data.find(h => String(h.id) === String(id));
        if (!habit) throw new Error('Habit not found');
        setName(habit.name);
        setColor(habit.color || '');
      } catch (err) {
        setError('Failed to load habit');
      } finally {
        setLoading(false);
      }
    };
    fetchHabit();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/habits/${id}`, { name, color });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update habit');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Habit</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Habit Name</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Color (optional)</label>
          <input type="color" className="w-12 h-8 p-0 border rounded" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Update Habit</button>
      </form>
    </div>
  );
};

export default EditHabit; 