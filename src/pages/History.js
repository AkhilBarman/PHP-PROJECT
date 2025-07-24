import React, { useEffect, useState } from 'react';
import api from '../api';
import { useSearchParams } from 'react-router-dom';

const History = () => {
  const [searchParams] = useSearchParams();
  const habitId = searchParams.get('habit');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!habitId) return;
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/habits/${habitId}/history`);
        setHistory(res.data);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [habitId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Habit History</h1>
      {!habitId ? (
        <div>Select a habit to view history.</div>
      ) : loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : history.length === 0 ? (
        <div>No history yet.</div>
      ) : (
        <ul className="space-y-2">
          {history.map((entry, i) => (
            <li key={i} className="bg-white p-4 rounded shadow flex items-center justify-between">
              <span>{entry.date}</span>
              <span className={entry.completed ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                {entry.completed ? 'Completed' : 'Missed'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History; 