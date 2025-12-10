import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const pilotesApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token
pilotesApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const pilotesService = {
  // Récupérer tous les pilotes
  getAllPilotes: () => pilotesApi.get('/pilotes/'),
  
  // Récupérer un pilote par ID
  getPilote: (id) => pilotesApi.get(`/pilotes/${id}/`),
  
  // Créer un pilote
  createPilote: (data) => pilotesApi.post('/pilotes/', data),
  
  // Mettre à jour un pilote
  updatePilote: (id, data) => pilotesApi.put(`/pilotes/${id}/`, data),
  
  // Supprimer un pilote
  deletePilote: (id) => pilotesApi.delete(`/pilotes/${id}/`),
  
  // Statistiques
  getStats: () => pilotesApi.get('/pilotes/stats/'),
  
  // Recherche
  searchPilotes: (query) => pilotesApi.get(`/pilotes/?search=${query}`),
};
export default pilotesService;