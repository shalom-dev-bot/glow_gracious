import axios from 'axios';

// 🔹 Création d'une instance Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // URL de ton backend Django
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 Intercepteur pour ajouter automatiquement le token JWT si dispo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access'); // On suppose que tu stockes le JWT ici
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
