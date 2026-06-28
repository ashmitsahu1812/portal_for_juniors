import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

// ── Modules ──────────────────────────────────────────────────────────────────
export const fetchModules = (semester) =>
  api.get('/modules', { params: semester ? { semester } : {} }).then((r) => r.data.data);

export const fetchModule = (id) =>
  api.get(`/modules/${id}`).then((r) => r.data.data);

// ── Quizzes ──────────────────────────────────────────────────────────────────
export const fetchQuizByModule = (moduleId) =>
  api.get(`/quizzes/module/${moduleId}`).then((r) => r.data.data);

export const submitQuiz = (quizId, payload) =>
  api.post(`/quizzes/${quizId}/submit`, payload).then((r) => r.data.data);

// ── Problems ─────────────────────────────────────────────────────────────────
export const fetchProblemsByModule = (moduleId) =>
  api.get(`/problems/module/${moduleId}`).then((r) => r.data.data);

export const fetchProblem = (id) =>
  api.get(`/problems/${id}`).then((r) => r.data.data);

// ── Compile ──────────────────────────────────────────────────────────────────
export const compileCode = (payload) =>
  api.post('/compile', payload).then((r) => r.data);

// ── Leaderboard ───────────────────────────────────────────────────────────────
export const fetchLeaderboard = () =>
  api.get('/progress/leaderboard').then((r) => r.data.data);

// ── Pathways ──────────────────────────────────────────────────────────────────
export const fetchPathways = () =>
  api.get('/pathways').then((r) => r.data.data);

export const fetchPathway = (id) =>
  api.get(`/pathways/${id}`).then((r) => r.data.data);

// ── Assignments ───────────────────────────────────────────────────────────────
export const fetchAssignments = () =>
  api.get('/assignments').then((r) => r.data.data);

export const createAssignment = (payload) =>
  api.post('/assignments', payload).then((r) => r.data.data);

export const updateAssignment = (id, payload) =>
  api.put(`/assignments/${id}`, payload).then((r) => r.data.data);

export const deleteAssignment = (id) =>
  api.delete(`/assignments/${id}`).then((r) => r.data.data);

// ── Google Auth ───────────────────────────────────────────────────────────────
export const googleAuth = (credential) =>
  api.post('/auth/google', { credential }).then((r) => r.data);

export const deleteAccount = () =>
  api.delete('/auth/me').then((r) => r.data);

export default api;
