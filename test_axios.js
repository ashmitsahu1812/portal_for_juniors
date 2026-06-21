const axios = require('axios');
const api = axios.create({ baseURL: 'https://portal-for-juniors.onrender.com/api' });
console.log(api.getUri({ url: '/games/score' }));
