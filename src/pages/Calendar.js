import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCompletions } from '../api';

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDay = (year, month) => new Date(year, month, 1).getDay();

const Calendar = () => {
  const user_id = localStorage.getItem('user_id');
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const days = daysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDay(viewYear, viewMonth);
  const weeks = [];
  let day = 1 - firstDay;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      week.push(day > 0 && day <= days ? day : null);
    }
    weeks.push(week);
  }
  // Map completions by date
  const completionsByDate = {};
  (completions || []).forEach(c => {
    const d = new Date(c.date);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const key = d.getDate();
      if (!completionsByDate[key]) completionsByDate[key] = [];
      completionsByDate[key].push(c);
    }
  });
  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' });
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };
  const handlePrevYear = () => setViewYear(viewYear - 1);
  const handleNextYear = () => setViewYear(viewYear + 1);

  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    getCompletions(user_id)
      .then(res => {
        setCompletions(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load completions');
        setLoading(false);
      });
  }, [user_id]);

  if (!user_id) {
    return <div className="text-center text-red-400 mt-12">You must be logged in to view the calendar.</div>;
  }
  if (loading) {
    return <div className="text-center text-green-400 mt-12">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 mt-12">{error}</div>;
  }

  return (
    <motion.div className="p-8 text-white min-h-screen bg-[#18162a] flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={handlePrevYear} className="px-2 py-1 rounded bg-[#23213a] text-green-400 hover:bg-green-400 hover:text-[#18162a]">«</button>
        <button onClick={handlePrevMonth} className="px-2 py-1 rounded bg-[#23213a] text-green-400 hover:bg-green-400 hover:text-[#18162a]">‹</button>
        <h1 className="text-4xl font-bold text-green-400 mx-4">{monthName} {viewYear}</h1>
        <button onClick={handleNextMonth} className="px-2 py-1 rounded bg-[#23213a] text-green-400 hover:bg-green-400 hover:text-[#18162a]">›</button>
        <button onClick={handleNextYear} className="px-2 py-1 rounded bg-[#23213a] text-green-400 hover:bg-green-400 hover:text-[#18162a]">»</button>
      </div>
      <div className="bg-gradient-to-br from-[#23213a] via-[#1e293b] to-[#18162a] rounded-3xl p-12 shadow-2xl w-full max-w-7xl">
        <div className="grid grid-cols-7 gap-6 mb-6">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="text-green-400 text-xl font-bold text-center">{d}</div>
          ))}
        </div>
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-6 mb-3">
            {week.map((date, j) => (
              <div key={j} className={`min-h-[110px] rounded-2xl transition-all duration-200 ${date ? 'bg-[#23213a]' : ''} flex flex-col items-center justify-start p-3 border-2 border-transparent ${completionsByDate[date] ? 'border-green-400 shadow-lg' : ''}`}>
                {date && <span className="text-green-200 font-bold mb-2 text-xl">{date}</span>}
                {completionsByDate[date] && completionsByDate[date].map((c, idx) => (
                  <div key={idx} className="bg-green-900 text-green-400 rounded-lg px-3 py-1 text-sm mb-1 w-full text-center">{c.habitName || 'Habit'}</div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Calendar; 