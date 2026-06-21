const axios = require('axios');
const api = axios.create({
  baseURL: 'https://portal-for-juniors.onrender.com/api',
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    console.log("INTERCEPTED ERROR:", e.response?.data || e.message);
    return Promise.reject(e);
  }
);
api.post('/games/score').catch(e => console.log("CAUGHT:", e.message));
