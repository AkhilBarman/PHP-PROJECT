import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getHabits, getCompletions, getAchievements, unlockAchievement } from '../api';

const baseAchievements = [
  { key: 'first_habit', icon: '🎯', title: 'First Habit', desc: 'Create your first habit', check: ({ habits }) => habits.length >= 1 },
  { key: 'streak_master', icon: '🔥', title: 'Streak Master', desc: 'Complete a habit 7 days in a row', check: ({ completions }) => completions.length >= 7 },
  { key: 'habit_builder', icon: '📚', title: 'Habit Builder', desc: 'Create 5 different habits', check: ({ habits }) => habits.length >= 5 },
  { key: 'consistency', icon: '💪', title: 'Consistency', desc: 'Complete 10 habits', check: ({ completions }) => completions.length >= 10 },
  { key: 'super_streak', icon: '🌟', title: 'Super Streak', desc: 'Complete a habit 30 days in a row', check: ({ completions }) => completions.length >= 30 },
  { key: 'early_bird', icon: '🕒', title: 'Early Bird', desc: 'Complete a habit before 8am', check: ({ completions }) => completions.some(c => new Date(c.date).getHours() < 8) },
  { key: 'night_owl', icon: '🌙', title: 'Night Owl', desc: 'Complete a habit after 10pm', check: ({ completions }) => completions.some(c => new Date(c.date).getHours() >= 22) },
  { key: 'champion', icon: '🏆', title: 'Champion', desc: 'Complete 100 habits', check: ({ completions }) => completions.length >= 100 },
  { key: 'mindful', icon: '🧘', title: 'Mindful', desc: 'Complete a meditation habit', check: ({ habits }) => habits.some(h => h.name && h.name.toLowerCase().includes('meditat')) },
  { key: 'step_up', icon: '🚶', title: 'Step Up', desc: 'Create a walking habit', check: ({ habits }) => habits.some(h => h.name && h.name.toLowerCase().includes('walk')) },
  { key: 'healthy_choice', icon: '🥗', title: 'Healthy Choice', desc: 'Create a healthy eating habit', check: ({ habits }) => habits.some(h => h.name && h.name.toLowerCase().includes('eat')) },
  { key: 'calendar_pro', icon: '📅', title: 'Calendar Pro', desc: 'Complete a habit every day for a week', check: ({ completions }) => completions.length >= 7 },
];

const Achievements = () => {
  const user_id = localStorage.getItem('user_id');
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [unlocked, setUnlocked] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    Promise.all([
      getHabits(user_id),
      getCompletions(user_id),
      getAchievements(user_id)
    ]).then(([habitsRes, completionsRes, unlockedRes]) => {
      setHabits(habitsRes.data);
      setCompletions(completionsRes.data);
      // Map unlocked achievements by key
      const unlockedMap = {};
      unlockedRes.data.forEach(a => { unlockedMap[a.achievement_key] = a.unlocked_at; });
      setUnlocked(unlockedMap);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load achievements');
      setLoading(false);
    });
  }, [user_id]);

  useEffect(() => {
    if (!user_id || loading) return;
    // Check and unlock new achievements
    baseAchievements.forEach(a => {
      const complete = a.check({ habits, completions });
      if (complete && !unlocked[a.key]) {
        unlockAchievement(user_id, a.key);
      }
    });
    // eslint-disable-next-line
  }, [habits, completions, unlocked, user_id, loading]);

  if (!user_id) {
    return <div className="text-center text-red-400 mt-12">You must be logged in to view achievements.</div>;
  }
  if (loading) {
    return <div className="text-center text-green-400 mt-12">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 mt-12">{error}</div>;
  }

  return (
    <motion.div className="p-8 text-white min-h-screen bg-[#18162a] flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.h1
        className="text-3xl font-bold text-green-400 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
      >
        Achievements
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {baseAchievements.map((a, i) => {
          const complete = a.check({ habits, completions }) || unlocked[a.key];
          const unlockedAt = unlocked[a.key];
          return (
            <motion.div
              key={a.key}
              className={`rounded-lg p-6 shadow-lg ${complete ? 'bg-[#23213a] border border-green-400' : 'bg-[#23213a]'}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.7, type: 'spring', stiffness: 60 }}
              whileHover={{ scale: 1.06, boxShadow: '0 8px 32px rgba(34,197,94,0.25)' }}
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="text-xl font-bold mb-1 text-green-400">{a.title}</div>
              <div className="mb-2 text-green-200">{a.desc}</div>
              <div className="w-full bg-[#18162a] rounded-full h-2 mb-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: `${complete ? 100 : 0}%` }}></div>
              </div>
              <div className="text-sm text-green-200">
                {complete ? (
                  <>
                    100% Complete<br />
                    {unlockedAt ? `Unlocked on ${new Date(unlockedAt).toLocaleDateString()}` : 'Unlocked'}
                  </>
                ) : (
                  'Locked'
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Achievements; 