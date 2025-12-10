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

const teamService = {
  // Équipes
  getAllTeams: async (params = {}) => {
    const response = await axiosInstance.get('/teams/', { params });
    return response.data;
  },

  getTeamById: async (id) => {
    const response = await axiosInstance.get(`/teams/${id}/`);
    return response.data;
  },

  createTeam: async (data) => {
    const response = await axiosInstance.post('/teams/', data);
    return response.data;
  },

  updateTeam: async (id, data) => {
    const response = await axiosInstance.put(`/teams/${id}/`, data);
    return response.data;
  },

  deleteTeam: async (id) => {
    const response = await axiosInstance.delete(`/teams/${id}/`);
    return response.data;
  },

  getActiveTeams: async () => {
    const response = await axiosInstance.get('/teams/actives/');
    return response.data;
  },

  getTeamStatistics: async () => {
    const response = await axiosInstance.get('/teams/statistiques/');
    return response.data;
  },

  getTeamPilots: async (teamId, seasonId = null) => {
    const params = seasonId ? { season: seasonId } : {};
    const response = await axiosInstance.get(`/teams/${teamId}/pilots/`, { params });
    return response.data;
  },

  // Pilotes d'équipe
  assignPilotToTeam: async (data) => {
    const response = await axiosInstance.post('/team-pilots/', data);
    return response.data;
  },

  getPilotsByS: async (seasonId) => {
    const response = await axiosInstance.get('/team-pilots/by_season/', {
      params: { season_id: seasonId }
    });
    return response.data;
  },
};

export default teamService;