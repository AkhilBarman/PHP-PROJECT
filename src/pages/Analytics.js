import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCompletions, getHabits } from '../api';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Analytics = () => {
  const user_id = localStorage.getItem('user_id');
  const [data, setData] = useState([]);
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    Promise.all([getCompletions(user_id), getHabits(user_id)])
      .then(([completionsRes, habitsRes]) => {
        setHabits(habitsRes.data);
        processData(completionsRes.data, 'all');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, [user_id]);

  // Re-process data when habit selection changes
  const processData = (completions, habitId) => {
    const week = Array(7).fill(0);
    completions
      .filter(c => habitId === 'all' || c.habit_id === habitId)
      .forEach(c => {
        const d = new Date(c.date);
        week[d.getDay()]++;
      });
    setData(days.map((day, i) => ({ day, completions: week[i] })));
  };

  // When habit selection changes, re-process data
  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    getCompletions(user_id)
      .then(res => {
        processData(res.data, selectedHabit);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, [selectedHabit, user_id]);

  if (!user_id) {
    return <div style={{ color: 'red', marginTop: 40, textAlign: 'center' }}>You must be logged in to view analytics.</div>;
  }
  if (loading) {
    return <div style={{ color: '#22c55e', marginTop: 40, textAlign: 'center' }}>Loading...</div>;
  }
  if (error) {
    return <div style={{ color: 'red', marginTop: 40, textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#18162a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', color: '#22c55e', marginBottom: '2rem' }}>Analytics</h1>
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ color: '#22c55e', fontWeight: 'bold', marginRight: 10 }}>Select Habit:</label>
        <select
          value={selectedHabit}
          onChange={e => setSelectedHabit(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#23213a', color: '#22c55e', border: 'none' }}
        >
          <option value="all">All Habits</option>
          {habits.map(habit => (
            <option key={habit.id} value={habit.id}>{habit.name}</option>
          ))}
        </select>
      </div>
      <div style={{
        background: '#23213a',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 24px #000',
        width: '90vw',
        maxWidth: '1200px',
        height: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#23213a" />
            <XAxis dataKey="day" stroke="#22c55e" />
            <YAxis stroke="#22c55e" />
            <Tooltip contentStyle={{ background: '#23213a', border: 'none', color: '#22c55e' }} />
            <Bar dataKey="completions" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics; 