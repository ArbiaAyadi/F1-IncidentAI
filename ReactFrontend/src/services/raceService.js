import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Ajouter le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const raceService = {
  // Saisons
  getAllSeasons: async () => {
    const response = await axiosInstance.get('/seasons/');
    return response.data;
  },

  getActiveSeason: async () => {
    const response = await axiosInstance.get('/seasons/active/');
    return response.data;
  },

  createSeason: async (data) => {
    const response = await axiosInstance.post('/seasons/', data);
    return response.data;
  },

  // Courses
  getAllRaces: async (params = {}) => {
    const response = await axiosInstance.get('/races/', { params });
    return response.data;
  },

  getRaceById: async (id) => {
    const response = await axiosInstance.get(`/races/${id}/`);
    return response.data;
  },

  createRace: async (data) => {
    const response = await axiosInstance.post('/races/', data);
    return response.data;
  },

  updateRace: async (id, data) => {
    const response = await axiosInstance.put(`/races/${id}/`, data);
    return response.data;
  },

  deleteRace: async (id) => {
    const response = await axiosInstance.delete(`/races/${id}/`);
    return response.data;
  },

  getCalendar: async (seasonId = null) => {
    const params = seasonId ? { season: seasonId } : {};
    const response = await axiosInstance.get('/races/calendar/', { params });
    return response.data;
  },

  getRaceResults: async (raceId) => {
    const response = await axiosInstance.get(`/races/${raceId}/results/`);
    return response.data;
  },

  addRaceResult: async (raceId, data) => {
    const response = await axiosInstance.post(`/races/${raceId}/add_result/`, data);
    return response.data;
  },

  // Résultats
  createResult: async (data) => {
    const response = await axiosInstance.post('/results/', data);
    return response.data;
  },

  updateResult: async (id, data) => {
    const response = await axiosInstance.put(`/results/${id}/`, data);
    return response.data;
  },

  deleteResult: async (id) => {
    const response = await axiosInstance.delete(`/results/${id}/`);
    return response.data;
  },

  // Championnat
  getChampionship: async (seasonId = null) => {
    const params = seasonId ? { season: seasonId } : {};
    const response = await axiosInstance.get('/championship/', { params });
    return response.data;
  },

  getCurrentChampionship: async () => {
    const response = await axiosInstance.get('/championship/current/');
    return response.data;
  },

  updateStandings: async (seasonId) => {
    const response = await axiosInstance.post('/championship/update_standings/', { season: seasonId });
    return response.data;
  },

  // Stratégies
  getAllStrategies: async (params = {}) => {
    const response = await axiosInstance.get('/strategies/', { params });
    return response.data;
  },

  getStrategyById: async (id) => {
    const response = await axiosInstance.get(`/strategies/${id}/`);
    return response.data;
  },

  getStrategiesByRace: async (raceId) => {
    const response = await axiosInstance.get('/strategies/by_race/', { params: { race_id: raceId } });
    return response.data;
  },

  createStrategy: async (data) => {
    const response = await axiosInstance.post('/strategies/', data);
    return response.data;
  },

  updateStrategy: async (id, data) => {
    const response = await axiosInstance.put(`/strategies/${id}/`, data);
    return response.data;
  },

  deleteStrategy: async (id) => {
    const response = await axiosInstance.delete(`/strategies/${id}/`);
    return response.data;
  },

  getStrategyStatistics: async (raceId = null) => {
    const params = raceId ? { race_id: raceId } : {};
    const response = await axiosInstance.get('/strategies/statistics/', { params });
    return response.data;
  },
};

export default raceService;