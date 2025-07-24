import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function register({ username, email, password }) {
  return api.post('/register', { username, email, password });
}

export async function login({ username, password }) {
  return api.post('/login', { username, password });
}

export async function getHabits(user_id) {
  return api.get(`/habits?user_id=${user_id}`);
}

export async function addHabit(habit) {
  return api.post('/habits', habit);
}

export async function deleteHabit(user_id, habit_id) {
  return api.delete('/habits', { data: { user_id, habit_id } });
}

export async function getCompletions(user_id) {
  return api.get(`/completions?user_id=${user_id}`);
}

export async function addCompletion(completion) {
  return api.post('/completions', completion);
}

export async function deleteCompletion(user_id, completion_id) {
  return api.delete('/completions', { data: { user_id, completion_id } });
}

export async function getAchievements(user_id) {
  return api.get(`/achievements?user_id=${user_id}`);
}

export async function unlockAchievement(user_id, achievement_key) {
  return api.post('/achievements', { user_id, achievement_key });
}

export default api; 